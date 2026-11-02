# Bereghici for Raycast

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Raycast](https://www.raycast.com). It follows the macOS appearance live.

## Usage

1. Open each link in [`themes/IMPORT.md`](themes/IMPORT.md) to import Bereghici Dark and Bereghici Light.

2. Settings → Appearance, and pick Bereghici Light for Light Mode and Bereghici Dark for Dark Mode.

See Raycast's [documentation](https://manual.raycast.com/themes).

## Files

| File                                                | Flavor                   |
| --------------------------------------------------- | ------------------------ |
| [IMPORT.md](themes/IMPORT.md)                       | Bereghici Dark and Light |
| [bereghici-dark.json](themes/bereghici-dark.json)   | Bereghici Dark           |
| [bereghici-light.json](themes/bereghici-light.json) | Bereghici Light          |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- Every `.json` file parses as JSON: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)

## Notes

Raycast's custom themes need Raycast Pro.
