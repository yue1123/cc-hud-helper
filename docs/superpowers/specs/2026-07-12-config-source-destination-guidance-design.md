# 配置来源 / 落点引导 —— 设计

日期:2026-07-12

## 背景与问题

claude-uhd-cc 是 [claude-hud](https://github.com/jarrodwatts/claude-hud) 插件的可视化配置工具。
用户在工具里调好配置后,面临两个不清楚的环节:

1. **来源**:要编辑的 `config.json` 从哪里拿?
2. **落点**:调好导出的 `config.json` 该放到哪里才能生效?

canonical 路径为 `~/.claude/plugins/claude-hud/config.json`(见 README.zh-CN.md 与插件安装目录)。

本设计在**不改变现有编辑/预览/校验能力**的前提下,把这两条引导融入导入、导出流程。

## 目标

- 导入时告诉用户「现有配置通常在哪里」以及「没有就从预设起步」。
- 导出时**醒目**告诉用户「保存为 config.json 放到 `~/.claude/plugins/claude-hud/config.json`」,并提供一键复制路径。
- 全部文案双语(`en` / `zh`)。

## 非目标(YAGNI)

- 不做顶部常驻引导条 / 独立 Help 页。
- 不做「自动写入文件」——纯静态前端,无文件系统写权限。
- 不改动校验、预览、URL 分享等既有逻辑。

## 方案

### 1. 导入弹窗增强(`src/components/io/ImportButton.vue`)

现有弹窗已有一段 `import.hint`。在其基础上补一段**来源引导**,不新增组件,仅新增文案 + 一个路径展示行:

- 来源说明:现有配置通常位于 `~/.claude/plugins/claude-hud/config.json`,可拖入 / 粘贴该文件继续编辑。
- 无配置时的兜底提示:直接从顶栏预设(Presets)起步。
- 路径以等宽、可选中的样式展示(复用 export 侧的路径展示样式,见下)。

现有 file input、textarea、drag-drop、apply 逻辑保持不变。

### 2. 新增导出弹窗(`src/components/io/ExportButton.vue` 改造)

当前顶栏是两个裸按钮:`[ 导出 ]`(下载)+ `[ 复制 ]`(复制 JSON)。合并为**单个** `[ 导出 ]` 按钮,点开一个与 Import 对称的模态弹窗。

弹窗内容(自上而下):

1. **标题**:导出 config.json。
2. **落点引导(核心)**:「调好后,把这份配置保存为 `config.json`,放到:」
3. **目标路径展示行**:醒目展示 `~/.claude/plugins/claude-hud/config.json`,右侧一个「复制路径」按钮(复制纯路径字符串到剪贴板,复用现有 toast 反馈)。
4. **生效说明**:保存后新开的 Claude Code 会话即会使用新配置。
5. **动作区**(保留现有两个能力):
   - `下载 config.json` —— 复用现有 `download()` 逻辑(Blob → `config.json`)。
   - `复制 JSON` —— 复用现有 `copyToClipboard()` 逻辑。
   - `关闭`。

交互权衡:下载从「一键」变为「点开弹窗 → 下载」两步。换取导出时可承载落点引导,且与 Import 弹窗交互对称。已与用户确认采用合并方案。

toast 反馈机制沿用现有实现(下载成功 / JSON 已复制 / 路径已复制 / 复制失败)。

### 3. 路径展示样式(共用)

导入与导出弹窗都需要展示 `~/.claude/plugins/claude-hud/config.json`。抽出一致的展示样式:等宽字体、`var(--bg-deep)` 背景、可选中、必要时横向滚动不撑破弹窗。可以是两个组件内各自的 scoped 样式(文案量小,不强制抽公共组件);若重复明显再抽为一个轻量 `PathHint` 组件。默认先内联,保持改动小。

### 4. i18n(`src/i18n/en.ts` / `src/i18n/zh.ts`)

在现有 `import` / `export` 命名空间下新增 key(示意,最终以实现为准):

- `import.sourceHint` —— 来源说明(含路径)。
- `import.noConfigHint` —— 无配置时从预设起步。
- `export.title` —— 导出弹窗标题。
- `export.destHint` —— 落点引导正文。
- `export.pathLabel` / 复用路径常量。
- `export.effectHint` —— 生效说明。
- `export.copyPath` —— 复制路径按钮。
- `export.downloadJson` / `export.copyJson` —— 弹窗内动作按钮标签(可复用现有 `downloadLabel` / `copyLabel`)。
- `toast.pathCopied` —— 路径已复制。

路径字符串 `~/.claude/plugins/claude-hud/config.json` 两种语言保持一致(建议抽成一个常量,避免文案里手写出错)。

## 数据流与边界

- 无新增全局状态;导出弹窗的开关是组件本地 `ref`(与 Import 弹窗一致)。
- 「复制路径」走 `navigator.clipboard.writeText`,失败回退到既有 `copyFailed` toast。
- App.vue 顶栏结构不变,仍为 `<ExportButton />` 一个组件,内部由两按钮变一按钮 + 弹窗。

## 测试

- 组件级(Vitest + 现有测试栈):
  - 导出弹窗:点击 `[ 导出 ]` 打开;显示目标路径文本;点击「复制路径」调用 clipboard 并出 toast;下载动作生成 `config.json` Blob;关闭。
  - 导入弹窗:来源引导文案与路径可见;既有导入逻辑回归不受影响。
- i18n:新增 key 在 `en` / `zh` 均存在,无缺失(如仓库已有 i18n 完整性测试则复用)。

## 影响面

- 改动文件:`ExportButton.vue`、`ImportButton.vue`、`en.ts`、`zh.ts`(可能新增一个路径常量 / 轻量 `PathHint`)。
- App.vue 无需改动(顶栏组件不变)。
