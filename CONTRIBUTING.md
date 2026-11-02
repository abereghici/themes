# Contributing

## Repository

```text
packages/
├── palette/       # resolves @abereghici/tokens and the terminal roles into the Dark, Light and terminal flavors
├── build/         # renders the ports, the generated README sections, each port's README and install.sh, and tests them
└── font/          # draws the Bereghici logo into ports/font/themes/BereghiciSymbols.otf
ports/
├── _shared/       # partials more than one port uses
└── <port>/
    ├── templates/ # Mustache templates, each naming its output and flavors in its frontmatter
    └── themes/    # what the templates render (committed; never edit by hand)
wallpapers/        # dynamic macOS wallpapers, and dynamic.swift, which packs a light and a dark image into one
ports.yml          # every port: its tool, docs, oldest supported version, how it switches, where it installs, how to use it
install.sh         # generated from ports.yml
mise.toml          # the tools the tests run the themes through, pinned (mise.lock holds their checksums)
```

## Development

Node.js and pnpm are pinned in `package.json` under `devEngines`. The tools the tests run the themes through (bat, delta, eza, fzf, jq, Neovim, ripgrep, Starship) and StyLua are pinned in [`mise.toml`](mise.toml); tmux 3.8 and zsh come from your system (Homebrew on macOS). Ghostty's and herdr's checks run when they're installed.

```sh
mise install      # the pinned tools
pnpm install
pnpm build        # render every port, the README's generated sections and install.sh
pnpm check        # fail when a committed file differs from a fresh render
pnpm test         # contrast minimums, the build, install.sh, every output, the editors and each tool on its themes
pnpm lint && pnpm format && pnpm check-types
```

A tool that isn't installed skips its check locally; in CI, where every tool but Ghostty and herdr is installed, a missing one fails.

Commit what `pnpm build` writes along with the change that caused it: CI runs `pnpm check` and fails on any difference.

## Colors

The colors come from [`@abereghici/tokens`](https://github.com/abereghici/design-system/tree/main/packages/tokens), whose DTCG source this repository resolves. A new hue or a changed step belongs in the design system; bump the `@abereghici/tokens` version in `pnpm-workspace.yaml` to take it. [`terminal.tokens.json`](packages/palette/src/tokens/terminal.tokens.json) maps the design system's tokens to the roles the ports use, and is the only color source here.

A role change must keep every pair in [`contrast.ts`](packages/palette/src/contrast.ts) at its minimum; `pnpm test` checks them and `pnpm build` writes the measured ratios into the README.

## Syntax

The editors (Neovim, VS Code and the TextMate theme bat, Codex and Yazi use) color code the same way, from the descriptions in `terminal.tokens.json`; `pnpm test` checks a sample of each item across the three. A new editor port follows this table:

| Code                                                    | Role                   |
| ------------------------------------------------------- | ---------------------- |
| Keywords, `return`, `throw`, tags                       | `magenta`              |
| `this`, `self`, globals such as `console` and `window`  | `magenta`, italic      |
| Parameters                                              | `magentaBright`        |
| Functions, methods, decorators and macros               | `green`                |
| Strings                                                 | `yellow`               |
| Regular expressions                                     | `yellowBright`         |
| Types and built-in classes, constants, numbers, escapes | `cyan`                 |
| JSX components                                          | `cyan`                 |
| Properties, object keys, attributes, Markdown headings  | `blue`                 |
| Variables                                               | `text`                 |
| Operators and punctuation                               | `textSubtle`           |
| Comments                                                | `textSubtlest`, italic |
| Markdown inline code and list markers                   | `cyan`                 |
| Markdown code block bodies                              | `text`                 |
| Links                                                   | `magenta`              |
| Invalid code                                            | `red`                  |

## Adding a port

1. Create `ports/<tool>/templates/<file>.mustache`. Its frontmatter names the output, and the flavors to render it in once each:

   ```mustache
   ---
   output: themes/{{id}}.conf
   flavors: [dark, light, terminal]
   ---
   background = {{colors.surface.hex}}
   ```

   Without `flavors` a template renders once, with `dark`, `light` and `terminal` in the view. `copy: <path>` writes a file unchanged, such as a license. Each color has `hex`, `bare`, `rgb`, `rgbCsv`, `ref`, `sgr` and `sgrBg`; the terminal flavor's colors are `ref`, `sgr`, `sgrBg`, `index` and `name`, and its `surface` and `surfaceRaised` are `null`, so guard them with `{{#colors.surface}}…{{/colors.surface}}`.

2. Register it in [`ports.yml`](ports.yml): its name, URL, the documentation its usage relies on, the oldest version it supports with a source, its category, how it switches, any `install` steps (`link`, `copy`, `switch`, `run`) and its `usage`, with the config to add as `code`.
3. If the tool can check a theme from the command line, add that to [`checks.ts`](packages/build/src/checks.ts), pin the tool in `mise.toml`, and break the theme once to see the check fail. The port's README lists what the tests prove.
4. Run `pnpm build` and load the theme in the tool itself before opening a pull request.

## Releasing

The themes are used from a clone, so `main` is the release. The VS Code port is packaged locally by `install.sh`; it isn't published to a marketplace.
