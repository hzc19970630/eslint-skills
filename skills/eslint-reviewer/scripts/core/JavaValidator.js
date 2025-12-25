/**
 * Java 验证器实现
 * 实现 Validator 接口，提供 Java 代码验证功能
 */
const Validator = require('./Validator');
const JavaExecutor = require('../executors/JavaExecutor');
const JavaOutputParser = require('../parsers/JavaOutputParser');
const CommandRunner = require('../utils/CommandRunner');

class JavaValidator extends Validator {
  constructor(dependencies = {}) {
    super();
    this.executor = dependencies.executor || new JavaExecutor({
      commandRunner: dependencies.commandRunner || new CommandRunner(),
      config: dependencies.config || {}
    });
    this.parser = dependencies.parser || new JavaOutputParser(
      dependencies.config?.defaultTool || 'checkstyle'
    );
    this.commandRunner = dependencies.commandRunner || new CommandRunner();
    this.config = dependencies.config || {};
  }

  /**
   * 检查前置条件
   * @returns {Object} { passed: boolean, message?: string }
   */
  checkPrerequisites() {
    // 检查 Java 是否安装
    if (!this.commandRunner.isAvailable('java')) {
      return {
        passed: false,
        message: 'Java is not installed. Please install Java JDK 8+'
      };
    }

    // 检查 linter 工具是否可用
    const tool = this.config.defaultTool || 'checkstyle';
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
      checkstyle: 'Download from https://checkstyle.sourceforge.io/ or use Maven/Gradle',
      spotbugs: 'Install via: mvn dependency:get -Dartifact=com.github.spotbugs:spotbugs:X.X.X',
      pmd: 'Install via: mvn dependency:get -Dartifact=net.sourceforge.pmd:pmd:X.X.X'
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

    const { tool = this.config.defaultTool || 'checkstyle' } = options;
    const result = await this.executor.run(files, { tool });
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
    // Java linter 通常不支持自动修复
    return {
      success: false,
      files: files.length,
      errors: 0,
      warnings: 0,
      fixable: 0,
      messages: [],
      note: 'Auto-fix is not supported for Java linters. Please fix issues manually.'
    };
  }
}

module.exports = JavaValidator;

