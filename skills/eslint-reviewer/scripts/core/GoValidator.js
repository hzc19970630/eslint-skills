/**
 * Go 验证器实现
 * 实现 Validator 接口，提供 Go 代码验证功能
 */
const Validator = require('./Validator');
const GoExecutor = require('../executors/GoExecutor');
const GoOutputParser = require('../parsers/GoOutputParser');
const CommandRunner = require('../utils/CommandRunner');

class GoValidator extends Validator {
  constructor(dependencies = {}) {
    super();
    this.executor = dependencies.executor || new GoExecutor({
      commandRunner: dependencies.commandRunner || new CommandRunner(),
      config: dependencies.config || {}
    });
    this.parser = dependencies.parser || new GoOutputParser(
      dependencies.config?.defaultTool || 'golangci-lint'
    );
    this.commandRunner = dependencies.commandRunner || new CommandRunner();
    this.config = dependencies.config || {};
  }

  /**
   * 检查前置条件
   * @returns {Object} { passed: boolean, message?: string }
   */
  checkPrerequisites() {
    // 检查 Go 是否安装
    if (!this.commandRunner.isAvailable('go')) {
      return {
        passed: false,
        message: 'Go is not installed. Please install Go 1.16+. Visit https://golang.org/dl/'
      };
    }

    // 检查 linter 工具是否可用
    const tool = this.config.defaultTool || 'golangci-lint';
    if (!this.executor.isAvailable(tool)) {
      const installMsg = this.getInstallMessage(tool);
      return {
        passed: false,
        message: `${tool} is not installed. ${installMsg}`
      };
    }

    return { passed: true };
  }

  /**
   * 获取安装提示信息
   * @param {string} tool - 工具名称
   * @returns {string}
   */
  getInstallMessage(tool) {
    const messages = {
      'golangci-lint': 'Install via: go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest',
      gofmt: 'gofmt is included with Go',
      govet: 'govet is included with Go'
    };
    return messages[tool] || `Install ${tool}`;
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

    const { tool = this.config.defaultTool || 'golangci-lint' } = options;
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

    // 只有 gofmt 支持自动修复
    const tool = options.tool || 'gofmt';
    if (tool !== 'gofmt') {
      return {
        success: false,
        files: files.length,
        errors: 0,
        warnings: 0,
        fixable: 0,
        messages: [],
        note: `Auto-fix is only supported for 'gofmt' tool, not '${tool}'`
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

module.exports = GoValidator;

