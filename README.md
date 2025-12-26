<div align="center">

# 🤖 ESLint Code Reviewer

### AI-Powered Code Quality Checker for Claude Code

**Save 30 minutes/day on code quality checks** | Auto-fix ESLint errors with natural language

[![GitHub stars](https://img.shields.io/github/stars/hzc19970630/eslint-skills?style=social)](https://github.com/hzc19970630/eslint-skills)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skills-blueviolet)](https://docs.anthropic.com/claude/docs/claude-code-skills)
[![ESLint](https://img.shields.io/badge/ESLint-Powered-4B32C3?logo=eslint)](https://eslint.org/)

[English](README.md) | [中文文档](README_zh-CN.md)

</div>

---

## 🎯 Why This Skill?

> **"I used to spend 2 hours fixing ESLint errors before every commit. Now I just say 'check code quality' and Claude does it in 30 seconds."**

### The Problem

- ❌ Running `npx eslint` manually is tedious
- ❌ Remembering which files changed is hard
- ❌ Understanding ESLint errors takes time
- ❌ Fixing errors one-by-one is painful

### The Solution

- ✅ Just say **"check code quality"**
- ✅ Automatically finds all changed files (staged + unstaged + untracked)
- ✅ AI explains errors in plain English
- ✅ One-click auto-fix for most issues

---

## 📺 See It In Action

<!-- TODO: Add demo GIF here -->
> **📸 Demo GIF Coming Soon!** For now, try it yourself in 5 minutes ⬇️

```bash
# What you type:
"check code quality"

# What Claude does:
🔍 Detecting changed files...
📝 Found 3 files with issues
   - src/App.jsx: 5 errors (4 auto-fixable)
   - utils/helper.js: 2 warnings

💡 Want me to fix these automatically? [Y/n]
```

---

## ⚡ Quick Comparison

<table>
<tr>
<th>Traditional Workflow</th>
<th>With This Skill</th>
</tr>
<tr>
<td>

```bash
# 1. Find changed files
$ git diff --name-only
$ git diff --cached --name-only
$ git ls-files -o --exclude-standard

# 2. Filter JS/TS files
$ ... | grep -E '\.(js|jsx|ts|tsx)$'

# 3. Run ESLint
$ npx eslint file1.js file2.js

# 4. Read cryptic errors
# 5. Google error codes
# 6. Fix manually
# 7. Run again...
```

**Time: 10-15 minutes** ⏱️

</td>
<td>

```bash
# Just ask Claude:
"check code quality"

# Claude handles everything:
✅ Finds changed files
✅ Filters relevant types
✅ Runs ESLint
✅ Explains errors clearly
✅ Auto-fixes when possible
✅ Shows results beautifully
```

**Time: 30 seconds** ⚡

**Savings: 10-15 minutes per check**

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- [Claude Code](https://docs.anthropic.com/claude/docs/claude-code) installed
- Your project has ESLint configuration (`.eslintrc.*` or `eslint.config.js`)

<details>
<summary><b>🚧 Don't have ESLint config yet?</b></summary>

**Quick setup (30 seconds):**

```bash
# Interactive setup (recommended)
npm init @eslint/config

# Or install a popular preset:
npm install --save-dev eslint eslint-config-airbnb
```

**Popular presets:**
- **Airbnb** - Most popular, strict (React/Vue recommended)
- **Standard** - No semicolons, simple
- **Google** - Google's style guide

**✨ Coming Soon:** Auto-generate ESLint config based on your code style!

Want this feature? Drop a ⭐ and [vote here](https://github.com/hzc19970630/eslint-skills/discussions)!

</details>

### Installation

```bash
# Install via Claude Code
claude skills install eslint-code-reviewer

# Or manually
git clone https://github.com/hzc19970630/eslint-skills.git
cp -r eslint-skills ~/.claude/skills/
cd ~/.claude/skills/eslint-skills && npm install
```

### Usage

Just talk to Claude using these triggers:

- **"check code quality"** - Validate all changes
- **"run eslint"** - Same as above
- **"fix eslint errors"** - Auto-fix all issues
- **"lint my code"** - Quick validation

That's it! No commands to remember. 🎉

---

## 🎯 Core Features

### 🔍 Smart File Detection

- ✅ Automatically finds **all** changed files
  - Staged files (`git add`ed)
  - Unstaged changes (modified but not added)
  - Untracked files (newly created)
- ✅ Filters relevant types (JS, TS, Vue, etc.)
- ✅ Excludes ESLint config files themselves

### 🤖 AI-Powered Assistance

- ✅ Natural language interaction
- ✅ Explains errors in plain English
- ✅ Suggests fixes with context
- ✅ Answers "why?" questions about rules

### ⚡ Auto-Fix Magic

- ✅ One-click fix for most issues
- ✅ Safe: asks before making changes
- ✅ Shows diff after fixing
- ✅ Handles 70%+ of common errors

### 📊 Beautiful Reports

- ✅ Color-coded output
- ✅ Grouped by file
- ✅ Prioritized by severity
- ✅ Shows fixable vs. manual issues

---

## 📖 Supported File Types

| Category | Extensions | Status |
|----------|-----------|--------|
| **JavaScript** | `.js`, `.mjs`, `.cjs`, `.jsx` | ✅ Full support |
| **TypeScript** | `.ts`, `.tsx` | ✅ Full support |
| **Vue** | `.vue` | ✅ Full support (with plugin) |
| **CSS** | `.css`, `.scss`, `.less` | ⚠️ Requires ESLint plugin |

---

## 💡 Use Cases

### For Junior Developers

```
You: "Why does ESLint say 'no-unused-vars'?"
Claude: "You declared 'userName' on line 4 but never used it.
         This might be a bug. Want me to remove it?"
```

**Value**: Learn ESLint rules interactively ⭐⭐⭐⭐⭐

### For Legacy Project Refactoring

```
You: "I have 500 ESLint errors. Where do I start?"
Claude: "I found:
         - 200 auto-fixable (trailing-spaces, semicolons)
         - 150 warnings (can be done later)
         - 150 need manual review (no-unused-vars)

         Let's fix the auto-fixable ones first?"
```

**Value**: Strategic refactoring plan ⭐⭐⭐⭐⭐

### For Multi-Project Developers

```
You: "What's different about this project's ESLint rules?"
Claude: "This project uses Airbnb config and enforces:
         - No semicolons (unusual!)
         - 2-space indentation
         - Strict prop-types for React

         Different from your last project."
```

**Value**: Quick context switching ⭐⭐⭐⭐

### For Pre-Commit Checks

```
You: "Check my code before I commit"
Claude: "Found 3 issues in 2 files:
         ✅ Fixed 2 automatically
         ⚠️ 1 needs your attention: unused import

         Ready to commit now!"
```

**Value**: Prevent CI failures ⭐⭐⭐⭐⭐

---

## 🏗️ Architecture

This project uses a **modular, high-cohesion, low-coupling** architecture:

```
┌─────────────────────────────────────────┐
│         CLI / Claude Interface          │
└─────────────────┬───────────────────────┘
                  │
         ┌────────▼────────┐
         │  Core Validator │
         └────────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌────▼─────┐  ┌───▼────┐
│Detector│  │ Executor │  │Reporter│
└───┬────┘  └────┬─────┘  └───┬────┘
    │            │             │
┌───▼────┐  ┌────▼─────┐  ┌───▼────┐
│Filter  │  │  Parser  │  │Formatter│
└────────┘  └──────────┘  └────────┘
```

**Benefits**:
- 🔧 Easy to extend (add new linters, file types)
- 🧪 Easy to test (each module is independent)
- 📦 Reusable (modules can be used standalone)

See [Architecture Guide](skills/eslint-reviewer/scripts/README.md) for details.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SKILL.md](skills/eslint-reviewer/SKILL.md) | Skill definition & workflow |
| [USAGE.md](skills/eslint-reviewer/USAGE.md) | Quick start guide |
| [scripts/README.md](skills/eslint-reviewer/scripts/README.md) | Architecture details |
| [CONTRIBUTING.md](#) | How to contribute |

---

## 🐛 Troubleshooting

<details>
<summary><b>Q: Skill doesn't activate when I say "check code quality"</b></summary>

**A:** Make sure:
1. Your project has an ESLint config file (`.eslintrc.*` or `eslint.config.js`)
2. You have changed files in Git (staged, unstaged, or untracked)
3. The skill is installed in `~/.claude/skills/`

</details>

<details>
<summary><b>Q: "No ESLint configuration found" error</b></summary>

**A:** This skill currently requires an existing ESLint setup.

**Quick fix (30 seconds):**

```bash
# Option 1: Interactive setup (easiest)
npm init @eslint/config

# Option 2: Use Airbnb preset (popular for React)
npm install --save-dev eslint eslint-config-airbnb eslint-plugin-react

# Option 3: Use Standard preset (simple)
npm install --save-dev eslint eslint-config-standard
```

**Then create `.eslintrc.json`:**

```json
{
  "extends": "airbnb"  // or "standard"
}
```

**✨ Coming Soon:** We're working on auto-generating ESLint config based on your code style!

Want this feature? [Vote here](https://github.com/hzc19970630/eslint-skills/discussions) 🗳️

</details>

<details>
<summary><b>Q: Vue files not working?</b></summary>

**A:** Install Vue ESLint plugin:

```bash
npm install --save-dev eslint-plugin-vue vue-eslint-parser
```

Update your ESLint config to include Vue. See [Vue Setup Guide](skills/eslint-reviewer/scripts/.eslintrc.vue.json).

</details>

---

## 🤝 Contributing

We'd love your help! Ways to contribute:

- 🐛 Report bugs via [Issues](https://github.com/hzc19970630/eslint-skills/issues)
- 💡 Suggest features in [Discussions](https://github.com/hzc19970630/eslint-skills/discussions)
- 📝 Improve documentation
- 🔧 Submit pull requests

See [CONTRIBUTING.md](#) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🌟 Show Your Support

If this skill saves you time, please:

1. ⭐ Star this repo
2. 🐦 [Share on Twitter](https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20Claude%20Code%20Skill%20for%20ESLint!&url=https://github.com/hzc19970630/eslint-skills)
3. 💬 Share your experience in [Discussions](https://github.com/hzc19970630/eslint-skills/discussions)

---

## 🔗 Related Resources

- [ESLint Official Docs](https://eslint.org/)
- [Claude Code Skills Docs](https://docs.anthropic.com/claude/docs/claude-code-skills)
- [Anthropic Discord](https://discord.gg/claude-developers)
- [Vue ESLint Plugin](https://eslint.vuejs.org/)

---

<div align="center">

**Made with ❤️ for the Claude Code community**

[Report Bug](https://github.com/hzc19970630/eslint-skills/issues) · [Request Feature](https://github.com/hzc19970630/eslint-skills/issues) · [Discord](https://discord.gg/claude-developers)

</div>
