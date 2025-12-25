/**
 * 验证器工厂
 * 创建不同类型的验证器实例
 */
const ESLintValidator = require('./ESLintValidator');
const PythonValidator = require('./PythonValidator');
const JavaValidator = require('./JavaValidator');
const GoValidator = require('./GoValidator');
const RustValidator = require('./RustValidator');

class ValidatorFactory {
  /**
   * 创建验证器
   * @param {string} type - 验证器类型 ('eslint', 'python', 'java', 'go', 'rust', etc.)
   * @param {Object} dependencies - 依赖注入
   * @returns {Validator} 验证器实例
   */
  static create(type, dependencies = {}) {
    switch (type.toLowerCase()) {
      case 'eslint':
        return new ESLintValidator(dependencies);
      
      case 'python':
        return new PythonValidator(dependencies);
      
      case 'java':
        return new JavaValidator(dependencies);
      
      case 'go':
        return new GoValidator(dependencies);
      
      case 'rust':
        return new RustValidator(dependencies);
      // case 'prettier':
      //   return new PrettierValidator(dependencies);
      // case 'stylelint':
      //   return new StylelintValidator(dependencies);
      
      default:
        // 检查是否已注册自定义验证器
        if (this.validators && this.validators[type.toLowerCase()]) {
          const ValidatorClass = this.validators[type.toLowerCase()];
          return new ValidatorClass(dependencies);
        }
        
        throw new Error(`Unknown validator type: ${type}. Supported types: eslint, python, java, go, rust`);
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
    return ['eslint', 'python', 'java', 'go', 'rust', ...(this.validators ? Object.keys(this.validators) : [])];
  }
}

module.exports = ValidatorFactory;

