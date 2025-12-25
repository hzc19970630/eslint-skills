/**
 * Python 执行器
 * 执行 Python linter 命令（pylint, flake8, black, mypy）
 */
const CommandExecutor = require('./CommandExecutor');
const CommandRunner = require('../utils/CommandRunner');

class PythonExecutor extends CommandExecutor {
  constructor(dependencies = {}) {
    super();
    this.commandRunner = dependencies.commandRunner || new CommandRunner();
    this.config = dependencies.config || {};
    this.defaultTool = this.config.defaultTool || 'pylint';
  }

  /**
   * 执行 Python linter
   * @param {string[]} files - 要检查的文件列表
   * @param {Object} options - 执行选项
   * @param {boolean} options.fix - 是否自动修复（仅 black 支持）
   * @param {string} options.tool - 使用的工具 (pylint, flake8, black, mypy)
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

    const { fix = false, tool = this.defaultTool } = options;
    const command = this.buildCommand(files, { fix, tool });

    try {
      const output = this.commandRunner.exec(command, {
        encoding: 'utf-8',
        stdio: 'pipe',
        throwOnError: false
      });

      const hasErrors = this.hasErrors(output, tool);

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
   * 构建 Python linter 命令
   * @param {string[]} files - 文件列表
   * @param {Object} options - 选项
   * @returns {string} 命令字符串
   */
  buildCommand(files, options = {}) {
    const { fix = false, tool = this.defaultTool } = options;
    const parts = [];

    switch (tool) {
      case 'pylint':
        parts.push('pylint', '--output-format=text');
        if (this.config.pylintConfig) {
          parts.push(`--rcfile=${this.config.pylintConfig}`);
        }
        break;

      case 'flake8':
        parts.push('flake8');
        if (this.config.flake8Config) {
          parts.push(`--config=${this.config.flake8Config}`);
        }
        break;

      case 'black':
        if (fix) {
          parts.push('black');
        } else {
          parts.push('black', '--check', '--diff');
        }
        break;

      case 'mypy':
        parts.push('mypy');
        if (this.config.mypyConfig) {
          parts.push(`--config-file=${this.config.mypyConfig}`);
        }
        break;

      default:
        parts.push(tool);
    }

    // 添加文件
    files.forEach(file => {
      parts.push(`"${file}"`);
    });

    return parts.join(' ');
  }

  /**
   * 检查输出中是否有错误
   * @param {string} output - 工具输出
   * @param {string} tool - 工具名称
   * @returns {boolean}
   */
  hasErrors(output, tool) {
    if (!output) {
      return false;
    }

    // 不同工具的错误模式
    const errorPatterns = {
      pylint: [
        /^[A-Z]\d{4}/,  // Pylint 错误代码格式
        /error/i,
        /fatal/i
      ],
      flake8: [
        /^[A-Z]\d{3}/,  // Flake8 错误代码格式
        /error/i
      ],
      black: [
        /would reformat/i,
        /reformatted/i
      ],
      mypy: [
        /error:/i,
        /Found \d+ error/i
      ]
    };

    const patterns = errorPatterns[tool] || [/error/i];
    return patterns.some(pattern => pattern.test(output));
  }

  /**
   * 检查工具是否可用
   * @param {string} tool - 工具名称
   * @returns {boolean}
   */
  isAvailable(tool = null) {
    const toolToCheck = tool || this.defaultTool;
    return this.commandRunner.isAvailable(toolToCheck);
  }
}

module.exports = PythonExecutor;

