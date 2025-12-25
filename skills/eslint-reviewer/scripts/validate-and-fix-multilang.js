#!/usr/bin/env node

/**
 * ESLint Skills - 多语言支持版本
 * 支持 JavaScript/TypeScript、Python、Java、Go、Rust 等多种语言
 */

const ValidatorFactory = require('./core/ValidatorFactory');
const MultiLanguageValidator = require('./core/MultiLanguageValidator');
const LanguageDetector = require('./detectors/LanguageDetector');
const ProjectStackDetector = require('./detectors/ProjectStackDetector');
const GitFileDetector = require('./detectors/GitFileDetector');
const CompositeFilter = require('./filters/CompositeFilter');
const ExtensionFilter = require('./filters/ExtensionFilter');
const ConfigFileFilter = require('./filters/ConfigFileFilter');
const ConsoleReporter = require('./reporters/ConsoleReporter');
const ConfigLoader = require('./config/ConfigLoader');
const Logger = require('./utils/Logger');
const CommandRunner = require('./utils/CommandRunner');

/**
 * 多语言代码校验 Skill
 */
class MultiLanguageSkill {
  constructor(options = {}) {
    // 加载配置
    this.config = ConfigLoader.load(options.configPath);
    
    // 创建工具实例
    this.logger = new Logger({
      verbose: options.verbose || false,
      silent: options.silent || false,
      colors: this.config.reporters?.options?.colors !== false
    });
    
    this.commandRunner = new CommandRunner();
    
    // 自动检测项目技术栈（如果启用）
    if (options.autoDetect !== false) {
      this.autoDetectStack();
    }
    
    // 创建语言检测器
    this.languageDetector = new LanguageDetector(this.config.languages);
    
    // 创建各语言验证器
    this.validators = this.createValidators();
    
    // 创建多语言验证器
    this.validator = new MultiLanguageValidator({
      languageDetector: this.languageDetector,
      validators: this.validators,
      logger: this.logger
    });
    
    // 创建文件检测器
    this.fileDetector = new GitFileDetector({
      commandRunner: this.commandRunner
    });
    
    // 创建文件过滤器
    this.fileFilter = this.createFileFilter();
    
    // 创建报告器
    this.reporter = new ConsoleReporter({
      logger: this.logger
    });
  }

  /**
   * 自动检测项目技术栈并更新配置
   */
  autoDetectStack() {
    try {
      const stackDetector = new ProjectStackDetector();
      const recommended = stackDetector.getRecommendedValidators();
      
      // 如果配置中没有语言配置，使用检测结果
      if (!this.config.languages || Object.keys(this.config.languages).length === 0) {
        this.logger.debug('No language config found, using auto-detection');
        const suggestedConfig = stackDetector.generateConfigSuggestion();
        
        // 合并建议的配置
        if (suggestedConfig.languages) {
          this.config.languages = suggestedConfig.languages;
        }
        if (suggestedConfig.validExtensions) {
          this.config.validExtensions = [
            ...new Set([...(this.config.validExtensions || []), ...suggestedConfig.validExtensions])
          ];
        }
      } else {
        // 验证现有配置是否匹配项目
        const validation = stackDetector.validateConfig(process.cwd(), this.config);
        if (!validation.valid && this.logger.verbose) {
          this.logger.warn('Config validation issues:');
          validation.issues.forEach(issue => {
            this.logger.warn(`  - ${issue.message}`);
          });
        }
      }
    } catch (error) {
      // 如果检测失败，使用默认配置
      this.logger.debug('Stack detection failed, using default config:', error.message);
    }
  }

