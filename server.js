const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// API endpoint to get project README
app.get('/api/project', (req, res) => {
  try {
    const readme = fs.readFileSync(path.join(__dirname, 'PROJECT_README.md'), 'utf-8');
    res.json({ content: readme });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read PROJECT_README' });
  }
});

// API endpoint to get skill README
app.get('/api/readme', (req, res) => {
  try {
    const readme = fs.readFileSync(path.join(__dirname, 'skills/eslint-reviewer/README.md'), 'utf-8');
    res.json({ content: readme });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read README' });
  }
});

// API endpoint to get usage guide
app.get('/api/usage', (req, res) => {
  try {
    const usage = fs.readFileSync(path.join(__dirname, 'skills/eslint-reviewer/USAGE.md'), 'utf-8');
    res.json({ content: usage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read USAGE' });
  }
});

// API endpoint to get SKILL.md
app.get('/api/skill', (req, res) => {
  try {
    const skill = fs.readFileSync(path.join(__dirname, 'skills/eslint-reviewer/SKILL.md'), 'utf-8');
    res.json({ content: skill });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read SKILL' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ESLint Code Reviewer Skill</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .links { margin: 20px 0; }
        .links a { display: inline-block; margin: 10px 10px 10px 0; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .links a:hover { background: #0056b3; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <h1>🎯 ESLint Code Reviewer - Claude Code Skills Plugin</h1>
      <p>A professional Claude Code skills plugin with correct structure for ESLint validation and auto-fixing.</p>

      <div class="links">
        <a href="/PROJECT_README.md">📦 Project Structure</a>
        <a href="/skills/eslint-reviewer/README.md">📖 Skill README</a>
        <a href="/skills/eslint-reviewer/USAGE.md">🚀 Usage Guide</a>
        <a href="/skills/eslint-reviewer/SKILL.md">⚙️ SKILL.md</a>
      </div>

      <h2>✅ Correct Skills Plugin Structure</h2>
      <pre><code>eslint-skills/
├── .claude-plugin/
│   └── plugin.json          # Plugin configuration
└── skills/
    └── eslint-reviewer/     # Skill name
        ├── SKILL.md         # ✅ Required (uppercase!)
        ├── README.md        # Documentation
        ├── USAGE.md         # Usage guide
        └── scripts/         # Support files
            ├── validate-and-fix.js
            ├── .eslintrc.json
            └── example files...</code></pre>

      <h2>🚀 Quick Start</h2>
      <pre><code># As Claude Code Skill - just say:
"check code quality"
"run eslint"
"validate git changes"

# Standalone script:
node skills/eslint-reviewer/scripts/validate-and-fix.js
node skills/eslint-reviewer/scripts/validate-and-fix.js --fix</code></pre>

      <h2>📚 Documentation</h2>
      <ul>
        <li><a href="/api/project">API: Project Structure</a></li>
        <li><a href="/api/readme">API: Skill README</a></li>
        <li><a href="/api/usage">API: Usage Guide</a></li>
        <li><a href="/api/skill">API: SKILL.md</a></li>
      </ul>

      <h2>📁 Key Files</h2>
      <ul>
        <li><a href="/.claude-plugin/plugin.json">.claude-plugin/plugin.json</a> - Plugin config</li>
        <li><a href="/skills/eslint-reviewer/SKILL.md">skills/eslint-reviewer/SKILL.md</a> - Skill definition (required!)</li>
        <li><a href="/skills/eslint-reviewer/scripts/validate-and-fix.js">validate-and-fix.js</a> - Main script</li>
        <li><a href="/package.json">package.json</a> - Dependencies</li>
      </ul>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
