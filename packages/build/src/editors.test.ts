import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { XMLParser } from "fast-xml-parser";
import { describe, expect, it } from "vitest";

import { APPEARANCES, loadPalette } from "@repo/palette";
import type { Appearance, Role } from "@repo/palette";

import { PORTS_DIR } from "./index.ts";

/** A TextMate rule, as VS Code and .tmTheme files both write it. */
interface Rule {
  readonly selectors: readonly string[];
  readonly foreground: string | undefined;
  readonly italic: boolean;
}

/**
 * The rule TextMate applies to a scope: the longest selector that is the scope or one of its
 * parents (`keyword` matches `keyword.control.ts`). Descendant selectors (`a b`) never match a
 * single scope, so they're left out, as are later rules that only add a font style.
 */
const ruleFor = (rules: readonly Rule[], scope: string): Rule | undefined => {
  let best: { rule: Rule; length: number } | undefined;

  for (const rule of rules) {
    for (const selector of rule.selectors) {
      const matches = scope === selector || scope.startsWith(`${selector}.`);

      if (matches && rule.foreground !== undefined && selector.length >= (best?.length ?? 0)) {
        best = { rule, length: selector.length };
      }
    }
  }

  return best?.rule;
};

const vscodeRules = (appearance: Appearance): Rule[] => {
  const theme = JSON.parse(
    readFileSync(join(PORTS_DIR, `vscode/themes/bereghici-${appearance}-color-theme.json`), "utf8"),
  ) as {
    tokenColors: {
      scope?: string | string[];
      settings: { foreground?: string; fontStyle?: string };
    }[];
  };

  return theme.tokenColors.map(({ scope, settings }) => ({
    selectors: [scope ?? []].flat().flatMap((s) => s.split(",").map((part) => part.trim())),
    foreground: settings.foreground?.toLowerCase(),
    italic: settings.fontStyle?.includes("italic") ?? false,
  }));
};

const textMateRules = (appearance: Appearance): Rule[] => {
  const plist = new XMLParser().parse(
    readFileSync(join(PORTS_DIR, `bat/themes/bereghici-${appearance}.tmTheme`), "utf8"),
  ) as {
    plist: { dict: { array: { dict: { key: string[]; string: string[]; dict?: unknown }[] } } };
  };

  return plist.plist.dict.array.dict.flatMap((entry) => {
    const keys = [entry.key].flat();
    const strings = [entry.string].flat();
    const scope = strings[keys.indexOf("scope")];
    const settings = entry.dict as
      | { key: string | string[]; string: string | string[] }
      | undefined;

    if (scope === undefined || settings === undefined) return [];

    const settingKeys = [settings.key].flat();
    const values = [settings.string].flat();
    const value = (key: string) => values[settingKeys.indexOf(key)];

    return [
      {
        selectors: scope.split(",").map((part) => part.trim()),
        foreground: value("foreground")?.toLowerCase(),
        italic: value("fontStyle")?.includes("italic") ?? false,
      },
    ];
  });
};

/** One row of CONTRIBUTING's syntax table: a sample of it in each editor, and its role. */
interface Sample {
  readonly code: string;
  readonly nvim: string;
  readonly scope: string;
  readonly role: Role;
  readonly italic?: boolean;
}

