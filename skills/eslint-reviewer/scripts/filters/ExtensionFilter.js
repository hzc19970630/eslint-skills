/**
 * 扩展名过滤器
 * 根据文件扩展名过滤文件
 */
const FileFilter = require('./FileFilter');
const path = require('path');

class ExtensionFilter extends FileFilter {
  constructor(allowedExtensions = []) {
    super();
    this.allowedExtensions = allowedExtensions.map(ext => 
      ext.startsWith('.') ? ext : `.${ext}`
    );
  }

  /**
   * 过滤文件列表
   * @param {string[]} files - 要过滤的文件列表
   * @returns {string[]} 过滤后的文件列表
   */
  filter(files) {
    return files.filter(file => {
      const ext = path.extname(file);
      return this.allowedExtensions.includes(ext);
    });
  }

  /**
   * 添加允许的扩展名
   * @param {string|string[]} extensions - 扩展名
   * @returns {ExtensionFilter} 返回自身，支持链式调用
   */
  addExtension(extensions) {
    const exts = Array.isArray(extensions) ? extensions : [extensions];
    exts.forEach(ext => {
      const normalized = ext.startsWith('.') ? ext : `.${ext}`;
      if (!this.allowedExtensions.includes(normalized)) {
        this.allowedExtensions.push(normalized);
      }
    });
    return this;
  }

  /**
   * 移除扩展名
   * @param {string|string[]} extensions - 扩展名
   * @returns {ExtensionFilter} 返回自身，支持链式调用
   */
  removeExtension(extensions) {
    const exts = Array.isArray(extensions) ? extensions : [extensions];
    const normalized = exts.map(ext => ext.startsWith('.') ? ext : `.${ext}`);
    this.allowedExtensions = this.allowedExtensions.filter(
      ext => !normalized.includes(ext)
    );
    return this;
  }
}

module.exports = ExtensionFilter;

