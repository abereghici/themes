# Bereghici for Yazi

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Yazi](https://yazi-rs.github.io). It picks the macOS appearance's theme each time it starts.

## Requirements

Yazi 0.4.0 or later ([source](https://github.com/sxyazi/yazi/releases/tag/v0.4.0)).

## Install

Run the repository's [`install.sh`](../../install.sh) from a clone at `~/.local/share/bereghici` (or linked there). For Yazi, it:

- links `~/.local/share/bereghici/ports/yazi/themes/bereghici-dark.yazi` at `~/.config/yazi/flavors/bereghici-dark.yazi`
- links `~/.local/share/bereghici/ports/yazi/themes/bereghici-light.yazi` at `~/.config/yazi/flavors/bereghici-light.yazi`

## Usage

1. In `~/.config/yazi/theme.toml`:

   ```toml
   [flavor]
   dark = "bereghici-dark"
   light = "bereghici-light"
   ```

See Yazi's [documentation](https://yazi-rs.github.io/docs/flavors/overview).

## Files

| File                                                | Flavor          |
| --------------------------------------------------- | --------------- |
| [bereghici-dark.yazi](themes/bereghici-dark.yazi)   | Bereghici Dark  |
| [bereghici-light.yazi](themes/bereghici-light.yazi) | Bereghici Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- bat, which reads TextMate themes with the same library as Yazi (syntect), loads each flavor's `tmtheme.xml` and highlights TypeScript with it (bat 0.26.1, from mise.toml): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- Every `.toml` file parses as TOML: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
- Every `.xml` file is well-formed XML: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
- `install.sh` puts each file above in place in an empty home folder, and keeps a file or link of yours: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
