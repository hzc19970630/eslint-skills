/**
 * Go 输出解析器
 * 解析 Go linter 的输出（golangci-lint, gofmt, govet）
 */
const OutputParser = require('./OutputParser');

class GoOutputParser extends OutputParser {
  constructor(tool = 'golangci-lint') {
    super();
    this.tool = tool;
  }

  /**
   * 解析 Go linter 输出
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
      case 'golangci-lint':
        return this.parseGolangciLint(output);
      case 'gofmt':
        return this.parseGofmt(output);
      case 'govet':
        return this.parseGovet(output);
      default:
        return this.parseGeneric(output);
    }
  }

  /**
   * 解析 golangci-lint 输出
   * @param {string} output - golangci-lint 输出
   * @returns {Object}
   */
  parseGolangciLint(output) {
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
      // golangci-lint 格式: "main.go:12:5: error message (linterName)"
      const match = line.match(/^(.+?):(\d+):(\d+):\s+(.+?)\s+\((.+?)\)$/);
      if (match) {
        const [, file, lineNum, col, message, linter] = match;
        currentFile = file;
        files.add(file);
        
        // golangci-lint 通常都是错误级别
        summary.errors++;

        summary.messages.push({
          file: currentFile,
          line: parseInt(lineNum, 10),
          column: parseInt(col, 10),
          severity: 'error',
          message: message.trim(),
          rule: linter
        });
      }

      // 统计: "Found X issues"
      const issueMatch = line.match(/Found\s+(\d+)\s+issues?/i);
      if (issueMatch) {
        summary.errors = parseInt(issueMatch[1], 10);
      }
    });

    summary.files = files.size;
    summary.success = summary.errors === 0 && summary.warnings === 0;

    return summary;
  }

  /**
   * 解析 gofmt 输出
   * @param {string} output - gofmt 输出
   * @returns {Object}
   */
  parseGofmt(output) {
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
      // gofmt -l 输出: "file.go"
      // gofmt -d 输出: "diff file.go (before/after)"
      if (line.trim() && !line.startsWith('diff ') && !line.startsWith('---') && !line.startsWith('+++')) {
        const fileMatch = line.match(/^(.+\.go)$/);
        if (fileMatch) {
          files.add(fileMatch[1]);
        }
      }
    });

    summary.files = files.size;
    summary.errors = files.size; // 需要格式化的文件数
    summary.fixable = files.size; // gofmt 可以自动修复
    summary.success = files.size === 0;

    return summary;
  }

  /**
   * 解析 govet 输出
   * @param {string} output - govet 输出
   * @returns {Object}
   */
  parseGovet(output) {
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
      // govet 格式: "file.go:12:5: error message"
      const match = line.match(/^(.+?):(\d+):(\d+):\s+(.+)$/);
      if (match) {
        const [, file, lineNum, col, message] = match;
        currentFile = file;
        files.add(file);
        summary.errors++;

        summary.messages.push({
          file: currentFile,
          line: parseInt(lineNum, 10),
          column: parseInt(col, 10),
          severity: 'error',
          message: message.trim(),
          rule: 'govet'
        });
      }
    });

    summary.files = files.size;
    summary.success = summary.errors === 0;

    return summary;
  }

  /**
   * 通用解析（fallback）
   * @param {string} output - 输出
   * @returns {Object}
   */
  parseGeneric(output) {
    const hasErrors = /error|issue|problem/i.test(output);
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

module.exports = GoOutputParser;

