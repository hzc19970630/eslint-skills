/**
 * 默认配置
 * 所有配置项都可以通过外部配置文件覆盖
 */
module.exports = {
  // 支持的文件扩展名（所有语言）
  validExtensions: [
    // JavaScript/TypeScript
    '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.vue',
    // Python
    '.py', '.pyw',
    // Java
    '.java',
    // Go
    '.go',
    // Rust
    '.rs',
    // 样式文件
    '.css', '.scss', '.sass', '.less', '.styl'
  ],

  // 语言配置
  languages: {
    javascript: {
      extensions: ['.js', '.jsx', '.mjs', '.cjs'],
      validator: 'eslint',
      tools: ['eslint'],
      defaultTool: 'eslint'
    },
    typescript: {
      extensions: ['.ts', '.tsx'],
      validator: 'eslint',
      tools: ['eslint'],
      defaultTool: 'eslint'
    },
    vue: {
      extensions: ['.vue'],
      validator: 'eslint',
      tools: ['eslint'],
      defaultTool: 'eslint'
    },
    python: {
      extensions: ['.py', '.pyw'],
      validator: 'python',
      tools: ['pylint', 'flake8', 'black', 'mypy'],
      defaultTool: 'pylint',
      configFiles: [
        '.pylintrc',
        'pylintrc',
        'setup.cfg',
        'pyproject.toml',
        '.flake8',
        'mypy.ini',
        '.mypy.ini',
        'tox.ini'
      ]
    },
    java: {
      extensions: ['.java'],
      validator: 'java',
      tools: ['checkstyle', 'spotbugs', 'pmd'],
      defaultTool: 'checkstyle',
      configFiles: [
        'checkstyle.xml',
        '.checkstyle.xml',
        'spotbugs.xml',
        '.spotbugs.xml',
        'pmd.xml',
        '.pmd.xml',
        'checkstyle-suppressions.xml',
        'spotbugs-exclude.xml'
      ]
    },
    go: {
      extensions: ['.go'],
      validator: 'go',
      tools: ['golangci-lint', 'gofmt', 'govet'],
      defaultTool: 'golangci-lint',
      configFiles: ['.golangci.yml', '.golangci.yaml', '.golangci.json', '.golangci.toml']
    },
    rust: {
      extensions: ['.rs'],
      validator: 'rust',
      tools: ['clippy', 'rustfmt'],
      defaultTool: 'clippy',
      configFiles: [
        'Cargo.toml',
        'Cargo.lock',
        'rustfmt.toml',
        '.rustfmt.toml',
        '.clippy.toml',
        'clippy.toml'
      ]
    }
  },

  // ESLint 配置文件列表
  eslintConfigFiles: [
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json',
    '.eslintrc',
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs'
  ],

  // 排除的文件模式
  excludePatterns: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '.git/**'
  ],

  // 报告器配置
  reporters: {
    default: 'console',
    options: {
      colors: true,
      verbose: false,
      silent: false
    }
  },

  // ESLint 执行配置
  eslint: {
    format: 'stylish',
    maxWarnings: 0,
    fixOnSave: false
  }
};

