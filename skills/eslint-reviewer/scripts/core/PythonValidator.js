/**
 * Python 验证器实现
 * 实现 Validator 接口，提供 Python 代码验证功能
 */
const Validator = require('./Validator');
const PythonExecutor = require('../executors/PythonExecutor');
const PythonOutputParser = require('../parsers/PythonOutputParser');
const CommandRunner = require('../utils/CommandRunner');

class PythonValidator extends Validator {
  constructor(dependencies = {}) {
    super();
    this.executor = dependencies.executor || new PythonExecutor({
      commandRunner: dependencies.commandRunner || new CommandRunner(),
      config: dependencies.config || {}
    });
    this.parser = dependencies.parser || new PythonOutputParser(
      dependencies.config?.defaultTool || 'pylint'
    );
    this.commandRunner = dependencies.commandRunner || new CommandRunner();
    this.config = dependencies.config || {};
  }

  /**
   * 检查前置条件
   * @returns {Object} { passed: boolean, message?: string }
   */
  checkPrerequisites() {
    // 检查 Python 是否安装
    if (!this.commandRunner.isAvailable('python3') && !this.commandRunner.isAvailable('python')) {
      return {
        passed: false,
        message: 'Python is not installed. Please install Python 3.6+'
      };
    }

    // 检查 linter 工具是否可用
    const tool = this.config.defaultTool || 'pylint';
    if (!this.executor.isAvailable(tool)) {
      return {
        passed: false,
        message: `${tool} is not installed. Run: pip install ${tool}`
      };
    }

    return { passed: true };
  }

  /**
   * 验证文件
   * @param {string[]} files - 要验证的文件列表
   * @param {Object} options - 验证选项
   * @returns {Promise<Object>} 验证结果
   */
  async validate(files, options = {}) {
    if (files.length === 0) {
      return {
        success: true,
        files: 0,
        errors: 0,
        warnings: 0,
        fixable: 0,
        messages: []
      };
    }

    const { tool = this.config.defaultTool || 'pylint' } = options;
    const result = await this.executor.run(files, { fix: false, tool });
    const parsed = this.parser.parse(result.output);

    return {
      ...parsed,
      rawOutput: result.output,
      tool
    };
  }

  /**
   * 自动修复文件
   * @param {string[]} files - 要修复的文件列表
   * @param {Object} options - 修复选项
   * @returns {Promise<Object>} 修复结果
   */
  async fix(files, options = {}) {
    if (files.length === 0) {
      return {
        success: true,
        files: 0,
        errors: 0,
        warnings: 0,
        fixable: 0,
        messages: []
      };
    }

    // 只有 black 支持自动修复
    const tool = options.tool || 'black';
    if (tool !== 'black') {
      return {
        success: false,
        files: files.length,
        errors: 0,
        warnings: 0,
        fixable: 0,
        messages: [],
        note: `Auto-fix is only supported for 'black' tool, not '${tool}'`
      };
    }

    const result = await this.executor.run(files, { fix: true, tool });
    const parsed = this.parser.parse(result.output);

    return {
      ...parsed,
      rawOutput: result.output,
      fixed: true,
      tool
    };
  }
}

module.exports = PythonValidator;

