# 多语言校验扩展设计

## 🎯 设计目标

支持多种编程语言的代码校验，包括：
- Python (pylint, flake8, black, mypy)
- Java (checkstyle, spotbugs, pmd)
- Go (golangci-lint, gofmt, govet)
- Rust (clippy, rustfmt)
- 其他语言...

## 🏗️ 架构设计

### 核心思想

1. **语言检测器**：根据文件扩展名自动识别语言
2. **验证器路由**：将文件路由到对应的验证器
3. **统一接口**：所有验证器实现相同的接口
4. **配置驱动**：通过配置文件定义语言和工具映射

### 架构图

```
文件检测
    ↓
语言检测器 (LanguageDetector)
    ├─→ .py → PythonValidator
    ├─→ .java → JavaValidator
    ├─→ .go → GoValidator
    ├─→ .rs → RustValidator
    └─→ .js/.ts/.vue → ESLintValidator
    ↓
多语言验证器管理器 (MultiLanguageValidator)
    ├─→ 并行执行多个验证器
    └─→ 合并结果
    ↓
统一报告
```

---

## 📦 模块设计

### 1. 语言检测器 (LanguageDetector)

**职责**：根据文件扩展名识别编程语言

```javascript
class LanguageDetector {
  detectLanguage(file) {
    const ext = path.extname(file);
    return this.languageMap[ext] || null;
  }
  
  groupFilesByLanguage(files) {
    // 按语言分组文件
  }
}
```

### 2. 多语言验证器 (MultiLanguageValidator)

**职责**：管理多个验证器，并行执行

```javascript
class MultiLanguageValidator extends Validator {
  constructor(validators = {}) {
    this.validators = validators; // { python: PythonValidator, java: JavaValidator, ... }
  }
  
  async validate(files, options) {
    // 按语言分组
    // 并行执行各语言验证器
    // 合并结果
  }
}
```

### 3. 语言特定验证器

每个语言实现自己的验证器：

- `PythonValidator` - Python 验证
- `JavaValidator` - Java 验证
- `GoValidator` - Go 验证
- `RustValidator` - Rust 验证

---

## 🔧 实现方案

### 方案 1: 语言路由模式（推荐）

**优点**：
- 自动识别语言
- 支持混合语言项目
- 易于扩展

**实现**：

```javascript
// 1. 语言检测器
class LanguageDetector {
  constructor() {
    this.languageMap = {
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust',
      '.js': 'javascript',
      '.ts': 'typescript',
      '.vue': 'vue'
    };
  }
  
  detectLanguage(file) {
    return this.languageMap[path.extname(file)];
  }
  
  groupFilesByLanguage(files) {
    const groups = {};
    files.forEach(file => {
      const lang = this.detectLanguage(file);
      if (lang) {
        if (!groups[lang]) groups[lang] = [];
        groups[lang].push(file);
      }
    });
    return groups;
  }
}

// 2. 多语言验证器
class MultiLanguageValidator extends Validator {
  constructor(dependencies = {}) {
    super();
    this.languageDetector = dependencies.languageDetector || new LanguageDetector();
    this.validators = dependencies.validators || {};
  }
  
  async validate(files, options = {}) {
    // 按语言分组
    const groups = this.languageDetector.groupFilesByLanguage(files);
    
    // 并行执行各语言验证器
    const results = await Promise.all(
      Object.entries(groups).map(async ([lang, langFiles]) => {
        const validator = this.validators[lang];
        if (!validator) {
          return {
            language: lang,
            success: true,
            message: `No validator configured for ${lang}`,
            files: langFiles.length
          };
        }
        
        const result = await validator.validate(langFiles, options);
        return {
          language: lang,
          ...result
        };
      })
    );
    
    // 合并结果
    return this.mergeResults(results);
  }
  
  mergeResults(results) {
    // 合并所有语言的结果
  }
}
```

### 方案 2: 配置驱动模式

**优点**：
- 完全配置化
- 灵活配置每个语言

**实现**：

```javascript
// 配置文件
{
  "languages": {
    "python": {
      "extensions": [".py"],
      "validator": "python",
      "tools": ["pylint", "flake8"],
      "configFiles": [".pylintrc", "setup.cfg", "pyproject.toml"]
    },
    "java": {
      "extensions": [".java"],
      "validator": "java",
      "tools": ["checkstyle"],
      "configFiles": ["checkstyle.xml"]
    }
  }
}
```

---

## 🐍 Python 验证器示例

### PythonValidator 实现

