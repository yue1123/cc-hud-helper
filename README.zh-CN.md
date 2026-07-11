# claude-uhd-cc

[English](./README.md) · **简体中文**

一个为 [**claude-hud**](https://github.com/jarrodwatts/claude-hud)(Claude Code 的状态栏插件)打造的可视化配置工具。

不用再手动编辑 `~/.claude/plugins/claude-hud/config.json`,你可以在表单里拨动开关、拉动滑块、调整颜色和元素顺序,同时**实时**看到状态栏按真实终端输出的尺寸重新渲染。调好之后,直接导出 `config.json` 或分享一个链接即可。

## 它能做什么

- **实时预览** —— 顶部固定、终端风格的状态栏预览,随编辑即时更新。这是本工具的核心。
- **可视化编辑器** —— 分标签页的表单,覆盖布局、元素、Git、显示项、阈值和颜色,并提供原始 JSON 兜底入口。
- **预设** —— 一键起步的配置模板:默认、精简、全功能、CJK 优化、开发模式、单行紧凑。
- **导入 / 导出** —— 拖入或粘贴已有的 `config.json`,或下载你调好的配置。
- **URL 分享** —— 配置会被压缩进 URL hash(LZ-string),因此一个链接就能完整还原一份配置,全程无需服务器。
- **校验与诊断** —— 超出范围的数值会被钳制,非法的枚举/颜色回退到默认值,未知元素会被标记出来——全部以行内提示和汇总横幅的形式呈现。
- **未知字段透传** —— 工具不认识的字段(例如上游新增的字段)**绝不会被静默丢弃**,导出时会原样保留。
- **双语界面** —— English 与简体中文,可一键切换语言。

## 项目搭建

```sh
pnpm install
```

### 开发(热更新)

```sh
pnpm dev
```

### 生产构建(静态产物)

```sh
pnpm build
```

产物是一份静态 bundle,可部署到 GitHub Pages、Vercel 或任意静态托管。

### 测试

```sh
pnpm test        # watch 模式
pnpm test:run    # 单次运行
```

### Lint 与格式化

```sh
pnpm lint        # oxlint + eslint
pnpm format      # oxfmt
```

## 推荐的 IDE 配置

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)(并禁用 Vetur)。我们用 `vue-tsc` 对 `.vue` 文件做类型检查。