  /**
   * 创建各语言验证器
   * @returns {Object} 语言到验证器的映射
   */
  createValidators() {
    const validators = {};
    const languages = this.config.languages || {};

    // JavaScript/TypeScript/Vue - ESLint
    if (languages.javascript || languages.typescript || languages.vue) {
      const jsValidator = ValidatorFactory.create('eslint', {
        config: this.config.eslint || {},
        commandRunner: this.commandRunner
      });
      
      // 为所有 JS/TS/Vue 语言使用同一个验证器
      if (languages.javascript) validators.javascript = jsValidator;
      if (languages.typescript) validators.typescript = jsValidator;
      if (languages.vue) validators.vue = jsValidator;
    }

    // Python
    if (languages.python) {
      validators.python = ValidatorFactory.create('python', {
        config: languages.python,
        commandRunner: this.commandRunner
      });
    }

    // Java
    if (languages.java) {
      validators.java = ValidatorFactory.create('java', {
        config: languages.java,
        commandRunner: this.commandRunner
      });
    }

    // Go
    if (languages.go) {
      validators.go = ValidatorFactory.create('go', {
        config: languages.go,
        commandRunner: this.commandRunner
      });
    }

    // Rust
    if (languages.rust) {
      validators.rust = ValidatorFactory.create('rust', {
        config: languages.rust,
        commandRunner: this.commandRunner
      });
    }

    return validators;
  }

  /**
   * 创建文件过滤器
   * @returns {CompositeFilter}
   */
  createFileFilter() {
    const filter = new CompositeFilter();
    
    // 扩展名过滤
    filter.addFilter(new ExtensionFilter(this.config.validExtensions));
    
    // 配置文件过滤（所有语言的配置文件）
    const allConfigFiles = this.getAllConfigFiles();
    if (allConfigFiles.length > 0) {
      filter.addFilter(new ConfigFileFilter(allConfigFiles));
    }
    
    return filter;
  }

  /**
   * 获取所有语言的配置文件列表
   * @returns {string[]}
   */
  getAllConfigFiles() {
    const configFiles = [];
    const languages = this.config.languages || {};
    
    // ESLint 配置文件
    if (this.config.eslintConfigFiles) {
      configFiles.push(...this.config.eslintConfigFiles);
    }
    
    // 各语言的配置文件
    Object.values(languages).forEach(langConfig => {
      if (langConfig.configFiles) {
        configFiles.push(...langConfig.configFiles);
      }
    });
    
    return [...new Set(configFiles)];
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

      // 按语言分组显示
      const groups = this.languageDetector.groupFilesByLanguage(files);
      this.logger.log(`\n📝 Found ${files.length} changed file(s) in ${Object.keys(groups).length} language(s):`);
      Object.entries(groups).forEach(([lang, langFiles]) => {
        this.logger.log(`   ${lang}: ${langFiles.length} file(s)`);
        langFiles.forEach(file => {
          this.logger.log(`      - ${file}`);
        });
      });

      // 报告开始验证
      this.reporter.reportValidationStart();

      // 运行验证或修复
      let result;
      if (options.fix) {
        result = await this.validator.fix(files, options);
      } else {
        result = await this.validator.validate(files, options);
      }

      // 输出原始输出
      if (result.rawOutput && result.rawOutput.length > 0) {
        result.rawOutput.forEach(({ language, output }) => {
          if (output) {
            this.logger.log(`\n[${language}]`);
            this.logger.log(output);
          }
        });
      }

      // 报告结果
      this.reportMultiLanguageResult(result);

      return result;
    } catch (error) {
      this.reporter.reportError(error);
      this.logger.debug('Error details:', error);
      process.exit(1);
    }
  }

  /**
   * 报告多语言结果
   * @param {Object} result - 验证结果
   */
  reportMultiLanguageResult(result) {
    if (result.success) {
      this.logger.success('All files passed validation!');
    } else {
      this.logger.error('Validation found issues');
      
      // 按语言显示统计
      if (result.languages && Object.keys(result.languages).length > 0) {
        this.logger.log('\n📊 Results by language:');
        Object.entries(result.languages).forEach(([lang, langResult]) => {
          const status = langResult.success ? '✅' : '❌';
          this.logger.log(`   ${status} ${lang}: ${langResult.errors} errors, ${langResult.warnings} warnings`);
        });
      }
      
      this.logger.log(`\nTotal: ${result.errors} errors, ${result.warnings} warnings`);
      
      if (result.fixable > 0) {
        this.logger.warn(`\n💡 Tip: ${result.fixable} issue(s) can be automatically fixed.`);
        this.logger.log('   Run with --fix flag: node validate-and-fix-multilang.js --fix');
      }
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

  const skill = new MultiLanguageSkill(options);
  
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

module.exports = MultiLanguageSkill;

