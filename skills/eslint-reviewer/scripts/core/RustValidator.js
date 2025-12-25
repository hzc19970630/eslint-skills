/**
 * Rust 验证器实现
 * 实现 Validator 接口，提供 Rust 代码验证功能
 */
const Validator = require('./Validator');
const RustExecutor = require('../executors/RustExecutor');
const RustOutputParser = require('../parsers/RustOutputParser');
const CommandRunner = require('../utils/CommandRunner');

class RustValidator extends Validator {
  constructor(dependencies = {}) {
    super();
    this.executor = dependencies.executor || new RustExecutor({
      commandRunner: dependencies.commandRunner || new CommandRunner(),
      config: dependencies.config || {}
    });
    this.parser = dependencies.parser || new RustOutputParser(
      dependencies.config?.defaultTool || 'clippy'
    );
    this.commandRunner = dependencies.commandRunner || new CommandRunner();
    this.config = dependencies.config || {};
  }

  /**
   * 检查前置条件
   * @param {string[]} files - 可选，要验证的文件列表。用于判断是否需要检查 Cargo.toml
   * @returns {Object} { passed: boolean, message?: string }
   */
  checkPrerequisites(files = null) {
    // 检查 Rust/Cargo 是否安装
    if (!this.commandRunner.isAvailable('cargo')) {
      return {
        passed: false,
        message: 'Rust/Cargo is not installed. Please install Rust. Visit https://rustup.rs/'
      };
    }

    // 检查 linter 工具是否可用
    const tool = this.config.defaultTool || 'clippy';
    if (!this.executor.isAvailable(tool)) {
      const installMsg = this.getInstallMessage(tool);
      return {
        passed: false,
        message: `${tool} is not installed. ${installMsg}`
      };
    }

    // 只有在有 Rust 文件时才检查 Cargo.toml
    // 如果没有提供文件列表，或者文件列表中有 .rs 文件，才检查 Cargo.toml
    const hasRustFiles = !files || files.some(file => file.endsWith('.rs'));
    
    if (hasRustFiles) {
      // 检查是否是 Cargo 项目
      const fs = require('fs');
      const path = require('path');
      const cargoToml = path.join(process.cwd(), 'Cargo.toml');
      if (!fs.existsSync(cargoToml)) {
        return {
          passed: false,
          message: 'Not a Rust/Cargo project. Cargo.toml not found. Rust files require a Cargo project.'
        };
      }
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
      clippy: 'Install via: rustup component add clippy',
      rustfmt: 'Install via: rustup component add rustfmt'
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

    const { tool = this.config.defaultTool || 'clippy' } = options;
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

    // 只有 rustfmt 支持自动修复
    const tool = options.tool || 'rustfmt';
    if (tool !== 'rustfmt') {
      return {
        success: false,
        files: files.length,
        errors: 0,
        warnings: 0,
        fixable: 0,
        messages: [],
        note: `Auto-fix is only supported for 'rustfmt' tool, not '${tool}'`
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

module.exports = RustValidator;

