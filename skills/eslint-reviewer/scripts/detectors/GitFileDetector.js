/**
 * Git 文件检测器
 * 从 Git 仓库中检测变更的文件（未暂存、已暂存、未跟踪）
 */
const FileDetector = require('./FileDetector');
const CommandRunner = require('../utils/CommandRunner');
const fs = require('fs');
const path = require('path');

class GitFileDetector extends FileDetector {
  constructor(dependencies = {}) {
    super();
    this.commandRunner = dependencies.commandRunner || new CommandRunner();
    this.fs = dependencies.fs || fs;
  }

  /**
   * 检测文件
   * @param {Object} options - 检测选项
   * @param {boolean} options.includeStaged - 是否包含已暂存的文件
   * @param {boolean} options.includeUnstaged - 是否包含未暂存的文件
   * @param {boolean} options.includeUntracked - 是否包含未跟踪的文件
   * @returns {Promise<string[]>} 检测到的文件列表
   */
  async detect(options = {}) {
    const {
      includeStaged = true,
      includeUnstaged = true,
      includeUntracked = true
    } = options;

    // 检查是否是 Git 仓库
    if (!this.isGitRepo()) {
      throw new Error('Not a git repository');
    }

    const files = [];

    if (includeUnstaged) {
      files.push(...this.getUnstagedFiles());
    }

    if (includeStaged) {
      files.push(...this.getStagedFiles());
    }

    if (includeUntracked) {
      files.push(...this.getUntrackedFiles());
    }

    // 去重并过滤存在的文件
    const uniqueFiles = [...new Set(files)];
    return uniqueFiles.filter(file => {
      const fullPath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
      return this.fs.existsSync(fullPath);
    });
  }

  /**
   * 检查是否是 Git 仓库
   * @returns {boolean}
   */
  isGitRepo() {
    try {
      this.commandRunner.exec('git rev-parse --git-dir', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取未暂存的文件
   * @returns {string[]}
   */
  getUnstagedFiles() {
    const output = this.commandRunner.exec('git diff --name-only');
    return output ? output.split('\n').filter(Boolean) : [];
  }

  /**
   * 获取已暂存的文件
   * @returns {string[]}
   */
  getStagedFiles() {
    const output = this.commandRunner.exec('git diff --cached --name-only');
    return output ? output.split('\n').filter(Boolean) : [];
  }

  /**
   * 获取未跟踪的文件
   * @returns {string[]}
   */
  getUntrackedFiles() {
    const output = this.commandRunner.exec('git ls-files --others --exclude-standard');
    return output ? output.split('\n').filter(Boolean) : [];
  }
}

module.exports = GitFileDetector;

