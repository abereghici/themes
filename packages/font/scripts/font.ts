/**
 * Writes Bereghici Symbols, a font with the logo at U+100000 (the first private-use code point
 * of plane 16, which Nerd Fonts leave free), for prompts: a terminal can only draw characters.
 * Ghostty takes the code point from it with `font-codepoint-map` (ports/font/README.md).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import opentype from "opentype.js";

/** The logo mark, copied from design-system packages/ui/assets/logo/logo-moss.svg (32×32) */
const LOGO = {
  path: "M11 9 L5 16 L11 23 M21 9 L27 16 L21 23 M16 6 L18.5 11 L13.5 16 L18.5 21 L16 26",
  strokeWidth: 3,
};

export const CODE_POINT = 0x10_00_00;

const OUTPUT = join(import.meta.dirname, "../../../ports/font/themes/BereghiciSymbols.otf");

// MesloLGS Nerd Font Mono's metrics (2048 units per em, a 1233-unit cell), so the logo sits on
// the text's line: as tall as the capitals (1493), centred on them. It overflows into the next
// cell, which the prompt leaves blank, as Nerd Font icons do.
const UNITS_PER_EM = 2048;
const ASCENDER = 2001;
const DESCENDER = -583;
const CELL = 1233;
const HEIGHT = 1550;
const MIDDLE = 1493 / 2;

type Point = readonly [x: number, y: number];

const polylines = (path: string): Point[][] =>
  path
    .split("M")
    .filter((run) => run.trim() !== "")
    .map((run) =>
      run.split("L").map((pair) => {
        const [x = 0, y = 0] = pair.trim().split(/\s+/v).map(Number);

        return [x, y] as const;
      }),
    );

const sub = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
const scale = (a: Point, k: number): Point => [a[0] * k, a[1] * k];
const unit = (a: Point): Point => scale(a, 1 / Math.hypot(a[0], a[1]));
const cross = (a: Point, b: Point): number => a[0] * b[1] - a[1] * b[0];

/** Where the line through `a` along `da` meets the line through `b` along `db` (a miter). */
const intersect = (a: Point, da: Point, b: Point, db: Point): Point =>
  add(a, scale(da, cross(sub(b, a), db) / cross(da, db)));

/** The outline of a polyline stroked `width` wide, with square caps and miter joins. */
const stroke = (points: readonly Point[], width: number): Point[] => {
  const half = width / 2;
  const directions = points.slice(1).map((point, i) => unit(sub(point, points[i] ?? point)));
  const first = directions[0] ?? [1, 0];
  const last = directions.at(-1) ?? first;
  const start = sub(points[0] ?? [0, 0], scale(first, half));
  const end = add(points.at(-1) ?? [0, 0], scale(last, half));

  const side = (sign: 1 | -1): Point[] => {
    const offset = (d: Point): Point => scale([-d[1], d[0]], half * sign);
    const joins = directions.slice(1).map((d, i) => {
      const previous = directions[i] ?? d;
      const corner = points[i + 1] ?? [0, 0];

      return intersect(add(corner, offset(previous)), previous, add(corner, offset(d)), d);
    });

    return [add(start, offset(first)), ...joins, add(end, offset(last))];
  };

  return [...side(1), ...side(-1).toReversed()];
};

const glyphPath = (): opentype.Path => {
  const contours = polylines(LOGO.path).map((line) => stroke(line, LOGO.strokeWidth));
  const xs = contours.flat().map(([x]) => x);
  const ys = contours.flat().map(([, y]) => y);
  const left = Math.min(...xs);
  const [top, bottom] = [Math.min(...ys), Math.max(...ys)];
  const k = HEIGHT / (bottom - top);
  // SVG y runs down, font y up
  const place = ([x, y]: Point): Point => [
    Math.round(CELL * 0.05 + (x - left) * k),
    Math.round(MIDDLE + ((top + bottom) / 2 - y) * k),
  ];
  const path = new opentype.Path();

  for (const contour of contours) {
    // Counter-clockwise in font space, as CFF outlines go
    const placed = contour.map(place).toReversed();

    for (const [i, [x, y]] of placed.entries()) {
      if (i === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    }
    path.close();
  }

  return path;
};

const font = new opentype.Font({
  familyName: "Bereghici Symbols",
  styleName: "Regular",
  unitsPerEm: UNITS_PER_EM,
  ascender: ASCENDER,
  descender: DESCENDER,
  glyphs: [
    new opentype.Glyph({ name: ".notdef", advanceWidth: CELL, path: new opentype.Path() }),
    new opentype.Glyph({
      name: "bereghici",
      unicode: CODE_POINT,
      advanceWidth: CELL,
      path: glyphPath(),
    }),
  ],
});

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, Buffer.from(font.toArrayBuffer()));
console.log(`wrote ${OUTPUT}`);
