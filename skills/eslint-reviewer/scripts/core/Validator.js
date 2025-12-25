/**
 * 验证器接口（抽象基类）
 * 定义所有验证器必须实现的接口
 */
class Validator {
  /**
   * 验证文件
   * @param {string[]} files - 要验证的文件列表
   * @param {Object} options - 验证选项
   * @returns {Promise<Object>} 验证结果
   */
  async validate(files, options = {}) {
    throw new Error('validate() must be implemented by subclass');
  }

  /**
   * 自动修复文件
   * @param {string[]} files - 要修复的文件列表
   * @param {Object} options - 修复选项
   * @returns {Promise<Object>} 修复结果
   */
  async fix(files, options = {}) {
    throw new Error('fix() must be implemented by subclass');
  }

  /**
   * 检查前置条件
   * @returns {boolean} 是否满足前置条件
   */
  checkPrerequisites() {
    throw new Error('checkPrerequisites() must be implemented by subclass');
  }

  /**
   * 获取验证器名称
   * @returns {string} 验证器名称
   */
  getName() {
    return this.constructor.name;
  }
}

module.exports = Validator;

