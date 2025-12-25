#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * ESLint Git Changes Validator and Fixer
 * Detects git changes and runs ESLint validation with auto-fix option
 */

class ESLintValidator {
  constructor() {
    this.changedFiles = new Set();
    // Support JavaScript, TypeScript, and style files
    this.validExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
      '.vue', '.css', '.scss', '.sass', '.less', '.styl'
    ];
  }

  /**
   * Execute shell command and return output
   */
  exec(command) {
    try {
      return execSync(command, { encoding: 'utf-8' }).trim();
    } catch (error) {
      return '';
    }
  }

  /**
   * Check if we're in a git repository
   */
  isGitRepo() {
    try {
      this.exec('git rev-parse --git-dir');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if ESLint is available
   */
  isESLintAvailable() {
    try {
      this.exec('npx eslint --version');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if ESLint config exists in current directory
   */
  hasESLintConfig() {
    const configFiles = [
      '.eslintrc.js',
      '.eslintrc.cjs',
      '.eslintrc.yaml',
      '.eslintrc.yml',
      '.eslintrc.json',
      '.eslintrc',
      'eslint.config.js',
      'eslint.config.mjs',
      'eslint.config.cjs'
    ];

    const hasConfigFile = configFiles.some(file =>
      fs.existsSync(path.join(process.cwd(), file))
    );

    if (hasConfigFile) return true;

    // Check package.json for eslintConfig
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        return !!packageJson.eslintConfig;
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * Get all changed files from git
   */
  getChangedFiles() {
    // Get unstaged changes
    const unstaged = this.exec('git diff --name-only').split('\n').filter(Boolean);

    // Get staged changes
    const staged = this.exec('git diff --cached --name-only').split('\n').filter(Boolean);

    // Get untracked files
    const untracked = this.exec('git ls-files --others --exclude-standard').split('\n').filter(Boolean);

    // Combine all and remove duplicates
    const allFiles = [...new Set([...unstaged, ...staged, ...untracked])];

    return allFiles.filter(file => {
      const ext = path.extname(file);
      return this.validExtensions.includes(ext) && fs.existsSync(file);
    });
  }

  /**
   * Run ESLint on files
   */
  runESLint(files, fix = false) {
    if (files.length === 0) {
      return { success: true, output: 'No files to lint' };
    }

    const fixFlag = fix ? '--fix' : '';
    const filesStr = files.map(f => `"${f}"`).join(' ');
    const command = `npx eslint ${fixFlag} ${filesStr}`;

    try {
      const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
      return { success: true, output };
    } catch (error) {
      return { success: false, output: error.stdout || error.message };
    }
  }

  /**
   * Parse ESLint output for summary
   */
  parseESLintOutput(output) {
    const lines = output.split('\n');
    const summary = {
      files: 0,
      errors: 0,
      warnings: 0,
      fixable: 0
    };

    lines.forEach(line => {
      const problemMatch = line.match(/(\d+)\s+problems?\s+\((\d+)\s+errors?,\s+(\d+)\s+warnings?\)/);
      if (problemMatch) {
        summary.errors = parseInt(problemMatch[2]);
        summary.warnings = parseInt(problemMatch[3]);
      }

      const fixableMatch = line.match(/(\d+)\s+errors?\s+and\s+(\d+)\s+warnings?\s+potentially\s+fixable/);
      if (fixableMatch) {
        summary.fixable = parseInt(fixableMatch[1]) + parseInt(fixableMatch[2]);
      }
    });

    return summary;
  }

  /**
   * Main validation workflow
   */
  async validate(autoFix = false) {
    console.log('🔍 ESLint Git Changes Validator\n');

    // Check prerequisites
    if (!this.isGitRepo()) {
      console.error('❌ Error: Not a git repository');
      process.exit(1);
    }

    if (!this.isESLintAvailable()) {
      console.error('❌ Error: ESLint is not installed. Run: npm install eslint');
      process.exit(1);
    }

    // Must have ESLint config to run
    if (!this.hasESLintConfig()) {
      console.error('❌ Error: No ESLint configuration found in the project');
      console.error('   This skill requires an ESLint config file to run.');
      console.error('   Supported config files:');
      console.error('   - .eslintrc.json, .eslintrc.js, .eslintrc.yml');
      console.error('   - eslint.config.js (flat config)');
      console.error('   - eslintConfig in package.json');
      process.exit(1);
    }

    // Get changed files
    console.log('📂 Detecting changed files...');
    const files = this.getChangedFiles();

    if (files.length === 0) {
      console.log('✅ No changed files found for linting');
      return;
    }

    console.log(`\n📝 Found ${files.length} changed file(s):`);
    files.forEach(file => console.log(`   - ${file}`));

    // Run ESLint
    console.log('\n🔎 Running ESLint validation...\n');
    const result = this.runESLint(files, autoFix);

    if (result.output) {
      console.log(result.output);
    }

    if (result.success) {
      console.log('\n✅ All files passed ESLint validation!');
    } else {
      console.log('\n❌ ESLint found issues');

      if (!autoFix) {
        const summary = this.parseESLintOutput(result.output);
        if (summary.fixable > 0) {
          console.log(`\n💡 Tip: ${summary.fixable} issue(s) can be automatically fixed.`);
          console.log('   Run with --fix flag: node validate-and-fix.js --fix');
        }
      }
    }

    process.exit(result.success ? 0 : 1);
  }
}

// CLI execution
const autoFix = process.argv.includes('--fix');
const validator = new ESLintValidator();
validator.validate(autoFix);
