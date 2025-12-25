/**
 * Go 执行器
 * 执行 Go linter 命令（golangci-lint, gofmt, govet）
 */
const CommandExecutor = require('./CommandExecutor');
const CommandRunner = require('../utils/CommandRunner');
const path = require('path');

class GoExecutor extends CommandExecutor {
  constructor(dependencies = {}) {
    super();
    this.commandRunner = dependencies.commandRunner || new CommandRunner();
    this.config = dependencies.config || {};
    this.defaultTool = this.config.defaultTool || 'golangci-lint';
  }

  /**
   * 执行 Go linter
   * @param {string[]} files - 要检查的文件列表
   * @param {Object} options - 执行选项
   * @param {boolean} options.fix - 是否自动修复（仅 gofmt 支持）
   * @param {string} options.tool - 使用的工具 (golangci-lint, gofmt, govet)
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
   * 构建 Go linter 命令
   * @param {string[]} files - 文件列表
   * @param {Object} options - 选项
   * @returns {string} 命令字符串
   */
  buildCommand(files, options = {}) {
    const { fix = false, tool = this.defaultTool } = options;
    const parts = [];

    switch (tool) {
      case 'golangci-lint':
        parts.push('golangci-lint', 'run');
        if (this.config.golangciConfig) {
          parts.push('--config', this.config.golangciConfig);
        }
        break;

      case 'gofmt':
        if (fix) {
          parts.push('gofmt', '-w');
        } else {
          parts.push('gofmt', '-l', '-d');
        }
        break;

      case 'govet':
        parts.push('go', 'vet');
        break;

      default:
        parts.push(tool);
    }

    // 添加文件或目录
    if (tool === 'govet') {
      // govet 需要包路径，不是文件
      const dirs = [...new Set(files.map(f => path.dirname(f)))];
      dirs.forEach(dir => parts.push(`"${dir}"`));
    } else {
      files.forEach(file => {
        parts.push(`"${file}"`);
      });
    }

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

    const errorPatterns = {
      'golangci-lint': [
        /error/i,
        /issues found/i,
        /Found \d+ issues?/i
      ],
      gofmt: [
        /diff/i,
        /would reformat/i
      ],
      govet: [
        /error/i,
        /vet found problems/i
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
    
    // 所有 Go 工具都需要 Go 环境
    if (!this.commandRunner.isAvailable('go')) {
      return false;
    }
    
    if (toolToCheck === 'golangci-lint') {
      return this.commandRunner.isAvailable('golangci-lint');
    }
    
    // gofmt 和 govet 是 Go 内置工具
    return true;
  }
}

module.exports = GoExecutor;

