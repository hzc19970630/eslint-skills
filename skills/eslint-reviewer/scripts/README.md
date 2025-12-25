# Scripts 文件夹说明

## 📁 目录结构

```
scripts/
├── validate-and-fix.js          # v1 版本（旧版，单文件实现）
├── validate-and-fix-v2.js      # v2 版本（新版，模块化实现）⭐ 主入口
│
├── core/                        # 核心模块
│   ├── Validator.js            # 验证器接口（抽象基类）
│   ├── ESLintValidator.js      # ESLint 验证器实现
│   └── ValidatorFactory.js     # 验证器工厂（创建验证器实例）
│
├── detectors/                   # 检测器模块
│   ├── FileDetector.js         # 文件检测器接口
│   ├── GitFileDetector.js      # Git 文件检测器（检测 Git 变更文件）
│   └── ConfigDetector.js       # ESLint 配置检测器（检测配置文件）
│
├── filters/                     # 过滤器模块
│   ├── FileFilter.js            # 文件过滤器接口
│   ├── ExtensionFilter.js      # 扩展名过滤器（按文件扩展名过滤）
│   ├── ConfigFileFilter.js     # 配置文件过滤器（排除配置文件）
│   └── CompositeFilter.js      # 组合过滤器（组合多个过滤器）
│
├── executors/                   # 执行器模块
│   ├── CommandExecutor.js      # 命令执行器接口
│   └── ESLintExecutor.js       # ESLint 执行器（执行 ESLint 命令）
│
├── parsers/                     # 解析器模块
│   ├── OutputParser.js          # 输出解析器接口
│   └── ESLintOutputParser.js   # ESLint 输出解析器（解析 ESLint 输出）
│
├── reporters/                   # 报告器模块
│   ├── Reporter.js              # 报告器接口
│   └── ConsoleReporter.js      # 控制台报告器（输出到控制台）
│
├── config/                      # 配置模块
│   ├── defaultConfig.js         # 默认配置（支持的扩展名、配置文件列表等）
│   └── ConfigLoader.js         # 配置加载器（加载和合并配置）
│
├── utils/                       # 工具模块
│   ├── CommandRunner.js         # 命令运行器（执行 shell 命令）
│   └── Logger.js                # 日志工具（统一日志输出）
│
└── [配置文件示例]               # ESLint 配置示例文件
    ├── .eslintrc.json           # ESLint 传统配置示例
    ├── .eslintrc.vue.json       # Vue 项目配置示例
    ├── eslint.config.js         # ESLint 扁平配置示例
    ├── eslint.config.vue.js     # Vue 项目扁平配置示例
    ├── example.js               # JavaScript 示例文件
    └── example.css              # CSS 示例文件
```

---

## 📄 文件详细说明

### 🚀 主入口文件

#### `validate-and-fix-v2.js` ⭐
**作用**：重构后的主程序入口，使用模块化设计

**功能**：
- 初始化所有模块（验证器、检测器、过滤器、报告器）
- 协调整个验证流程
- 处理命令行参数
- 输出最终结果

**使用方式**：
```bash
node validate-and-fix-v2.js [--fix] [--verbose] [--silent] [--config path]
```

---

### 🎯 核心模块 (core/)

#### `Validator.js`
**作用**：验证器接口（抽象基类）

**定义的方法**：
- `validate(files, options)` - 验证文件
- `fix(files, options)` - 自动修复
- `checkPrerequisites()` - 检查前置条件

**用途**：定义所有验证器必须实现的接口

---

#### `ESLintValidator.js`
**作用**：ESLint 验证器的具体实现

**功能**：
- 检查前置条件（Git 仓库、ESLint 安装、配置文件）
- 调用 ESLintExecutor 执行验证
- 使用 ESLintOutputParser 解析结果
- 返回结构化的验证结果

**依赖**：
- `ESLintExecutor` - 执行 ESLint 命令
- `ESLintOutputParser` - 解析输出
- `ConfigDetector` - 检测配置

