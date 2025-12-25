# GitHub 上传指南

本指南将帮助您将 ESLint Code Reviewer Skills Plugin 项目上传到 GitHub。

---

## 📋 前置准备

### 1. 创建 GitHub 账号
如果还没有 GitHub 账号，请访问 https://github.com 注册。

### 2. 安装 Git
确认 Git 已安装：
```bash
git --version
```

### 3. 配置 Git 用户信息（如果还未配置）
```bash
# 全局配置
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 或仅在此项目配置（已配置）
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

---

## 🚀 方法一：通过 GitHub 网页界面（推荐新手）

### 步骤 1: 在 GitHub 创建新仓库

1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - **Repository name**: `eslint-code-reviewer` 或 `eslint-skills-plugin`
   - **Description**: "A Claude Code skill that automatically validates and fixes code quality issues using ESLint"
   - **Public/Private**: 选择 Public（公开）或 Private（私有）
   - ⚠️ **不要**勾选 "Initialize with README"（我们已有 README）
   - ⚠️ **不要**勾选 "Add .gitignore"（我们已有 .gitignore）
   - **License**: 选择 MIT（如果需要）
4. 点击 "Create repository"

### 步骤 2: 连接本地仓库到 GitHub

GitHub 会显示一个页面，包含上传命令。按照以下步骤操作：

```bash
# 进入项目目录（如果不在的话）
cd /home/claude-app/eslint-skills

# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 查看远程仓库配置
git remote -v

# 推送到 GitHub（首次推送）
git push -u origin master
```

### 步骤 3: 输入 GitHub 凭证

如果是首次推送，Git 会要求输入 GitHub 用户名和密码：
- **Username**: 您的 GitHub 用户名
- **Password**: 使用 Personal Access Token（不是账号密码）

**如何获取 Personal Access Token:**
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 点击 "Generate token"
5. 复制生成的 token（只显示一次，请保存）
6. 在命令行输入 token 作为密码

---

## 🚀 方法二：使用 SSH（推荐高级用户）

### 步骤 1: 生成 SSH 密钥（如果还没有）

```bash
# 检查是否已有 SSH 密钥
ls -la ~/.ssh

# 如果没有，生成新的 SSH 密钥
ssh-keygen -t ed25519 -C "your.email@example.com"

# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 添加 SSH 密钥到 ssh-agent
ssh-add ~/.ssh/id_ed25519

# 复制公钥
cat ~/.ssh/id_ed25519.pub
```

### 步骤 2: 添加 SSH 密钥到 GitHub

1. 访问 https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴公钥内容
4. 点击 "Add SSH key"

### 步骤 3: 使用 SSH 连接仓库

```bash
# 添加远程仓库（SSH 格式）
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# 推送到 GitHub
git push -u origin master
```

---

## 📝 完整命令示例

假设您的 GitHub 用户名是 `john-doe`，仓库名是 `eslint-code-reviewer`：

### HTTPS 方式
```bash
cd /home/claude-app/eslint-skills

# 添加远程仓库
git remote add origin https://github.com/john-doe/eslint-code-reviewer.git

# 查看分支
git branch

# 如果当前分支不是 main/master，重命名
git branch -M main

# 推送到 GitHub
git push -u origin main

# 输入凭证
Username: john-doe
Password: <your-personal-access-token>
```

### SSH 方式
```bash
cd /home/claude-app/eslint-skills

# 添加远程仓库
git remote add origin git@github.com:john-doe/eslint-code-reviewer.git

# 推送到 GitHub
git push -u origin master
```

---

## 🔄 后续更新

项目上传成功后，以后的更新流程：

```bash
# 1. 添加更改
git add .

# 2. 提交更改
git commit -m "描述你的更改"

# 3. 推送到 GitHub
git push
```

---

## 📦 推荐的仓库设置

### 1. 添加 Topics（标签）

在 GitHub 仓库页面，点击 "About" 旁边的设置图标，添加 topics：
- `claude-code`
- `eslint`
- `code-quality`
- `skills-plugin`
- `git-hooks`
- `javascript`
- `typescript`

### 2. 设置仓库描述

```
A professional Claude Code skills plugin for ESLint validation and auto-fixing
```

### 3. 添加仓库 URL

在 "Website" 字段添加部署的 URL：
```
https://abrahamhan_eslintskills.anker-launch.com
```

---

## 🌟 创建 Release（可选）

发布第一个版本：

1. 在 GitHub 仓库页面，点击 "Releases" → "Create a new release"
2. 填写信息：
   - **Tag version**: `v1.0.0`
   - **Release title**: `v1.0.0 - Initial Release`
   - **Description**:
     ```markdown
     ## 🎉 First Release

     A professional Claude Code skills plugin with standard structure.

     ### Features
     - ✅ Git change detection
     - ✅ ESLint validation
     - ✅ Auto-fix support
     - ✅ Multiple file types support
     - ✅ Web interface

     ### Deployment
     Live demo: https://abrahamhan_eslintskills.anker-launch.com
     ```
3. 点击 "Publish release"

---

## ⚠️ 常见问题

### 1. "remote origin already exists"
```bash
# 删除现有的 origin
git remote remove origin

# 重新添加
git remote add origin <your-repo-url>
```

### 2. "failed to push some refs"
```bash
# 先拉取远程更改
git pull origin master --allow-unrelated-histories

# 再推送
git push -u origin master
```

### 3. "Authentication failed"
- 确保使用的是 Personal Access Token，而不是账号密码
- 检查 token 是否有 `repo` 权限
- Token 可能已过期，需要重新生成

### 4. 推送很慢或超时
```bash
# 使用代理（如果有）
git config --global http.proxy http://proxy.example.com:8080

# 或取消代理
git config --global --unset http.proxy
```

---

## 📚 验证上传成功

上传成功后，在浏览器访问：
```
https://github.com/YOUR_USERNAME/REPO_NAME
```

您应该能看到：
- ✅ 所有文件和目录
- ✅ README.md 自动渲染
- ✅ 提交历史
- ✅ 正确的 .gitignore（node_modules 不会被上传）

---

## 🔗 推荐添加的 Badges（徽章）

在 README.md 顶部添加：

```markdown
# ESLint Code Reviewer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![ESLint](https://img.shields.io/badge/ESLint-%3E%3D7.0.0-blue)](https://eslint.org/)

A professional Claude Code skills plugin for ESLint validation and auto-fixing.

[Live Demo](https://abrahamhan_eslintskills.anker-launch.com) | [Documentation](docs/README.md)
```

---

## ✅ 检查清单

上传前确认：
- [ ] .gitignore 已配置（不上传 node_modules）
- [ ] 所有更改已提交到本地 Git
- [ ] 已在 GitHub 创建新仓库
- [ ] 已配置 Git 用户信息
- [ ] 已获取 Personal Access Token（HTTPS）或配置 SSH（SSH）
- [ ] README.md 内容完整
- [ ] package.json 信息正确

上传后验证：
- [ ] GitHub 仓库页面显示所有文件
- [ ] README.md 正确渲染
- [ ] node_modules 未被上传
- [ ] .git 目录未被上传（GitHub 自动处理）
- [ ] 提交历史完整

---

## 🎓 学习资源

- [GitHub 官方文档](https://docs.github.com/)
- [Git 官方文档](https://git-scm.com/doc)
- [GitHub Personal Access Token 指南](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

## 📧 需要帮助？

如果遇到问题：
1. 查看 GitHub 的错误信息
2. 检查 Git 配置：`git config --list`
3. 查看远程仓库配置：`git remote -v`
4. 查看提交历史：`git log`

---

**祝您上传成功！** 🎉
