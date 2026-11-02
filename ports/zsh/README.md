# Bereghici for zsh-syntax-highlighting, zsh-autosuggestions

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [zsh-syntax-highlighting, zsh-autosuggestions](https://github.com/zsh-users/zsh-syntax-highlighting). It follows the macOS appearance live.

## Usage

1. In `.zshrc`, before the plugins:

   ```zsh
   source ~/.local/share/bereghici/ports/zsh/themes/bereghici-terminal.zsh
   ```

See zsh-syntax-highlighting, zsh-autosuggestions's [documentation](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/docs/highlighters/main.md).

## Files

| File                                                    | Flavor                                                                               |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [bereghici-dark.zsh](themes/bereghici-dark.zsh)         | Bereghici Dark                                                                       |
| [bereghici-light.zsh](themes/bereghici-light.zsh)       | Bereghici Light                                                                      |
| [bereghici-terminal.zsh](themes/bereghici-terminal.zsh) | Terminal: the terminal's ANSI colors, so it switches with a Bereghici terminal theme |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- Every `.zsh` file passes `zsh -n`: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
