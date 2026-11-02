import { fileURLToPath } from "node:url";

import StyleDictionary from "style-dictionary";
import { getReferences } from "style-dictionary/utils";

import type { Dictionary, TransformedToken } from "style-dictionary/types";

import { hexToRgb, mixOklab } from "./color.ts";

/** Where a themed token keeps its dark value; the light value is its `$value`. */
const THEME_EXTENSION = "com.bereghici.theme";

const designToken = (file: string): string =>
  fileURLToPath(import.meta.resolve(`@abereghici/tokens/source/${file}.tokens.json`));

/** The design system's palette and roles, then the terminal roles this repository maps onto them. */
const SOURCES = [
  designToken("primitive"),
  designToken("semantic"),
  `${import.meta.dirname}/tokens/terminal.tokens.json`,
];

export const APPEARANCES = ["dark", "light"] as const;

export type Appearance = (typeof APPEARANCES)[number];

/**
 * What a theme is generated in: Bereghici Dark and Light in their own colors, and `terminal`,
 * which names each role by the ANSI color a Bereghici terminal theme gives it, so a tool themed
 * that way switches with the terminal.
 */
export const FLAVORS = ["dark", "light", "terminal"] as const;

export type FlavorId = (typeof FLAVORS)[number];

/** The terminal roles, in `terminal.tokens.json` order, keyed as templates name them. */
export const ROLES = [
  "surface",
  "surfaceRaised",
  "surfaceNested",
  "textSubtlest",
  "textSubtle",
  "text",
  "lineHighlight",
  "selection",
  "border",
  "accent",
  "red",
  "yellow",
  "green",
  "cyan",
  "blue",
  "magenta",
  "redBright",
  "yellowBright",
  "greenBright",
  "cyanBright",
  "blueBright",
  "magentaBright",
] as const;

export type Role = (typeof ROLES)[number];

/** The forms of a color every flavor has, so one template can render in all three. */
interface ColorRef {
  /** How most tools take a color: `#rrggbb`, or the ANSI index in the terminal flavor */
  readonly ref: string;
  /** The SGR parameters that set it as the foreground: `38;2;r;g;b`, or `31` */
  readonly sgr: string;
  /** … and as the background: `48;2;r;g;b`, or `41` */
  readonly sgrBg: string;
}

export interface Color extends ColorRef {
  /** `#rrggbb` */
  readonly hex: string;
  /** `rrggbb` */
  readonly bare: string;
  /** `r, g, b` in 0–255 */
  readonly rgb: string;
  /** `r,g,b` in 0–255 */
  readonly rgbCsv: string;
}

export interface TerminalColor extends ColorRef {
  /** 0–15 */
  readonly index: number;
  /** `red`, `bright-red`… */
  readonly name: string;
}

export interface AnsiColor extends Color {
  /** 0–15 */
  readonly index: number;
}

/** Opaque tints of a role over `surface`, for diff and search backgrounds that can't be translucent. */
export const TINTS = {
  added: { role: "green", amount: 0.16 },
  addedEmphasis: { role: "green", amount: 0.32 },
  removed: { role: "red", amount: 0.16 },
  removedEmphasis: { role: "red", amount: 0.32 },
  // The changed words of a line, where a tool has a third, stronger diff shade
  addedStrong: { role: "green", amount: 0.48 },
  removedStrong: { role: "red", amount: 0.48 },
  changed: { role: "blue", amount: 0.16 },
  changedEmphasis: { role: "blue", amount: 0.32 },
  search: { role: "yellow", amount: 0.24 },
} as const satisfies Record<string, { role: Role; amount: number }>;

export type Tint = keyof typeof TINTS;

interface FlavorBase {
  /** File-name form: `bereghici-dark` */
  readonly id: string;
  /** Display form: `Bereghici Dark` */
  readonly name: string;
  readonly flavor: FlavorId;
  /** For Mustache sections such as `{{#isDark}}` */
  readonly isDark: boolean;
  readonly isTerminal: boolean;
}

/** Bereghici Dark or Light. */
export interface Variant extends FlavorBase {
  readonly appearance: Appearance;
  readonly colors: Readonly<Record<Role, Color>>;
  readonly tints: Readonly<Record<Tint, Color>>;
  /** ANSI 0–15, in order */
  readonly ansi: readonly AnsiColor[];
}

/** The ANSI color the terminal flavor gives each role; a terminal has none for the others. */
export const TERMINAL_COLORS = {
  surfaceNested: 0,
  lineHighlight: 0,
  selection: 0,
  border: 8,
  textSubtlest: 8,
  textSubtle: 7,
  text: 15,
  // The moss brand accent's nearest terminal color
  accent: 2,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  magenta: 5,
  cyan: 6,
  redBright: 9,
  greenBright: 10,
  yellowBright: 11,
  blueBright: 12,
  magentaBright: 13,
  cyanBright: 14,
} as const satisfies Partial<Record<Role, number>>;

/** The ANSI color the terminal flavor gives a role, or undefined for a role it leaves out. */
export const terminalIndex = (role: Role): number | undefined =>
  Object.hasOwn(TERMINAL_COLORS, role)
    ? TERMINAL_COLORS[role as keyof typeof TERMINAL_COLORS]
    : undefined;