```javascript
class PythonValidator extends Validator {
  constructor(dependencies = {}) {
    super();
    this.executor = dependencies.executor || new PythonExecutor();
    this.parser = dependencies.parser || new PythonOutputParser();
    this.configDetector = dependencies.configDetector || new PythonConfigDetector();
  }
  
  checkPrerequisites() {
    // 检查 Python 是否安装
    // 检查 pylint/flake8 是否安装
    // 检查配置文件
  }
  
  async validate(files, options = {}) {
    // 执行 pylint 或 flake8
    const result = await this.executor.run(files, options);
    return this.parser.parse(result.output);
  }
}

class PythonExecutor extends CommandExecutor {
  buildCommand(files, options = {}) {
    const tool = options.tool || 'pylint'; // pylint, flake8, black, mypy
    const parts = [tool];
    
    if (tool === 'pylint') {
      parts.push('--output-format=text');
    }
    
    files.forEach(file => parts.push(`"${file}"`));
    return parts.join(' ');
  }
}
```

---

## ☕ Java 验证器示例

### JavaValidator 实现

```javascript
class JavaValidator extends Validator {
  constructor(dependencies = {}) {
    super();
    this.executor = dependencies.executor || new JavaExecutor();
    this.parser = dependencies.parser || new JavaOutputParser();
    this.configDetector = dependencies.configDetector || new JavaConfigDetector();
  }
  
  checkPrerequisites() {
    // 检查 Java 是否安装
    // 检查 checkstyle/spotbugs 是否安装
    // 检查配置文件
  }
  
  async validate(files, options = {}) {
    const result = await this.executor.run(files, options);
    return this.parser.parse(result.output);
  }
}

class JavaExecutor extends CommandExecutor {
  buildCommand(files, options = {}) {
    const tool = options.tool || 'checkstyle'; // checkstyle, spotbugs, pmd
    const parts = ['java', '-jar', tool];
    
    if (tool === 'checkstyle') {
      parts.push('-c', 'checkstyle.xml');
    }
    
    files.forEach(file => parts.push(`"${file}"`));
    return parts.join(' ');
  }
}
```

---

## 🚀 Go 验证器示例

### GoValidator 实现

```javascript
class GoValidator extends Validator {
  constructor(dependencies = {}) {
    super();
    this.executor = dependencies.executor || new GoExecutor();
    this.parser = dependencies.parser || new GoOutputParser();
    this.configDetector = dependencies.configDetector || new GoConfigDetector();
  }
  
  checkPrerequisites() {
    // 检查 Go 是否安装
    // 检查 golangci-lint 是否安装
    // 检查配置文件
  }
  
  async validate(files, options = {}) {
    const result = await this.executor.run(files, options);
    return this.parser.parse(result.output);
  }
}

class GoExecutor extends CommandExecutor {
  buildCommand(files, options = {}) {
    const tool = options.tool || 'golangci-lint'; // golangci-lint, gofmt, govet
    const parts = [tool, 'run'];
    
    files.forEach(file => parts.push(`"${file}"`));
    return parts.join(' ');
  }
}
```

---

## 🦀 Rust 验证器示例

### RustValidator 实现

```javascript
class RustValidator extends Validator {
  constructor(dependencies = {}) {
    super();
    this.executor = dependencies.executor || new RustExecutor();
    this.parser = dependencies.parser || new RustOutputParser();
    this.configDetector = dependencies.configDetector || new RustConfigDetector();
  }
  
  checkPrerequisites() {
    // 检查 Rust 是否安装
    // 检查 clippy 是否安装
    // 检查配置文件
  }
  
  async validate(files, options = {}) {
    const result = await this.executor.run(files, options);
    return this.parser.parse(result.output);
  }
}

class RustExecutor extends CommandExecutor {
  buildCommand(files, options = {}) {
    const tool = options.tool || 'clippy'; // clippy, rustfmt
    const parts = ['cargo', tool];
    
    if (tool === 'clippy') {
      parts.push('--message-format=json');
    }
    
    return parts.join(' ');
  }
}
```

---

## ⚙️ 配置扩展

### 更新 defaultConfig.js

