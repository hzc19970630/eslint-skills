/**
 * 语言检测器
 * 根据文件扩展名识别编程语言
 */
const path = require('path');

class LanguageDetector {
  constructor(languageConfig = {}) {
    // 语言映射表：扩展名 -> 语言
    this.languageMap = this.buildLanguageMap(languageConfig);
  }

  /**
   * 构建语言映射表
   * @param {Object} languageConfig - 语言配置
   * @returns {Object} 扩展名到语言的映射
   */
  buildLanguageMap(languageConfig) {
    const map = {};
    
    // 默认语言映射
    const defaultLanguages = {
      javascript: {
        extensions: ['.js', '.jsx', '.mjs', '.cjs'],
        tools: ['eslint']
      },
      typescript: {
        extensions: ['.ts', '.tsx'],
        tools: ['eslint']
      },
      vue: {
        extensions: ['.vue'],
        tools: ['eslint']
      },
      python: {
        extensions: ['.py', '.pyw'],
        tools: ['pylint', 'flake8', 'black', 'mypy']
      },
      java: {
        extensions: ['.java'],
        tools: ['checkstyle', 'spotbugs', 'pmd']
      },
      go: {
        extensions: ['.go'],
        tools: ['golangci-lint', 'gofmt', 'govet']
      },
      rust: {
        extensions: ['.rs'],
        tools: ['clippy', 'rustfmt']
      }
    };
    
    // 合并用户配置
    const languages = { ...defaultLanguages, ...languageConfig };
    
    // 构建映射表
    Object.entries(languages).forEach(([lang, config]) => {
      if (config.extensions) {
        config.extensions.forEach(ext => {
          const normalizedExt = ext.startsWith('.') ? ext : `.${ext}`;
          map[normalizedExt] = lang;
        });
      }
    });
    
    return map;
  }

  /**
   * 检测文件的编程语言
   * @param {string} file - 文件路径
   * @returns {string|null} 语言名称，如果无法识别返回 null
   */
  detectLanguage(file) {
    const ext = path.extname(file);
    return this.languageMap[ext] || null;
  }

  /**
   * 按语言分组文件
   * @param {string[]} files - 文件列表
   * @returns {Object} 按语言分组的文件 { language: [files] }
   */
  groupFilesByLanguage(files) {
    const groups = {};
    
    files.forEach(file => {
      const lang = this.detectLanguage(file);
      if (lang) {
        if (!groups[lang]) {
          groups[lang] = [];
        }
        groups[lang].push(file);
      }
    });
    
    return groups;
  }

  /**
   * 获取语言的所有扩展名
   * @param {string} language - 语言名称
   * @returns {string[]} 扩展名列表
   */
  getExtensionsForLanguage(language) {
    return Object.entries(this.languageMap)
      .filter(([ext, lang]) => lang === language)
      .map(([ext]) => ext);
  }

  /**
   * 检查语言是否支持
   * @param {string} language - 语言名称
   * @returns {boolean}
   */
  isLanguageSupported(language) {
    return Object.values(this.languageMap).includes(language);
  }

  /**
   * 获取所有支持的语言
   * @returns {string[]} 语言列表
   */
  getSupportedLanguages() {
    return [...new Set(Object.values(this.languageMap))];
  }
}

module.exports = LanguageDetector;

