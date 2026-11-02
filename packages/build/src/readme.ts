import { CONTRAST, measure } from "@repo/palette/contrast";
import { ROLES, terminalIndex } from "@repo/palette";
import type { Palette } from "@repo/palette";

import { CHECKS, pinnedVersion, toolName } from "./checks.ts";
import { CATEGORIES, SWITCHES, sorted } from "./registry.ts";
import type { InstallStep, PortEntry, Registry, UsageStep } from "./registry.ts";

/** A Markdown table with its columns padded, as oxfmt pads them, so `pnpm format` agrees. */
const table = (header: readonly string[], rows: readonly (readonly string[])[]): string => {
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
      const index = terminalIndex(role);

      return [
        code(role),
        code(palette.dark.colors[role].hex),
        code(palette.light.colors[role].hex),
        index === undefined ? "background" : `ANSI ${index}`,
      ];
    }),
  );

/** Every tool `pnpm test` runs on the themes, and what passing proves. */
export const verificationTable = (registry: Registry): string =>
  table(
    ["Port", "Tool", "Proves"],
    CHECKS.map((check) => [
      `[${registry[check.port]?.name ?? check.port}](ports/${check.port})`,
      check.version ?? `${toolName(check.tool)} ${pinnedVersion(check.tool) ?? ""}`,
      check.claim,
    ]),
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
  none: "",
} as const satisfies Record<PortEntry["switches"], string>;

const FLAVOR_NAMES = {
  dark: "Bereghici Dark",
  light: "Bereghici Light",
  terminal: "Terminal: the terminal's ANSI colors, so it switches with a Bereghici terminal theme",
  both: "Bereghici Dark and Light",
} as const;

/** A file or folder in a port's `themes/`, and the flavor it was rendered in. */
export interface ThemeFile {
  readonly name: string;
  readonly flavor?: keyof typeof FLAVOR_NAMES;
}

/** What `pnpm test` proves about a port, for its README. */
export interface Evidence {
  readonly claim: string;
  /** The test file, from the repository root */
  readonly test: string;
  /** The tool and version it runs, if any */
  readonly tool?: string;
}

const HOME = "~/.local/share/bereghici";

const FENCE = "```";

const step = (index: number, { text, code: config, lang }: UsageStep): string =>
  [
    `${index + 1}. ${text}`,
    ...(config === undefined
      ? []
      : [
          "",
          `   ${FENCE}${lang}`,
          ...config
            .trimEnd()
            .split("\n")
            .map((line) => `   ${line}`.trimEnd()),
          `   ${FENCE}`,
        ]),
  ].join("\n");

/** Where install.sh puts each file, as the README's Install section lists it. */
const installed = (id: string, install: readonly InstallStep[]): string[] =>
  install.flatMap((s) => {
    const to = s.to === undefined ? "" : `\`${s.to}\``;

    if (s.link !== undefined) return [`- links \`${HOME}/ports/${id}/${s.link}\` at ${to}`];
    if (s.copy !== undefined) return [`- copies \`${HOME}/ports/${id}/${s.copy}\` to ${to}`];
    if (s.switch !== undefined) {
      return [
        `- links ${to} at \`${s.switch.replace("{appearance}", "dark")}\` or \`${s.switch.replace("{appearance}", "light")}\`, for the current appearance`,
      ];
    }

    return [
      `- runs \`${s.run}\`${s.when === undefined ? "" : `, when \`${s.when.replaceAll(" ", "` and `")}\` exist${s.when.includes(" ") ? "" : "s"}`}`,
    ];
  });

/** A port's README, in the one layout every port shares. */
export const portReadme = (
  id: string,
  entry: PortEntry,
  themes: readonly ThemeFile[],
  evidence: readonly Evidence[],
): string => {
  const sections: string[][] = [
    [
      `# Bereghici for ${entry.name}`,
      "",
      "<!-- Generated from ports.yml by `pnpm build`: edit it there. -->",
      "",
      `Bereghici for [${entry.name}](${entry.url}). ${SWITCHING[entry.switches]}`.trimEnd(),
    ],
  ];

  if (entry.requires !== undefined) {
    sections.push([
      "## Requirements",
      "",
      `${entry.requires.version} or later ([source](${entry.requires.source})).`,
    ]);
  }
  if (entry.install !== undefined) {
    sections.push([
      "## Install",
      "",
      `Run the repository's [\`install.sh\`](../../install.sh) from a clone at \`${HOME}\` (or linked there). For ${entry.name}, it:`,
      "",
      ...installed(id, entry.install),
    ]);
  }
  sections.push([
    "## Usage",
    "",
    entry.usage.map((s, i) => step(i, s)).join("\n\n"),
    "",
    `See ${entry.name}'s [documentation](${entry.docs}).`,
  ]);
  if (themes.length > 0) {
    sections.push([
      "## Files",
      "",
      table(
        ["File", "Flavor"],
        themes.map((theme) => [
          `[${theme.name}](themes/${theme.name})`,
          theme.flavor === undefined ? "—" : FLAVOR_NAMES[theme.flavor],
        ]),
      ),
    ]);
  }
  sections.push([
    "## Verification",
    "",
    "`pnpm test` checks this port on every push to `main` and every pull request ([CI](../../.github/workflows/ci.yml)):",
    "",
    ...evidence.map(
      (e) =>
        `- ${e.claim}${e.tool === undefined ? "" : ` (${e.tool})`}: [\`${e.test.split("/").at(-1)}\`](../../${e.test})`,
    ),
  ]);
  if (entry.notes !== undefined) sections.push(["## Notes", "", entry.notes]);

  return `${sections.map((lines) => lines.join("\n")).join("\n\n")}\n`;
};
