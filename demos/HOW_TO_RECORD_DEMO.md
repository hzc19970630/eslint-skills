# 📹 How to Record Demo GIF

This guide helps you create a compelling demo GIF for the project.

## 🎯 Goal

Create a **30-second GIF** showing:
1. Creating a file with ESLint errors
2. Running the skill with natural language
3. Seeing beautiful formatted output
4. Auto-fixing the issues
5. Showing the fixed code

## 🛠️ Tools

### Option 1: Terminalizer (Recommended)
Best for terminal recordings with syntax highlighting.

```bash
# Install
npm install -g terminalizer

# Record
terminalizer record demo

# Play back
terminalizer play demo

# Generate GIF
terminalizer render demo -o demo.gif
```

### Option 2: Asciinema + agg
Best for lightweight, text-based demos.

```bash
# Install
brew install asciinema  # macOS
pip install agg         # GIF converter

# Record
asciinema rec demo.cast

# Convert to GIF
agg demo.cast demo.gif
```

### Option 3: LICEcap (Simple)
Best for quick screen recordings.

- Download: https://www.cockos.com/licecap/
- Just point and record
- Instant GIF output

## 📝 Script

Follow this script for a perfect demo:

### Setup (before recording)

```bash
# 1. Create a test project
mkdir /tmp/demo-project && cd /tmp/demo-project
npm init -y
npm install eslint

# 2. Create ESLint config
cat > .eslintrc.js << 'EOF'
module.exports = {
  extends: 'eslint:recommended',
  env: { node: true, es6: true },
  parserOptions: { ecmaVersion: 2020 }
};
EOF

# 3. Initialize Git
git init
git config user.name "Demo User"
git config user.email "demo@example.com"

# 4. Open Claude Code
# Make sure your terminal is clean
clear
```

### Recording Steps

**Step 1** (3 seconds): Create file with errors
```bash
cat > app.js << 'EOF'
const unused = 'test'
function hello()
{
console.log("Hello World")
}
EOF

# Show the file
cat app.js
```

**Step 2** (2 seconds): Show it's a new file
```bash
git status
```

**Step 3** (10 seconds): Ask Claude to check
```bash
# In Claude Code, type:
"check code quality"

# Claude will respond with:
# 🔍 Detecting changed files...
# 📝 Found 1 file: app.js
#
# ❌ 5 errors found:
#   - Line 1: 'unused' is assigned but never used
#   - Line 2: Missing newline after '()'
#   - Line 4: Unexpected console statement
#   - Line 4: Expected single quotes, saw double quotes
#   - Line 6: Missing semicolon
#
# 💡 4 issues can be auto-fixed. Want me to fix them? [Y/n]
```

**Step 4** (5 seconds): Auto-fix
```bash
# Type: Y

# Claude responds:
# ✅ Fixed 4 issues!
# ⚠️ 1 issue needs manual attention:
#    - 'unused' variable (consider removing)
```

**Step 5** (5 seconds): Show result
```bash
cat app.js

# Output shows fixed code:
# const unused = 'test';
#
# function hello() {
#   console.log('Hello World');
# }
```

**Step 6** (3 seconds): Verify it's clean
```bash
npx eslint app.js

# Shows only 1 warning (unused var)
```

**Step 7** (2 seconds): End with message
```bash
echo "✨ Code quality checked in 30 seconds!"
```

### Total: ~30 seconds

## 🎨 Tips for Great GIF

### Terminal Setup
```bash
# Use a nice theme
# Recommended: "Dracula" or "One Dark"

# Set reasonable terminal size
# 80 columns × 24 rows is standard

# Increase font size for recording
# 14-16pt for better readability
```

### Recording Best Practices

1. **Clear terminal before starting**
   ```bash
   clear
   ```

2. **Type slower than normal**
   - Use `--typing-delay 50` with terminalizer
   - Or just type slower manually

3. **Add pauses between steps**
   - 1-2 second pause before each command
   - Gives viewers time to read

4. **Keep it focused**
   - Don't show unrelated output
   - Cut out mistakes (use terminalizer editing)

5. **Optimize file size**
   ```bash
   # For Terminalizer
   terminalizer render demo -o demo.gif --quality 80

   # For gifsicle (reduce size)
   gifsicle -O3 --lossy=80 demo.gif -o demo-optimized.gif
   ```

## 📐 Ideal Dimensions

- **Width**: 800-1000px
- **Height**: 450-600px
- **Frame rate**: 10-15 fps (lower = smaller file)
- **File size**: < 10MB (GitHub limit: 10MB)

## 🎬 Alternative: Video

If GIF is too large, create an MP4:

```bash
# Record with asciinema
asciinema rec demo.cast

# Upload to asciinema.org
asciinema upload demo.cast

# Or convert to SVG (vector, small size)
svg-term --in demo.cast --out demo.svg
```

Embed in README:
```markdown
[![Demo](https://asciinema.org/a/YOUR_ID.svg)](https://asciinema.org/a/YOUR_ID)
```

## 📍 Where to Put the GIF

Once created:

1. Save to `demos/demo.gif`
2. Update README.md line 42:
   ```markdown
   <!-- Change this: -->
   > **📸 Demo GIF Coming Soon!**

   <!-- To this: -->
   ![Demo](demos/demo.gif)
   ```
3. Commit and push:
   ```bash
   git add demos/demo.gif README.md
   git commit -m "docs: add demo GIF"
   git push
   ```

## 🎯 Checklist

Before publishing your GIF:

- [ ] Shows the core value (finds + fixes errors)
- [ ] Runs in ~30 seconds
- [ ] Terminal is clean and readable
- [ ] Font size is large enough
- [ ] No sensitive information visible
- [ ] File size < 10MB
- [ ] GIF loops smoothly
- [ ] Colors are visible (not too dark/bright)

## 🚀 Quick Start

**Fastest way to record right now:**

```bash
# 1. Install LICEcap (GUI tool, easiest)
open https://www.cockos.com/licecap/

# 2. Follow the script above

# 3. Save as demos/demo.gif

# Done! 🎉
```

## 📚 Resources

- [Terminalizer Docs](https://terminalizer.com/)
- [Asciinema Docs](https://asciinema.org/)
- [GIF Optimization Guide](https://github.com/sindresorhus/guides/blob/main/gif-workflow.md)
- [Screen Recording Tips](https://www.screentogif.com/best-practices)

---

**Need help?** Open an issue or ask in [Discussions](https://github.com/hzc19970630/eslint-skills/discussions)!
