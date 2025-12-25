# Quick Usage Guide

## Prerequisites

Before using this skill, ensure your project has:
1. Git repository initialized
2. ESLint installed (`npm install eslint`)
3. **ESLint configuration file** (one of the following):
   - `.eslintrc.json`, `.eslintrc.js`, `.eslintrc.yml`
   - `eslint.config.js` (ESLint 9+ flat config)
   - `eslintConfig` in `package.json`

## Usage Methods

### Method 1: Direct Script

```bash
# Validate changed files
node validate-and-fix.js

# Validate and auto-fix
node validate-and-fix.js --fix
```

### Method 2: NPM Scripts

```bash
# Validate
npm run validate

# Lint all files
npm run lint

# Lint and fix all files
npm run lint:fix
```

### Method 3: As Claude Code Skill

Just ask:
- "check code quality"
- "run eslint"
- "validate git changes"
- "lint my code"
- "fix eslint errors"

## Supported File Types

The skill automatically detects and validates these file types:

**JavaScript/TypeScript:**
- `.js`, `.jsx`, `.mjs`, `.cjs`
- `.ts`, `.tsx`
- `.vue`

**Styles (requires plugins):**
- `.css`, `.scss`, `.sass`, `.less`, `.styl`

## What Gets Checked

The validator checks:
- ✅ Unstaged changes (`git diff --name-only`)
- ✅ Staged changes (`git diff --cached --name-only`)
- ✅ Untracked files (`git ls-files --others --exclude-standard`)

## Example Workflow

1. Make changes to your code
2. Run `node validate-and-fix.js` to check for issues
3. Review the errors and warnings
4. Run `node validate-and-fix.js --fix` to auto-fix issues
5. Manually fix remaining issues
6. Commit your clean code

## Error Handling

If you see:
- "Not a git repository" → Initialize git with `git init`
- "ESLint is not installed" → Run `npm install eslint`
- "No ESLint configuration found" → Create an ESLint config file
- **"Parsing error: Unexpected keyword or identifier" for `.vue` files** → Install and configure Vue ESLint plugin:
  ```bash
  npm install --save-dev eslint-plugin-vue vue-eslint-parser
  ```
  Then update your ESLint config to include Vue support (see README.md for examples)

## Configuration

This skill uses **your project's ESLint configuration**. To customize:

1. Edit `.eslintrc.json` or `eslint.config.js`
2. Add/remove rules
3. Configure plugins
4. Run the validator again

Example `.eslintrc.json`:
```json
{
  "extends": "eslint:recommended",
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
}
```

## Integration with Git Hooks

Add to `.git/hooks/pre-commit`:
```bash
#!/bin/sh
node path/to/validate-and-fix.js
```

This will automatically check code quality before each commit.
