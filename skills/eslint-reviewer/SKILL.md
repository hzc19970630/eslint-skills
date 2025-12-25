---
name: multi-language-code-reviewer
description: This skill automatically validates and fixes code using language-specific linters. It supports JavaScript/TypeScript/Vue (ESLint), Python (pylint/flake8/black), Java (checkstyle/spotbugs/pmd), Go (golangci-lint/gofmt), and Rust (clippy/rustfmt). It automatically detects file types and applies the appropriate validator. The skill should be triggered when the user asks to "check code quality", "run linter", "validate git changes", "lint my code", or "fix code errors". It detects changed files in git, runs appropriate validators based on file types, and can automatically fix issues when supported.
version: 2.0.0
---

# Multi-Language Code Reviewer

## Overview

This skill provides **automatic code validation and fixing** for multiple programming languages. It intelligently detects file types and applies the appropriate linter/validator for each language.

### Supported Languages

| Language | Validator | Tools | Auto-fix |
|----------|-----------|-------|----------|
| **JavaScript/TypeScript/Vue** | ESLint | eslint | ✅ |
| **Python** | PythonValidator | pylint, flake8, black, mypy | ✅ (black) |
| **Java** | JavaValidator | checkstyle, spotbugs, pmd | ❌ |
| **Go** | GoValidator | golangci-lint, gofmt, govet | ✅ (gofmt) |
| **Rust** | RustValidator | clippy, rustfmt | ✅ (rustfmt) |

---

## Prerequisites Check

**CRITICAL**: Before running this skill, verify that the project has appropriate configuration files for the languages present:

### 1. JavaScript/TypeScript/Vue Files
Check for ESLint configuration:
- `.eslintrc.json`, `.eslintrc.js`, `.eslintrc.yml`, `.eslintrc.yaml`
- `eslint.config.js`, `eslint.config.mjs`, `eslint.config.cjs` (flat config)
- `eslintConfig` field in `package.json`

**If NO ESLint config is found for JS/TS/Vue files:**
- Inform the user: "No ESLint configuration found. JavaScript/TypeScript/Vue files require ESLint config."
- Skip validation for JS/TS/Vue files, but continue with other languages if present

### 2. Python Files
Check for Python linter configuration:
- `.pylintrc`, `pyproject.toml`, `setup.cfg` (for pylint)
- `.flake8` (for flake8)
- `mypy.ini` (for mypy)

**Note**: Python validators can work without explicit config files (using defaults)

### 3. Java Files
Check for Java linter configuration:
- `checkstyle.xml` (for checkstyle)
- `spotbugs.xml` (for spotbugs)
- `pmd.xml` (for pmd)

**Note**: Java validators can work without explicit config files (using defaults)

### 4. Go Files
Check for Go linter configuration:
- `.golangci.yml`, `.golangci.yaml` (for golangci-lint)

**Note**: Go validators can work without explicit config files (using defaults)

### 5. Rust Files
Check for Rust project:
- `Cargo.toml` (required for Rust projects)

**If NO Rust project detected:**
- Inform the user: "Not a Rust/Cargo project. Cargo.toml not found."
- Skip Rust validation

### Summary
- **If NO supported language files are found**: Inform user and exit gracefully
- **If some languages have config, others don't**: Proceed with languages that have valid configuration
- **The skill automatically detects file types** and only validates files for which validators are available

---

## Your Role

You are a **multi-language code validation and fixing assistant**. Your role is to:

1. **Detect project technology stack** by analyzing file types in the repository
2. **Verify prerequisites** for each detected language
3. **Detect git changed files** (staged, unstaged, and untracked)
4. **Automatically identify file languages** based on extensions
5. **Apply appropriate validators** for each language
6. **Run validation** using language-specific tools
7. **Report errors and warnings** grouped by language
8. **Offer automatic fixing** when supported by the tool
9. **Show summary** of validation results per language

---

## Workflow

Follow these steps when activated:

### Step 1: Detect Project Technology Stack

**Automatically detect which languages are present** by checking:
- File extensions in the repository
- Configuration files (e.g., `package.json`, `Cargo.toml`, `requirements.txt`)
- Project structure

