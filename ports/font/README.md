# Bereghici for Bereghici Symbols

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Bereghici Symbols](https://github.com/abereghici/design-system).

## Install

Run the repository's [`install.sh`](../../install.sh) from a clone at `~/.local/share/bereghici` (or linked there). For Bereghici Symbols, it:

- copies `~/.local/share/bereghici/ports/font/themes/BereghiciSymbols.otf` to `~/Library/Fonts/BereghiciSymbols.otf`

## Usage

1. Have the terminal take the logo's code point from the font. In Ghostty's config:

   ```ini
   font-codepoint-map = U+100000=Bereghici Symbols
   ```

2. Write the logo as `\U00100000` in TOML (Starship) or `$'\U00100000'` in zsh, followed by a space.

See Bereghici Symbols's [documentation](https://ghostty.org/docs/config/reference#font-codepoint-map).

## Files

| File                                                | Flavor |
| --------------------------------------------------- | ------ |
| [BereghiciSymbols.otf](themes/BereghiciSymbols.otf) | —      |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- The font is named Bereghici Symbols and draws the logo at U+100000: [`font.test.ts`](../../packages/font/scripts/font.test.ts)
- `install.sh` puts each file above in place in an empty home folder, and keeps a file or link of yours: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)

## Notes

The Bereghici logo as a glyph at U+100000, the first private-use code point of plane 16, which Nerd Fonts leave free: a terminal can only draw characters. `pnpm font` draws it from the logo's SVG on MesloLGS Nerd Font's metrics, centred on its capitals. It overflows into the next cell, as Nerd Font icons do.