---

#### `ValidatorFactory.js`
**作用**：验证器工厂，创建不同类型的验证器

**功能**：
- 根据类型创建验证器实例（目前支持 'eslint'）
- 支持注册自定义验证器
- 统一创建接口

**使用示例**：
```javascript
const validator = ValidatorFactory.create('eslint', dependencies);
```

---

### 🔍 检测器模块 (detectors/)

#### `FileDetector.js`
**作用**：文件检测器接口

**定义的方法**：
- `detect(options)` - 检测文件

**用途**：定义文件检测的标准接口

---

#### `GitFileDetector.js`
**作用**：从 Git 仓库检测变更的文件

**功能**：
- 检测未暂存的文件（`git diff --name-only`）
- 检测已暂存的文件（`git diff --cached --name-only`）
- 检测未跟踪的文件（`git ls-files --others --exclude-standard`）
- 合并去重
- 验证文件是否存在

**返回**：文件路径数组

---

#### `ConfigDetector.js`
**作用**：检测项目中是否存在 ESLint 配置文件

**功能**：
- 检查各种 ESLint 配置文件格式（.eslintrc.*, eslint.config.js）
- 检查 package.json 中的 eslintConfig 字段
- 返回配置文件路径

**支持的配置格式**：
- `.eslintrc.js`, `.eslintrc.json`, `.eslintrc.yml`
- `eslint.config.js`, `eslint.config.mjs`, `eslint.config.cjs`
- `package.json` 中的 `eslintConfig`

---

### 🔧 过滤器模块 (filters/)

#### `FileFilter.js`
**作用**：文件过滤器接口

**定义的方法**：
- `filter(files)` - 过滤文件列表

**用途**：定义过滤器的标准接口

---

#### `ExtensionFilter.js`
**作用**：根据文件扩展名过滤文件

**功能**：
- 只保留指定扩展名的文件
- 支持动态添加/移除扩展名
- 自动处理扩展名格式（自动添加点号）

**使用示例**：
```javascript
const filter = new ExtensionFilter(['.js', '.vue', '.ts']);
const filtered = filter.filter(['app.js', 'app.vue', 'app.py']);
// 返回: ['app.js', 'app.vue']
```

---

#### `ConfigFileFilter.js`
**作用**：过滤掉 ESLint 配置文件

**功能**：
- 排除 `.eslintrc.*` 文件
- 排除 `eslint.config.*` 文件
- 防止配置文件被检查

**原因**：配置文件不应该被 ESLint 检查

---

#### `CompositeFilter.js`
**作用**：组合多个过滤器，按顺序应用

**功能**：
- 组合多个过滤器形成过滤链
- 支持动态添加/移除过滤器
- 按顺序应用所有过滤器

**使用示例**：
```javascript
const composite = new CompositeFilter()
  .addFilter(new ExtensionFilter(['.js', '.vue']))
  .addFilter(new ConfigFileFilter());
const result = composite.filter(files);
```

---

### ⚙️ 执行器模块 (executors/)

#### `CommandExecutor.js`
**作用**：命令执行器接口

**定义的方法**：
- `run(files, options)` - 执行命令

**用途**：定义命令执行的标准接口

---

#### `ESLintExecutor.js`
**作用**：执行 ESLint 命令

**功能**：
- 构建 ESLint 命令（`npx eslint [options] [files]`）
- 执行命令并捕获输出
- 处理错误情况
- 返回执行结果（success, output, exitCode）

**支持选项**：
- `fix` - 自动修复
- `format` - 输出格式（stylish, json, etc.）

---

### 📊 解析器模块 (parsers/)

#### `OutputParser.js`
**作用**：输出解析器接口

**定义的方法**：
- `parse(output)` - 解析输出

**用途**：定义解析器的标准接口

---

#### `ESLintOutputParser.js`
**作用**：解析 ESLint 的输出

**功能**：
- 解析错误和警告数量
- 解析可修复的问题数量
- 解析详细的错误信息（文件、行号、列号、规则）
- 返回结构化的结果对象