**Example detection:**
```bash
# Check for common project files
ls -la | grep -E "(package.json|Cargo.toml|requirements.txt|go.mod|pom.xml)"
```

### Step 2: Verify Prerequisites

For each detected language, verify prerequisites:

**JavaScript/TypeScript/Vue:**
- Check ESLint installation: `npx eslint --version`
- Check ESLint config exists (see Prerequisites Check above)

**Python:**
- Check Python installation: `python --version` or `python3 --version`
- Check linter tools: `pylint --version`, `flake8 --version`, etc.

**Java:**
- Check Java installation: `java -version`
- Check linter tools: `java -jar checkstyle.jar --version`, etc.

**Go:**
- Check Go installation: `go version`
- Check golangci-lint: `golangci-lint --version`

**Rust:**
- Check Rust/Cargo: `cargo --version`
- Check clippy: `cargo clippy --version`

### Step 3: Detect Git Changes

Run the following commands to detect changed files:
- `git diff --name-only` (unstaged changes)
- `git diff --cached --name-only` (staged changes)
- `git ls-files --others --exclude-standard` (untracked files)

Combine these results to get all changed files.

### Step 4: Filter and Group by Language

**Automatically filter files by supported extensions:**

**JavaScript/TypeScript:**
- `.js`, `.jsx` - JavaScript files
- `.ts`, `.tsx` - TypeScript files
- `.mjs`, `.cjs` - ES Module/CommonJS files
- `.vue` - Vue single file components

**Python:**
- `.py`, `.pyw` - Python files

**Java:**
- `.java` - Java files

**Go:**
- `.go` - Go files

**Rust:**
- `.rs` - Rust files

**The skill automatically groups files by language** and applies the appropriate validator.

### Step 5: Run Language-Specific Validation

**For each language group, run the appropriate validator:**

**JavaScript/TypeScript/Vue:**
```bash
npx eslint [file1] [file2] [file3]
```

**Python:**
```bash
pylint [file1] [file2] [file3]
# or
flake8 [file1] [file2] [file3]
```

**Java:**
```bash
java -jar checkstyle.jar [file1] [file2] [file3]
```

**Go:**
```bash
golangci-lint run [file1] [file2] [file3]
```

**Rust:**
```bash
cargo clippy -- [file1] [file2] [file3]
```

**The skill uses the multi-language script:**
```bash
node skills/eslint-reviewer/scripts/validate-and-fix-multilang.js
```

This script automatically:
- Detects file languages
- Groups files by language
- Runs appropriate validators in parallel
- Merges results

### Step 6: Report Results

Display results **grouped by language**:
- Total number of files checked per language
- Number of files with errors per language
- Number of files with warnings per language
- List of specific errors and warnings with file locations
- Language-specific summary

**Example output:**
```
📊 Results by language:
   ✅ javascript: 0 errors, 0 warnings
   ❌ python: 2 errors, 1 warnings
   ✅ go: 0 errors, 0 warnings

Total: 2 errors, 1 warnings
```

### Step 7: Auto-fix Option

**If there are fixable issues, ask the user if they want to auto-fix them.**

