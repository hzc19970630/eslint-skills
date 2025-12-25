/**
 * 文件检测器接口（抽象基类）
 * 定义所有文件检测器必须实现的接口
 */
class FileDetector {
  /**
   * 检测文件
   * @param {Object} options - 检测选项
   * @returns {Promise<string[]>} 检测到的文件列表
   */
  async detect(options = {}) {
    throw new Error('detect() must be implemented by subclass');
  }

  /**
   * 获取检测器名称
   * @returns {string} 检测器名称
   */
  getName() {
    return this.constructor.name;
  }
}

module.exports = FileDetector;

