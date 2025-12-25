/**
 * 组合过滤器
 * 组合多个过滤器，按顺序应用
 */
const FileFilter = require('./FileFilter');

class CompositeFilter extends FileFilter {
  constructor(filters = []) {
    super();
    this.filters = filters;
  }

  /**
   * 过滤文件列表
   * @param {string[]} files - 要过滤的文件列表
   * @returns {string[]} 过滤后的文件列表
   */
  filter(files) {
    return this.filters.reduce((result, filter) => {
      if (!(filter instanceof FileFilter)) {
        throw new Error(`Filter must be an instance of FileFilter, got ${filter.constructor.name}`);
      }
      return filter.filter(result);
    }, files);
  }

  /**
   * 添加过滤器
   * @param {FileFilter} filter - 要添加的过滤器
   * @returns {CompositeFilter} 返回自身，支持链式调用
   */
  addFilter(filter) {
    if (!(filter instanceof FileFilter)) {
      throw new Error(`Filter must be an instance of FileFilter, got ${filter.constructor.name}`);
    }
    this.filters.push(filter);
    return this;
  }

  /**
   * 移除过滤器
   * @param {FileFilter|number} filter - 要移除的过滤器或索引
   * @returns {CompositeFilter} 返回自身，支持链式调用
   */
  removeFilter(filter) {
    if (typeof filter === 'number') {
      this.filters.splice(filter, 1);
    } else {
      const index = this.filters.indexOf(filter);
      if (index > -1) {
        this.filters.splice(index, 1);
      }
    }
    return this;
  }

  /**
   * 清空所有过滤器
   * @returns {CompositeFilter} 返回自身，支持链式调用
   */
  clear() {
    this.filters = [];
    return this;
  }

  /**
   * 获取过滤器数量
   * @returns {number}
   */
  getFilterCount() {
    return this.filters.length;
  }
}

module.exports = CompositeFilter;

