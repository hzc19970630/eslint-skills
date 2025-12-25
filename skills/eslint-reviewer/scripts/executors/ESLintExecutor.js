/**
 * ESLint 执行器
 * 执行 ESLint 命令并返回结果
 */
const CommandExecutor = require('./CommandExecutor');
const CommandRunner = require('../utils/CommandRunner');

class ESLintExecutor extends CommandExecutor {
  constructor(dependencies = {}) {
    super();
    this.commandRunner = dependencies.commandRunner || new CommandRunner();
    this.config = dependencies.config || {};
  }

  /**
   * 执行 ESLint
   * @param {string[]} files - 要检查的文件列表
   * @param {Object} options - 执行选项
   * @param {boolean} options.fix - 是否自动修复
   * @param {string} options.format - 输出格式
   * @returns {Promise<Object>} 执行结果
   */
  async run(files, options = {}) {
    if (files.length === 0) {
      return {
        success: true,
        output: 'No files to lint',
        exitCode: 0
      };
    }

    const { fix = false, format = this.config.format || 'stylish' } = options;
    const command = this.buildCommand(files, { fix, format });

    try {
      const output = this.commandRunner.exec(command, {
        encoding: 'utf-8',
        stdio: 'pipe',
        throwOnError: false
      });

      // ESLint 成功时返回码为 0，有错误时返回码非 0
      // 我们需要检查输出中是否有错误信息
      const hasErrors = this.hasErrors(output);

      return {
        success: !hasErrors,
        output: output || '',
        exitCode: hasErrors ? 1 : 0
      };
    } catch (error) {
      return {
        success: false,
        output: error.stdout || error.stderr || error.message || '',
        error: error.message,
        exitCode: error.code || 1
      };
    }
  }

  /**
   * 构建 ESLint 命令
   * @param {string[]} files - 文件列表
   * @param {Object} options - 选项
   * @returns {string} 命令字符串
   */
  buildCommand(files, options = {}) {
    const parts = ['npx', 'eslint'];

    if (options.fix) {
      parts.push('--fix');
    }

    if (options.format) {
      parts.push(`--format=${options.format}`);
    }

    // 添加文件，使用引号包裹以处理空格
    files.forEach(file => {
      parts.push(`"${file}"`);
    });

    return parts.join(' ');
  }

  /**
   * 检查输出中是否有错误
   * @param {string} output - ESLint 输出
   * @returns {boolean}
   */
  hasErrors(output) {
    if (!output) {
      return false;
    }

    // 检查常见的错误模式
    const errorPatterns = [
      /error\s+\d+/i,
      /✖\s+\d+\s+problems?/i,
      /problems?\s+\((\d+)\s+errors?/i
    ];

    return errorPatterns.some(pattern => pattern.test(output));
  }

  /**
   * 检查 ESLint 是否可用
   * @returns {boolean}
   */
  isAvailable() {
    return this.commandRunner.isAvailable('npx eslint');
  }
}

module.exports = ESLintExecutor;

