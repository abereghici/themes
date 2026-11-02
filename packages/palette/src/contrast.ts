import { contrastRatio } from "./color.ts";
import { APPEARANCES, HUES, TINTS } from "./index.ts";
import type { Appearance, Palette, Role, Tint } from "./index.ts";

const BRIGHT_HUES = HUES.map((hue) => `${hue}Bright` as const);
const PANELS = ["surfaceRaised", "surfaceNested"] as const;

export interface ContrastPair {
  readonly foreground: Role;
  readonly background: Role | Tint;
  /** The WCAG 2.2 contrast ratio it must reach, in both appearances */
  readonly minimum: number;
}

export interface ContrastGroup {
  readonly title: string;
  readonly pairs: readonly ContrastPair[];
}

const pairs = (
  foregrounds: readonly Role[],
  backgrounds: readonly (Role | Tint)[],
  minimum: (foreground: Role) => number,
): ContrastPair[] =>
  foregrounds.flatMap((foreground) =>
    backgrounds.map((background) => ({ foreground, background, minimum: minimum(foreground) })),
  );

/**
 * The pairs every port relies on. 4.5 is WCAG 2.2 AA for text (SC 1.4.3) and 3 for large text and
 * user-interface marks (SC 1.4.11). Yellow and the accents on panels and the selection sit below
 * that by design, as in Catppuccin Latte: a light yellow dark enough for 4.5
 * reads as brown, and six hues can't all stay distinct at 4.5 on every background.
 */
export const CONTRAST: readonly ContrastGroup[] = [
  {
    title: "Text on the background and panels",
    pairs: [
      ...pairs(
        ["text", "textSubtle", "textSubtlest", "accent"],
        ["surface", "surfaceRaised"],
        () => 4.5,
      ),
      ...pairs(["text", "accent"], ["surfaceNested"], () => 4.5),
    ],
  },
  {
    title: "Syntax and ANSI colors on the background",
    pairs: pairs([...HUES, ...BRIGHT_HUES], ["surface"], (hue) => (hue === "yellow" ? 3 : 4.5)),
  },
  {
    title: "Syntax and ANSI colors on panels",
    pairs: pairs([...HUES, ...BRIGHT_HUES], PANELS, (hue) => (hue === "yellow" ? 2.5 : 3)),
  },
  {
    title: "Text and syntax colors on the selection",
    pairs: [...pairs(["text"], ["selection"], () => 4.5), ...pairs(HUES, ["selection"], () => 2)],
  },
  {
    title: "Text on diff and search backgrounds",
    pairs: pairs(["text"], Object.keys(TINTS) as Tint[], () => 4.5),
  },
];

export interface Measured extends ContrastPair {
  readonly ratio: Readonly<Record<Appearance, number>>;
}

const hexOf = (palette: Palette, appearance: Appearance, name: Role | Tint): string => {
  const variant = palette[appearance];

  return name in variant.tints ? variant.tints[name as Tint].hex : variant.colors[name as Role].hex;
};

/** Each pair's ratio in Bereghici Dark and Light. */
export const measure = (palette: Palette, pair: ContrastPair): Measured => ({
  ...pair,
  ratio: Object.fromEntries(
    APPEARANCES.map((appearance) => [
      appearance,
      contrastRatio(
        hexOf(palette, appearance, pair.foreground),
        hexOf(palette, appearance, pair.background),
      ),
    ]),
  ) as Record<Appearance, number>,
});