**解析的信息**：
- 文件数量
- 错误数量
- 警告数量
- 可修复数量
- 详细消息列表

---

### 📢 报告器模块 (reporters/)

#### `Reporter.js`
**作用**：报告器接口

**定义的方法**：
- `report(result)` - 报告结果
- `reportError(error)` - 报告错误
- `reportInfo(message)` - 报告信息

**用途**：定义报告器的标准接口

---

#### `ConsoleReporter.js`
**作用**：将结果输出到控制台

**功能**：
- 格式化输出验证结果
- 显示错误和警告统计
- 显示可修复提示
- 使用颜色和图标美化输出

---

### ⚙️ 配置模块 (config/)

#### `defaultConfig.js`
**作用**：默认配置

**包含的配置**：
- `validExtensions` - 支持的文件扩展名
- `eslintConfigFiles` - ESLint 配置文件列表
- `excludePatterns` - 排除的文件模式
- `reporters` - 报告器配置
- `eslint` - ESLint 执行配置

---

#### `ConfigLoader.js`
**作用**：加载和合并配置

**功能**：
- 从外部文件加载配置（`.eslint-skills-config.json`）
- 与默认配置合并
- 提供配置回退机制

**加载顺序**：
1. 用户指定的配置文件
2. 项目根目录的 `.eslint-skills-config.json`
3. 默认配置

---

### 🛠️ 工具模块 (utils/)

#### `CommandRunner.js`
**作用**：命令运行器抽象

**功能**：
- 执行 shell 命令
- 处理命令输出
- 错误处理
- 检查命令是否可用

**优势**：抽象命令执行，便于测试和扩展

---

#### `Logger.js`
**作用**：日志工具抽象

**功能**：
- 统一日志输出接口
- 支持不同日志级别（log, error, warn, info, debug）
- 支持颜色输出
- 支持静默模式
- 支持详细模式

**方法**：
- `log()` - 普通日志
- `error()` - 错误日志（红色）
- `success()` - 成功日志（绿色）
- `warn()` - 警告日志（黄色）
- `info()` - 信息日志（蓝色）
- `debug()` - 调试日志（仅在 verbose 模式）

---

## 🔄 Skills 执行顺序

### 完整执行流程

```
1. 初始化阶段
   ├── 加载配置 (ConfigLoader.load)
   ├── 创建工具实例 (Logger, CommandRunner)
   ├── 创建验证器 (ValidatorFactory.create)
   ├── 创建文件检测器 (GitFileDetector)
   ├── 创建文件过滤器 (CompositeFilter + ExtensionFilter + ConfigFileFilter)
   └── 创建报告器 (ConsoleReporter)

2. 前置条件检查
   ├── 检查 Git 仓库 (GitFileDetector.isGitRepo)
   ├── 检查 ESLint 安装 (ESLintExecutor.isAvailable)
   └── 检查 ESLint 配置 (ConfigDetector.hasConfig)

3. 文件检测阶段
   ├── 检测未暂存文件 (git diff --name-only)
   ├── 检测已暂存文件 (git diff --cached --name-only)
   ├── 检测未跟踪文件 (git ls-files --others)
   └── 合并去重

4. 文件过滤阶段
   ├── 扩展名过滤 (ExtensionFilter) - 只保留 .js, .vue, .ts 等
   └── 配置文件过滤 (ConfigFileFilter) - 排除 .eslintrc.js 等

5. 验证执行阶段
   ├── 构建 ESLint 命令 (ESLintExecutor.buildCommand)
   ├── 执行命令 (CommandRunner.exec)
   └── 捕获输出

6. 结果解析阶段
   ├── 解析输出 (ESLintOutputParser.parse)
   ├── 提取错误和警告数量
   ├── 提取可修复数量
   └── 提取详细消息

7. 结果报告阶段
   ├── 输出原始 ESLint 输出
   ├── 报告统计信息
   └── 显示修复提示

8. 退出
   └── 根据结果设置退出码 (0 = 成功, 1 = 失败)
```

