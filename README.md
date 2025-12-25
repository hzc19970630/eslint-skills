# ESLint Code Reviewer Skill

A Claude Code skill that automatically validates and fixes code quality issues in git changed files using ESLint configuration.

## Features

- Automatically detects git changed files (staged, unstaged, and untracked)
- Filters JavaScript/TypeScript files for validation
- Runs ESLint validation based on project configuration
- Provides detailed error and warning reports
- Supports automatic fixing of issues
- Integrates seamlessly with Claude Code workflow

## Installation

1. Install dependencies:
```bash
npm install
```

2. Ensure ESLint is available in your project

## Usage

### As a Standalone Script

Run validation on changed files:
```bash
node validate-and-fix.js
```

Run validation and auto-fix issues:
```bash
node validate-and-fix.js --fix
```

Using npm scripts:
```bash
npm run validate
```

### As a Claude Code Skill

This skill is automatically triggered when users ask to:
- "check code quality"
- "run eslint"
- "validate git changes"
- "lint my code"
- "fix eslint errors"

The skill will:
1. Detect all changed files in git
2. Filter JavaScript/TypeScript files
3. Run ESLint validation
4. Report issues with file locations
5. Offer to auto-fix when possible

## Configuration

### ESLint Configuration

The project includes a default `.eslintrc.json` with common rules:
- 2-space indentation
- Single quotes
- Semicolons required
- Unix line endings
- No trailing spaces
- And more...

Customize the `.eslintrc.json` file to match your project's coding standards.

### Supported File Extensions

- `.js` - JavaScript
- `.jsx` - React JavaScript
- `.ts` - TypeScript
- `.tsx` - React TypeScript
- `.mjs` - ES Module JavaScript
- `.cjs` - CommonJS JavaScript

## How It Works

### Detection Phase
1. Runs `git diff --name-only` for unstaged changes
2. Runs `git diff --cached --name-only` for staged changes
3. Runs `git ls-files --others --exclude-standard` for untracked files
4. Combines and deduplicates the results

### Validation Phase
1. Filters files by supported extensions
2. Runs `npx eslint [files]` on detected files
3. Parses output for errors and warnings
4. Reports results with file locations

### Fix Phase (optional)
1. Runs `npx eslint [files] --fix`
2. Automatically fixes auto-fixable issues
3. Reports remaining issues

## Example Output

```
🔍 ESLint Git Changes Validator

📂 Detecting changed files...

📝 Found 3 changed file(s):
   - src/app.js
   - src/utils.js
   - test/app.test.js

🔎 Running ESLint validation...

/path/to/src/app.js
  12:15  error    'foo' is not defined                no-undef
  25:3   warning  Unexpected console statement        no-console

/path/to/src/utils.js
  8:1    error    Expected indentation of 2 spaces    indent

❌ ESLint found issues

💡 Tip: 1 issue(s) can be automatically fixed.
   Run with --fix flag: node validate-and-fix.js --fix
```

## Integration with Git Hooks

You can integrate this tool with git hooks for automatic validation:

### Pre-commit Hook

Create `.git/hooks/pre-commit`:
```bash
#!/bin/sh
node validate-and-fix.js
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Requirements

- Node.js >= 14.0.0
- Git
- ESLint >= 8.0.0

## Project Structure

```
eslint-skills/
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore rules
├── package.json            # Node.js dependencies
├── skill.md                # Claude Code skill definition
├── validate-and-fix.js     # Main validation script
└── README.md               # This file
```

## Contributing

Feel free to customize this skill for your specific needs:
- Modify ESLint rules in `.eslintrc.json`
- Add support for additional file types
- Enhance the validation logic
- Add more reporting options

## License

MIT
