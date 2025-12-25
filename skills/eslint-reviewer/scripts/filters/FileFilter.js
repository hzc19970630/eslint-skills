/**
 * 文件过滤器接口（抽象基类）
 * 定义所有文件过滤器必须实现的接口
 */
class FileFilter {
  /**
   * 过滤文件列表
   * @param {string[]} files - 要过滤的文件列表
   * @returns {string[]} 过滤后的文件列表
   */
  filter(files) {
    throw new Error('filter() must be implemented by subclass');
  }

  /**
   * 获取过滤器名称
   * @returns {string} 过滤器名称
   */
  getName() {
    return this.constructor.name;
  }
}

module.exports = FileFilter;

