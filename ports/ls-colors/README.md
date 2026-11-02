# Bereghici for LS_COLORS (fd, ls, zsh completion)

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [LS_COLORS (fd, ls, zsh completion)](https://www.gnu.org/software/coreutils/manual/html_node/dircolors-invocation.html). It follows the macOS appearance live.

## Themes

| Theme | |
| --- | --- |
| [bereghici-dark.sh](themes/bereghici-dark.sh) | Bereghici Dark |
| [bereghici-light.sh](themes/bereghici-light.sh) | Bereghici Light |
| [bereghici-terminal.sh](themes/bereghici-terminal.sh) | The terminal's ANSI colors: switches with a Bereghici terminal theme |

## Usage

1. In your shell's startup: `source ~/.local/share/bereghici/ports/ls-colors/themes/bereghici-terminal.sh`.
2. For zsh's completion menu: `zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}`.
