# ESLint Code Reviewer - Claude Code Skills Plugin

一个专业的 Claude Code Skills 插件，使用 ESLint 配置自动验证和修复 Git 变更文件的代码质量问题。

## 📋 项目简介

这是一个符合 Claude Code Skills 标准的插件，提供了模块化、高内聚低耦合的架构设计，可以自动检测 Git 变更文件并运行 ESLint 验证。

## 🎯 核心功能

- ✅ 自动检测 Git 变更文件（未暂存、已暂存、未跟踪）
- ✅ 支持多种文件类型（JavaScript、TypeScript、Vue、CSS 等）
- ✅ 使用项目自己的 ESLint 配置
- ✅ 自动修复可修复的问题
- ✅ 详细的错误和警告报告
- ✅ 模块化设计，易于扩展

## 📁 项目结构

```
eslint-skills/
├── .claude-plugin/
│   └── plugin.json          # 插件配置文件
├── skills/
│   └── eslint-reviewer/     # Skill 目录
│       ├── SKILL.md         # Skill 定义（必需）
│       ├── README.md        # 详细功能文档
│       ├── USAGE.md         # 使用指南
│       └── scripts/         # 脚本目录
│           ├── validate-and-fix-v2.js  # 主入口脚本
│           ├── core/        # 核心模块
│           ├── detectors/    # 检测器模块
│           ├── filters/      # 过滤器模块
│           ├── executors/    # 执行器模块
│           ├── parsers/      # 解析器模块
│           ├── reporters/   # 报告器模块
│           ├── config/       # 配置模块
│           └── utils/        # 工具模块
├── package.json
└── README.md                # 本文件
```

## 🚀 快速开始

### 安装

1. **克隆或下载项目到 Claude Code Skills 目录**：

```bash
# 找到 Claude Code Skills 目录
# macOS/Linux: ~/.claude/skills/
# Windows: %USERPROFILE%\.claude\skills\

# 复制项目
cp -r eslint-skills ~/.claude/skills/eslint-code-reviewer
```

2. **安装依赖**（可选，如果项目需要）：

```bash
cd ~/.claude/skills/eslint-code-reviewer
npm install
```

### 使用

在 Claude Code 中，使用以下触发词来激活技能：

- "check code quality"
- "run eslint"
- "validate git changes"
- "lint my code"
- "fix eslint errors"
- "eslint"

## ⚙️ 前置条件

**重要**：此 skill 仅在项目有 ESLint 配置时运行。

支持的配置格式：
- `.eslintrc.json`, `.eslintrc.js`, `.eslintrc.yml`, `.eslintrc.yaml`
- `eslint.config.js`, `eslint.config.mjs`, `eslint.config.cjs` (ESLint 9+ 扁平配置)
- `package.json` 中的 `eslintConfig` 字段

如果没有找到配置文件，skill 会明确告知用户并退出。

## 📖 文档

- [SKILL.md](skills/eslint-reviewer/SKILL.md) - Skill 定义和工作流程
- [README.md](skills/eslint-reviewer/README.md) - 详细功能文档
- [USAGE.md](skills/eslint-reviewer/USAGE.md) - 快速使用指南
- [scripts/README.md](skills/eslint-reviewer/scripts/README.md) - 脚本文件夹说明
- [scripts/DETAILED_STEPS.md](skills/eslint-reviewer/scripts/DETAILED_STEPS.md) - 详细执行步骤

## 🏗️ 架构设计

项目采用模块化、高内聚低耦合的设计：

- **核心模块**：验证器接口和实现
- **检测器模块**：文件检测和配置检测
- **过滤器模块**：文件过滤（扩展名、配置文件等）
- **执行器模块**：ESLint 命令执行
- **解析器模块**：输出解析
- **报告器模块**：结果报告
- **配置模块**：配置加载和管理
- **工具模块**：命令运行器、日志工具

详细设计说明请参考 [scripts/README.md](skills/eslint-reviewer/scripts/README.md)。

## 🔧 独立使用

除了作为 Claude Code Skill，你也可以直接运行脚本：

```bash
# 在项目目录中
node skills/eslint-reviewer/scripts/validate-and-fix-v2.js

# 自动修复
node skills/eslint-reviewer/scripts/validate-and-fix-v2.js --fix

# 详细输出
node skills/eslint-reviewer/scripts/validate-and-fix-v2.js --verbose
```

## 🎨 设计特点

- **高内聚**：每个模块只负责一个明确的功能
- **低耦合**：模块之间通过接口和依赖注入交互
- **可扩展**：易于添加新的 linter、过滤器、报告器
- **可测试**：依赖注入，便于单元测试
- **可配置**：配置外部化，支持自定义

## 📝 支持的文件类型

**JavaScript/TypeScript:**
- `.js`, `.jsx` - JavaScript
- `.ts`, `.tsx` - TypeScript
- `.mjs`, `.cjs` - ES Module/CommonJS
- `.vue` - Vue 单文件组件

**样式文件（需要相应插件）:**
- `.css`, `.scss`, `.sass` - CSS/Sass
- `.less` - Less
- `.styl` - Stylus

## ⚠️ Vue 文件支持

如果项目包含 `.vue` 文件，需要安装和配置 Vue ESLint 插件：

```bash
npm install --save-dev eslint-plugin-vue vue-eslint-parser
```

然后更新 ESLint 配置以支持 Vue。示例配置请参考：
- `skills/eslint-reviewer/scripts/.eslintrc.vue.json`
- `skills/eslint-reviewer/scripts/eslint.config.vue.js`

## 🐛 故障排查

### 问题：找不到入口文件

**错误信息**：
```
Error: Cannot find module '.../validate-and-fix-v2.js'
```

**解决方案**：
1. 确认脚本文件存在于 `skills/eslint-reviewer/scripts/validate-and-fix-v2.js`
2. 确认技能安装在正确的目录（`~/.claude/skills/`）
3. 检查文件权限：`chmod +x skills/eslint-reviewer/scripts/validate-and-fix-v2.js`

### 问题：Vue 文件解析错误

**错误信息**：
```
Parsing error: Unexpected keyword or identifier
```

**解决方案**：安装并配置 Vue ESLint 插件（见上方说明）

### 其他问题

请参考 [skills/eslint-reviewer/README.md](skills/eslint-reviewer/README.md) 中的故障排查部分。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎贡献！你可以：
- 自定义 ESLint 规则
- 添加更多文件类型支持
- 改进验证逻辑
- 增强报告功能
- 添加新的 linter 支持

## 📚 相关资源

- [ESLint 官方文档](https://eslint.org/)
- [Claude Code Skills 文档](https://docs.anthropic.com/claude/docs/claude-code-skills)
- [Vue ESLint 插件](https://eslint.vuejs.org/)

---

**项目已完成！** 🎉

