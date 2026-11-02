# Bereghici for tmux

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [tmux](https://github.com/tmux/tmux). It follows the macOS appearance live.

## Requirements

tmux 3.8 or later ([source](https://github.com/tmux/tmux/blob/master/CHANGES)).

## Usage

1. In `tmux.conf`:

   ```tmux
   source-file ~/.local/share/bereghici/ports/tmux/themes/bereghici.conf
   ```

See tmux's [documentation](https://man.openbsd.org/tmux#theme).

## Files

| File                                    | Flavor                   |
| --------------------------------------- | ------------------------ |
| [bereghici.conf](themes/bereghici.conf) | Bereghici Dark and Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- tmux sources the theme without an error, and the status bar keeps the terminal's background (tmux 3.8, built from source in CI): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- The status bar, popups and menus keep the terminal's background: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)

## Notes

It sets both appearances' colors and `theme detect`, so tmux switches between them as the terminal reports the appearance.
