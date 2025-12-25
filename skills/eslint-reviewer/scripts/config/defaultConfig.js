/**
 * 默认配置
 * 所有配置项都可以通过外部配置文件覆盖
 */
module.exports = {
  // 支持的文件扩展名
  validExtensions: [
    '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
    '.vue', '.css', '.scss', '.sass', '.less', '.styl'
  ],

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

