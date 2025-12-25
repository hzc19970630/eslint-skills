/**
 * Rust 执行器
 * 执行 Rust linter 命令（clippy, rustfmt）
 */
const CommandExecutor = require('./CommandExecutor');
const CommandRunner = require('../utils/CommandRunner');

class RustExecutor extends CommandExecutor {
  constructor(dependencies = {}) {
    super();
    this.commandRunner = dependencies.commandRunner || new CommandRunner();
    this.config = dependencies.config || {};
    this.defaultTool = this.config.defaultTool || 'clippy';
  }

  /**
   * 执行 Rust linter
   * @param {string[]} files - 要检查的文件列表
   * @param {Object} options - 执行选项
   * @param {boolean} options.fix - 是否自动修复（仅 rustfmt 支持）
   * @param {string} options.tool - 使用的工具 (clippy, rustfmt)
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
        throwOnError: false,
        cwd: this.findCargoProjectRoot(files[0])
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
   * 构建 Rust linter 命令
   * @param {string[]} files - 文件列表
   * @param {Object} options - 选项
   * @returns {string} 命令字符串
   */
  buildCommand(files, options = {}) {
    const { fix = false, tool = this.defaultTool } = options;
    const parts = [];

    switch (tool) {
      case 'clippy':
        parts.push('cargo', 'clippy');
        parts.push('--message-format=json');
        if (this.config.clippyConfig) {
          parts.push('--', '--config', this.config.clippyConfig);
        }
        break;

      case 'rustfmt':
        parts.push('rustfmt');
        if (fix) {
          parts.push('--write-mode=overwrite');
        } else {
          parts.push('--check');
        }
        if (this.config.rustfmtConfig) {
          parts.push('--config-path', this.config.rustfmtConfig);
        }
        break;

      default:
        parts.push(tool);
    }

    // Rust 工具通常处理整个项目，而不是单个文件
    // 但我们可以传递文件列表
    if (tool === 'rustfmt') {
      files.forEach(file => {
        parts.push(`"${file}"`);
      });
    }

    return parts.join(' ');
  }

  /**
   * 查找 Cargo 项目根目录
   * @param {string} file - 文件路径
   * @returns {string} 项目根目录
   */
  findCargoProjectRoot(file) {
    const path = require('path');
    const fs = require('fs');
    let dir = path.dirname(file);
    
    while (dir !== path.dirname(dir)) {
      if (fs.existsSync(path.join(dir, 'Cargo.toml'))) {
        return dir;
      }
      dir = path.dirname(dir);
    }
    
    return process.cwd();
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
      clippy: [
        /error/i,
        /warning/i,
        /clippy::/i,
        /Finished in/i  // clippy 成功时输出 "Finished"
      ],
      rustfmt: [
        /Diff of/i,
        /would be reformatted/i
      ]
    };

    const patterns = errorPatterns[tool] || [/error/i];
    
    // clippy 特殊处理：如果没有 "Finished" 且有 "error" 或 "warning"，认为有错误
    if (tool === 'clippy') {
      const hasFinished = /Finished/i.test(output);
      const hasError = /error/i.test(output) || /warning/i.test(output);
      return hasError && !hasFinished;
    }
    
    return patterns.some(pattern => pattern.test(output));
  }

  /**
   * 检查工具是否可用
   * @param {string} tool - 工具名称
   * @returns {boolean}
   */
  isAvailable(tool = null) {
    const toolToCheck = tool || this.defaultTool;
    
    // 所有 Rust 工具都需要 Rust 环境
    if (!this.commandRunner.isAvailable('cargo')) {
      return false;
    }
    
    if (toolToCheck === 'clippy') {
      // clippy 是 cargo 的子命令
      return this.commandRunner.isAvailable('cargo clippy');
    }
    
    if (toolToCheck === 'rustfmt') {
      return this.commandRunner.isAvailable('rustfmt');
    }
    
    return false;
  }
}

module.exports = RustExecutor;

