/**
 * 日志工具抽象
 * 封装日志输出逻辑，便于测试和扩展（支持不同的日志级别和输出方式）
 */
class Logger {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.silent = options.silent || false;
    this.colors = options.colors !== false; // 默认启用颜色
  }

  /**
   * 普通日志
   * @param {...any} args - 日志参数
   */
  log(...args) {
    if (!this.silent) {
      console.log(...args);
    }
  }

  /**
   * 错误日志
   * @param {...any} args - 日志参数
   */
  error(...args) {
    if (!this.silent) {
      const prefix = this.colors ? '\x1b[31m❌\x1b[0m' : '❌';
      console.error(prefix, ...args);
    }
  }

  /**
   * 成功日志
   * @param {...any} args - 日志参数
   */
  success(...args) {
    if (!this.silent) {
      const prefix = this.colors ? '\x1b[32m✅\x1b[0m' : '✅';
      console.log(prefix, ...args);
    }
  }

  /**
   * 警告日志
   * @param {...any} args - 日志参数
   */
  warn(...args) {
    if (!this.silent) {
      const prefix = this.colors ? '\x1b[33m⚠️\x1b[0m' : '⚠️';
      console.warn(prefix, ...args);
    }
  }

  /**
   * 信息日志
   * @param {...any} args - 日志参数
   */
  info(...args) {
    if (!this.silent) {
      const prefix = this.colors ? '\x1b[36mℹ️\x1b[0m' : 'ℹ️';
      console.log(prefix, ...args);
    }
  }

  /**
   * 调试日志（仅在 verbose 模式下输出）
   * @param {...any} args - 日志参数
   */
  debug(...args) {
    if (this.verbose && !this.silent) {
      const prefix = this.colors ? '\x1b[90m[DEBUG]\x1b[0m' : '[DEBUG]';
      console.debug(prefix, ...args);
    }
  }
}

module.exports = Logger;

