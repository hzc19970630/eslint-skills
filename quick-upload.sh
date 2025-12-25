#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         GitHub 快速上传脚本                                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# 检查 git 是否已初始化
if [ ! -d ".git" ]; then
    echo "❌ 错误: 当前目录不是 Git 仓库"
    exit 1
fi

# 获取用户输入
echo "请输入您的 GitHub 信息："
echo ""
read -p "GitHub 用户名: " username
read -p "仓库名称 (例如: eslint-code-reviewer): " reponame
echo ""

echo "选择连接方式："
echo "1) HTTPS (需要 Personal Access Token)"
echo "2) SSH (需要已配置 SSH 密钥)"
read -p "请选择 (1 或 2): " method
echo ""

# 检查是否已有 remote origin
if git remote | grep -q "^origin$"; then
    echo "⚠️  警告: 已存在 remote 'origin'"
    read -p "是否删除并重新添加? (y/n): " confirm
    if [ "$confirm" = "y" ]; then
        git remote remove origin
        echo "✅ 已删除旧的 remote 'origin'"
    else
        echo "❌ 操作取消"
        exit 1
    fi
fi

# 添加 remote
if [ "$method" = "1" ]; then
    remote_url="https://github.com/$username/$reponame.git"
elif [ "$method" = "2" ]; then
    remote_url="git@github.com:$username/$reponame.git"
else
    echo "❌ 无效的选择"
    exit 1
fi

echo "添加远程仓库: $remote_url"
git remote add origin "$remote_url"

# 显示当前分支
current_branch=$(git branch --show-current)
echo "当前分支: $current_branch"
echo ""

# 确认推送
read -p "是否推送到 GitHub? (y/n): " push_confirm
if [ "$push_confirm" != "y" ]; then
    echo "❌ 操作取消"
    exit 1
fi

echo ""
echo "开始推送到 GitHub..."
echo "════════════════════════════════════════════════════════════════"

# 推送到 GitHub
if git push -u origin "$current_branch"; then
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "✅ 上传成功！"
    echo ""
    echo "仓库地址: https://github.com/$username/$reponame"
    echo ""
    echo "后续更新命令:"
    echo "  git add ."
    echo "  git commit -m \"更新说明\""
    echo "  git push"
else
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "❌ 上传失败"
    echo ""
    echo "可能的原因："
    echo "1. GitHub 仓库不存在 - 请先在 GitHub 创建仓库"
    echo "2. 认证失败 - 检查 Personal Access Token 或 SSH 密钥"
    echo "3. 权限不足 - 确认有推送权限"
    echo ""
    echo "请查看详细指南: cat GITHUB_UPLOAD_GUIDE.md"
    exit 1
fi
