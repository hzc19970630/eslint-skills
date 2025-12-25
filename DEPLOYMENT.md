# 部署测试指南

## 部署信息

**部署域名**: https://abrahamhan_eslintskills.anker-launch.com

**部署时间**: 2025-12-25 03:14:48

**服务器信息**:
- 容器名称: abraham.han-eslint-skills-v1
- 服务器IP: 10.94.35.226
- 分配端口: 10224
- 内网地址: http://10.94.35.226:10224

---

## 测试方法

### 1. 浏览器访问测试

直接在浏览器中打开以下 URL：

**主页**:
```
https://abrahamhan_eslintskills.anker-launch.com/
```

**文档页面**:
- README: https://abrahamhan_eslintskills.anker-launch.com/README.md
- 使用指南: https://abrahamhan_eslintskills.anker-launch.com/USAGE.md
- Skill 定义: https://abrahamhan_eslintskills.anker-launch.com/skill.md

**配置文件**:
- package.json: https://abrahamhan_eslintskills.anker-launch.com/package.json
- ESLint 配置: https://abrahamhan_eslintskills.anker-launch.com/.eslintrc.json
- 扁平配置: https://abrahamhan_eslintskills.anker-launch.com/eslint.config.js

**示例文件**:
- example.js: https://abrahamhan_eslintskills.anker-launch.com/example.js
- example.css: https://abrahamhan_eslintskills.anker-launch.com/example.css

### 2. API 接口测试

#### 使用 curl 命令测试

**获取首页 HTML**:
```bash
curl https://abrahamhan_eslintskills.anker-launch.com/
```

**获取 README 内容（JSON 格式）**:
```bash
curl https://abrahamhan_eslintskills.anker-launch.com/api/readme
```

**获取 USAGE 内容（JSON 格式）**:
```bash
curl https://abrahamhan_eslintskills.anker-launch.com/api/usage
```

**查看响应头**:
```bash
curl -I https://abrahamhan_eslintskills.anker-launch.com/
```

**测试响应时间**:
```bash
curl -w "\nTime: %{time_total}s\n" -o /dev/null -s https://abrahamhan_eslintskills.anker-launch.com/
```

#### 使用 Python 测试

```python
import requests

# 测试首页
response = requests.get('https://abrahamhan_eslintskills.anker-launch.com/')
print(f"Status: {response.status_code}")
print(f"Content-Type: {response.headers['content-type']}")

# 测试 API
api_response = requests.get('https://abrahamhan_eslintskills.anker-launch.com/api/readme')
data = api_response.json()
print(f"README length: {len(data['content'])} characters")
```

#### 使用 JavaScript/Node.js 测试

```javascript
// 使用 fetch (Node.js 18+)
const response = await fetch('https://abrahamhan_eslintskills.anker-launch.com/api/readme');
const data = await response.json();
console.log('README content:', data.content.substring(0, 100));

// 或使用 axios
const axios = require('axios');
const result = await axios.get('https://abrahamhan_eslintskills.anker-launch.com/api/usage');
console.log('USAGE content:', result.data.content);
```

### 3. 性能测试

**使用 ab (Apache Bench)**:
```bash
ab -n 100 -c 10 https://abrahamhan_eslintskills.anker-launch.com/
```

**使用 wrk**:
```bash
wrk -t4 -c100 -d30s https://abrahamhan_eslintskills.anker-launch.com/
```

### 4. 健康检查

**检查服务是否在线**:
```bash
curl -f https://abrahamhan_eslintskills.anker-launch.com/ && echo "Service is UP" || echo "Service is DOWN"
```

**检查 API 可用性**:
```bash
curl -s https://abrahamhan_eslintskills.anker-launch.com/api/readme | grep -q "content" && echo "API works" || echo "API failed"
```

---

## 测试场景示例

### 场景 1: 完整功能测试

