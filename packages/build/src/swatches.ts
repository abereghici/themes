import { APPEARANCES } from "@repo/palette";
import type { Palette, Role } from "@repo/palette";

const SHOWN = [
  "surface",
  "surfaceRaised",
  "surfaceNested",
  "textSubtlest",
  "textSubtle",
  "text",
  "accent",
  "red",
  "yellow",
  "green",
  "cyan",
  "blue",
  "magenta",
] as const satisfies readonly Role[];

const SWATCH = 80;
const GAP = 16;
const PADDING = 32;
const ROW = 176;
const WIDTH = PADDING * 2 + SHOWN.length * SWATCH + (SHOWN.length - 1) * GAP;

/** The README's palette image: each variant's main roles as swatches on its own background. */
export const swatchesSvg = (palette: Palette): string => {
  const rows = APPEARANCES.map((appearance, row) => {
    const { colors, name } = palette[appearance];
    const top = row * ROW;
    const swatches = SHOWN.map((role, i) => {
      const x = PADDING + i * (SWATCH + GAP);
      const y = top + 48;

      return [
        `    <rect x="${x}" y="${y}" width="${SWATCH}" height="${SWATCH}" rx="8" fill="${colors[role].hex}" stroke="${colors.surfaceNested.hex}"/>`,
        `    <text x="${x}" y="${y + SWATCH + 20}" fill="${colors.textSubtle.hex}">${role}</text>`,
      ].join("\n");
    });

    return [
      `  <g>`,
      `    <rect y="${top}" width="${WIDTH}" height="${ROW}" fill="${colors.surface.hex}"/>`,
      `    <text x="${PADDING}" y="${top + 32}" fill="${colors.text.hex}" font-weight="600">${name}</text>`,
      ...swatches,
      `  </g>`,
    ].join("\n");
  });

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${ROW * APPEARANCES.length}" viewBox="0 0 ${WIDTH} ${ROW * APPEARANCES.length}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="13">`,
    `  <title>The Bereghici Dark and Light palettes</title>`,
    ...rows,
    `</svg>`,
    "",
  ].join("\n");
};
