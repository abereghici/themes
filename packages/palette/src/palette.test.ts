import { describe, expect, it } from "vitest";

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
        expect(variant.colors[a].hex, `${a} vs ${b}`).not.toBe(variant.colors[b].hex);
      }
    }
  });
});
