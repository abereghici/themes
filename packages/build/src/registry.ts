/** ports.yml, the registry of ports, as Catppuccin keeps one: what the READMEs and install.sh are generated from. */
import { readFileSync } from "node:fs";

import { parse } from "yaml";

export const CATEGORIES = {
  terminal: "Terminal",
  editor: "Editors",
  cli: "Command line",
  shell: "Shell",
  app: "Apps",
  browser: "Browser",
  font: "Font",
} as const;

export type Category = keyof typeof CATEGORIES;

/** How the tool picks Bereghici Dark or Light when macOS switches. */
export const SWITCHES = {
  live: "live",
  "on start": "on start",
  sync: "through `install.sh sync`",
  manual: "by hand",
  none: "—",
} as const;

/**
 * One step of installing a port, from the port's directory:
 * - `link: <path>` → `to`: a symlink, so a rebuilt theme applies without installing again
 * - `copy: <path>` → `to`: a copy, for what can't be a link (macOS skips linked fonts)
 * - `switch: <path with {appearance}>` → `to`: a link `install.sh sync` points at the appearance
 * - `run: <command>`, when every command `when` names exists (rebuilding bat's cache)
 */
export interface InstallStep {
  readonly link?: string;
  readonly copy?: string;
  readonly switch?: string;
  readonly to?: string;
  readonly run?: string;
  readonly when?: string;
}

/** A step of a port's usage: what to do, and the config to add for it. */
export interface UsageStep {
  readonly text: string;
  readonly code?: string;
  /** The code's language, for the README's syntax highlighting */
  readonly lang?: string;
}

export interface PortEntry {
  readonly name: string;
  readonly url: string;
  /** The tool's documentation of what the usage relies on */
  readonly docs: string;
  /** The oldest version with every feature the port uses, and where that's documented */
  readonly requires?: { readonly version: string; readonly source: string };
  readonly category: Category;
  readonly switches: keyof typeof SWITCHES;
  readonly install?: readonly InstallStep[];
  readonly usage: readonly UsageStep[];
  readonly notes?: string;
}

export type Registry = Readonly<Record<string, PortEntry>>;

/** What would expand or end a double-quoted path in install.sh. */
const UNSAFE_IN_QUOTES = /["$`\\]/v;

const isText = (value: unknown): value is string => typeof value === "string" && value !== "";

const isUrl = (value: unknown): boolean => isText(value) && URL.canParse(value);

/** The entry, when it has everything README and install.sh generation need; throws otherwise. */
const validate = (id: string, entry: Record<string, unknown>): PortEntry => {
  const fail = (message: string): never => {
    throw new Error(`ports.yml ${id}: ${message}`);
  };
  const requires = entry["requires"] as Record<string, unknown> | undefined;

  if (!isText(entry["name"])) fail("no name");
  if (!isUrl(entry["url"])) fail("url isn't a URL");
  if (!isUrl(entry["docs"])) fail("docs isn't a URL");
  if (requires !== undefined && (!isText(requires["version"]) || !isUrl(requires["source"]))) {
    fail("requires needs a version and a source URL");
  }
  if (!Object.hasOwn(CATEGORIES, String(entry["category"]))) fail("unknown category");
  if (!Object.hasOwn(SWITCHES, String(entry["switches"]))) fail("unknown switches");
  if (entry["notes"] !== undefined && !isText(entry["notes"])) fail("notes isn't text");

  const usage = entry["usage"];

  if (!Array.isArray(usage) || usage.length === 0) fail("no usage");
  for (const step of usage as unknown[]) {
    const { text, code, lang } = (typeof step === "object" && step !== null ? step : {}) as Record<
      string,
      unknown
    >;

    if (!isText(text)) fail("a usage step needs text");
    if (code !== undefined && (!isText(code) || !isText(lang)))
      fail("a usage step's code needs a lang");
  }

  for (const step of (entry["install"] ?? []) as InstallStep[]) {
    const kinds = [step.link, step.copy, step.switch, step.run].filter((k) => k !== undefined);

    if (kinds.length !== 1) fail("a step does one thing");
    for (const target of [step.link, step.copy, step.switch, step.to]) {
      if (target !== undefined && UNSAFE_IN_QUOTES.test(target)) {
        fail(`${target} has a character install.sh can't quote`);
      }
    }
    if (step.when !== undefined && !/^[\w.+\-]+(?: [\w.+\-]+)*$/v.test(step.when)) {
      fail('"when" names commands, separated by spaces');
    }
    if (step.run?.includes("'")) fail("a \"run\" can't hold a '");
    if (step.run === undefined && step.to === undefined) {
      fail(`a ${step.link ? "link" : step.copy ? "copy" : "switch"} step needs a "to"`);
    }
  }

  return entry as unknown as PortEntry;
};

export const loadRegistry = (path: string, portIds: readonly string[]): Registry => {
  const registry = parse(readFileSync(path, "utf8")) as Record<string, Record<string, unknown>>;
  const missing = portIds.filter((id) => !Object.hasOwn(registry, id));
  const unknown = Object.keys(registry).filter((id) => !portIds.includes(id));

  if (missing.length > 0) throw new Error(`ports.yml has no entry for ${missing.join(", ")}`);
  if (unknown.length > 0) throw new Error(`ports.yml lists ${unknown.join(", ")}, with no port`);

  return Object.fromEntries(
    Object.entries(registry).map(([id, entry]) => [id, validate(id, entry)]),
  );
};

/** The registry in README order: by category, then by name. */
export const sorted = (registry: Registry): [string, PortEntry][] =>
  Object.entries(registry).toSorted(
    ([, a], [, b]) =>
      Object.keys(CATEGORIES).indexOf(a.category) - Object.keys(CATEGORIES).indexOf(b.category) ||
      a.name.localeCompare(b.name),
  );
