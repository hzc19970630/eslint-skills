/**
 * 配置加载器
 * 支持从外部文件加载配置，提供默认配置回退
 */
const fs = require('fs');
const path = require('path');
const defaultConfig = require('./defaultConfig');

class ConfigLoader {
  /**
   * 加载配置
   * @param {string|null} configPath - 配置文件路径（可选）
   * @returns {Object} 配置对象
   */
  static load(configPath = null) {
    // 如果指定了配置文件路径，尝试加载
    if (configPath && fs.existsSync(configPath)) {
      try {
        const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        return this.mergeConfig(defaultConfig, userConfig);
      } catch (error) {
        console.warn(`Failed to load config from ${configPath}, using defaults`);
      }
    }

    // 尝试从项目根目录加载 .eslint-skills-config.json
    const projectConfigPath = path.join(process.cwd(), '.eslint-skills-config.json');
    if (fs.existsSync(projectConfigPath)) {
      try {
        const userConfig = JSON.parse(fs.readFileSync(projectConfigPath, 'utf-8'));
        return this.mergeConfig(defaultConfig, userConfig);
      } catch (error) {
        console.warn(`Failed to load config from ${projectConfigPath}, using defaults`);
      }
    }

    // 返回默认配置
    return defaultConfig;
  }

  /**
   * 合并配置（深度合并）
   * @param {Object} defaultConfig - 默认配置
   * @param {Object} userConfig - 用户配置
   * @returns {Object} 合并后的配置
   */
  static mergeConfig(defaultConfig, userConfig) {
    const merged = { ...defaultConfig };

    for (const key in userConfig) {
      if (userConfig.hasOwnProperty(key)) {
        if (
          typeof userConfig[key] === 'object' &&
          userConfig[key] !== null &&
          !Array.isArray(userConfig[key]) &&
          typeof defaultConfig[key] === 'object' &&
          defaultConfig[key] !== null &&
          !Array.isArray(defaultConfig[key])
        ) {
          // 深度合并对象
          merged[key] = this.mergeConfig(defaultConfig[key], userConfig[key]);
        } else {
          // 覆盖其他类型
          merged[key] = userConfig[key];
        }
      }
    }

    return merged;
  }

  /**
   * 获取默认配置
   * @returns {Object} 默认配置
   */
  static getDefaultConfig() {
    return defaultConfig;
  }
}

module.exports = ConfigLoader;

