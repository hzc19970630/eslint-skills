/**
 * 项目技术栈检测器
 * 自动检测项目使用的编程语言和技术栈
 */
const fs = require('fs');
const path = require('path');

class ProjectStackDetector {
  constructor(dependencies = {}) {
    this.fs = dependencies.fs || fs;
    this.path = dependencies.path || path;
  }

  /**
   * 检测项目技术栈
   * @param {string} projectRoot - 项目根目录
   * @returns {Object} 检测结果
   */
  detect(projectRoot = process.cwd()) {
    const stack = {
      languages: [],
      frameworks: [],
      tools: [],
      configs: {}
    };

    // 检测配置文件
    const configs = this.detectConfigFiles(projectRoot);
    stack.configs = configs;

    // 根据配置文件推断语言
    if (configs.packageJson) {
      stack.languages.push('javascript');
      if (configs.packageJson.dependencies?.typescript || configs.packageJson.devDependencies?.typescript) {
        stack.languages.push('typescript');
      }
      if (configs.packageJson.dependencies?.vue || configs.packageJson.devDependencies?.vue) {
        stack.languages.push('vue');
      }
    }

    if (configs.cargoToml) {
      stack.languages.push('rust');
    }

    if (configs.goMod || configs.goSum) {
      stack.languages.push('go');
    }

    if (configs.requirementsTxt || configs.setupPy || configs.pyprojectToml) {
      stack.languages.push('python');
    }

    if (configs.pomXml || configs.buildGradle) {
      stack.languages.push('java');
    }

    // 检测文件扩展名
    const fileExtensions = this.detectFileExtensions(projectRoot);
    fileExtensions.forEach(ext => {
      const lang = this.extensionToLanguage(ext);
      if (lang && !stack.languages.includes(lang)) {
        stack.languages.push(lang);
      }
    });

    // 去重
    stack.languages = [...new Set(stack.languages)];

    return stack;
  }

  /**
   * 检测配置文件
   * @param {string} projectRoot - 项目根目录
   * @returns {Object} 配置文件路径
   */
  detectConfigFiles(projectRoot) {
    const configs = {};

    // JavaScript/TypeScript/Vue
    const jsConfigs = [
      'package.json',
      '.eslintrc.js',
      '.eslintrc.json',
      '.eslintrc.yml',
      '.eslintrc.yaml',
      'eslint.config.js',
      'eslint.config.mjs',
      'eslint.config.cjs',
      'tsconfig.json',
      'jsconfig.json'
    ];

    jsConfigs.forEach(file => {
      const filePath = this.path.join(projectRoot, file);
      if (this.fs.existsSync(filePath)) {
        if (file === 'package.json') {
          try {
            configs.packageJson = JSON.parse(this.fs.readFileSync(filePath, 'utf-8'));
          } catch {
            configs.packageJson = true;
          }
        } else {
          configs[file] = filePath;
        }
      }
    });

    // Python
    const pythonConfigs = [
      'requirements.txt',
      'requirements-dev.txt',
      'setup.py',
      'setup.cfg',
      'pyproject.toml',
      '.pylintrc',
      'pylintrc',
      '.flake8',
      'setup.cfg', // flake8 也可能在 setup.cfg 的 [flake8] 部分
      'mypy.ini',
      '.mypy.ini',
      'tox.ini' // 某些项目在 tox.ini 中配置工具
    ];

    pythonConfigs.forEach(file => {
      const filePath = this.path.join(projectRoot, file);
      if (this.fs.existsSync(filePath)) {
        configs[file] = filePath;
      }
    });

    // Java
    const javaConfigs = [
      'pom.xml',
      'build.gradle',
      'build.gradle.kts',
      'checkstyle.xml',
      '.checkstyle.xml', // 某些项目使用隐藏文件
      'spotbugs.xml',
      '.spotbugs.xml',
      'pmd.xml',
      '.pmd.xml',
      'checkstyle-suppressions.xml', // Checkstyle 抑制文件
      'spotbugs-exclude.xml' // SpotBugs 排除文件
    ];

    javaConfigs.forEach(file => {
      const filePath = this.path.join(projectRoot, file);
      if (this.fs.existsSync(filePath)) {
        configs[file] = filePath;
      }
    });

    // Go
    const goConfigs = [
      'go.mod',
      'go.sum',
      '.golangci.yml',
      '.golangci.yaml',
      '.golangci.json',
      '.golangci.toml',
      '.codeclimate.yml', // Code Climate 配置（用于检测项目使用的工具）
      'codeclimate.yml'   // 某些项目不使用隐藏文件
    ];

    goConfigs.forEach(file => {
      const filePath = this.path.join(projectRoot, file);
      if (this.fs.existsSync(filePath)) {
        configs[file] = filePath;
      }
    });

    // Rust
    const rustConfigs = [
      'Cargo.toml',
      'Cargo.lock',
      'rustfmt.toml',
      '.rustfmt.toml', // 某些项目使用隐藏文件
      '.clippy.toml',
      'clippy.toml' // 某些项目不使用隐藏文件
    ];

    rustConfigs.forEach(file => {
      const filePath = this.path.join(projectRoot, file);
      if (this.fs.existsSync(filePath)) {
        configs[file] = filePath;
      }
    });

    return configs;
  }

