/**
 * 配置文件过滤器
 * 过滤掉 ESLint 配置文件（这些文件不应该被检查）
 */
const FileFilter = require('./FileFilter');
const path = require('path');
const defaultConfig = require('../config/defaultConfig');

class ConfigFileFilter extends FileFilter {
  constructor(configFiles = null) {
    super();
    this.configFiles = configFiles || defaultConfig.eslintConfigFiles;
  }

  /**
   * 过滤文件列表
   * @param {string[]} files - 要过滤的文件列表
   * @returns {string[]} 过滤后的文件列表
   */
  filter(files) {
    return files.filter(file => {
      const basename = path.basename(file);
      return !this.configFiles.includes(basename);
    });
  }

  /**
   * 检查文件是否是配置文件
   * @param {string} file - 文件路径
   * @returns {boolean}
   */
  isConfigFile(file) {
    const basename = path.basename(file);
    return this.configFiles.includes(basename);
  }
}

module.exports = ConfigFileFilter;

