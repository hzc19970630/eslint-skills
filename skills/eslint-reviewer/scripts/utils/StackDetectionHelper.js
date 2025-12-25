/**
 * 技术栈检测辅助工具
 * 提供便捷的方法来检测和配置项目技术栈
 */
const ProjectStackDetector = require('../detectors/ProjectStackDetector');
const fs = require('fs');
const path = require('path');

class StackDetectionHelper {
  constructor(dependencies = {}) {
    this.detector = dependencies.detector || new ProjectStackDetector();
    this.fs = dependencies.fs || fs;
    this.path = dependencies.path || path;
  }

  /**
   * 检测并显示项目技术栈
   * @param {string} projectRoot - 项目根目录
   * @returns {Object} 检测结果
   */
  detectAndDisplay(projectRoot = process.cwd()) {
    const stack = this.detector.detect(projectRoot);
    const validators = this.detector.getRecommendedValidators(projectRoot);

    console.log('\n🔍 Project Technology Stack Detection\n');
    console.log('📦 Detected Languages:');
    if (stack.languages.length > 0) {
      stack.languages.forEach(lang => {
        console.log(`   ✓ ${lang}`);
      });
    } else {
      console.log('   (none detected)');
    }

    console.log('\n🔧 Recommended Validators:');
    if (Object.keys(validators).length > 0) {
      Object.entries(validators).forEach(([lang, config]) => {
        const status = config.enabled ? '✓' : '✗';
        console.log(`   ${status} ${lang}: ${config.validator} (${config.reason})`);
        if (config.tools) {
          console.log(`      Tools: ${config.tools.join(', ')}`);
        }
      });
    } else {
      console.log('   (none recommended)');
    }

    console.log('\n📄 Configuration Files Found:');
    const configCount = Object.keys(stack.configs).length;
    if (configCount > 0) {
      Object.keys(stack.configs).slice(0, 10).forEach(config => {
        console.log(`   ✓ ${config}`);
      });
      if (configCount > 10) {
        console.log(`   ... and ${configCount - 10} more`);
      }
    } else {
      console.log('   (none found)');
    }

    return { stack, validators };
  }

  /**
   * 生成配置文件
   * @param {string} projectRoot - 项目根目录
   * @param {string} outputPath - 输出路径
   * @returns {string} 生成的配置路径
   */
  generateConfigFile(projectRoot = process.cwd(), outputPath = '.eslint-skills-config.json') {
    const config = this.detector.generateConfigSuggestion(projectRoot);
    const fullPath = this.path.join(projectRoot, outputPath);

    // 如果文件已存在，询问是否覆盖
    if (this.fs.existsSync(fullPath)) {
      console.log(`⚠️  Config file already exists: ${outputPath}`);
      console.log('   Skipping generation. Use --force to overwrite.');
      return null;
    }

    this.fs.writeFileSync(fullPath, JSON.stringify(config, null, 2));
    console.log(`✅ Generated config file: ${outputPath}`);
    return fullPath;
  }

  /**
   * 验证当前配置是否匹配项目
   * @param {string} projectRoot - 项目根目录
   * @param {Object} currentConfig - 当前配置
   * @returns {Object} 验证结果
   */
  validateConfig(projectRoot = process.cwd(), currentConfig) {
    const recommended = this.detector.getRecommendedValidators(projectRoot);
    const issues = [];

    // 检查缺失的验证器
    Object.entries(recommended).forEach(([lang, config]) => {
      if (config.enabled && !currentConfig.languages?.[lang]) {
        issues.push({
          type: 'missing',
          language: lang,
          message: `Missing validator for ${lang}. Recommended: ${config.validator}`
        });
      }
    });

    // 检查多余的验证器
    if (currentConfig.languages) {
      Object.keys(currentConfig.languages).forEach(lang => {
        if (!recommended[lang]) {
          issues.push({
            type: 'unused',
            language: lang,
            message: `Validator for ${lang} is configured but not detected in project`
          });
        }
      });
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

module.exports = StackDetectionHelper;

