/**
 * 命令运行器抽象
 * 封装命令执行逻辑，便于测试和扩展
 */
class CommandRunner {
  constructor(dependencies = {}) {
    // 允许注入 execSync，便于测试
    this.execSync = dependencies.execSync || require('child_process').execSync;
  }

  /**
   * 执行命令
   * @param {string} command - 要执行的命令
   * @param {Object} options - 执行选项
   * @returns {string} 命令输出
   */
  exec(command, options = {}) {
    const {
      encoding = 'utf-8',
      stdio = 'pipe',
      throwOnError = false,
      cwd = process.cwd()
    } = options;

    try {
      const result = this.execSync(command, {
        encoding,
        stdio,
        cwd
      });
      return result.trim();
    } catch (error) {
      if (throwOnError) {
        throw error;
      }
      // 返回错误输出，而不是抛出异常
      return error.stdout || error.stderr || error.message || '';
    }
  }

  /**
   * 检查命令是否可用
   * @param {string} command - 要检查的命令
   * @returns {boolean} 命令是否可用
   */
  isAvailable(command) {
    try {
      this.exec(`${command} --version`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = CommandRunner;

