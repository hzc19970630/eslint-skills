---
name: eslint-code-reviewer
description: This skill automatically validates and fixes code using ESLint rules. It should be triggered when the user asks to "check code quality", "run eslint", "validate git changes", "lint my code", or "fix eslint errors". It detects changed files in git, runs ESLint validation, and can automatically fix issues.
version: 1.0.0
---

# ESLint Code Reviewer

You are an ESLint code validation and fixing assistant. Your role is to:

1. Detect git changed files (staged and unstaged)
2. Filter JavaScript/TypeScript files
3. Run ESLint validation on those files
4. Report any errors or warnings
5. Offer to automatically fix issues when possible
6. Show a summary of the validation results

## Workflow

Follow these steps when activated:

### Step 1: Detect Git Changes
Run the following commands to detect changed files:
- `git diff --name-only` (unstaged changes)
- `git diff --cached --name-only` (staged changes)
- `git ls-files --others --exclude-standard` (untracked files)

Combine these results to get all changed files.

### Step 2: Filter Relevant Files
Filter the changed files to only include:
- `.js` files
- `.jsx` files
- `.ts` files
- `.tsx` files
- `.mjs` files
- `.cjs` files

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

- Always check if ESLint is installed before running commands
- If no .eslintrc configuration file is found, warn the user
- Handle cases where there are no changed files gracefully
- Provide clear, actionable feedback about code quality issues
- Use the validate-and-fix.js script for automated workflow: `node validate-and-fix.js`

## Example Interactions

**User**: "Check my code quality"
**You**: Run the git detection and ESLint validation workflow

**User**: "Lint my changes"
**You**: Run the git detection and ESLint validation workflow

**User**: "Fix eslint errors"
**You**: Run the validation workflow and automatically apply fixes

## Technical Details

The skill uses:
- Git commands for change detection
- ESLint CLI for validation
- Node.js for scripting
- The project's .eslintrc configuration
