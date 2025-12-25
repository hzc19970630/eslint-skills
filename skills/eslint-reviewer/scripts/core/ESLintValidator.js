/**
 * ESLint 验证器实现
 * 实现 Validator 接口，提供 ESLint 验证功能
 */
const Validator = require('./Validator');
const ESLintExecutor = require('../executors/ESLintExecutor');
const ESLintOutputParser = require('../parsers/ESLintOutputParser');
const ConfigDetector = require('../detectors/ConfigDetector');
const CommandRunner = require('../utils/CommandRunner');

class ESLintValidator extends Validator {
  constructor(dependencies = {}) {
    super();
    this.executor = dependencies.executor || new ESLintExecutor({
      commandRunner: dependencies.commandRunner || new CommandRunner(),
      config: dependencies.config || {}
    });
    this.parser = dependencies.parser || new ESLintOutputParser();
    this.configDetector = dependencies.configDetector || new ConfigDetector();
    this.commandRunner = dependencies.commandRunner || new CommandRunner();
  }

  /**
   * 检查前置条件
   * @returns {Object} { passed: boolean, message?: string }
   */
  checkPrerequisites() {
    // 检查 Git 仓库
    try {
      this.commandRunner.exec('git rev-parse --git-dir', { stdio: 'ignore' });
    } catch {
      return {
        passed: false,
        message: 'Not a git repository'
      };
    }

    // 检查 ESLint 是否可用
    if (!this.executor.isAvailable()) {
      return {
        passed: false,
        message: 'ESLint is not installed. Run: npm install eslint'
      };
    }

    // 检查 ESLint 配置
    if (!this.configDetector.hasConfig()) {
      return {
        passed: false,
        message: 'No ESLint configuration found in the project'
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

    const { format = 'stylish' } = options;
    const result = await this.executor.run(files, { fix: false, format });
    const parsed = this.parser.parse(result.output);

    return {
      ...parsed,
      rawOutput: result.output
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

    const { format = 'stylish' } = options;
    const result = await this.executor.run(files, { fix: true, format });
    const parsed = this.parser.parse(result.output);

    return {
      ...parsed,
      rawOutput: result.output,
      fixed: true
    };
  }
}

module.exports = ESLintValidator;

