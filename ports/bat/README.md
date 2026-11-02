# Bereghici for bat

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [bat](https://github.com/sharkdp/bat). It picks the macOS appearance's theme each time it starts.

## Requirements

bat 0.25.0 or later ([source](https://github.com/sharkdp/bat/blob/master/CHANGELOG.md)).

## Install

Run the repository's [`install.sh`](../../install.sh) from a clone at `~/.local/share/bereghici` (or linked there). For bat, it:

- links `~/.local/share/bereghici/ports/bat/themes` at `~/.config/bat/themes`
- runs `bat cache --build`, when `bat` exists

## Usage

1. Pick the theme for the macOS appearance in bat's config (`bat --config-file` prints where it is). `auto:system` asks macOS rather than the terminal, so it also holds when bat's output is piped, as in fzf previews.

   ```sh
   --theme=auto:system
   --theme-dark=bereghici-dark
   --theme-light=bereghici-light
   ```

See bat's [documentation](https://github.com/sharkdp/bat#adding-new-themes).

## Files

| File                                                      | Flavor          |
| --------------------------------------------------------- | --------------- |
| [bereghici-dark.tmTheme](themes/bereghici-dark.tmTheme)   | Bereghici Dark  |
| [bereghici-light.tmTheme](themes/bereghici-light.tmTheme) | Bereghici Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- bat builds its cache from both themes without a warning and highlights TypeScript with them (bat 0.26.1, from mise.toml): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- Neovim, VS Code and the TextMate theme color a sample of each row of [CONTRIBUTING's syntax table](../../CONTRIBUTING.md#syntax) with the same role: [`editors.test.ts`](../../packages/build/src/editors.test.ts)
- Every `.tmTheme` file is well-formed XML: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
- `install.sh` puts each file above in place in an empty home folder, and keeps a file or link of yours: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
