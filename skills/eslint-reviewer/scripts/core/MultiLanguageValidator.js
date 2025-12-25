/**
 * 多语言验证器
 * 管理多个语言验证器，支持混合语言项目
 */
const Validator = require('./Validator');
const LanguageDetector = require('../detectors/LanguageDetector');

class MultiLanguageValidator extends Validator {
  constructor(dependencies = {}) {
    super();
    this.languageDetector = dependencies.languageDetector || new LanguageDetector();
    this.validators = dependencies.validators || {}; // { language: Validator }
    this.logger = dependencies.logger;
  }

  /**
   * 检查前置条件
   * @param {string[]} files - 可选，要验证的文件列表。如果提供，只检查这些文件中出现的语言的验证器
   * @returns {Object} { passed: boolean, message?: string, warnings?: string[] }
   */
  checkPrerequisites(files = null) {
    // 检查是否有可用的验证器
    const availableValidators = Object.keys(this.validators);
    
    if (availableValidators.length === 0) {
      return {
        passed: false,
        message: 'No validators configured. Please configure at least one language validator.'
      };
    }

    // 如果提供了文件列表，只检查那些文件中出现的语言的验证器
    let validatorsToCheck = this.validators;
    if (files && files.length > 0) {
      const groups = this.languageDetector.groupFilesByLanguage(files);
      const languagesInFiles = Object.keys(groups);
      
      // 只检查文件中出现的语言的验证器
      validatorsToCheck = {};
      languagesInFiles.forEach(lang => {
        if (this.validators[lang]) {
          validatorsToCheck[lang] = this.validators[lang];
        }
      });

      // 如果没有找到任何匹配的验证器，说明项目中没有支持的语言文件
      if (Object.keys(validatorsToCheck).length === 0) {
        return {
          passed: false,
          message: 'No supported language files found in the project. This skill requires at least one supported language (JavaScript/TypeScript/Vue, Python, Java, Go, or Rust).'
        };
      }
    }
    
    // 检查每个验证器的前置条件
    const failedResults = [];
    const warnings = [];
    
    for (const [lang, validator] of Object.entries(validatorsToCheck)) {
      if (validator && typeof validator.checkPrerequisites === 'function') {
        // 获取该语言的文件列表（如果提供了文件列表）
        const langFiles = files && files.length > 0 
          ? (this.languageDetector.groupFilesByLanguage(files)[lang] || [])
          : null;
        
        // 将文件列表传递给验证器（如果验证器支持）
        const result = typeof validator.checkPrerequisites === 'function' && validator.checkPrerequisites.length > 0
          ? validator.checkPrerequisites(langFiles)
          : validator.checkPrerequisites();
        
        if (!result.passed) {
          // 如果提供了文件列表，说明这个语言的文件确实存在，前置条件失败是严重问题
          // 如果没有提供文件列表，说明这个验证器可能不会被使用，只记录警告
          if (files && files.length > 0) {
            failedResults.push({ language: lang, ...result });
          } else {
            warnings.push(`${lang}: ${result.message} (will be skipped if no ${lang} files are found)`);
          }
        }
      }
    }
    
    // 如果有实际会使用的验证器失败，返回失败
    if (failedResults.length > 0) {
      const messages = failedResults.map(r => `${r.language}: ${r.message}`).join('; ');
      return {
        passed: false,
        message: `Some validators failed prerequisites: ${messages}`
      };
    }
    
    // 如果有警告（未使用的验证器前置条件失败），返回成功但包含警告
    if (warnings.length > 0) {
      return {
        passed: true,
        warnings: warnings
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
        languages: {},
        messages: []
      };
    }

    // 按语言分组文件
    const groups = this.languageDetector.groupFilesByLanguage(files);
    
    if (Object.keys(groups).length === 0) {
      return {
        success: true,
        files: files.length,
        errors: 0,
        warnings: 0,
        languages: {},
        messages: [],
        note: 'No supported language files found'
      };
    }

    // 并行执行各语言验证器
    const languageResults = await Promise.all(
      Object.entries(groups).map(async ([lang, langFiles]) => {
        const validator = this.validators[lang];
        
        if (!validator) {
          if (this.logger) {
            this.logger.debug(`No validator configured for language: ${lang}`);
          }
          return {
            language: lang,
            success: true,
            files: langFiles.length,
            errors: 0,
            warnings: 0,
            messages: [],
            note: `No validator configured for ${lang}`
          };
        }

        try {
          const result = await validator.validate(langFiles, options);
          return {
            language: lang,
            files: langFiles.length,
            ...result
          };
        } catch (error) {
          return {
            language: lang,
            success: false,
            files: langFiles.length,
            errors: 0,
            warnings: 0,
            messages: [],
            error: error.message
          };
        }
      })
    );

    // 合并结果
    return this.mergeResults(languageResults);
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
        languages: {},
        messages: []
      };
    }

    // 按语言分组文件
    const groups = this.languageDetector.groupFilesByLanguage(files);

    // 并行执行各语言验证器的修复
    const languageResults = await Promise.all(
      Object.entries(groups).map(async ([lang, langFiles]) => {
        const validator = this.validators[lang];
        
        if (!validator || typeof validator.fix !== 'function') {
          return {
            language: lang,
            success: true,
            files: langFiles.length,
            errors: 0,
            warnings: 0,
            messages: [],
            note: `Fix not supported for ${lang}`
          };
        }

        try {
          const result = await validator.fix(langFiles, options);
          return {
            language: lang,
            files: langFiles.length,
            ...result,
            fixed: true
          };
        } catch (error) {
          return {
            language: lang,
            success: false,
            files: langFiles.length,
            errors: 0,
            warnings: 0,
            messages: [],
            error: error.message
          };
        }
      })
    );

    // 合并结果
    return this.mergeResults(languageResults);
  }

  /**
   * 合并多个语言的结果
   * @param {Object[]} languageResults - 各语言的结果
   * @returns {Object} 合并后的结果
   */
  mergeResults(languageResults) {
    const merged = {
      success: true,
      files: 0,
      errors: 0,
      warnings: 0,
      fixable: 0,
      languages: {},
      messages: [],
      rawOutput: []
    };

    languageResults.forEach(result => {
      merged.files += result.files || 0;
      merged.errors += result.errors || 0;
      merged.warnings += result.warnings || 0;
      merged.fixable += result.fixable || 0;
      
      if (result.language) {
        merged.languages[result.language] = {
          files: result.files || 0,
          errors: result.errors || 0,
          warnings: result.warnings || 0,
          fixable: result.fixable || 0,
          success: result.success !== false
        };
      }
      
      if (result.messages) {
        merged.messages.push(...result.messages);
      }
      
      if (result.rawOutput) {
        merged.rawOutput.push({
          language: result.language,
          output: result.rawOutput
        });
      }
      
      // 如果有任何语言失败，整体失败
      if (result.success === false) {
        merged.success = false;
      }
    });

    return merged;
  }

  /**
   * 添加语言验证器
   * @param {string} language - 语言名称
   * @param {Validator} validator - 验证器实例
   */
  addValidator(language, validator) {
    this.validators[language] = validator;
  }

  /**
   * 移除语言验证器
   * @param {string} language - 语言名称
   */
  removeValidator(language) {
    delete this.validators[language];
  }

  /**
   * 获取所有已配置的语言
   * @returns {string[]}
   */
  getConfiguredLanguages() {
    return Object.keys(this.validators);
  }
}

module.exports = MultiLanguageValidator;

