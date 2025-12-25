# 多语言校验使用示例

## 🎯 快速开始

### 使用多语言版本

```bash
# 基本使用（自动识别语言）
node skills/eslint-reviewer/scripts/validate-and-fix-multilang.js

# 自动修复
node skills/eslint-reviewer/scripts/validate-and-fix-multilang.js --fix
```

---

## 📝 配置示例

### 启用 Python 支持

在项目根目录创建 `.eslint-skills-config.json`：

```json
{
  "languages": {
    "python": {
      "extensions": [".py"],
      "validator": "python",
      "tools": ["pylint", "flake8"],
      "defaultTool": "pylint",
      "configFiles": [".pylintrc", "pyproject.toml"]
    }
  }
}
```

### 启用多语言支持

```json
{
  "validExtensions": [
    ".js", ".ts", ".vue",
    ".py",
    ".java",
    ".go",
    ".rs"
  ],
  "languages": {
    "javascript": {
      "extensions": [".js", ".jsx"],
      "validator": "eslint",
      "defaultTool": "eslint"
    },
    "python": {
      "extensions": [".py"],
      "validator": "python",
      "defaultTool": "pylint"
    },
    "java": {
      "extensions": [".java"],
      "validator": "java",
      "defaultTool": "checkstyle"
    },
    "go": {
      "extensions": [".go"],
      "validator": "go",
      "defaultTool": "golangci-lint"
    },
    "rust": {
      "extensions": [".rs"],
      "validator": "rust",
      "defaultTool": "clippy"
    }
  }
}
```

---

## 🐍 Python 使用示例

### 前置条件

```bash
# 安装 Python linter
pip install pylint flake8 black mypy
```

### 验证 Python 文件

```bash
# 使用默认工具 (pylint)
node validate-and-fix-multilang.js

# 指定工具
# 需要在代码中传递 tool 选项
```

### Python 工具对比

| 工具 | 用途 | 支持修复 |
|------|------|---------|
| pylint | 代码质量检查 | ❌ |
| flake8 | 风格检查 | ❌ |
| black | 代码格式化 | ✅ |
| mypy | 类型检查 | ❌ |

---

## ☕ Java 使用示例

### 前置条件

```bash
# 安装 checkstyle
# 下载 checkstyle.jar
wget https://github.com/checkstyle/checkstyle/releases/download/checkstyle-X.X.X/checkstyle-X.X.X-all.jar

# 或使用 Maven/Gradle
mvn dependency:get -Dartifact=com.puppycrawl.tools:checkstyle:X.X.X
```

### 配置 checkstyle.xml

```xml
<?xml version="1.0"?>
<!DOCTYPE module PUBLIC
  "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
  "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
  <module name="TreeWalker">
    <module name="IllegalImport"/>
    <module name="RedundantImport"/>
  </module>
</module>
```

---

## 🚀 Go 使用示例

### 前置条件

```bash
# 安装 golangci-lint
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# 或使用 Homebrew (macOS)
brew install golangci-lint
```

### 配置 .golangci.yml

```yaml
linters:
  enable:
    - errcheck
    - gosimple
    - govet
    - ineffassign
    - staticcheck
    - unused

linters-settings:
  errcheck:
    check-type-assertions: true
```

---

## 🦀 Rust 使用示例

### 前置条件

```bash
# Rust 工具通常随 Rust 安装
# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# clippy 和 rustfmt 通常已包含
```

### 配置 Cargo.toml

```toml
[package]
name = "my-project"

[dependencies]

[lints.clippy]
# Clippy 配置
```

---

## 🔧 扩展新语言

### 示例：添加 PHP 支持

#### 1. 创建 PHP 执行器

```javascript
// executors/PHPExecutor.js
class PHPExecutor extends CommandExecutor {
  buildCommand(files, options = {}) {
    const tool = options.tool || 'phpcs'; // phpcs, phpmd, phpstan
    return `${tool} ${files.join(' ')}`;
  }
}
```

#### 2. 创建 PHP 解析器

```javascript
// parsers/PHPOutputParser.js
class PHPOutputParser extends OutputParser {
  parse(output) {
    // 解析 phpcs/phpmd 输出
  }
}
```

#### 3. 创建 PHP 验证器

```javascript
// core/PHPValidator.js
class PHPValidator extends Validator {
  // 实现接口
}
```

#### 4. 注册到工厂

```javascript
// ValidatorFactory.js
case 'php':
  return new PHPValidator(dependencies);
```

#### 5. 更新配置

```javascript
// defaultConfig.js
languages: {
  php: {
    extensions: ['.php'],
    validator: 'php',
    tools: ['phpcs', 'phpmd'],
    defaultTool: 'phpcs'
  }
}
```

---

## 📊 混合语言项目示例

### 项目结构

```
my-project/
├── frontend/
│   ├── src/
│   │   ├── app.js        # JavaScript
│   │   └── app.vue       # Vue
│   └── package.json
├── backend/
│   ├── api/
│   │   └── main.py       # Python
│   └── services/
│       └── User.java     # Java
└── tools/
    ├── cli.go            # Go
    └── parser.rs         # Rust
```

### 执行验证

```bash
node validate-and-fix-multilang.js
```

**输出示例**：

```
🔍 Multi-Language Code Validator

📂 Detecting changed files...

📝 Found 5 changed file(s) in 4 language(s):
   javascript: 1 file(s)
      - frontend/src/app.js
   vue: 1 file(s)
      - frontend/src/app.vue
   python: 1 file(s)
      - backend/api/main.py
   java: 1 file(s)
      - backend/services/User.java
   go: 1 file(s)
      - tools/cli.go

🔎 Running validation...

[javascript]
/Users/anker/my-project/frontend/src/app.js
  12:15  error    'foo' is not defined  no-undef

[python]
/Users/anker/my-project/backend/api/main.py
  8:1    error    Line too long (120/100)  C0301

[java]
/Users/anker/my-project/backend/services/User.java
  15:3   error    Missing a Javadoc comment  MissingJavadocMethod

[go]
/Users/anker/my-project/tools/cli.go
  10:5   error    Error return value is not checked  errcheck

📊 Results by language:
   ❌ javascript: 1 errors, 0 warnings
   ✅ vue: 0 errors, 0 warnings
   ❌ python: 1 errors, 0 warnings
   ❌ java: 1 errors, 0 warnings
   ❌ go: 1 errors, 0 warnings

Total: 4 errors, 0 warnings
```

---

## 🎨 设计优势

### 1. 自动语言识别

无需手动指定语言，系统自动根据文件扩展名识别。

### 2. 并行执行

不同语言的验证器可以并行执行，提高效率。

### 3. 统一接口

所有语言使用相同的接口，结果格式统一。

### 4. 易于扩展

添加新语言只需实现三个类：
- Executor（执行器）
- Parser（解析器）
- Validator（验证器）

### 5. 配置驱动

通过配置文件控制支持的语言和工具。

---

## 💡 最佳实践

### 1. 工具选择

- **代码质量**：pylint, checkstyle, golangci-lint, clippy
- **代码风格**：black, gofmt, rustfmt
- **类型检查**：mypy, phpstan

### 2. 配置管理

- 将配置文件提交到版本控制
- 使用项目级配置（`.eslint-skills-config.json`）
- 为不同环境使用不同配置

### 3. 性能优化

- 只检查变更的文件
- 并行执行多个验证器
- 缓存验证结果

---

**按照这个设计，可以轻松支持任何编程语言！** 🚀

