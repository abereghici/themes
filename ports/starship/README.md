# Bereghici for Starship

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Starship](https://starship.rs). It follows the macOS appearance live.

## Themes

| Theme | |
| --- | --- |
| [bereghici-dark.toml](themes/bereghici-dark.toml) | Bereghici Dark |
| [bereghici-light.toml](themes/bereghici-light.toml) | Bereghici Light |
| [bereghici-terminal.toml](themes/bereghici-terminal.toml) | The terminal's ANSI colors: switches with a Bereghici terminal theme |

## Usage

1. Paste the palette's table into `~/.config/starship.toml`.
2. Select it near the top: `palette = "bereghici_terminal"` (or `bereghici_dark`, `bereghici_light`).
3. Use the role names in styles: `style = "fg:magenta"`, `[](fg:surface_nested)`.

## Notes

Starship has no light/dark switch, so with a Bereghici terminal theme `bereghici_terminal` is the palette that changes with the appearance. The logo (Bereghici Symbols) can stand in the prompt as `\U00100000`.
