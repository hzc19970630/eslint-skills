/**
 * Python 输出解析器
 * 解析 Python linter 的输出（pylint, flake8, black, mypy）
 */
const OutputParser = require('./OutputParser');

class PythonOutputParser extends OutputParser {
  constructor(tool = 'pylint') {
    super();
    this.tool = tool;
  }

  /**
   * 解析 Python linter 输出
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
      case 'pylint':
        return this.parsePylint(output);
      case 'flake8':
        return this.parseFlake8(output);
      case 'black':
        return this.parseBlack(output);
      case 'mypy':
        return this.parseMypy(output);
      default:
        return this.parseGeneric(output);
    }
  }

  /**
   * 解析 Pylint 输出
   * @param {string} output - Pylint 输出
   * @returns {Object}
   */
  parsePylint(output) {
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

    lines.forEach(line => {
      // Pylint 格式: "file.py:12:4: C0301: Line too long (120/100)"
      const match = line.match(/^(.+?):(\d+):(\d+):\s+([A-Z]\d+):\s+(.+)$/);
      if (match) {
        const [, file, lineNum, col, code, message] = match;
        currentFile = file;
        summary.files = summary.files || 1;
        
        const severity = this.getPylintSeverity(code);
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
          rule: code
        });
      }

      // 统计行: "Your code has been rated at 8.50/10"
      if (line.includes('rated at')) {
        const ratingMatch = line.match(/(\d+\.?\d*)\/10/);
        if (ratingMatch) {
          const rating = parseFloat(ratingMatch[1]);
          summary.success = rating >= 8.0; // 可以配置阈值
        }
      }
    });

    // 如果没有错误和警告，认为成功
    if (summary.errors === 0 && summary.warnings === 0) {
      summary.success = true;
    }

    return summary;
  }

  /**
   * 获取 Pylint 严重程度
   * @param {string} code - Pylint 错误代码
   * @returns {string} 'error' 或 'warning'
   */
  getPylintSeverity(code) {
    // E: 错误, F: 致命错误, W: 警告, C: 约定, R: 重构建议, I: 信息
    const firstChar = code.charAt(0);
    return ['E', 'F'].includes(firstChar) ? 'error' : 'warning';
  }

  /**
   * 解析 Flake8 输出
   * @param {string} output - Flake8 输出
   * @returns {Object}
   */
  parseFlake8(output) {
    const lines = output.split('\n').filter(Boolean);
    const summary = {
      success: lines.length === 0,
      files: 0,
      errors: 0,
      warnings: 0,
      fixable: 0,
      messages: []
    };

    const files = new Set();

    lines.forEach(line => {
      // Flake8 格式: "file.py:12:4: E501 line too long (120 > 100 characters)"
      const match = line.match(/^(.+?):(\d+):(\d+):\s+([A-Z]\d+)\s+(.+)$/);
      if (match) {
        const [, file, lineNum, col, code, message] = match;
        files.add(file);
        
        summary.errors++;
        summary.messages.push({
          file,
          line: parseInt(lineNum, 10),
          column: parseInt(col, 10),
          severity: 'error',
          message: message.trim(),
          rule: code
        });
      }
    });

    summary.files = files.size;
    return summary;
  }

  /**
   * 解析 Black 输出
   * @param {string} output - Black 输出
   * @returns {Object}
   */
  parseBlack(output) {
    const summary = {
      success: !output.includes('would reformat'),
      files: 0,
      errors: 0,
      warnings: 0,
      fixable: 0,
      messages: []
    };

    if (output.includes('would reformat')) {
      const files = output.match(/would reformat (.+)/g) || [];
      summary.files = files.length;
      summary.errors = files.length;
      summary.fixable = files.length;
    } else if (output.includes('reformatted')) {
      const files = output.match(/reformatted (.+)/g) || [];
      summary.files = files.length;
      summary.fixable = files.length;
    }

    return summary;
  }

  /**
   * 解析 Mypy 输出
   * @param {string} output - Mypy 输出
   * @returns {Object}
   */
  parseMypy(output) {
    const lines = output.split('\n');
    const summary = {
      success: false,
      files: 0,
      errors: 0,
      warnings: 0,
      fixable: 0,
      messages: []
    };

    lines.forEach(line => {
      // Mypy 格式: "file.py:12: error: Incompatible types..."
      const match = line.match(/^(.+?):(\d+):\s+(error|warning|note):\s+(.+)$/);
      if (match) {
        const [, file, lineNum, severity, message] = match;
        summary.files = summary.files || 1;
        
        if (severity === 'error') {
          summary.errors++;
        } else {
          summary.warnings++;
        }

        summary.messages.push({
          file,
          line: parseInt(lineNum, 10),
          column: 0,
          severity,
          message: message.trim(),
          rule: 'mypy'
        });
      }

      // 统计: "Found X errors in Y files"
      const foundMatch = line.match(/Found (\d+) error/i);
      if (foundMatch) {
        summary.errors = parseInt(foundMatch[1], 10);
      }
    });

    summary.success = summary.errors === 0;
    return summary;
  }

  /**
   * 通用解析（fallback）
   * @param {string} output - 输出
   * @returns {Object}
   */
  parseGeneric(output) {
    const hasErrors = /error/i.test(output);
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

module.exports = PythonOutputParser;

