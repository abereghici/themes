# Bereghici for herdr

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [herdr](https://github.com/herdrdev/herdr). It follows the macOS appearance live.

## Requirements

herdr 0.9.5 or later ([source](https://github.com/herdrdev/herdr/releases/tag/v0.9.5)).

## Usage

1. Paste `~/.local/share/bereghici/ports/herdr/themes/bereghici.toml` into herdr's `config.toml` in place of its `[theme]` tables. herdr can't include a file, so paste it again after the themes change.

See herdr's [documentation](https://github.com/herdrdev/herdr/blob/master/docs/versions/0.9.5/website/src/content/docs/configuration.mdx).

## Files

| File                                    | Flavor                   |
| --------------------------------------- | ------------------------ |
| [bereghici.toml](themes/bereghici.toml) | Bereghici Dark and Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- `herdr config check` reports no issue with the theme as `config.toml` (it reports unknown keys) (herdr on the maintainer's Mac; CI can't install it): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- The sidebar keeps the terminal's background: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
- Every `.toml` file parses as TOML: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
