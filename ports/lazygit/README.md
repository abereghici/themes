# Bereghici for lazygit

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [lazygit](https://github.com/jesseduffield/lazygit). It picks the macOS appearance's theme each time it starts.

## Themes

| Theme | |
| --- | --- |
| [bereghici.yml](themes/bereghici.yml) | Bereghici Dark and Light |

## Usage

1. Add the theme after your config: `export LG_CONFIG_FILE="<your config.yml>,$HOME/.local/share/bereghici/ports/lazygit/themes/bereghici.yml"`.

## Notes

One file holds both appearances (`gui.colorScheme: auto`), which lazygit picks between on start.
