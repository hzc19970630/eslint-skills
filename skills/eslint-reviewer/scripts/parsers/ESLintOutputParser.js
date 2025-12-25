/**
 * ESLint 输出解析器
 * 解析 ESLint 的输出，提取错误、警告等信息
 */
const OutputParser = require('./OutputParser');

class ESLintOutputParser extends OutputParser {
  /**
   * 解析 ESLint 输出
   * @param {string} output - ESLint 输出
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

    const lines = output.split('\n');
    const summary = {
      success: false,
      files: 0,
      errors: 0,
      warnings: 0,
      fixable: 0,
      messages: []
    };

    // 解析问题统计
    this.parseSummary(lines, summary);

    // 解析详细信息
    this.parseMessages(lines, summary);

    // 如果没有错误和警告，认为成功
    summary.success = summary.errors === 0 && summary.warnings === 0;

    return summary;
  }

  /**
   * 解析摘要信息
   * @param {string[]} lines - 输出行
   * @param {Object} summary - 摘要对象
   */
  parseSummary(lines, summary) {
    lines.forEach(line => {
      // 匹配: "✖ 3 problems (2 errors, 1 warning)"
      const problemMatch = line.match(/(\d+)\s+problems?\s+\((\d+)\s+errors?,\s+(\d+)\s+warnings?\)/i);
      if (problemMatch) {
        summary.errors = parseInt(problemMatch[2], 10);
        summary.warnings = parseInt(problemMatch[3], 10);
      }

      // 匹配: "2 errors and 1 warning potentially fixable"
      const fixableMatch = line.match(/(\d+)\s+errors?\s+and\s+(\d+)\s+warnings?\s+potentially\s+fixable/i);
      if (fixableMatch) {
        summary.fixable = parseInt(fixableMatch[1], 10) + parseInt(fixableMatch[2], 10);
      }
    });
  }

  /**
   * 解析详细消息
   * @param {string[]} lines - 输出行
   * @param {Object} summary - 摘要对象
   */
  parseMessages(lines, summary) {
    let currentFile = null;

    lines.forEach((line, index) => {
      // 匹配文件路径: "/path/to/file.js"
      const fileMatch = line.match(/^(.+)$/);
      if (fileMatch && !line.match(/^\s+\d+:\d+/)) {
        const potentialFile = fileMatch[1].trim();
        // 简单启发式：如果行包含文件扩展名且下一行是错误信息，认为是文件路径
        if (potentialFile.match(/\.(js|jsx|ts|tsx|vue|css|scss|sass|less|styl)$/i)) {
          currentFile = potentialFile;
          summary.files++;
        }
      }

      // 匹配错误/警告: "  12:15  error    'foo' is not defined                no-undef"
      const messageMatch = line.match(/^\s+(\d+):(\d+)\s+(error|warning)\s+(.+?)\s+(\S+)$/);
      if (messageMatch) {
        summary.messages.push({
          file: currentFile || 'unknown',
          line: parseInt(messageMatch[1], 10),
          column: parseInt(messageMatch[2], 10),
          severity: messageMatch[3],
          message: messageMatch[4].trim(),
          rule: messageMatch[5]
        });
      }
    });
  }
}

module.exports = ESLintOutputParser;

