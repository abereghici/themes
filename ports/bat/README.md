# Bereghici for bat

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [bat](https://github.com/sharkdp/bat). It picks the macOS appearance's theme each time it starts.

## Themes

| Theme | |
| --- | --- |
| [bereghici-dark.tmTheme](themes/bereghici-dark.tmTheme) | Bereghici Dark |
| [bereghici-light.tmTheme](themes/bereghici-light.tmTheme) | Bereghici Light |

## Usage

1. Run the repository's [`install.sh`](../../install.sh), which puts the themes in place.
2. In bat's config (`bat --config-file`): `--theme=auto:system`, `--theme-dark=bereghici-dark` and `--theme-light=bereghici-light`. `auto:system` reads the macOS appearance, so it holds when bat's output is piped (fzf previews, delta), where plain `auto` can't ask the terminal.
