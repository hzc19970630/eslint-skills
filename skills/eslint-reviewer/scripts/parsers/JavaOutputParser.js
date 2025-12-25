/**
 * Java 输出解析器
 * 解析 Java linter 的输出（checkstyle, spotbugs, pmd）
 */
const OutputParser = require('./OutputParser');

class JavaOutputParser extends OutputParser {
  constructor(tool = 'checkstyle') {
    super();
    this.tool = tool;
  }

  /**
   * 解析 Java linter 输出
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
      case 'checkstyle':
        return this.parseCheckstyle(output);
      case 'spotbugs':
        return this.parseSpotbugs(output);
      case 'pmd':
        return this.parsePmd(output);
      default:
        return this.parseGeneric(output);
    }
  }

  /**
   * 解析 Checkstyle 输出
   * @param {string} output - Checkstyle 输出
   * @returns {Object}
   */
  parseCheckstyle(output) {
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
      // Checkstyle 格式: "file.java:12:4: error: Missing a Javadoc comment. [MissingJavadocMethod]"
      const match = line.match(/^(.+?):(\d+):(\d+):\s+(error|warning|info):\s+(.+?)\s+\[(.+)\]$/);
      if (match) {
        const [, file, lineNum, col, severity, message, rule] = match;
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
          rule
        });
      }

      // 统计行: "Checkstyle ends with 3 errors."
      const errorMatch = line.match(/(\d+)\s+errors?/i);
      if (errorMatch) {
        summary.errors = parseInt(errorMatch[1], 10);
      }

      const warningMatch = line.match(/(\d+)\s+warnings?/i);
      if (warningMatch) {
        summary.warnings = parseInt(warningMatch[1], 10);
      }
    });

    summary.files = files.size;
    summary.success = summary.errors === 0 && summary.warnings === 0;

    return summary;
  }

  /**
   * 解析 Spotbugs 输出
   * @param {string} output - Spotbugs 输出
   * @returns {Object}
   */
  parseSpotbugs(output) {
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
      // Spotbugs 格式: "file.java:12: warning: [RULE] Description"
      const match = line.match(/^(.+?):(\d+):\s+warning:\s+\[(.+?)\]\s+(.+)$/);
      if (match) {
        const [, file, lineNum, rule, message] = match;
        files.add(file);
        summary.warnings++;
        summary.errors++; // Spotbugs 的 warning 通常视为错误

        summary.messages.push({
          file,
          line: parseInt(lineNum, 10),
          column: 0,
          severity: 'error',
          message: message.trim(),
          rule
        });
      }

      // 统计: "Found X bugs"
      const bugMatch = line.match(/Found\s+(\d+)\s+bugs?/i);
      if (bugMatch) {
        summary.errors = parseInt(bugMatch[1], 10);
      }
    });

    summary.files = files.size;
    summary.success = summary.errors === 0;

    return summary;
  }

  /**
   * 解析 PMD 输出
   * @param {string} output - PMD 输出
   * @returns {Object}
   */
  parsePmd(output) {
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
      // PMD 格式: "file.java:12:    Rule:Violation message"
      const match = line.match(/^(.+?):(\d+):\s+(.+?):(.+)$/);
      if (match) {
        const [, file, lineNum, rule, message] = match;
        files.add(file);
        summary.errors++;

        summary.messages.push({
          file,
          line: parseInt(lineNum, 10),
          column: 0,
          severity: 'error',
          message: message.trim(),
          rule: rule.trim()
        });
      }

      // 统计: "Found X violations"
      const violationMatch = line.match(/Found\s+(\d+)\s+violations?/i);
      if (violationMatch) {
        summary.errors = parseInt(violationMatch[1], 10);
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
    const hasErrors = /error|violation|bug/i.test(output);
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

module.exports = JavaOutputParser;

