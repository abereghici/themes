# Bereghici for jq

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [jq](https://jqlang.org). It follows the macOS appearance live.

## Requirements

jq 1.7 or later ([source](https://github.com/jqlang/jq/blob/master/NEWS.md)).

## Usage

1. In your shell's startup:

   ```sh
   source ~/.local/share/bereghici/ports/jq/themes/bereghici-terminal.sh
   ```

See jq's [documentation](https://jqlang.org/manual/#colors).

## Files

| File                                                  | Flavor                                                                               |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [bereghici-dark.sh](themes/bereghici-dark.sh)         | Bereghici Dark                                                                       |
| [bereghici-light.sh](themes/bereghici-light.sh)       | Bereghici Light                                                                      |
| [bereghici-terminal.sh](themes/bereghici-terminal.sh) | Terminal: the terminal's ANSI colors, so it switches with a Bereghici terminal theme |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- jq accepts every theme's `JQ_COLORS` (it warns on an invalid one) and colors object keys with the theme's blue (jq 1.8.2, from mise.toml): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- Every `.sh` file passes `bash -n`: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