/** The six hues, each with a bright pair (`redBright`…). */
export const HUES = ["red", "yellow", "green", "cyan", "blue", "magenta"] as const;

const ANSI_NAMES = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];

/**
 * The terminal flavor. `surface` and `surfaceRaised` are the terminal's own background, so they're `null`:
 * a template guards them with `{{#colors.surface}}…{{/colors.surface}}{{^colors.surface}}…{{/colors.surface}}`.
 */
export interface TerminalFlavor extends FlavorBase {
  readonly colors: Readonly<Record<Role, TerminalColor | null>>;
}

const terminalColor = (index: number): TerminalColor => {
  const bright = index >= 8;
  const code = index % 8;

  return {
    ref: String(index),
    sgr: String((bright ? 90 : 30) + code),
    sgrBg: String((bright ? 100 : 40) + code),
    index,
    name: `${bright ? "bright-" : ""}${ANSI_NAMES[code] ?? "white"}`,
  };
};

const TERMINAL: TerminalFlavor = {
  id: "bereghici-terminal",
  name: "Bereghici Terminal",
  flavor: "terminal",
  isDark: false,
  isTerminal: true,
  colors: Object.fromEntries(
    ROLES.map((role) => {
      const index = terminalIndex(role);

      return [role, index === undefined ? null : terminalColor(index)];
    }),
  ) as Record<Role, TerminalColor | null>,
};

const kebab = (role: string): string => role.replaceAll(/[A-Z]/gv, (c) => `-${c.toLowerCase()}`);

const color = (hex: string): Color => {
  const rgb = hexToRgb(hex).map((channel) => Math.round(channel * 255));

  return {
    ref: hex.toLowerCase(),
    sgr: `38;2;${rgb.join(";")}`,
    sgrBg: `48;2;${rgb.join(";")}`,
    hex: hex.toLowerCase(),
    bare: hex.slice(1).toLowerCase(),
    rgb: rgb.join(", "),
    rgbCsv: rgb.join(","),
  };
};

const darkOf = (extensions: unknown): unknown => {
  if (typeof extensions !== "object" || extensions === null) return undefined;

  const entry: unknown = Reflect.get(extensions, THEME_EXTENSION);

  return typeof entry === "object" && entry !== null ? Reflect.get(entry, "dark") : undefined;
};

/** The token `value` references when the whole value is one reference, such as `{semantic.color-text}`. */
const referencedToken = (value: unknown, dictionary: Dictionary): TransformedToken | undefined => {
  if (typeof value !== "string") return undefined;

  const [target, ...more] = getReferences(value, dictionary.tokens, { warnImmediately: false });

  return more.length === 0 && value === `{${target?.path.join(".")}}` ? target : undefined;
};

/** A token's hex in one appearance, following references and each token's own dark value. */
const hexIn = (token: TransformedToken, appearance: Appearance, dictionary: Dictionary): string => {
  const authoredDark = darkOf(token.original["$extensions"]);
  const ownDark = appearance === "dark" && authoredDark !== undefined;
  const authored: unknown = ownDark ? authoredDark : token.original.$value;
  const target = referencedToken(authored, dictionary);

  if (target !== undefined) return hexIn(target, appearance, dictionary);

  const value: unknown = ownDark ? darkOf(token["$extensions"]) : token.$value;

  if (typeof value !== "string") throw new Error(`${token.name} has no ${appearance} hex value`);

  return value;
};

export interface Palette {
  readonly dark: Variant;
  readonly light: Variant;
  readonly terminal: TerminalFlavor;
}

/** Resolves the terminal tier of the token source into both variants. */
export async function loadPalette(): Promise<Palette> {
  const sd = new StyleDictionary({
    source: SOURCES,
    log: { verbosity: "silent", warnings: "error" },
    platforms: { terminal: { transforms: ["name/kebab", "color/hex"] } },
  });
  const dictionary = await sd.getPlatformTokens("terminal");
  const token = (name: string): TransformedToken => {
    const found = dictionary.allTokens.find((t) => t.path.join(".") === `terminal.color-${name}`);

    if (found === undefined) throw new Error(`Missing token terminal.color-${name}`);

    return found;
  };

  const variant = (appearance: Appearance): Variant => {
    const colors = Object.fromEntries(
      ROLES.map((role) => [role, color(hexIn(token(kebab(role)), appearance, dictionary))]),
    ) as Record<Role, Color>;
    const ansi = Array.from({ length: 16 }, (_, index) => ({
      index,
      ...color(hexIn(token(`ansi-${index}`), appearance, dictionary)),
    }));
    const tints = Object.fromEntries(
      Object.entries(TINTS).map(([tint, { role, amount }]) => [
        tint,
        color(mixOklab(colors.surface.hex, colors[role].hex, amount)),
      ]),
    ) as Record<Tint, Color>;
    const title = appearance === "dark" ? "Dark" : "Light";

    return {
      id: `bereghici-${appearance}`,
      name: `Bereghici ${title}`,
      flavor: appearance,
      appearance,
      isDark: appearance === "dark",
      isTerminal: false,
      colors,
      tints,
      ansi,
    };
  };

  return { dark: variant("dark"), light: variant("light"), terminal: TERMINAL };
}
