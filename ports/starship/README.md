# Bereghici for Starship

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [Starship](https://starship.rs). It follows the macOS appearance live.

## Requirements

Starship 1.11.0 or later ([source](https://github.com/starship/starship/releases/tag/v1.11.0)).

## Usage

1. Paste the table of `~/.local/share/bereghici/ports/starship/themes/bereghici-terminal.toml` into `~/.config/starship.toml`, and select it near the top:

   ```toml
   palette = "bereghici_terminal"
   ```

2. Use the role names in styles:

   ```toml
   [directory]
   style = "fg:magenta"
   format = "[](fg:surface_nested)[ $path ]($style)"
   ```

See Starship's [documentation](https://starship.rs/advanced-config/#style-strings).

## Files

| File                                                      | Flavor                                                                               |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [bereghici-dark.toml](themes/bereghici-dark.toml)         | Bereghici Dark                                                                       |
| [bereghici-light.toml](themes/bereghici-light.toml)       | Bereghici Light                                                                      |
| [bereghici-terminal.toml](themes/bereghici-terminal.toml) | Terminal: the terminal's ANSI colors, so it switches with a Bereghici terminal theme |

## Verification

`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):

- Starship draws each palette's colors by role name exactly as it draws their values (it ignores a name it doesn't know) (starship 1.27.0, from mise.toml): [`tools.test.ts`](../../packages/build/src/tools.test.ts)
- Every `.toml` file parses as TOML: [`outputs.test.ts`](../../packages/build/src/outputs.test.ts)

## Notes

Starship has no light/dark switch, so `bereghici_terminal`, in the terminal's ANSI colors, is the palette that changes with the appearance; `bereghici_dark` and `bereghici_light` stay as they are. The logo (Bereghici Symbols) can stand in the prompt as `\U00100000`.
