# 多语言校验扩展指南

## 🎯 概述

本指南说明如何扩展支持更多编程语言的代码校验，包括 Python、Java、Go、Rust 等。

## 🏗️ 架构设计

### 核心组件

1. **LanguageDetector** - 语言检测器（根据文件扩展名识别语言）
2. **MultiLanguageValidator** - 多语言验证器管理器
3. **语言特定验证器** - 每个语言的验证器实现
4. **语言特定执行器** - 每个语言的工具执行器
5. **语言特定解析器** - 每个语言的输出解析器

### 设计原则

- **高内聚**：每个语言验证器独立实现
- **低耦合**：通过接口和工厂模式解耦
- **可扩展**：添加新语言只需实现接口
- **可配置**：通过配置文件控制

---

## 📝 实现步骤

### 步骤 1: 创建执行器

为每种语言创建执行器，继承 `CommandExecutor`：

```javascript
// executors/PythonExecutor.js
class PythonExecutor extends CommandExecutor {
  buildCommand(files, options) {
    const tool = options.tool || 'pylint';
    // 构建命令
  }
}
```

### 步骤 2: 创建解析器

为每种语言创建解析器，继承 `OutputParser`：

```javascript
// parsers/PythonOutputParser.js
class PythonOutputParser extends OutputParser {
  parse(output) {
    // 解析工具输出
  }
}
```

### 步骤 3: 创建验证器

为每种语言创建验证器，继承 `Validator`：

```javascript
// core/PythonValidator.js
class PythonValidator extends Validator {
  checkPrerequisites() { /* ... */ }
  async validate(files, options) { /* ... */ }
  async fix(files, options) { /* ... */ }
}
```

### 步骤 4: 注册到工厂

在 `ValidatorFactory` 中注册：

```javascript
case 'python':
  return new PythonValidator(dependencies);
```

### 步骤 5: 更新配置

在 `defaultConfig.js` 中添加语言配置：

```javascript
languages: {
  python: {
    extensions: ['.py'],
    validator: 'python',
    tools: ['pylint', 'flake8'],
    defaultTool: 'pylint'
  }
}
```

---

## 🐍 Python 支持（已实现示例）

### 工具支持

- **pylint** - 代码质量检查
- **flake8** - 风格检查
- **black** - 代码格式化（支持自动修复）
- **mypy** - 类型检查

### 使用示例

```javascript
const validator = ValidatorFactory.create('python', {
  config: {
    defaultTool: 'pylint'
  }
});

const result = await validator.validate(['app.py', 'utils.py']);
```

---

## ☕ Java 支持（待实现）

### 需要创建的文件

1. `executors/JavaExecutor.js` - 执行 checkstyle/spotbugs/pmd
2. `parsers/JavaOutputParser.js` - 解析 Java linter 输出
3. `core/JavaValidator.js` - Java 验证器实现
4. `detectors/JavaConfigDetector.js` - 检测 Java 配置文件

### 工具支持

- **checkstyle** - 代码风格检查
- **spotbugs** - Bug 检测
- **pmd** - 代码质量分析

### 实现示例

```javascript
// executors/JavaExecutor.js
class JavaExecutor extends CommandExecutor {
  buildCommand(files, options = {}) {
    const tool = options.tool || 'checkstyle';
    if (tool === 'checkstyle') {
      return `java -jar checkstyle.jar -c checkstyle.xml ${files.join(' ')}`;
    }
    // ...
  }
}
```

---

## 🚀 Go 支持（待实现）

### 需要创建的文件

1. `executors/GoExecutor.js` - 执行 golangci-lint/gofmt/govet
2. `parsers/GoOutputParser.js` - 解析 Go linter 输出
3. `core/GoValidator.js` - Go 验证器实现
4. `detectors/GoConfigDetector.js` - 检测 Go 配置文件

### 工具支持

- **golangci-lint** - 综合 linter
- **gofmt** - 代码格式化
- **govet** - 静态分析

### 实现示例

```javascript
// executors/GoExecutor.js
class GoExecutor extends CommandExecutor {
  buildCommand(files, options = {}) {
    const tool = options.tool || 'golangci-lint';
    if (tool === 'golangci-lint') {
      return `golangci-lint run ${files.join(' ')}`;
    }
    // ...
  }
}
```

