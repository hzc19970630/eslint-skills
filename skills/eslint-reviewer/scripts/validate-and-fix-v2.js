#!/usr/bin/env node

/**
 * ESLint Skills - 重构版本
 * 使用模块化、高内聚低耦合的设计
 */

const ValidatorFactory = require('./core/ValidatorFactory');
const GitFileDetector = require('./detectors/GitFileDetector');
const CompositeFilter = require('./filters/CompositeFilter');
const ExtensionFilter = require('./filters/ExtensionFilter');
const ConfigFileFilter = require('./filters/ConfigFileFilter');
const ConsoleReporter = require('./reporters/ConsoleReporter');
const ConfigLoader = require('./config/ConfigLoader');
const Logger = require('./utils/Logger');
const CommandRunner = require('./utils/CommandRunner');

/**
 * ESLint Skill 主类
 */
class ESLintSkill {
  constructor(options = {}) {
    // 加载配置
    this.config = ConfigLoader.load(options.configPath);
    
    // 创建工具实例（依赖注入）
    this.logger = new Logger({
      verbose: options.verbose || false,
      silent: options.silent || false,
      colors: this.config.reporters?.options?.colors !== false
    });
    
    this.commandRunner = new CommandRunner();
    
    // 创建验证器
    this.validator = ValidatorFactory.create('eslint', {
      config: this.config.eslint || {},
      commandRunner: this.commandRunner
    });
    
    // 创建文件检测器
    this.fileDetector = new GitFileDetector({
      commandRunner: this.commandRunner
    });
    
    // 创建文件过滤器（组合模式）
    this.fileFilter = this.createFileFilter();
    
    // 创建报告器
    this.reporter = new ConsoleReporter({
      logger: this.logger
    });
  }

  /**
   * 创建文件过滤器
   * @returns {CompositeFilter}
   */
  createFileFilter() {
    return new CompositeFilter()
      .addFilter(new ExtensionFilter(this.config.validExtensions))
      .addFilter(new ConfigFileFilter(this.config.eslintConfigFiles));
  }

  /**
   * 运行验证
   * @param {Object} options - 运行选项
   * @returns {Promise<Object>} 验证结果
   */
  async run(options = {}) {
    try {
      // 报告开始
      this.reporter.reportStart();

      // 检查前置条件
      const prerequisites = this.validator.checkPrerequisites();
      if (!prerequisites.passed) {
        this.reporter.reportError(prerequisites.message);
        
        if (prerequisites.message.includes('ESLint configuration')) {
          this.logger.log('   Supported config files:');
          this.logger.log('   - .eslintrc.json, .eslintrc.js, .eslintrc.yml');
          this.logger.log('   - eslint.config.js (flat config)');
          this.logger.log('   - eslintConfig in package.json');
        }
        
        process.exit(1);
      }

      // 检测文件
      const detectedFiles = await this.fileDetector.detect({
        includeStaged: options.includeStaged !== false,
        includeUnstaged: options.includeUnstaged !== false,
        includeUntracked: options.includeUntracked !== false
      });

      // 过滤文件
      const files = this.fileFilter.filter(detectedFiles);

      if (files.length === 0) {
        this.reporter.reportInfo('No changed files found for linting');
        return { success: true, files: [] };
      }

      // 报告文件列表
      this.reporter.reportFiles(files);

      // 报告开始验证
      this.reporter.reportValidationStart();

      // 运行验证或修复
      let result;
      if (options.fix) {
        result = await this.validator.fix(files, {
          format: this.config.eslint?.format || 'stylish'
        });
      } else {
        result = await this.validator.validate(files, {
          format: this.config.eslint?.format || 'stylish'
        });
      }

      // 输出原始 ESLint 输出
      if (result.rawOutput) {
        this.logger.log(result.rawOutput);
      }

      // 报告结果
      this.reporter.report(result);

      return result;
    } catch (error) {
      this.reporter.reportError(error);
      this.logger.debug('Error details:', error);
      process.exit(1);
    }
  }
}

// CLI 入口
function main() {
  const args = process.argv.slice(2);
  
  const options = {
    fix: args.includes('--fix'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    silent: args.includes('--silent') || args.includes('-s'),
    config: (() => {
      const configIndex = args.indexOf('--config');
      return configIndex > -1 && args[configIndex + 1]
        ? args[configIndex + 1]
        : null;
    })()
  };

  const skill = new ESLintSkill(options);
  
  skill.run({ fix: options.fix })
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

// 如果直接运行此文件
if (require.main === module) {
  main();
}

module.exports = ESLintSkill;

