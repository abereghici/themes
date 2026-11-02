# Bereghici for fzf

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [fzf](https://github.com/junegunn/fzf). It follows the macOS appearance live.

## Requirements

fzf 0.52.0 or later ([source](https://github.com/junegunn/fzf/blob/master/CHANGELOG.md)).

## Usage

1. In your shell's startup, after setting `FZF_DEFAULT_OPTS` (it adds the colors to it):

   ```sh
   source ~/.local/share/bereghici/ports/fzf/themes/bereghici-terminal.sh
   ```

See fzf's [documentation](https://junegunn.github.io/fzf/reference/#color).

## Files

| File                                                  | Flavor                                                                               |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [bereghici-dark.sh](themes/bereghici-dark.sh)         | Bereghici Dark                                                                       |
| [bereghici-light.sh](themes/bereghici-light.sh)       | Bereghici Light                                                                      |
| [bereghici-terminal.sh](themes/bereghici-terminal.sh) | Terminal: the terminal's ANSI colors, so it switches with a Bereghici terminal theme |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- fzf accepts every theme's `--color` (it exits with an error on an unknown color name or value) (fzf 0.74.5, from mise.toml): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- The terminal flavor keeps the terminal's background: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
- Every `.sh` file passes `bash -n`: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
