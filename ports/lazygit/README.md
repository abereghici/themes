# Bereghici for lazygit

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [lazygit](https://github.com/jesseduffield/lazygit). It follows the macOS appearance live.

## Requirements

lazygit 0.66.0 or later ([source](https://github.com/jesseduffield/lazygit/releases/tag/v0.66.0)).

## Usage

1. Merge the theme after your own config, in your shell's startup:

   ```sh
   export LG_CONFIG_FILE="$(lazygit --print-config-dir)/config.yml,$HOME/.local/share/bereghici/ports/lazygit/themes/bereghici.yml"
   ```

See lazygit's [documentation](https://github.com/jesseduffield/lazygit/blob/master/docs/Config.md).

## Files

| File                                  | Flavor                   |
| ------------------------------------- | ------------------------ |
| [bereghici.yml](themes/bereghici.yml) | Bereghici Dark and Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- Every `.yml` file parses as YAML: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)

## Notes

One file holds both appearances, with `gui.colorScheme: auto`: lazygit picks between them when it starts, and switches live in terminals that report appearance changes.
