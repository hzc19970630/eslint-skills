/**
 * 报告器接口（抽象基类）
 * 定义所有报告器必须实现的接口
 */
class Reporter {
  /**
   * 报告结果
   * @param {Object} result - 验证结果
   */
  report(result) {
    throw new Error('report() must be implemented by subclass');
  }

  /**
   * 报告错误
   * @param {string|Error} error - 错误信息
   */
  reportError(error) {
    throw new Error('reportError() must be implemented by subclass');
  }

  /**
   * 报告信息
   * @param {string} message - 信息
   */
  reportInfo(message) {
    throw new Error('reportInfo() must be implemented by subclass');
  }

  /**
   * 获取报告器名称
   * @returns {string}
   */
  getName() {
    return this.constructor.name;
  }
}

module.exports = Reporter;

