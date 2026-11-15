import { describe, expect, it } from "vitest";

import { distance, lightness } from "./color.ts";
import { CONTRAST, measure } from "./contrast.ts";
import { APPEARANCES, HUES, loadPalette, ROLES, TERMINAL_COLORS } from "./index.ts";
import type { Role } from "./index.ts";

const palette = await loadPalette();

describe.each(APPEARANCES)("Bereghici %s", (appearance) => {
  const variant = palette[appearance];

  it("resolves every role to an opaque hex color", () => {
    for (const role of ROLES) expect(variant.colors[role].hex).toMatch(/^#[0-9a-f]{6}$/v);
  });

  it.each(CONTRAST.flatMap((group) => group.pairs))(
    "$foreground on $background: at least $minimum:1",
    (pair) => {
      expect(measure(palette, pair).ratio[appearance]).toBeGreaterThanOrEqual(pair.minimum);
    },
  );

  it("maps ANSI 0–15 to the conventional roles", () => {
    const { colors, ansi } = variant;
    const roleOf = (index: number) => ansi[index]?.hex;

    expect([1, 2, 3, 4, 5, 6].map(roleOf)).toEqual(
      ["red", "green", "yellow", "blue", "magenta", "cyan"].map((r) => colors[r as Role].hex),
    );
    expect([9, 10, 11, 12, 13, 14].map(roleOf)).toEqual(
      ["redBright", "greenBright", "yellowBright", "blueBright", "magentaBright", "cyanBright"].map(
        (r) => colors[r as Role].hex,
      ),
    );
    expect(roleOf(15)).toBe(colors.text.hex);
  });

  it("names each terminal-flavor role by the ANSI color this theme gives it", () => {
    // The highlights and accent have no ANSI color of their own, so they take the nearest
    const approximated = new Set<Role>(["lineHighlight", "selection", "border", "accent"]);

    for (const [role, index] of Object.entries(TERMINAL_COLORS)) {
      if (approximated.has(role as Role)) continue;
      expect(variant.ansi[index]?.hex, role).toBe(variant.colors[role as Role].hex);
    }
  });

  it("keeps the six syntax hues apart", () => {
    for (const [i, a] of HUES.entries()) {
      for (const b of HUES.slice(i + 1)) {
        const apart = distance(variant.colors[a].hex, variant.colors[b].hex);

        expect(apart, `${a} vs ${b}`).toBeGreaterThanOrEqual(0.06);
      }
    }
  });

  it("sets each bright hue off from its normal, away from the background", () => {
    // Bold-as-bright and the bright ANSI colors only mean something when they stand out more
    const away = appearance === "dark" ? 1 : -1;

    for (const hue of HUES) {
      const step =
        lightness(variant.colors[`${hue}Bright`].hex) - lightness(variant.colors[hue].hex);

      expect(step * away, hue).toBeGreaterThanOrEqual(0.03);
    }
  });

  it("keeps the cursor, the cursor line and the text apart", () => {
    const { colors } = variant;

    expect(distance(colors.accent.hex, colors.text.hex)).toBeGreaterThanOrEqual(0.08);
    expect(distance(colors.lineHighlight.hex, colors.surface.hex)).toBeGreaterThanOrEqual(0.05);
  });
});
