/**
 * 控制台报告器
 * 将结果输出到控制台
 */
const Reporter = require('./Reporter');
const Logger = require('../utils/Logger');

class ConsoleReporter extends Reporter {
  constructor(dependencies = {}) {
    super();
    this.logger = dependencies.logger || new Logger();
  }

  /**
   * 报告结果
   * @param {Object} result - 验证结果
   */
  report(result) {
    if (result.success) {
      this.logger.success('All files passed ESLint validation!');
    } else {
      this.logger.error('ESLint found issues');
      
      if (result.errors > 0 || result.warnings > 0) {
        this.logger.log(`\nErrors: ${result.errors}`);
        this.logger.log(`Warnings: ${result.warnings}`);
        
        if (result.fixable > 0) {
          this.logger.warn(`\n💡 Tip: ${result.fixable} issue(s) can be automatically fixed.`);
          this.logger.log('   Run with --fix flag: node validate-and-fix.js --fix');
        }
      }
    }
  }

  /**
   * 报告错误
   * @param {string|Error} error - 错误信息
   */
  reportError(error) {
    const message = error instanceof Error ? error.message : error;
    this.logger.error(`Error: ${message}`);
  }

  /**
   * 报告信息
   * @param {string} message - 信息
   */
  reportInfo(message) {
    this.logger.info(message);
  }

  /**
   * 报告文件列表
   * @param {string[]} files - 文件列表
   */
  reportFiles(files) {
    if (files.length === 0) {
      this.logger.info('No changed files found for linting');
      return;
    }

    this.logger.log(`\n📝 Found ${files.length} changed file(s):`);
    files.forEach(file => {
      this.logger.log(`   - ${file}`);
    });
  }

  /**
   * 报告开始验证
   */
  reportStart() {
    this.logger.log('🔍 ESLint Git Changes Validator\n');
    this.logger.log('📂 Detecting changed files...');
  }

  /**
   * 报告开始验证文件
   */
  reportValidationStart() {
    this.logger.log('\n🔎 Running ESLint validation...\n');
  }
}

module.exports = ConsoleReporter;

