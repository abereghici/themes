# Bereghici for lazydocker

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [lazydocker](https://github.com/jesseduffield/lazydocker). It follows the macOS appearance live.

## Usage

1. Paste the `gui.theme` of `~/.local/share/bereghici/ports/lazydocker/themes/bereghici-terminal.yml` into lazydocker's `config.yml` (`~/Library/Application Support/lazydocker/config.yml` on macOS), which can't include another file.

See lazydocker's [documentation](https://github.com/jesseduffield/lazydocker/blob/master/docs/Config.md).

## Files

| File                                                    | Flavor                                                                               |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [bereghici-dark.yml](themes/bereghici-dark.yml)         | Bereghici Dark                                                                       |
| [bereghici-light.yml](themes/bereghici-light.yml)       | Bereghici Light                                                                      |
| [bereghici-terminal.yml](themes/bereghici-terminal.yml) | Terminal: the terminal's ANSI colors, so it switches with a Bereghici terminal theme |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- Every `.yml` file parses as YAML: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
