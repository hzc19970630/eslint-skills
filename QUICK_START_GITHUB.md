# 🚀 GitHub 上传快速开始

## 最简单的方法（3 步完成）

### 第 1 步：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 填写：
   - **Repository name**: `eslint-code-reviewer`
   - **Description**: `A Claude Code skill for ESLint validation`
   - **Public** (公开) 或 **Private** (私有)
   - ⚠️ **不要勾选** "Add a README file"
3. 点击 **"Create repository"**

### 第 2 步：获取 Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 设置：
   - **Note**: `eslint-skills-upload`
   - **Expiration**: `90 days` 或更长
   - **Select scopes**: 勾选 ✅ `repo`
4. 点击 **"Generate token"**
5. **复制 token**（只显示一次，请保存！）

### 第 3 步：上传到 GitHub

在项目目录执行：

```bash
cd /home/claude-app/eslint-skills

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/eslint-code-reviewer.git

# 推送到 GitHub
git push -u origin master
```

输入凭证：
- **Username**: 您的 GitHub 用户名
- **Password**: 粘贴刚才复制的 **Personal Access Token**

完成！访问 https://github.com/YOUR_USERNAME/eslint-code-reviewer 查看。

---

## 🎯 使用快速上传脚本

我已经为您准备了一个自动化脚本：

```bash
cd /home/claude-app/eslint-skills
./quick-upload.sh
```

按照提示输入信息即可。

---

## 📋 完整命令示例

假设您的 GitHub 用户名是 `zhangsan`：

```bash
# 1. 添加远程仓库
git remote add origin https://github.com/zhangsan/eslint-code-reviewer.git

# 2. 查看配置
git remote -v

# 3. 推送
git push -u origin master

# 输入：
# Username: zhangsan
# Password: ghp_xxxxxxxxxxxxxxxxxxxx (您的 token)
```

---

## ✅ 验证上传成功

浏览器访问：
```
https://github.com/YOUR_USERNAME/eslint-code-reviewer
```

应该能看到：
- ✅ 项目文件和目录
- ✅ README.md 自动渲染显示
- ✅ 5 次提交历史
- ✅ 正确的文件结构

---

## 🔄 后续更新流程

上传成功后，以后修改项目只需：

```bash
# 1. 添加更改
git add .

# 2. 提交
git commit -m "描述你的更改"

# 3. 推送
git push
```

---

## ⚠️ 常见问题

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin <your-repo-url>
```

### "Authentication failed"
- 确保使用 **Personal Access Token**，不是账号密码
- Token 需要有 `repo` 权限

### "Repository not found"
- 确认仓库名称正确
- 确认已在 GitHub 创建该仓库

---

## 📚 需要详细指南？

查看完整文档：
```bash
cat GITHUB_UPLOAD_GUIDE.md
```

或在线查看：https://docs.github.com/

---

**现在就开始上传吧！** 🎉
