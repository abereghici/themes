# Bereghici for Claude Code

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Claude Code](https://claude.com/claude-code). It follows the macOS appearance through `install.sh sync dark|light`, which repoints its theme.

## Requirements

Claude Code 2.1.118 or later ([source](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)).

## Install

Run the repository's [`install.sh`](../../install.sh) from a clone at `~/.local/share/bereghici` (or linked there). For Claude Code, it:

- links `~/.claude/themes/bereghici.json` at `themes/bereghici-dark.json` or `themes/bereghici-light.json`, for the current appearance

## Usage

1. `/theme`, then Bereghici, or in `~/.claude/settings.json`:

   ```json
   { "theme": "custom:bereghici" }
   ```

2. Run `~/.local/share/bereghici/install.sh sync dark` or `sync light` from whatever switches the macOS appearance.

See Claude Code's [documentation](https://code.claude.com/docs/en/terminal-config).

## Files

| File                                                | Flavor          |
| --------------------------------------------------- | --------------- |
| [bereghici-dark.json](themes/bereghici-dark.json)   | Bereghici Dark  |
| [bereghici-light.json](themes/bereghici-light.json) | Bereghici Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- `install.sh sync dark|light` points the theme at that appearance's: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
- Every `.json` file parses as JSON: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
- `install.sh` puts each file above in place in an empty home folder, and keeps a file or link of yours: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)

## Notes

Claude Code's custom themes have no light/dark pair, so `bereghici.json` links to the appearance's theme. Claude Code watches `~/.claude/themes` and applies the theme again when `install.sh sync` repoints the link.
