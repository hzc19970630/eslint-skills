/**
 * 输出解析器接口（抽象基类）
 * 定义所有输出解析器必须实现的接口
 */
class OutputParser {
  /**
   * 解析输出
   * @param {string} output - 原始输出
   * @returns {Object} 解析后的结果
   */
  parse(output) {
    throw new Error('parse() must be implemented by subclass');
  }

  /**
   * 获取解析器名称
   * @returns {string}
   */
  getName() {
    return this.constructor.name;
  }
}

module.exports = OutputParser;

