/**
 * Java 执行器
 * 执行 Java linter 命令（checkstyle, spotbugs, pmd）
 */
const CommandExecutor = require('./CommandExecutor');
const CommandRunner = require('../utils/CommandRunner');

class JavaExecutor extends CommandExecutor {
  constructor(dependencies = {}) {
    super();
    this.commandRunner = dependencies.commandRunner || new CommandRunner();
    this.config = dependencies.config || {};
    this.defaultTool = this.config.defaultTool || 'checkstyle';
  }

  /**
   * 执行 Java linter
   * @param {string[]} files - 要检查的文件列表
   * @param {Object} options - 执行选项
   * @param {string} options.tool - 使用的工具 (checkstyle, spotbugs, pmd)
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

    const { tool = this.defaultTool } = options;
    const command = this.buildCommand(files, { tool });

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
   * 构建 Java linter 命令
   * @param {string[]} files - 文件列表
   * @param {Object} options - 选项
   * @returns {string} 命令字符串
   */
  buildCommand(files, options = {}) {
    const { tool = this.defaultTool } = options;
    const parts = [];

    switch (tool) {
      case 'checkstyle':
        // checkstyle 通常作为 Java 程序运行
        const checkstyleJar = this.config.checkstyleJar || 'checkstyle.jar';
        const checkstyleConfig = this.config.checkstyleConfig || 'checkstyle.xml';
        parts.push('java', '-jar', checkstyleJar, '-c', checkstyleConfig);
        break;

      case 'spotbugs':
        // spotbugs 需要编译后的 class 文件
        parts.push('spotbugs');
        if (this.config.spotbugsConfig) {
          parts.push('-include', this.config.spotbugsConfig);
        }
        break;

      case 'pmd':
        parts.push('pmd', 'check');
        if (this.config.pmdConfig) {
          parts.push('-R', this.config.pmdConfig);
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

    const errorPatterns = {
      checkstyle: [
        /error/i,
        /violation/i,
        /Found \d+ violations?/i
      ],
      spotbugs: [
        /error/i,
        /bug/i,
        /Found \d+ bugs?/i
      ],
      pmd: [
        /error/i,
        /violation/i,
        /Found \d+ violations?/i
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
    
    // Java 工具通常需要 Java 环境
    if (!this.commandRunner.isAvailable('java')) {
      return false;
    }
    
    // 检查具体工具
    if (toolToCheck === 'checkstyle') {
      // checkstyle 通常是 jar 文件，需要检查文件是否存在
      return true; // 简化检查
    }
    
    return this.commandRunner.isAvailable(toolToCheck);
  }
}

module.exports = JavaExecutor;