---

## 📊 执行流程图

```
用户执行命令
    ↓
validate-and-fix-v2.js (主入口)
    ↓
ESLintSkill 初始化
    ├── ConfigLoader.load() ──────────┐
    ├── Logger()                      │
    ├── CommandRunner()               │
    ├── ValidatorFactory.create() ────┤
    │   └── ESLintValidator           │
    │       ├── ESLintExecutor         │
    │       ├── ESLintOutputParser     │
    │       └── ConfigDetector         │
    ├── GitFileDetector()             │
    ├── CompositeFilter()              │
    │   ├── ExtensionFilter()         │
    │   └── ConfigFileFilter()         │
    └── ConsoleReporter()             │
        └── Logger                    │
    ↓
skill.run()
    ↓
1. 前置条件检查
    ├── validator.checkPrerequisites()
    │   ├── GitFileDetector.isGitRepo()
    │   ├── ESLintExecutor.isAvailable()
    │   └── ConfigDetector.hasConfig()
    ↓
2. 文件检测
    ├── fileDetector.detect()
    │   ├── getUnstagedFiles()
    │   ├── getStagedFiles()
    │   └── getUntrackedFiles()
    ↓
3. 文件过滤
    ├── fileFilter.filter()
    │   ├── ExtensionFilter.filter()
    │   └── ConfigFileFilter.filter()
    ↓
4. 执行验证
    ├── validator.validate() 或 validator.fix()
    │   ├── ESLintExecutor.run()
    │   │   └── CommandRunner.exec()
    │   └── ESLintOutputParser.parse()
    ↓
5. 报告结果
    ├── reporter.report()
    │   └── Logger.log/error/success()
    ↓
退出 (process.exit)
```

---

## 🎯 关键模块交互

### 验证器创建流程

```
ValidatorFactory.create('eslint')
    ↓
new ESLintValidator({
    executor: ESLintExecutor,
    parser: ESLintOutputParser,
    configDetector: ConfigDetector
})
```

### 文件处理流程

```
GitFileDetector.detect()
    ↓
返回: ['file1.js', 'file2.vue', 'config.json']
    ↓
CompositeFilter.filter()
    ├── ExtensionFilter → ['file1.js', 'file2.vue']
    └── ConfigFileFilter → ['file1.js', 'file2.vue']
    ↓
最终: ['file1.js', 'file2.vue']
```

### 验证执行流程

```
ESLintValidator.validate(['file1.js', 'file2.vue'])
    ↓
ESLintExecutor.run(['file1.js', 'file2.vue'])
    ↓
CommandRunner.exec('npx eslint "file1.js" "file2.vue"')
    ↓
返回: { success: false, output: '...' }
    ↓
ESLintOutputParser.parse(output)
    ↓
返回: { errors: 2, warnings: 1, fixable: 1, messages: [...] }
```

---

## 💡 设计优势

1. **模块化**：每个模块职责单一，易于理解和维护
2. **可扩展**：通过接口和工厂模式，易于添加新功能
3. **可测试**：依赖注入，便于单元测试
4. **可配置**：配置外部化，支持自定义
5. **低耦合**：模块之间通过接口交互，互不依赖

---

## 🔧 扩展示例

### 添加新的文件类型

修改 `config/defaultConfig.js`：
```javascript
validExtensions: ['.js', '.vue', '.py']  // 添加 .py
```

### 添加新的过滤器

```javascript
class CustomFilter extends FileFilter {
  filter(files) {
    return files.filter(/* 自定义逻辑 */);
  }
}

compositeFilter.addFilter(new CustomFilter());
```

### 添加新的报告器

```javascript
class JsonReporter extends Reporter {
  report(result) {
    console.log(JSON.stringify(result));
  }
}
```

---

**这个模块化设计使得代码更清晰、更易维护、更易扩展！** 🎉

