/**
 * 命令执行器接口（抽象基类）
 * 定义所有命令执行器必须实现的接口
 */
class CommandExecutor {
  /**
   * 执行命令
   * @param {string[]} files - 要处理的文件列表
   * @param {Object} options - 执行选项
   * @returns {Promise<Object>} 执行结果 { success: boolean, output: string, error?: string }
   */
  async run(files, options = {}) {
    throw new Error('run() must be implemented by subclass');
  }

  /**
   * 获取执行器名称
   * @returns {string}
   */
  getName() {
    return this.constructor.name;
  }
}

module.exports = CommandExecutor;

