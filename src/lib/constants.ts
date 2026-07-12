/**
 * Canonical locations claude-hud reads its config from.
 *
 * The `~` / `%USERPROFILE%` prefix is the user's home directory. Claude Code
 * stores config under `<home>/.claude` on every platform; only the way the
 * home dir is written differs per shell:
 *   - macOS / Linux (and WSL / Git Bash on Windows): `~/.claude/...`
 *   - Windows native CMD / PowerShell: `%USERPROFILE%\.claude\...`
 */
export const CONFIG_PATH_UNIX = '~/.claude/plugins/claude-hud/config.json'
export const CONFIG_PATH_WINDOWS =
  '%USERPROFILE%\\.claude\\plugins\\claude-hud\\config.json'

/** Both paths, labelled by platform, for guidance UIs. */
export const CONFIG_PATHS = [
  { os: 'macOS / Linux', path: CONFIG_PATH_UNIX },
  { os: 'Windows', path: CONFIG_PATH_WINDOWS },
] as const
