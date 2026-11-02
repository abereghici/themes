import { readFileSync } from "node:fs";
import { join } from "node:path";

import opentype from "opentype.js";
import { describe, expect, it } from "vitest";

const FONT = join(import.meta.dirname, "../../../ports/font/themes/BereghiciSymbols.otf");

describe("Bereghici Symbols", () => {
  const file = readFileSync(FONT);
  // A small Buffer shares a larger pool: parse only the font's own bytes
  const font = opentype.parse(
    file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength),
  );

  it("is named Bereghici Symbols", () => {
    expect(font.getEnglishName("fontFamily")).toBe("Bereghici Symbols");
  });

  it("draws the logo at U+100000", () => {
    const glyph = font.charToGlyph(String.fromCodePoint(0x10_00_00));

    expect(glyph.name).toBe("bereghici");
    expect(glyph.path.commands.length).toBeGreaterThan(0);
  });
});
