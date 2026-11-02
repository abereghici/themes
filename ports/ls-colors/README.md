# Bereghici for LS_COLORS (GNU ls, fd, eza, zsh completion)

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [LS_COLORS (GNU ls, fd, eza, zsh completion)](https://www.gnu.org/software/coreutils/manual/html_node/General-output-formatting.html). It follows the macOS appearance live.

## Usage

1. In your shell's startup:

   ```sh
   source ~/.local/share/bereghici/ports/ls-colors/themes/bereghici-terminal.sh
   ```

2. For zsh's completion menu:

   ```zsh
   zmodload zsh/complist
   zstyle ':completion:*:default' list-colors ${(s.:.)LS_COLORS}
   ```

See LS_COLORS (GNU ls, fd, eza, zsh completion)'s [documentation](https://www.gnu.org/software/coreutils/manual/html_node/dircolors-invocation.html).

## Files

| File                                                  | Flavor                                                                               |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [bereghici-dark.sh](themes/bereghici-dark.sh)         | Bereghici Dark                                                                       |
| [bereghici-light.sh](themes/bereghici-light.sh)       | Bereghici Light                                                                      |
| [bereghici-terminal.sh](themes/bereghici-terminal.sh) | Terminal: the terminal's ANSI colors, so it switches with a Bereghici terminal theme |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- eza reads each `LS_COLORS` and draws directories in the theme's blue (eza 0.23.5, from mise.toml): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- Every `.sh` file passes `bash -n`: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)

## Notes

macOS's own `ls` reads `LSCOLORS`, not `LS_COLORS`: use GNU ls (`gls`, from Homebrew's coreutils) or eza.
