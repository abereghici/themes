# Bereghici for delta

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [delta](https://github.com/dandavison/delta). It picks the macOS appearance's theme each time it starts.

## Usage

1. In `~/.gitconfig`, include the themes and pick the one for the macOS appearance each time git starts the pager (git runs `core.pager` with `sh`):

   ```gitconfig
   [include]
     path = ~/.local/share/bereghici/ports/delta/themes/bereghici.gitconfig
   [core]
     pager = delta --features=bereghici-$([ \"$(defaults read -g AppleInterfaceStyle 2>/dev/null)\" = Dark ] && echo dark || echo light)
   ```

See delta's [documentation](https://dandavison.github.io/delta/custom-themes.html).

## Files

| File                                              | Flavor                   |
| ------------------------------------------------- | ------------------------ |
| [bereghici.gitconfig](themes/bereghici.gitconfig) | Bereghici Dark and Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- delta renders a diff with each feature, and its output carries the feature's added and removed line backgrounds (delta 0.20.1, from mise.toml): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- Every `.gitconfig` file is read by `git config --list`: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)

## Notes

delta's `syntax-theme` is one setting, and its light/dark detection only picks its own default colors, so each appearance is a feature: `bereghici-dark` and `bereghici-light`. Both take their syntax colors from the bat themes of the same name, so install the bat port too.
