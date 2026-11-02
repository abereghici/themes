# Bereghici for Claude Code

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Claude Code](https://claude.com/claude-code). It follows the macOS appearance through `install.sh sync dark|light`, which repoints its theme.

## Themes

| Theme | |
| --- | --- |
| [bereghici-dark.json](themes/bereghici-dark.json) | Bereghici Dark |
| [bereghici-light.json](themes/bereghici-light.json) | Bereghici Light |

## Usage

1. Run the repository's [`install.sh`](../../install.sh), which puts the themes in place.
2. `/theme` → Bereghici (the `bereghici` custom theme), or `"theme": "custom:bereghici"` in `~/.claude/settings.json`.

## Notes

Claude Code's custom themes have no light/dark pair, so `bereghici.json` links to the appearance's, and Claude Code applies it live when `install.sh sync` repoints it. Its built-in `dark-ansi` doesn't suit a Bereghici terminal: it draws messages on ANSI 8, which Bereghici keeps for muted text.
