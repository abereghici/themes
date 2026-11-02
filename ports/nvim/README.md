# Bereghici for Neovim

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Neovim](https://neovim.io). It follows the macOS appearance live.

## Usage

1. With lazy.nvim: `{ dir = vim.fn.expand("~/.local/share/bereghici/ports/nvim"), name = "bereghici", lazy = false, priority = 1000, opts = {} }`, then `colorscheme bereghici`.

## Notes

It follows `'background'`, which Neovim 0.12 sets from the terminal's appearance reports, so it switches live. `setup()` takes `transparent`, `dim_inactive`, `italic`, `bold`, and `on_colors` and `on_highlights` to adjust the palette or any group.
