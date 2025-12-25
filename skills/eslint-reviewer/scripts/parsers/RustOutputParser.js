/**
 * Rust 输出解析器
 * 解析 Rust linter 的输出（clippy, rustfmt）
 */
const OutputParser = require('./OutputParser');

class RustOutputParser extends OutputParser {
  constructor(tool = 'clippy') {
    super();
    this.tool = tool;
  }

  /**
   * 解析 Rust linter 输出
   * @param {string} output - 工具输出
   * @returns {Object} 解析结果
   */
  parse(output) {
    if (!output || output.trim() === '') {
      return {
        success: true,
        files: 0,
        errors: 0,
        warnings: 0,
        fixable: 0,
        messages: []
      };
    }

    switch (this.tool) {
      case 'clippy':
        return this.parseClippy(output);
      case 'rustfmt':
        return this.parseRustfmt(output);
      default:
        return this.parseGeneric(output);
    }
  }

  /**
   * 解析 Clippy 输出
   * @param {string} output - Clippy 输出（JSON 格式）
   * @returns {Object}
   */
  parseClippy(output) {
    const summary = {
      success: false,
      files: 0,
      errors: 0,
      warnings: 0,
      fixable: 0,
      messages: []
    };

    const files = new Set();

    try {
      // Clippy 输出是 JSON 格式（当使用 --message-format=json）
      const lines = output.split('\n').filter(Boolean);
      
      lines.forEach(line => {
        try {
          const message = JSON.parse(line);
          
          if (message.reason === 'compiler-message') {
            const span = message.message.spans && message.message.spans[0];
            if (span) {
              const file = span.file_name;
              files.add(file);
              
              const level = message.message.level;
              if (level === 'error') {
                summary.errors++;
              } else if (level === 'warning') {
                summary.warnings++;
              }

              summary.messages.push({
                file,
                line: span.line_start || 0,
                column: span.column_start || 0,
                severity: level,
                message: message.message.message || message.message.rendered || '',
                rule: message.message.code?.code || 'clippy'
              });
            }
          }
        } catch {
          // 如果不是 JSON，尝试文本解析
          // Clippy 文本格式: "warning: unused variable: `x`"
          const textMatch = line.match(/^(error|warning):\s+(.+)$/);
          if (textMatch) {
            const [, level, message] = textMatch;
            if (level === 'error') {
              summary.errors++;
            } else {
              summary.warnings++;
            }
            
            summary.messages.push({
              file: 'unknown',
              line: 0,
              column: 0,
              severity: level,
              message: message.trim(),
              rule: 'clippy'
            });
          }
        }
      });
    } catch {
      // 如果解析失败，使用文本解析
      return this.parseClippyText(output);
    }

    summary.files = files.size;
    summary.success = summary.errors === 0 && summary.warnings === 0;

    return summary;
  }

  /**
   * 解析 Clippy 文本输出（fallback）
   * @param {string} output - Clippy 文本输出
   * @returns {Object}
   */
  parseClippyText(output) {
    const lines = output.split('\n');
    const summary = {
      success: false,
      files: 0,
      errors: 0,
      warnings: 0,
      fixable: 0,
      messages: []
    };

    let currentFile = null;
    const files = new Set();

    lines.forEach(line => {
      // Clippy 文本格式: "src/main.rs:12:5: warning: unused variable"
      const match = line.match(/^(.+?):(\d+):(\d+):\s+(error|warning):\s+(.+)$/);
      if (match) {
        const [, file, lineNum, col, severity, message] = match;
        currentFile = file;
        files.add(file);
        
        if (severity === 'error') {
          summary.errors++;
        } else {
          summary.warnings++;
        }

        summary.messages.push({
          file: currentFile,
          line: parseInt(lineNum, 10),
          column: parseInt(col, 10),
          severity,
          message: message.trim(),
          rule: 'clippy'
        });
      }

      // 统计: "warning: X warnings emitted"
      const warningMatch = line.match(/(\d+)\s+warnings?\s+emitted/i);
      if (warningMatch) {
        summary.warnings = parseInt(warningMatch[1], 10);
      }

      const errorMatch = line.match(/(\d+)\s+errors?\s+emitted/i);
      if (errorMatch) {
        summary.errors = parseInt(errorMatch[1], 10);
      }
    });

    summary.files = files.size;
    summary.success = summary.errors === 0 && summary.warnings === 0;

    return summary;
  }

  /**
   * 解析 rustfmt 输出
   * @param {string} output - rustfmt 输出
   * @returns {Object}
   */
  parseRustfmt(output) {
    const lines = output.split('\n');
    const summary = {
      success: false,
      files: 0,
      errors: 0,
      warnings: 0,
      fixable: 0,
      messages: []
    };

    const files = new Set();

    lines.forEach(line => {
      // rustfmt --check 输出: "Diff of file.rs:"
      // 或 "file.rs would be reformatted"
      if (line.includes('would be reformatted') || line.includes('Diff of')) {
        const fileMatch = line.match(/(.+\.rs)/);
        if (fileMatch) {
          files.add(fileMatch[1]);
        }
      }

      // 统计: "Diff of file.rs:"
      const diffMatch = line.match(/^Diff of (.+\.rs):$/);
      if (diffMatch) {
        files.add(diffMatch[1]);
      }
    });

    summary.files = files.size;
    summary.errors = files.size; // 需要格式化的文件数
    summary.fixable = files.size; // rustfmt 可以自动修复
    summary.success = files.size === 0;

    return summary;
  }

  /**
   * 通用解析（fallback）
   * @param {string} output - 输出
   * @returns {Object}
   */
  parseGeneric(output) {
    const hasErrors = /error|warning/i.test(output);
    return {
      success: !hasErrors,
      files: 0,
      errors: hasErrors ? 1 : 0,
      warnings: 0,
      fixable: 0,
      messages: [],
      rawOutput: output
    };
  }
}

module.exports = RustOutputParser;

