# Bereghici for Bereghici Symbols

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Bereghici Symbols](https://github.com/abereghici/design-system). It follows the macOS appearance live.

## Themes

| Theme | |
| --- | --- |
| [BereghiciSymbols.otf](themes/BereghiciSymbols.otf) |  |

## Usage

1. Run the repository's [`install.sh`](../../install.sh), which puts the themes in place.
2. Have the terminal take the logo's code point from it. Ghostty: `font-codepoint-map = U+100000=Bereghici Symbols`.
3. Write it as `\U00100000` in TOML (Starship) or `$'\U00100000'` in zsh, followed by a space.

## Notes

The Bereghici logo as a glyph at U+100000 (the first private-use code point of plane 16, which Nerd Fonts leave free), so a prompt can show it: a terminal can only draw characters. `pnpm font` draws it from the logo's SVG on MesloLGS Nerd Font's metrics, as tall as its capitals; it overflows into the next cell, as Nerd Font icons do.
