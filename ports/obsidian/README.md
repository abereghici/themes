# Bereghici for Obsidian

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Obsidian](https://obsidian.md). It follows the macOS appearance live.

## Usage

1. Copy the theme into your vault:

   ```sh
   cp -R ~/.local/share/bereghici/ports/obsidian/themes/Bereghici <vault>/.obsidian/themes/
   ```

2. Settings → Appearance → Themes → Bereghici, with Base color scheme on Adapt to system.

See Obsidian's [documentation](https://docs.obsidian.md/Themes/App+themes/Build+a+theme).

## Files

| File                          | Flavor                   |
| ----------------------------- | ------------------------ |
| [Bereghici](themes/Bereghici) | Bereghici Dark and Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- Every `.json` file parses as JSON: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
