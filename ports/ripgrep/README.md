# Bereghici for ripgrep

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [ripgrep](https://github.com/BurntSushi/ripgrep). It follows the macOS appearance live.

## Requirements

ripgrep 0.8.0 or later ([source](https://github.com/BurntSushi/ripgrep/blob/master/CHANGELOG.md)).

## Usage

1. Add the lines of `~/.local/share/bereghici/ports/ripgrep/themes/bereghici-terminal.ripgreprc` to the file `RIPGREP_CONFIG_PATH` names (ripgrep reads only one), or point it there:

   ```sh
   export RIPGREP_CONFIG_PATH=~/.local/share/bereghici/ports/ripgrep/themes/bereghici-terminal.ripgreprc
   ```

See ripgrep's [documentation](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md#configuration-file).

## Files

| File                                                                | Flavor                                                                               |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [bereghici-dark.ripgreprc](themes/bereghici-dark.ripgreprc)         | Bereghici Dark                                                                       |
| [bereghici-light.ripgreprc](themes/bereghici-light.ripgreprc)       | Bereghici Light                                                                      |
| [bereghici-terminal.ripgreprc](themes/bereghici-terminal.ripgreprc) | Terminal: the terminal's ANSI colors, so it switches with a Bereghici terminal theme |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- ripgrep accepts every theme's `--colors` (it exits with an error on an invalid one) and marks matches in the theme's red (ripgrep 15.2.0, from mise.toml): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
