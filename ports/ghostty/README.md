# Bereghici for Ghostty

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Ghostty](https://ghostty.org). It follows the macOS appearance live.

## Install

Run the repository's [`install.sh`](../../install.sh) from a clone at `~/.local/share/bereghici` (or linked there). For Ghostty, it:

- links `~/.local/share/bereghici/ports/ghostty/themes` at `~/.config/ghostty/themes`

## Usage

1. In Ghostty's config:

   ```ini
   theme = light:bereghici-light,dark:bereghici-dark
   ```

See Ghostty's [documentation](https://ghostty.org/docs/features/theme).

## Files

| File                                      | Flavor          |
| ----------------------------------------- | --------------- |
| [bereghici-dark](themes/bereghici-dark)   | Bereghici Dark  |
| [bereghici-light](themes/bereghici-light) | Bereghici Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- `ghostty +validate-config` accepts a config that sets each theme (Ghostty on the maintainer's Mac; CI can't install it): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- `install.sh` puts each file above in place in an empty home folder, and keeps a file or link of yours: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
