import { CONTRAST, measure } from "@repo/palette/contrast";
import { ROLES, TERMINAL_COLORS } from "@repo/palette";
import type { Palette } from "@repo/palette";

import { CATEGORIES, SWITCHES, sorted } from "./registry.ts";
import type { PortEntry, Registry } from "./registry.ts";

/** A Markdown table with its columns padded, as oxfmt pads them, so `pnpm format` agrees. */
export const table = (header: readonly string[], rows: readonly (readonly string[])[]): string => {
  const widths = header.map((title, i) =>
    Math.max(title.length, ...rows.map((row) => row[i]?.length ?? 0)),
  );
  const line = (cells: readonly string[]) =>
    `| ${cells.map((cell, i) => cell.padEnd(widths[i] ?? 0)).join(" | ")} |`;

  return [line(header), line(widths.map((width) => "-".repeat(width))), ...rows.map(line)].join(
    "\n",
  );
};

/**
 * Replaces each `<!-- generated:<name> -->` … `<!-- /generated:<name> -->` section of a README,
 * with the blank lines oxfmt keeps around a block.
 */
export const withSections = (readme: string, sections: Readonly<Record<string, string>>): string =>
  Object.entries(sections).reduce((text, [name, content]) => {
    const start = `<!-- generated:${name} -->\n`;
    const end = `\n<!-- /generated:${name} -->`;
    const from = text.indexOf(start);
    const to = text.indexOf(end);

    if (from === -1 || to === -1) throw new Error(`README.md has no generated:${name} section`);

    return `${text.slice(0, from + start.length)}\n${content}\n${text.slice(to)}`;
  }, readme);

export const portsTable = (registry: Registry): string =>
  table(
    ["Port", "For", "Switches"],
    sorted(registry).map(([id, entry]) => [
      `[${entry.name}](ports/${id})`,
      CATEGORIES[entry.category],
      SWITCHES[entry.switches],
    ]),
  );

const code = (text: string): string => `\`${text}\``;

export const paletteTable = (palette: Palette): string =>
  table(
    ["Role", "Dark", "Light", "Terminal"],
    ROLES.map((role) => {
      const index: number | undefined = Reflect.get(TERMINAL_COLORS, role);

      return [
        code(role),
        code(palette.dark.colors[role].hex),
        code(palette.light.colors[role].hex),
        index === undefined ? "background" : `ANSI ${index}`,
      ];
    }),
  );

const ratio = (value: number): string => value.toFixed(2);

/** One table per contrast group: each pair, its minimum and its measured ratio in both variants. */
export const contrastTables = (palette: Palette): string =>
  CONTRAST.map((group) =>
    [
      `**${group.title}**`,
      "",
      table(
        ["Foreground", "Background", "Minimum", "Dark", "Light"],
        group.pairs.map((pair) => {
          const measured = measure(palette, pair);

          return [
            code(pair.foreground),
            code(pair.background),
            ratio(pair.minimum),
            ratio(measured.ratio.dark),
            ratio(measured.ratio.light),
          ];
        }),
      ),
    ].join("\n"),
  ).join("\n\n");

const SWITCHING = {
  live: "It follows the macOS appearance live.",
  "on start": "It picks the macOS appearance's theme each time it starts.",
  sync: "It follows the macOS appearance through `install.sh sync dark|light`, which repoints its theme.",
  manual: "It doesn't follow the macOS appearance: pick Dark or Light.",
} as const satisfies Record<PortEntry["switches"], string>;

const FLAVOR_NAMES = {
  dark: "Bereghici Dark",
  light: "Bereghici Light",
  terminal: "The terminal's ANSI colors: switches with a Bereghici terminal theme",
  both: "Bereghici Dark and Light",
} as const;

/** A file or folder in a port's `themes/`, and the flavor it was rendered in. */
export interface ThemeFile {
  readonly name: string;
  readonly flavor?: keyof typeof FLAVOR_NAMES;
}

/** A port's README, in the one layout every port shares. */
export const portReadme = (entry: PortEntry, themes: readonly ThemeFile[]): string => {
  const steps = [
    ...(entry.install === undefined
      ? []
      : ["Run the repository's [`install.sh`](../../install.sh), which puts the themes in place."]),
    ...entry.usage,
  ];

  return [
    `# Bereghici for ${entry.name}`,
    "",
    "<!-- Generated from ports.yml by `pnpm build`: edit it there. -->",
    "",
    `Bereghici for [${entry.name}](${entry.url}). ${SWITCHING[entry.switches]}`,
    ...(themes.length === 0
      ? []
      : [
          "",
          "## Themes",
          "",
          "| Theme | |",
          "| --- | --- |",
          ...themes.map(
            (theme) =>
              `| [${theme.name}](themes/${theme.name}) | ${theme.flavor === undefined ? "" : FLAVOR_NAMES[theme.flavor]} |`,
          ),
        ]),
    "",
    "## Usage",
    "",
    ...steps.map((step, i) => `${i + 1}. ${step}`),
    ...(entry.notes === undefined ? [] : ["", "## Notes", "", entry.notes]),
    "",
  ].join("\n");
};