---

## 🦀 Rust 支持（待实现）

### 需要创建的文件

1. `executors/RustExecutor.js` - 执行 clippy/rustfmt
2. `parsers/RustOutputParser.js` - 解析 Rust linter 输出
3. `core/RustValidator.js` - Rust 验证器实现
4. `detectors/RustConfigDetector.js` - 检测 Rust 配置文件

### 工具支持

- **clippy** - Linter
- **rustfmt** - 代码格式化

### 实现示例

```javascript
// executors/RustExecutor.js
class RustExecutor extends CommandExecutor {
  buildCommand(files, options = {}) {
    const tool = options.tool || 'clippy';
    if (tool === 'clippy') {
      return `cargo clippy --message-format=json`;
    }
    // ...
  }
}
```

---

## 🔄 使用多语言验证器

### 方式 1: 自动语言检测（推荐）

```javascript
const LanguageDetector = require('./detectors/LanguageDetector');
const MultiLanguageValidator = require('./core/MultiLanguageValidator');

// 创建语言检测器
const languageDetector = new LanguageDetector(config.languages);

// 创建各语言验证器
const validators = {
  javascript: ValidatorFactory.create('eslint', {...}),
  python: ValidatorFactory.create('python', {...}),
  java: ValidatorFactory.create('java', {...})
};

// 创建多语言验证器
const validator = new MultiLanguageValidator({
  languageDetector,
  validators
});

// 自动识别语言并验证
const result = await validator.validate(files);
```

### 方式 2: 手动指定语言

```javascript
// 按语言分组
const groups = languageDetector.groupFilesByLanguage(files);

// 分别验证
const jsResult = await eslintValidator.validate(groups.javascript);
const pyResult = await pythonValidator.validate(groups.python);
```

---

## 📊 配置示例

### 完整配置

```json
{
  "validExtensions": [
    ".js", ".py", ".java", ".go", ".rs"
  ],
  "languages": {
    "python": {
      "extensions": [".py"],
      "validator": "python",
      "tools": ["pylint", "flake8"],
      "defaultTool": "pylint",
      "configFiles": [".pylintrc", "pyproject.toml"]
    },
    "java": {
      "extensions": [".java"],
      "validator": "java",
      "tools": ["checkstyle"],
      "defaultTool": "checkstyle",
      "configFiles": ["checkstyle.xml"]
    }
  }
}
```

---

## 🎨 扩展最佳实践

### 1. 统一接口

所有验证器必须实现 `Validator` 接口：
- `checkPrerequisites()` - 检查前置条件
- `validate(files, options)` - 验证文件
- `fix(files, options)` - 自动修复

### 2. 错误处理

```javascript
try {
  const result = await validator.validate(files);
} catch (error) {
  return {
    success: false,
    error: error.message
  };
}
```

### 3. 输出格式统一

所有解析器返回统一格式：

```javascript
{
  success: boolean,
  files: number,
  errors: number,
  warnings: number,
  fixable: number,
  messages: Array<{
    file: string,
    line: number,
    column: number,
    severity: 'error' | 'warning',
    message: string,
    rule: string
  }>
}
```

### 4. 配置外部化

所有配置项都应该可以通过外部配置文件覆盖。

---

## 🔍 已实现的模块

- ✅ `LanguageDetector` - 语言检测器
- ✅ `MultiLanguageValidator` - 多语言验证器管理器
- ✅ `PythonValidator` - Python 验证器
- ✅ `PythonExecutor` - Python 执行器
- ✅ `PythonOutputParser` - Python 输出解析器

---

## 📚 待实现的模块

- [ ] `JavaValidator` - Java 验证器
- [ ] `JavaExecutor` - Java 执行器
- [ ] `JavaOutputParser` - Java 输出解析器
- [ ] `GoValidator` - Go 验证器
- [ ] `GoExecutor` - Go 执行器
- [ ] `GoOutputParser` - Go 输出解析器
- [ ] `RustValidator` - Rust 验证器
- [ ] `RustExecutor` - Rust 执行器
- [ ] `RustOutputParser` - Rust 输出解析器

---

**按照这个设计，可以轻松扩展支持任何编程语言！** 🚀

