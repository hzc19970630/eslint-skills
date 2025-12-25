/**
 * ESLint 配置检测器
 * 检测项目中是否存在 ESLint 配置文件
 */
const fs = require('fs');
const path = require('path');
const defaultConfig = require('../config/defaultConfig');

class ConfigDetector {
  constructor(dependencies = {}) {
    this.fs = dependencies.fs || fs;
    this.configFiles = dependencies.configFiles || defaultConfig.eslintConfigFiles;
  }

  /**
   * 检查是否存在 ESLint 配置
   * @returns {boolean}
   */
  hasConfig() {
    // 检查配置文件
    const hasConfigFile = this.configFiles.some(file =>
      this.fs.existsSync(path.join(process.cwd(), file))
    );

    if (hasConfigFile) {
      return true;
    }

    // 检查 package.json 中的 eslintConfig
    return this.hasConfigInPackageJson();
  }

  /**
   * 检查 package.json 中是否有 eslintConfig
   * @returns {boolean}
   */
  hasConfigInPackageJson() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (!this.fs.existsSync(packageJsonPath)) {
      return false;
    }

    try {
      const packageJson = JSON.parse(
        this.fs.readFileSync(packageJsonPath, 'utf-8')
      );
      return !!packageJson.eslintConfig;
    } catch {
      return false;
    }
  }

  /**
   * 获取 ESLint 配置文件路径
   * @returns {string|null}
   */
  getConfigPath() {
    for (const file of this.configFiles) {
      const filePath = path.join(process.cwd(), file);
      if (this.fs.existsSync(filePath)) {
        return filePath;
      }
    }

    // 检查 package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (this.fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          this.fs.readFileSync(packageJsonPath, 'utf-8')
        );
        if (packageJson.eslintConfig) {
          return packageJsonPath;
        }
      } catch {
        // 忽略解析错误
      }
    }

    return null;
  }
}

module.exports = ConfigDetector;