```javascript
module.exports = {
  // 支持的文件扩展名（所有语言）
  validExtensions: [
    // JavaScript/TypeScript
    '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.vue',
    // Python
    '.py', '.pyw',
    // Java
    '.java',
    // Go
    '.go',
    // Rust
    '.rs'
  ],
  
  // 语言配置
  languages: {
    python: {
      extensions: ['.py', '.pyw'],
      tools: ['pylint', 'flake8', 'black', 'mypy'],
      defaultTool: 'pylint',
      configFiles: ['.pylintrc', 'setup.cfg', 'pyproject.toml', '.flake8']
    },
    java: {
      extensions: ['.java'],
      tools: ['checkstyle', 'spotbugs', 'pmd'],
      defaultTool: 'checkstyle',
      configFiles: ['checkstyle.xml', 'spotbugs.xml', 'pmd.xml']
    },
    go: {
      extensions: ['.go'],
      tools: ['golangci-lint', 'gofmt', 'govet'],
      defaultTool: 'golangci-lint',
      configFiles: ['.golangci.yml', '.golangci.yaml', '.golangci.json', '.golangci.toml']
    },
    rust: {
      extensions: ['.rs'],
      tools: ['clippy', 'rustfmt'],
      defaultTool: 'clippy',
      configFiles: ['Cargo.toml', 'rustfmt.toml', '.clippy.toml']
    }
  }
};
```

---

## 🔄 主入口改造

### validate-and-fix-v2.js 更新

```javascript
class ESLintSkill {
  constructor(options = {}) {
    this.config = ConfigLoader.load(options.configPath);
    
    // 创建语言检测器
    this.languageDetector = new LanguageDetector(this.config.languages);
    
    // 创建各语言验证器
    this.validators = this.createValidators();
    
    // 创建多语言验证器
    this.validator = new MultiLanguageValidator({
      languageDetector: this.languageDetector,
      validators: this.validators
    });
    
    // ... 其他初始化
  }
  
  createValidators() {
    const validators = {};
    
    // ESLint (JavaScript/TypeScript)
    if (this.config.languages?.javascript) {
      validators.javascript = ValidatorFactory.create('eslint', {
        config: this.config.eslint || {},
        commandRunner: this.commandRunner
      });
    }
    
    // Python
    if (this.config.languages?.python) {
      validators.python = ValidatorFactory.create('python', {
        config: this.config.languages.python,
        commandRunner: this.commandRunner
      });
    }
    
    // Java
    if (this.config.languages?.java) {
      validators.java = ValidatorFactory.create('java', {
        config: this.config.languages.java,
        commandRunner: this.commandRunner
      });
    }
    
    // Go
    if (this.config.languages?.go) {
      validators.go = ValidatorFactory.create('go', {
        config: this.config.languages.go,
        commandRunner: this.commandRunner
      });
    }
    
    // Rust
    if (this.config.languages?.rust) {
      validators.rust = ValidatorFactory.create('rust', {
        config: this.config.languages.rust,
        commandRunner: this.commandRunner
      });
    }
    
    return validators;
  }
}
```

---

## 📝 扩展步骤

### 添加新语言的步骤

1. **创建验证器类**
   ```javascript
   class NewLanguageValidator extends Validator {
     // 实现接口
   }
   ```

2. **创建执行器**
   ```javascript
   class NewLanguageExecutor extends CommandExecutor {
     // 实现命令构建
   }
   ```

3. **创建解析器**
   ```javascript
   class NewLanguageOutputParser extends OutputParser {
     // 实现输出解析
   }
   ```

4. **创建配置检测器**
   ```javascript
   class NewLanguageConfigDetector {
     // 检测配置文件
   }
   ```

5. **注册到工厂**
   ```javascript
   ValidatorFactory.register('newlanguage', NewLanguageValidator);
   ```

6. **更新配置**
   ```javascript
   // defaultConfig.js
   languages: {
     newlanguage: {
       extensions: ['.ext'],
       tools: ['tool1', 'tool2'],
       defaultTool: 'tool1',
       configFiles: ['config.file']
     }
   }
   ```

---

## 🎨 设计优势

1. **高内聚**：每个语言验证器独立实现
2. **低耦合**：通过接口和工厂模式解耦
3. **可扩展**：添加新语言只需实现接口
4. **可配置**：通过配置文件控制
5. **并行执行**：支持多语言并行验证

---

## 📊 使用示例

### 混合语言项目

```javascript
// 项目包含多种语言文件
const files = [
  'src/app.js',        // JavaScript
  'src/utils.py',      // Python
  'src/Main.java',     // Java
  'src/main.go',       // Go
  'src/lib.rs'         // Rust
];

// 自动识别并验证
const result = await multiLanguageValidator.validate(files);

// 结果
{
  success: false,
  languages: {
    javascript: { errors: 2, warnings: 1 },
    python: { errors: 0, warnings: 0 },
    java: { errors: 1, warnings: 0 },
    go: { errors: 0, warnings: 0 },
    rust: { errors: 0, warnings: 0 }
  },
  totalErrors: 3,
  totalWarnings: 1
}
```

---

这个设计保持了高内聚低耦合的原则，易于扩展新语言支持！