const SAMPLES: readonly Sample[] = [
  {
    code: "keywords",
    nvim: "@keyword.conditional",
    scope: "keyword.control.conditional.ts",
    role: "magenta",
  },
  { code: "return", nvim: "@keyword.return", scope: "keyword.control.flow.ts", role: "magenta" },
  { code: "tags", nvim: "@tag", scope: "entity.name.tag.html", role: "magenta" },
  {
    code: "this",
    nvim: "@variable.builtin",
    scope: "variable.language.this.ts",
    role: "magenta",
    italic: true,
  },
  {
    code: "parameters",
    nvim: "@variable.parameter",
    scope: "variable.parameter.ts",
    role: "magentaBright",
  },
  { code: "functions", nvim: "@function", scope: "entity.name.function.ts", role: "green" },
  { code: "strings", nvim: "@string", scope: "string.quoted.double.ts", role: "yellow" },
  {
    code: "regular expressions",
    nvim: "@string.regexp",
    scope: "string.regexp.ts",
    role: "yellowBright",
  },
  { code: "types", nvim: "@type", scope: "entity.name.type.ts", role: "cyan" },
  { code: "numbers", nvim: "@number", scope: "constant.numeric.decimal.ts", role: "cyan" },
  { code: "escapes", nvim: "@string.escape", scope: "constant.character.escape.ts", role: "cyan" },
  { code: "JSX components", nvim: "@tag.tsx", scope: "support.class.component.tsx", role: "cyan" },
  { code: "properties", nvim: "@property", scope: "variable.other.property.ts", role: "blue" },
  {
    code: "attributes",
    nvim: "@tag.attribute",
    scope: "entity.other.attribute-name.html",
    role: "blue",
  },
  {
    code: "Markdown headings",
    nvim: "@markup.heading",
    scope: "markup.heading.markdown",
    role: "blue",
  },
  { code: "variables", nvim: "@variable", scope: "variable.other.readwrite.ts", role: "text" },
  {
    code: "operators",
    nvim: "@operator",
    scope: "keyword.operator.arithmetic.ts",
    role: "textSubtle",
  },
  {
    code: "comments",
    nvim: "@comment",
    scope: "comment.line.double-slash.ts",
    role: "textSubtlest",
    italic: true,
  },
  {
    code: "inline code",
    nvim: "@markup.raw",
    scope: "markup.inline.raw.string.markdown",
    role: "cyan",
  },
  {
    code: "list markers",
    nvim: "@markup.list",
    scope: "punctuation.definition.list.begin.markdown",
    role: "cyan",
  },
  {
    code: "code blocks",
    nvim: "@markup.raw.block",
    scope: "markup.raw.block.markdown",
    role: "text",
  },
  {
    code: "links",
    nvim: "@markup.link.label",
    scope: "string.other.link.title.markdown",
    role: "magenta",
  },
];

/** Groups `transparent` leaves without a background, as the README's Transparency section says. */
const TRANSPARENT = [
  "Normal",
  "NormalNC",
  "NormalFloat",
  "SignColumn",
  "LineNr",
  "StatusLine",
  "TabLine",
  "TabLineFill",
  "Folded",
  "LspInlayHint",
  "DiagnosticVirtualTextError",
  "SnacksDashboardNormal",
];

interface Loaded {
  readonly broken: readonly string[] | Record<string, never>;
  readonly groups: Record<string, { fg?: string; bg?: string; italic: boolean }>;
}

const nvim = JSON.parse(
  execFileSync(
    "nvim",
    [
      "--clean",
      "--headless",
      "-l",
      join(import.meta.dirname, "nvim.lua"),
      join(PORTS_DIR, "nvim"),
      JSON.stringify([...SAMPLES.map((sample) => sample.nvim), ...TRANSPARENT]),
    ],
    { encoding: "utf8" },
  ),
) as Record<string, Loaded>;

const palette = await loadPalette();

describe("Neovim", () => {
  it.each(Object.keys(nvim))("%s links only to groups that exist, with hex colors", (run) => {
    expect(Object.values(nvim[run]?.broken ?? [])).toEqual([]);
  });

  it.each(APPEARANCES)("%s has a background, and none with transparent", (appearance) => {
    expect(nvim[appearance]?.groups["Normal"]?.bg).toBe(palette[appearance].colors.surface.hex);

    for (const group of TRANSPARENT) {
      expect(nvim[`${appearance}-transparent`]?.groups[group]?.bg, group).toBeUndefined();
    }
  });
});

describe.each(APPEARANCES)("the editors color %s code the same way", (appearance) => {
  const vscode = vscodeRules(appearance);
  const textMate = textMateRules(appearance);

  it.each(SAMPLES)("$code", ({ nvim: group, scope, role, italic = false }) => {
    const expected = palette[appearance].colors[role].hex;
    const neovim = nvim[appearance]?.groups[group];

    expect({
      nvim: neovim?.fg,
      vscode: ruleFor(vscode, scope)?.foreground,
      textMate: ruleFor(textMate, scope)?.foreground,
    }).toEqual({ nvim: expected, vscode: expected, textMate: expected });

    if (italic) {
      expect(neovim?.italic).toBe(true);
      expect(ruleFor(vscode, scope)?.italic).toBe(true);
      expect(ruleFor(textMate, scope)?.italic).toBe(true);
    }
  });
});
