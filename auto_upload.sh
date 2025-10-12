#!/bin/bash
# 一键上传投注计算器 v12.3 到 GitHub Pages
# 适用于: Kinseygo / bet-calculator

echo "=== 投注计算器 v12.3 自动上传脚本 ==="
echo "请输入你的 GitHub Token (必须有repo权限):"
read -s TOKEN

USERNAME="Kinseygo"
REPO="bet-calculator"

echo "正在创建本地临时仓库..."
git init
git config user.name "$USERNAME"
git config user.email "${USERNAME}@users.noreply.github.com"
git add .
git commit -m "Deploy v12.3"
git branch -M main

echo "推送到 GitHub..."
git remote add origin https://$TOKEN@github.com/$USERNAME/$REPO.git
git push -u origin main --force

echo "启用 GitHub Pages..."
curl -H "Authorization: token $TOKEN" -X PUT      -d '{"source":{"branch":"main","path":"/"}}'      https://api.github.com/repos/$USERNAME/$REPO/pages

echo "部署完成 ✅"
echo "访问地址: https://$USERNAME.github.io/$REPO/"
