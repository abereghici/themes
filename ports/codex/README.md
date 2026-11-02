# Bereghici for Codex

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Codex](https://github.com/openai/codex). It follows the macOS appearance through `install.sh sync dark|light`, which repoints its theme.

## Requirements

Codex 0.105.0 or later ([source](https://github.com/openai/codex/releases/tag/rust-v0.105.0)).

## Install

Run the repository's [`install.sh`](../../install.sh) from a clone at `~/.local/share/bereghici` (or linked there). For Codex, it:

- links `~/.codex/themes/bereghici.tmTheme` at `themes/bereghici-dark.tmTheme` or `themes/bereghici-light.tmTheme`, for the current appearance

## Usage

1. In `~/.codex/config.toml`:

   ```toml
   [tui]
   theme = "bereghici"
   ```

2. Run `~/.local/share/bereghici/install.sh sync dark` or `sync light` from whatever switches the macOS appearance.

See Codex's [documentation](https://github.com/openai/codex/blob/main/docs/config.md).

## Files

| File                                                      | Flavor          |
| --------------------------------------------------------- | --------------- |
| [bereghici-dark.tmTheme](themes/bereghici-dark.tmTheme)   | Bereghici Dark  |
| [bereghici-light.tmTheme](themes/bereghici-light.tmTheme) | Bereghici Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- bat, which reads TextMate themes with the same library as Codex (syntect), loads both themes and highlights TypeScript with them (bat 0.26.1, from mise.toml): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- `install.sh sync dark|light` points the theme at that appearance's: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
- Every `.tmTheme` file is well-formed XML: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
- `install.sh` puts each file above in place in an empty home folder, and keeps a file or link of yours: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)

## Notes

Codex has one syntax theme setting, so `bereghici.tmTheme` links to the appearance's theme, which Codex reads when it starts. The TextMate themes are the ones bat uses.
