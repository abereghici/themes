# Bereghici for glamour (gh, glow)

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [glamour (gh, glow)](https://github.com/charmbracelet/glamour). It follows the macOS appearance live.

## Usage

1. For gh, which reads a style file from `GLAMOUR_STYLE`, in your shell's startup:

   ```sh
   export GLAMOUR_STYLE=~/.local/share/bereghici/ports/glamour/themes/bereghici-terminal.json
   ```

2. For glow, pass the style:

   ```sh
   glow --style ~/.local/share/bereghici/ports/glamour/themes/bereghici-terminal.json README.md
   ```

See glamour (gh, glow)'s [documentation](https://github.com/charmbracelet/glamour#styles).

## Files

| File                                                      | Flavor                                                                               |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [bereghici-dark.json](themes/bereghici-dark.json)         | Bereghici Dark                                                                       |
| [bereghici-light.json](themes/bereghici-light.json)       | Bereghici Light                                                                      |
| [bereghici-terminal.json](themes/bereghici-terminal.json) | Terminal: the terminal's ANSI colors, so it switches with a Bereghici terminal theme |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- Every `.json` file parses as JSON: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
