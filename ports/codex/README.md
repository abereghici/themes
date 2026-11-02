# Bereghici for Codex

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Codex](https://github.com/openai/codex). It follows the macOS appearance through `install.sh sync dark|light`, which repoints its theme.

## Themes

| Theme | |
| --- | --- |
| [bereghici-dark.tmTheme](themes/bereghici-dark.tmTheme) | Bereghici Dark |
| [bereghici-light.tmTheme](themes/bereghici-light.tmTheme) | Bereghici Light |

## Usage

1. Run the repository's [`install.sh`](../../install.sh), which puts the themes in place.
2. In `~/.codex/config.toml`: `[tui]` `theme = "bereghici"`.

## Notes

Codex has one syntax theme setting, so `bereghici.tmTheme` links to the appearance's, which Codex picks up on start. The TextMate theme is the one bat and yazi use.
