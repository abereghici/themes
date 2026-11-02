# Bereghici for eza

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [eza](https://eza.rocks). It follows the macOS appearance live.

## Requirements

eza 0.23.5 or later ([source](https://github.com/eza-community/eza/blob/main/CHANGELOG.md)).

## Install

Run the repository's [`install.sh`](../../install.sh) from a clone at `~/.local/share/bereghici` (or linked there). For eza, it:

- links `~/.local/share/bereghici/ports/eza/themes/bereghici-terminal.yml` at `~/Library/Application Support/eza/theme.yml`

## Usage

1. Nothing more: eza reads `theme.yml` from `~/Library/Application Support/eza` on macOS, or from `$EZA_CONFIG_DIR` when that's set (link the theme there instead). For colors that don't follow the terminal, link `bereghici-dark.yml` or `bereghici-light.yml` in its place.

See eza's [documentation](https://github.com/eza-community/eza/blob/main/docs/theme.yml).

## Files

| File                                                    | Flavor                                                                               |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [bereghici-dark.yml](themes/bereghici-dark.yml)         | Bereghici Dark                                                                       |
| [bereghici-light.yml](themes/bereghici-light.yml)       | Bereghici Light                                                                      |
| [bereghici-terminal.yml](themes/bereghici-terminal.yml) | Terminal: the terminal's ANSI colors, so it switches with a Bereghici terminal theme |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- eza reads each theme as its `theme.yml` and draws directories in the theme's blue (eza 0.23.5, from mise.toml): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- Every `.yml` file parses as YAML: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
- `install.sh` puts each file above in place in an empty home folder, and keeps a file or link of yours: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)

## Notes

The terminal flavor names ANSI colors by number (`"4"`), which eza reads from 0.23.5 on.
