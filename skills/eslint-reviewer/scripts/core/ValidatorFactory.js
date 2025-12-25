/**
 * 验证器工厂
 * 创建不同类型的验证器实例
 */
const ESLintValidator = require('./ESLintValidator');

class ValidatorFactory {
  /**
   * 创建验证器
   * @param {string} type - 验证器类型 ('eslint', 'prettier', etc.)
   * @param {Object} dependencies - 依赖注入
   * @returns {Validator} 验证器实例
   */
  static create(type, dependencies = {}) {
    switch (type.toLowerCase()) {
      case 'eslint':
        return new ESLintValidator(dependencies);
      
      // 未来可以扩展其他验证器
      // case 'prettier':
      //   return new PrettierValidator(dependencies);
      // case 'stylelint':
      //   return new StylelintValidator(dependencies);
      
      default:
        throw new Error(`Unknown validator type: ${type}. Supported types: eslint`);
    }
  }

  /**
   * 注册自定义验证器
   * @param {string} type - 验证器类型
   * @param {Function} ValidatorClass - 验证器类
   */
  static register(type, ValidatorClass) {
    if (this.validators === undefined) {
      this.validators = {};
    }
    this.validators[type.toLowerCase()] = ValidatorClass;
  }

  /**
   * 获取所有已注册的验证器类型
   * @returns {string[]}
   */
  static getRegisteredTypes() {
    return ['eslint', ...(this.validators ? Object.keys(this.validators) : [])];
  }
}

module.exports = ValidatorFactory;

