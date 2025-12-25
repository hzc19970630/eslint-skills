# 多语言支持快速参考

## 🎯 支持的语言

| 语言 | 验证器 | 支持的工具 | 自动修复 |
|------|--------|-----------|---------|
| JavaScript/TypeScript/Vue | ESLint | eslint | ✅ |
| Python | PythonValidator | pylint, flake8, black, mypy | ✅ (black) |
| Java | JavaValidator | checkstyle, spotbugs, pmd | ❌ |
| Go | GoValidator | golangci-lint, gofmt, govet | ✅ (gofmt) |
| Rust | RustValidator | clippy, rustfmt | ✅ (rustfmt) |

---

## 📁 文件结构

```
skills/eslint-reviewer/scripts/
├── core/
│   ├── Validator.js              # 抽象基类
│   ├── ValidatorFactory.js       # 工厂（已注册所有语言）
│   ├── MultiLanguageValidator.js # 多语言管理器
│   ├── ESLintValidator.js        # JavaScript/TS/Vue
│   ├── PythonValidator.js        # Python
│   ├── JavaValidator.js          # Java
│   ├── GoValidator.js            # Go
│   └── RustValidator.js          # Rust
├── executors/
│   ├── ESLintExecutor.js
│   ├── PythonExecutor.js
│   ├── JavaExecutor.js
│   ├── GoExecutor.js
│   └── RustExecutor.js
├── parsers/
│   ├── ESLintOutputParser.js
│   ├── PythonOutputParser.js
│   ├── JavaOutputParser.js
│   ├── GoOutputParser.js
│   └── RustOutputParser.js
├── detectors/
│   └── LanguageDetector.js       # 语言检测
├── validate-and-fix-v2.js        # 单语言版本
└── validate-and-fix-multilang.js # 多语言版本
```

---

## 🚀 快速开始

### 1. 单语言（JavaScript/TypeScript/Vue）
```bash
node skills/eslint-reviewer/scripts/validate-and-fix-v2.js
```

### 2. 多语言（自动检测）
```bash
node skills/eslint-reviewer/scripts/validate-and-fix-multilang.js
```

### 3. 自动修复
```bash
node skills/eslint-reviewer/scripts/validate-and-fix-multilang.js --fix
```

---

## 🔧 前置条件

### JavaScript/TypeScript/Vue
- Node.js
- ESLint

### Python
- Python 3.6+
- 安装 linter: `pip install pylint flake8 black mypy`

### Java
- Java JDK 8+
- 安装 linter（选择其一）:
  - Checkstyle: 下载 jar 或使用 Maven/Gradle
  - Spotbugs: `mvn dependency:get -Dartifact=com.github.spotbugs:spotbugs:X.X.X`
  - PMD: `mvn dependency:get -Dartifact=net.sourceforge.pmd:pmd:X.X.X`

### Go
- Go 1.16+
- 安装 linter: `go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest`

### Rust
- Rust/Cargo
- 安装工具: `rustup component add clippy rustfmt`

---

## 📝 配置示例

### 最小配置
```json
{
  "languages": {
    "python": {
      "extensions": [".py"],
      "validator": "python",
      "defaultTool": "pylint"
    }
  }
}
```

### 完整配置
见 `MULTI_LANGUAGE_EXAMPLES.md`

---

## 🎨 设计模式

### 1. 策略模式
- 每个语言使用不同的验证策略
- 通过 `Validator` 接口统一

### 2. 工厂模式
- `ValidatorFactory` 创建验证器实例
- 支持注册自定义验证器

### 3. 组合模式
- `MultiLanguageValidator` 组合多个验证器
- `CompositeFilter` 组合多个过滤器

### 4. 依赖注入
- 所有依赖通过构造函数注入
- 易于测试和替换

---

## 🔍 扩展新语言

### 步骤
1. 创建 `executors/XxxExecutor.js`
2. 创建 `parsers/XxxOutputParser.js`
3. 创建 `core/XxxValidator.js`
4. 在 `ValidatorFactory.js` 中注册
5. 更新 `defaultConfig.js`

### 示例代码
见 `MULTI_LANGUAGE_GUIDE.md`

---

## 📊 输出格式

### 成功
```
✅ All files passed validation!
```

### 失败
```
❌ Validation found issues

📊 Results by language:
   ✅ javascript: 0 errors, 0 warnings
   ❌ python: 2 errors, 1 warnings
   ✅ go: 0 errors, 0 warnings

Total: 2 errors, 1 warnings
```

---

## 💡 常见问题

### Q: 如何只检查特定语言？
A: 在配置中只启用需要的语言，或使用单语言版本。

### Q: 如何添加自定义 linter？
A: 扩展对应的 Executor 和 Parser，或创建新的验证器。

### Q: 支持哪些输出格式？
A: 目前支持各工具的标准输出，未来可扩展 JSON 格式。

### Q: 如何调试？
A: 使用 `--verbose` 参数查看详细信息。

---

## 📚 相关文档

- `MULTI_LANGUAGE_DESIGN.md` - 架构设计
- `MULTI_LANGUAGE_GUIDE.md` - 扩展指南
- `MULTI_LANGUAGE_EXAMPLES.md` - 使用示例
- `MULTI_LANGUAGE_IMPLEMENTATION.md` - 实现总结

---

**所有语言支持已完整实现！** 🎉

