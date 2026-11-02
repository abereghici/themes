# Bereghici for VS Code

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [VS Code](https://code.visualstudio.com). It follows the macOS appearance live.

## Requirements

VS Code 1.80 or later ([source](https://github.com/abereghici/themes/blob/main/ports/vscode/package.json)).

## Install

Run the repository's [`install.sh`](../../install.sh) from a clone at `~/.local/share/bereghici` (or linked there). For VS Code, it:

- runs `vsix="$(mktemp -d)/bereghici-theme.vsix" && cd "$ports/vscode" && npx --yes @vscode/vsce@4.1.0 package --no-dependencies --out "$vsix" && code --install-extension "$vsix" --force`, when `code` and `npx` exist

## Usage

1. In `settings.json`:

   ```json
   {
     "window.autoDetectColorScheme": true,
     "workbench.preferredDarkColorTheme": "Bereghici Dark",
     "workbench.preferredLightColorTheme": "Bereghici Light"
   }
   ```

2. After the themes change, run `install.sh` again, since VS Code keeps its own copy of the extension.

See VS Code's [documentation](https://code.visualstudio.com/docs/configure/themes#_automatically-switch-based-on-os-color-scheme).

## Files

| File                                                                        | Flavor          |
| --------------------------------------------------------------------------- | --------------- |
| [bereghici-dark-color-theme.json](themes/bereghici-dark-color-theme.json)   | Bereghici Dark  |
| [bereghici-light-color-theme.json](themes/bereghici-light-color-theme.json) | Bereghici Light |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- `vsce package` packages the extension, and the package holds every theme the manifest contributes (@vscode/vsce 4.1.0, from pnpm-workspace.yaml): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- Neovim, VS Code and the TextMate theme color a sample of each row of [CONTRIBUTING's syntax table](../../CONTRIBUTING.md#syntax) with the same role: [`editors.test.ts`](../../packages/build/src/editors.test.ts)
- Every `.json` file parses as JSON: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
- `install.sh` puts each file above in place in an empty home folder, and keeps a file or link of yours: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)
