// Example ESLint flat config for Vue.js projects (ESLint 9+)
// Requires: npm install --save-dev eslint-plugin-vue vue-eslint-parser

import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  // Vue files configuration
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@babel/eslint-parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env']
        }
      }
    },
    plugins: {
      vue
    },
    rules: {
      ...vue.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn'
    }
  },
  // JavaScript files configuration
  {
    files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always']
    }
  }
];

