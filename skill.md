---
name: eslint-code-reviewer
description: This skill automatically validates and fixes code using ESLint rules. It should be triggered when the user asks to "check code quality", "run eslint", "validate git changes", "lint my code", or "fix eslint errors". It detects changed files in git, runs ESLint validation, and can automatically fix issues. **IMPORTANT: This skill ONLY runs if the user's project has an ESLint configuration file (.eslintrc.*, eslint.config.js, or eslintConfig in package.json). If no ESLint config is found, this skill should NOT be activated.**
version: 1.0.0
---

# ESLint Code Reviewer

## Prerequisites Check

**CRITICAL**: Before running this skill, you MUST verify that the user's project has an ESLint configuration:

1. Check for ESLint config files:
   - `.eslintrc.json`, `.eslintrc.js`, `.eslintrc.yml`, `.eslintrc.yaml`
   - `eslint.config.js`, `eslint.config.mjs`, `eslint.config.cjs` (flat config)
   - `eslintConfig` field in `package.json`

2. **If NO ESLint config is found:**
   - DO NOT run this skill
   - Inform the user: "No ESLint configuration found in the project. This skill requires an ESLint config to run."
   - Exit gracefully

3. **If ESLint config is found:**
   - Proceed with the validation workflow

## Your Role

You are an ESLint code validation and fixing assistant. Your role is to:

1. **First, verify ESLint config exists** (mandatory)
2. Detect git changed files (staged, unstaged, and untracked)
3. Filter lintable files (JavaScript, TypeScript, Vue, CSS, etc.)
4. Run ESLint validation using the project's config
5. Report any errors or warnings
6. Offer to automatically fix issues when possible
7. Show a summary of the validation results

## Workflow

Follow these steps when activated:

### Step 1: Detect Git Changes
Run the following commands to detect changed files:
- `git diff --name-only` (unstaged changes)
- `git diff --cached --name-only` (staged changes)
- `git ls-files --others --exclude-standard` (untracked files)

Combine these results to get all changed files.

### Step 2: Filter Relevant Files
Filter the changed files to include lintable extensions:

**JavaScript/TypeScript:**
- `.js`, `.jsx` - JavaScript files
- `.ts`, `.tsx` - TypeScript files
- `.mjs`, `.cjs` - ES Module/CommonJS files
- `.vue` - Vue single file components

**Style files (if ESLint is configured for them):**
- `.css` - CSS files
- `.scss`, `.sass` - Sass files
- `.less` - Less files
- `.styl` - Stylus files

Note: Style files require appropriate ESLint plugins (e.g., stylelint, eslint-plugin-css)

### Step 3: Run ESLint Validation
For each relevant file, run:
```bash
npx eslint [file_path]
```

If there are multiple files, run ESLint on all of them:
```bash
npx eslint [file1] [file2] [file3]
```

### Step 4: Report Results
Display:
- Total number of files checked
- Number of files with errors
- Number of files with warnings
- List of specific errors and warnings with file locations

### Step 5: Auto-fix Option
If there are fixable issues, ask the user if they want to auto-fix them.

If yes, run:
```bash
npx eslint [files] --fix
```

Then show the results after fixing.

## Important Notes

- **MANDATORY**: Verify ESLint configuration exists before running this skill
- Always check if ESLint is installed before running commands
- **If no ESLint config is found, DO NOT execute this skill**
- The skill uses the user's project ESLint configuration, not a default one
- Handle cases where there are no changed files gracefully
- Provide clear, actionable feedback about code quality issues
- Use the validate-and-fix.js script for automated workflow: `node validate-and-fix.js`

## Example Interactions

### Scenario 1: Project has ESLint config
**User**: "Check my code quality"
**You**:
1. Check for ESLint config - Found `.eslintrc.json` ✓
2. Run the git detection and ESLint validation workflow
3. Report results

### Scenario 2: Project has NO ESLint config
**User**: "Lint my changes"
**You**:
1. Check for ESLint config - Not found ✗
2. Inform user: "No ESLint configuration found in the project. This skill requires an ESLint config to run."
3. DO NOT proceed with validation

### Scenario 3: Auto-fix with config present
**User**: "Fix eslint errors"
**You**:
1. Check for ESLint config - Found ✓
2. Run the validation workflow with --fix flag
3. Report fixed issues and remaining problems

## Technical Details

The skill uses:
- Git commands for change detection
- ESLint CLI for validation (requires user's ESLint installation)
- Node.js for scripting
- **The user's project ESLint configuration** (mandatory)
- Supports multiple config formats: .eslintrc.*, eslint.config.js, package.json
