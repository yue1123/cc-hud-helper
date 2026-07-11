# claude-uhd-cc

**English** · [简体中文](./README.zh-CN.md)

A visual configuration tool for [**claude-hud**](https://github.com/jarrodwatts/claude-hud) — the statusline plugin for Claude Code.

Instead of hand-editing `~/.claude/plugins/claude-hud/config.json`, you tweak switches, sliders, colors, and element order in a form and watch the resulting statusline re-render **live**, sized to look like the real terminal output. When you're done, export the `config.json` or share a link.

## What it does

- **Live preview** — a sticky, terminal-styled preview of your statusline that updates as you edit. This is the core of the tool.
- **Visual editor** — tabbed form covering layout, elements, git, display options, thresholds, and colors, plus a raw-JSON escape hatch.
- **Presets** — one-click starting points: Default, Minimal, Full-featured, CJK-optimized, Dev mode, and Compact one-liner.
- **Import / Export** — drop or paste an existing `config.json`, or download the config you built.
- **Share via URL** — the config is compressed into the URL hash (LZ-string), so a link fully reconstructs a configuration with no server involved.
- **Validation & diagnostics** — out-of-range numbers are clamped, illegal enums/colors fall back to defaults, and unknown elements are flagged — all surfaced as inline hints and a summary banner.
- **Unknown-field passthrough** — fields the tool doesn't recognize (e.g. newer upstream additions) are **never silently stripped**; they're preserved on export.
- **Bilingual UI** — English and 简体中文, with a language toggle.

## Project setup

```sh
pnpm install
```

### Develop (hot-reload)

```sh
pnpm dev
```

### Build for production (static bundle)

```sh
pnpm build
```

Output is a static bundle deployable to GitHub Pages, Vercel, or any static host.

### Test

```sh
pnpm test        # watch mode
pnpm test:run    # single run
```

### Lint & format

```sh
pnpm lint        # oxlint + eslint
pnpm format      # oxfmt
```

## Recommended IDE setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur). We use `vue-tsc` for type checking of `.vue` files.
