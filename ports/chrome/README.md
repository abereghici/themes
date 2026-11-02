# Bereghici for Chrome

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Chrome](https://www.google.com/chrome). It doesn't follow the macOS appearance: pick Dark or Light.

## Usage

1. Open `chrome://extensions` and turn on Developer mode.

2. Load unpacked, and pick `~/.local/share/bereghici/ports/chrome/themes/bereghici-dark` or `bereghici-light` (⌘⇧. shows the hidden `.local` folder in the file picker).

See Chrome's [documentation](https://developer.chrome.com/docs/extensions/develop/ui/themes).

## Files

| File                                      | Flavor          |
| ----------------------------------------- | --------------- |
| [bereghici-dark](themes/bereghici-dark)   | Bereghici Dark  |
| [bereghici-light](themes/bereghici-light) | Bereghici Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- Every `.json` file parses as JSON: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)

## Notes

A Chrome theme has one set of colors, so it stays as it is when macOS switches. To follow the appearance instead, skip the theme: in the Customize Chrome panel, pick the custom color `#263316` (Bereghici's accent) and Appearance → Device. Chrome derives both palettes from that color, so they're close to Bereghici rather than exact.