```bash
#!/bin/bash

BASE_URL="https://abrahamhan_eslintskills.anker-launch.com"

echo "Testing ESLint Skills Deployment..."

# Test homepage
echo -n "1. Homepage: "
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/
echo ""

# Test README API
echo -n "2. README API: "
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/readme
echo ""

# Test USAGE API
echo -n "3. USAGE API: "
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/usage
echo ""

# Test static files
echo -n "4. package.json: "
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/package.json
echo ""

echo -n "5. skill.md: "
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/skill.md
echo ""

echo "Testing complete!"
```

### 场景 2: 内容验证测试

```bash
# 验证 README 内容包含关键信息
curl -s https://abrahamhan_eslintskills.anker-launch.com/api/readme | \
  grep -q "ESLint Code Reviewer" && \
  echo "✓ README contains expected content" || \
  echo "✗ README content mismatch"

# 验证 API 返回 JSON 格式
curl -s https://abrahamhan_eslintskills.anker-launch.com/api/usage | \
  python3 -c "import sys, json; json.load(sys.stdin)" && \
  echo "✓ API returns valid JSON" || \
  echo "✗ API JSON format error"
```

---

## 故障排查

### 服务无法访问

1. **检查网络连接**:
   ```bash
   ping abrahamhan_eslintskills.anker-launch.com
   ```

2. **检查 DNS 解析**:
   ```bash
   nslookup abrahamhan_eslintskills.anker-launch.com
   ```

3. **检查容器状态**（需要服务器访问权限）:
   ```bash
   docker ps | grep abraham.han-eslint-skills-v1
   docker logs abraham.han-eslint-skills-v1
   ```

### API 返回错误

1. **查看详细错误信息**:
   ```bash
   curl -v https://abrahamhan_eslintskills.anker-launch.com/api/readme
   ```

2. **检查响应头**:
   ```bash
   curl -I https://abrahamhan_eslintskills.anker-launch.com/api/readme
   ```

### 性能问题

1. **测量响应时间**:
   ```bash
   time curl https://abrahamhan_eslintskills.anker-launch.com/
   ```

2. **检查服务器负载**（需要服务器访问权限）:
   ```bash
   docker stats abraham.han-eslint-skills-v1
   ```

---

## 集成测试

如果您想将此 skill 集成到您的项目中测试：

### 作为 Claude Code Skill 使用

1. 确保您的项目有 ESLint 配置文件
2. 确保有 git 仓库和变更文件
3. 在 Claude Code 中说：
   - "check code quality"
   - "run eslint"
   - "validate git changes"
   - "fix eslint errors"

### 本地下载测试

```bash
# 下载项目文件
mkdir eslint-skills-test
cd eslint-skills-test

# 下载关键文件
curl -O https://abrahamhan_eslintskills.anker-launch.com/validate-and-fix.js
curl -O https://abrahamhan_eslintskills.anker-launch.com/package.json
curl -O https://abrahamhan_eslintskills.anker-launch.com/.eslintrc.json

# 安装依赖
npm install

# 测试脚本
node validate-and-fix.js
```

---

## 监控建议

### 定期健康检查

设置 cron 任务定期检查服务状态：

```bash
*/5 * * * * curl -f https://abrahamhan_eslintskills.anker-launch.com/ > /dev/null 2>&1 || echo "Service down at $(date)" >> /var/log/eslint-skills-monitor.log
```

### 日志监控

如果有服务器访问权限，监控容器日志：

```bash
docker logs -f abraham.han-eslint-skills-v1
```

---

## 联系信息

- **部署用户**: mingzhi.xia
- **飞书用户ID**: ou_49ff9dab9cecf050af641a3712278561
- **部署平台**: Anker Launch
- **NGINX配置**: /etc/nginx/conf.d/abrahamhan_eslintskills_anker-launch_com.conf

---

## 更新记录

- **2025-12-25 03:14:48**: 初始部署成功
  - 版本: v1
  - Node.js: 20.19-alpine
  - Express: 4.18.2
