# Bereghici for delta

<!-- Generated from ports.yml by `pnpm build`: edit it there. -->

Bereghici for [delta](https://github.com/dandavison/delta). It picks the macOS appearance's theme each time it starts.

## Themes

| Theme | |
| --- | --- |
| [bereghici.gitconfig](themes/bereghici.gitconfig) | Bereghici Dark and Light |

## Usage

1. In `~/.gitconfig`: `[include] path = ~/.local/share/bereghici/ports/delta/themes/bereghici.gitconfig`.
2. Pick the feature for the appearance when git pages: `pager = delta --features=bereghici-$(appearance)`, where `appearance` is a script of your own printing `dark` or `light`, such as `[ "$(defaults read -g AppleInterfaceStyle 2>/dev/null)" = Dark ] && echo dark || echo light`.

## Notes

delta has one syntax theme setting, not one per appearance, so each appearance is a feature: `bereghici-dark` and `bereghici-light`, with the bat themes for syntax.
