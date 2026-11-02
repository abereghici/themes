# Bereghici for Neovim

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Neovim](https://neovim.io). It follows the macOS appearance live.

## Requirements

Neovim 0.11 or later ([source](https://neovim.io/doc/user/news-0.11.html)).

## Usage

1. With [lazy.nvim](https://lazy.folke.io):

   ```lua
   {
     dir = vim.fn.expand("~/.local/share/bereghici/ports/nvim"),
     name = "bereghici",
     lazy = false,
     priority = 1000,
     opts = {},
     config = function(_, opts)
       require("bereghici").setup(opts)
       vim.cmd.colorscheme("bereghici")
     end,
   }
   ```

See Neovim's [documentation](https://neovim.io/doc/user/options.html#'background').

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- Neovim loads both variants, with and without `transparent`, and every highlight link has a target and every color is a hex color (Neovim 0.12.6, from mise.toml): [`editors.test.ts`](../../packages/build/src/editors.test.ts)
- `transparent = true` leaves the editor, floats, sign column, status and tab lines, folds, inlay hints and diagnostics without a background: [`editors.test.ts`](../../packages/build/src/editors.test.ts)
- Neovim, VS Code and the TextMate theme color a sample of each row of [CONTRIBUTING's syntax table](../../CONTRIBUTING.md#syntax) with the same role: [`editors.test.ts`](../../packages/build/src/editors.test.ts)

## Notes

It follows `'background'`, which Neovim sets from the terminal's appearance reports in terminals that send them (Ghostty does), so it switches live. `setup()` takes `transparent`, `dim_inactive`, `italic` and `bold`, and `on_colors` and `on_highlights` to change the palette or any group.
