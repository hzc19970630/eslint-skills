# ESLint Code Reviewer - Claude Code Skills Plugin

A professional Claude Code skills plugin that automatically validates and fixes code quality issues in git changed files using ESLint configuration.

## 🎯 正确的 Skills 插件结构

```
eslint-skills/
├── .claude-plugin/
│   └── plugin.json          # 插件配置文件（定义插件元数据和 skills）
├── skills/
│   └── eslint-reviewer/     # skill 名称
│       ├── SKILL.md         # ✅ 必需（大写！）- Skill 定义和工作流程
│       ├── README.md        # 📖 可选 - 详细文档
│       ├── USAGE.md         # 📖 可选 - 使用指南
│       └── scripts/         # 📁 可选 - 支持脚本和配置文件
│           ├── validate-and-fix.js   # 核心验证脚本
│           ├── .eslintrc.json        # ESLint 配置示例
│           ├── eslint.config.js      # ESLint 扁平配置示例
│           ├── example.js            # JavaScript 示例
│           └── example.css           # CSS 示例
├── package.json             # Node.js 依赖配置
├── Dockerfile               # Docker 部署配置
├── server.js                # Web 服务器（用于展示）
└── DEPLOYMENT.md            # 部署文档
```

## 📦 安装和使用

### 作为 Claude Code Skill 使用

1. **克隆或下载此插件到 Claude Code skills 目录**:
   ```bash
   cd ~/.claude/skills/
   git clone <repository-url> eslint-code-reviewer
   ```

2. **在您的项目中使用**:
   - 确保项目有 ESLint 配置文件
   - 确保有 git 仓库和变更文件
   - 在 Claude Code 中说：
     - "check code quality"
     - "run eslint"
     - "validate git changes"
     - "lint my code"
     - "fix eslint errors"

### 独立脚本使用

```bash
# 安装依赖
npm install

# 验证变更文件
node skills/eslint-reviewer/scripts/validate-and-fix.js

# 验证并自动修复
node skills/eslint-reviewer/scripts/validate-and-fix.js --fix
```

## 🌐 在线演示

已部署的 Web 版本：**https://abrahamhan_eslintskills.anker-launch.com**

功能：
- 📄 查看完整文档
- 🔌 API 接口访问
- 📁 浏览所有配置文件和示例
- 🎨 友好的 Web 界面

## ⚙️ 插件配置

### .claude-plugin/plugin.json

定义了插件的元数据和技能触发器：

```json
{
  "name": "eslint-code-reviewer",
  "version": "1.0.0",
  "skills": [
    {
      "name": "eslint-reviewer",
      "triggers": [
        "check code quality",
        "run eslint",
        "validate git changes"
      ]
    }
  ]
}
```

### skills/eslint-reviewer/SKILL.md

**最重要的文件**！定义了：
- Skill 的描述和版本
- 前置条件检查（必须有 ESLint 配置）
- 完整的工作流程
- 使用示例

## 🎯 核心功能

### 1. 自动检测 Git 变更
- ✅ 未暂存的变更 (unstaged)
- ✅ 已暂存的变更 (staged)
- ✅ 未跟踪的新文件 (untracked)

### 2. 多文件类型支持
**JavaScript/TypeScript:**
- `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`, `.vue`

**样式文件（需要相应插件）:**
- `.css`, `.scss`, `.sass`, `.less`, `.styl`

### 3. 智能验证
- 使用项目自己的 ESLint 配置
- 详细的错误和警告报告
- 显示文件位置和行号

### 4. 自动修复
- 支持 `--fix` 标志
- 自动修复可修复的问题
- 报告剩余问题

## 🔒 前置条件（重要！）

**此 skill 仅在项目有 ESLint 配置时运行**

支持的配置格式：
- `.eslintrc.json`, `.eslintrc.js`, `.eslintrc.yml`, `.eslintrc.yaml`
- `eslint.config.js`, `eslint.config.mjs`, `eslint.config.cjs` (ESLint 9+ 扁平配置)
- `package.json` 中的 `eslintConfig` 字段

如果没有找到配置文件，skill 会明确告知用户并退出。

## 📚 文档结构

| 文件 | 位置 | 说明 |
|------|------|------|
| **SKILL.md** | `skills/eslint-reviewer/` | ✅ **必需** - Skill 定义（大写） |
| **README.md** | `skills/eslint-reviewer/` | 详细功能文档 |
| **USAGE.md** | `skills/eslint-reviewer/` | 快速使用指南 |
| **plugin.json** | `.claude-plugin/` | 插件配置文件 |
| **validate-and-fix.js** | `skills/eslint-reviewer/scripts/` | 核心脚本 |

## 🚀 部署信息

### Docker 部署
- **域名**: https://abrahamhan_eslintskills.anker-launch.com
- **基础镜像**: node:20.19-alpine
- **运行端口**: 3000
- **部署时间**: 2025-12-25

### 本地开发
```bash
# 安装依赖
npm install

# 启动 Web 服务器
npm start

# 运行验证脚本
npm run validate
```

## 🧪 测试

### API 测试
```bash
# 测试首页
curl https://abrahamhan_eslintskills.anker-launch.com/

# 获取 README
curl https://abrahamhan_eslintskills.anker-launch.com/api/readme

# 获取使用指南
curl https://abrahamhan_eslintskills.anker-launch.com/api/usage
```

### 功能测试
```bash
# 在有 git 变更的项目中
cd your-project
node /path/to/skills/eslint-reviewer/scripts/validate-and-fix.js

# 自动修复
node /path/to/skills/eslint-reviewer/scripts/validate-and-fix.js --fix
```

## 📖 相关文档

- [SKILL.md](skills/eslint-reviewer/SKILL.md) - Skill 定义和工作流程
- [README.md](skills/eslint-reviewer/README.md) - 详细功能文档
- [USAGE.md](skills/eslint-reviewer/USAGE.md) - 快速使用指南
- [DEPLOYMENT.md](DEPLOYMENT.md) - 部署测试指南

## 🤝 贡献

欢迎贡献！您可以：
- 自定义 ESLint 规则
- 添加更多文件类型支持
- 改进验证逻辑
- 增强报告功能

## 📄 许可证

MIT License

---

## 🔄 版本历史

### v1.0.0 (2025-12-25)
- ✅ 初始版本
- ✅ 支持 JavaScript/TypeScript/Vue 文件
- ✅ 支持样式文件 (CSS/SCSS/Less/Stylus)
- ✅ 强制要求 ESLint 配置
- ✅ 自动修复功能
- ✅ Web 界面展示
- ✅ 符合 Claude Code Skills 标准结构