**Supported auto-fix:**
- ✅ JavaScript/TypeScript/Vue: ESLint `--fix`
- ✅ Python: `black` formatter
- ❌ Java: Not supported (most tools don't support auto-fix)
- ✅ Go: `gofmt`
- ✅ Rust: `rustfmt`

**If yes, run:**
```bash
node skills/eslint-reviewer/scripts/validate-and-fix-multilang.js --fix
```

Then show the results after fixing.

---

## Important Notes

### Automatic Language Detection
- **The skill automatically detects file types** based on extensions
- **No manual language specification needed**
- **Mixed-language projects are fully supported**

### Configuration Priority
1. Project-specific config (`.eslint-skills-config.json`)
2. Language-specific config files (e.g., `.pylintrc`, `checkstyle.xml`)
3. Default configuration

### Validator Selection
- **Automatic**: Based on file extensions
- **Configurable**: Via `.eslint-skills-config.json`
- **Fallback**: Uses default tool for each language

### Error Handling
- If a validator is not available, skip that language and continue with others
- Provide clear error messages with installation instructions
- Never fail completely if only some languages have issues

### Performance
- **Parallel execution**: Multiple language validators run in parallel
- **Efficient**: Only validates changed files
- **Fast**: Uses native tools for each language

---

## Example Interactions

### Scenario 1: JavaScript/TypeScript Project
**User**: "Check my code quality"

**You**:
1. Detect project: Found `package.json`, `.eslintrc.json` ✓
2. Detect files: Found `.js`, `.ts` files
3. Verify: ESLint config exists ✓
4. Run: `node validate-and-fix-multilang.js`
5. Report: JavaScript/TypeScript validation results

### Scenario 2: Multi-Language Project
**User**: "Lint my changes"

**You**:
1. Detect project: Found `package.json`, `requirements.txt`, `Cargo.toml`
2. Detect files: Found `.js`, `.py`, `.rs` files
3. Verify:
   - ESLint config exists ✓
   - Python tools available ✓
   - Rust/Cargo available ✓
4. Run: `node validate-and-fix-multilang.js`
5. Report: Results grouped by language (JavaScript, Python, Rust)

### Scenario 3: Python-Only Project
**User**: "Fix code errors"

**You**:
1. Detect project: Found `requirements.txt`, `.pylintrc`
2. Detect files: Found `.py` files only
3. Verify: Python tools available ✓
4. Run: `node validate-and-fix-multilang.js --fix`
5. Report: Python validation and auto-fix results

### Scenario 4: Missing Configuration
**User**: "Check code quality"

**You**:
1. Detect project: Found `.js` files but no ESLint config
2. Inform: "No ESLint configuration found for JavaScript files. Skipping JS validation."
3. Check other languages: Found `.py` files
4. Verify: Python tools available ✓
5. Run: Validate Python files only
6. Report: Python validation results (with note about skipped JS files)

---

## Technical Details

### Scripts Used

**Single Language (ESLint only):**
- `skills/eslint-reviewer/scripts/validate-and-fix-v2.js`
- Use when only JavaScript/TypeScript/Vue files are present

**Multi-Language:**
- `skills/eslint-reviewer/scripts/validate-and-fix-multilang.js`
- Use for projects with multiple languages or when unsure

### Architecture

The skill uses a **modular, extensible architecture**:

- **Language Detection**: Automatically identifies file languages
- **Validator Factory**: Creates appropriate validators
- **Multi-Language Validator**: Manages multiple validators in parallel
- **Output Parsers**: Parse tool-specific output into unified format
- **Reporters**: Display results in a user-friendly format

### Configuration Files

**Project-level config** (`.eslint-skills-config.json`):
```json
{
  "languages": {
    "python": {
      "extensions": [".py"],
      "validator": "python",
      "defaultTool": "pylint"
    }
  }
}
```

**Language-specific configs:**
- ESLint: `.eslintrc.*`, `eslint.config.js`
- Python: `.pylintrc`, `pyproject.toml`
- Java: `checkstyle.xml`
- Go: `.golangci.yml`
- Rust: `Cargo.toml`, `rustfmt.toml`

### File Filtering

**Excluded from validation:**
- ESLint config files (`.eslintrc.js`, `eslint.config.js`)
- Language-specific config files (`.pylintrc`, `checkstyle.xml`, etc.)
- `node_modules/`, `dist/`, `build/`, `.git/`

---

## Best Practices

1. **Always check prerequisites** before running validation
2. **Provide clear error messages** with installation instructions
3. **Group results by language** for better readability
4. **Support mixed-language projects** seamlessly
5. **Use parallel execution** for performance
6. **Handle missing tools gracefully** (skip language, don't fail completely)
7. **Offer auto-fix** when supported
8. **Exclude config files** from validation

---

## Version History

- **v2.0.0**: Multi-language support (JavaScript, Python, Java, Go, Rust)
- **v1.0.0**: ESLint-only support

---

**The skill automatically adapts to your project's technology stack!** 🚀