  /**
   * 检测文件扩展名
   * @param {string} projectRoot - 项目根目录
   * @param {number} maxDepth - 最大深度
   * @returns {string[]} 扩展名列表
   */
  detectFileExtensions(projectRoot, maxDepth = 2) {
    const extensions = new Set();
    const excludeDirs = ['node_modules', '.git', 'dist', 'build', 'target', '__pycache__', '.venv', 'venv'];

    const scanDir = (dir, depth = 0) => {
      if (depth > maxDepth) return;

      try {
        const entries = this.fs.readdirSync(dir, { withFileTypes: true });
        entries.forEach(entry => {
          const fullPath = this.path.join(dir, entry.name);

          if (entry.isDirectory()) {
            if (!excludeDirs.includes(entry.name) && !entry.name.startsWith('.')) {
              scanDir(fullPath, depth + 1);
            }
          } else if (entry.isFile()) {
            const ext = this.path.extname(entry.name);
            if (ext) {
              extensions.add(ext);
            }
          }
        });
      } catch {
        // 忽略无法访问的目录
      }
    };

    scanDir(projectRoot);
    return Array.from(extensions);
  }

  /**
   * 扩展名到语言的映射
   * @param {string} ext - 文件扩展名
   * @returns {string|null} 语言名称
   */
  extensionToLanguage(ext) {
    const map = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.mjs': 'javascript',
      '.cjs': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.vue': 'vue',
      '.py': 'python',
      '.pyw': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust'
    };
    return map[ext.toLowerCase()] || null;
  }

  /**
   * 获取推荐的有效验证器
   * @param {string} projectRoot - 项目根目录
   * @returns {Object} 推荐的验证器配置
   */
  getRecommendedValidators(projectRoot = process.cwd()) {
    const stack = this.detect(projectRoot);
    const validators = {};

    stack.languages.forEach(lang => {
      switch (lang) {
        case 'javascript':
        case 'typescript':
        case 'vue':
          if (stack.configs.packageJson?.eslintConfig || 
              stack.configs['.eslintrc.js'] || 
              stack.configs['.eslintrc.json'] ||
              stack.configs['eslint.config.js']) {
            validators[lang] = {
              validator: 'eslint',
              enabled: true,
              reason: 'ESLint config found'
            };
          }
          break;

        case 'python':
          validators[lang] = {
            validator: 'python',
            enabled: true,
            reason: 'Python project detected',
            tools: ['pylint', 'flake8', 'black']
          };
          break;

        case 'java':
          validators[lang] = {
            validator: 'java',
            enabled: true,
            reason: 'Java project detected',
            tools: ['checkstyle', 'spotbugs', 'pmd']
          };
          break;

        case 'go':
          validators[lang] = {
            validator: 'go',
            enabled: true,
            reason: 'Go project detected',
            tools: ['golangci-lint', 'gofmt']
          };
          break;

        case 'rust':
          if (stack.configs.cargoToml) {
            validators[lang] = {
              validator: 'rust',
              enabled: true,
              reason: 'Rust/Cargo project detected',
              tools: ['clippy', 'rustfmt']
            };
          }
          break;
      }
    });

    return validators;
  }

  /**
   * 生成配置建议
   * @param {string} projectRoot - 项目根目录
   * @returns {Object} 配置建议
   */
  generateConfigSuggestion(projectRoot = process.cwd()) {
    const stack = this.detect(projectRoot);
    const validators = this.getRecommendedValidators(projectRoot);
    
    const config = {
      validExtensions: [],
      languages: {}
    };

    // 根据检测到的语言生成配置
    Object.entries(validators).forEach(([lang, validator]) => {
      if (validator.enabled) {
        const langConfig = {
          validator: validator.validator,
          defaultTool: validator.tools?.[0] || 'default'
        };

        // 添加扩展名
        switch (lang) {
          case 'javascript':
            langConfig.extensions = ['.js', '.jsx', '.mjs', '.cjs'];
            break;
          case 'typescript':
            langConfig.extensions = ['.ts', '.tsx'];
            break;
          case 'vue':
            langConfig.extensions = ['.vue'];
            break;
          case 'python':
            langConfig.extensions = ['.py', '.pyw'];
            break;
          case 'java':
            langConfig.extensions = ['.java'];
            break;
          case 'go':
            langConfig.extensions = ['.go'];
            break;
          case 'rust':
            langConfig.extensions = ['.rs'];
            break;
        }

        config.languages[lang] = langConfig;
        config.validExtensions.push(...langConfig.extensions);
      }
    });

    return config;
  }
}

module.exports = ProjectStackDetector;

