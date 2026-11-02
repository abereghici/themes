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
} as const;

/**
 * One step of installing a port, from the port's directory:
 * - `link: <path>` → `to`: a symlink, so a rebuilt theme applies without installing again
 * - `copy: <path>` → `to`: a copy, for what can't be a link (macOS skips linked fonts)
 * - `switch: <path with {appearance}>` → `to`: a link `install.sh sync` points at the appearance
 * - `run: <command>`, when the `when` command exists (rebuilding bat's cache)
 */
export interface InstallStep {
  readonly link?: string;
  readonly copy?: string;
  readonly switch?: string;
  readonly to?: string;
  readonly run?: string;
  readonly when?: string;
}

export interface PortEntry {
  readonly name: string;
  readonly url: string;
  readonly category: Category;
  readonly switches: keyof typeof SWITCHES;
  readonly install?: readonly InstallStep[];
  /** What to add to the tool's config, in Markdown: the README's numbered steps */
  readonly usage: readonly string[];
  readonly notes?: string;
}

export type Registry = Readonly<Record<string, PortEntry>>;

/** What would expand or end a double-quoted path in install.sh. */
const UNSAFE_IN_QUOTES = /["$`\\]/v;

export const loadRegistry = (path: string, portIds: readonly string[]): Registry => {
  const registry = parse(readFileSync(path, "utf8")) as Record<string, PortEntry>;
  const missing = portIds.filter((id) => !(id in registry));
  const unknown = Object.keys(registry).filter((id) => !portIds.includes(id));

  if (missing.length > 0) throw new Error(`ports.yml has no entry for ${missing.join(", ")}`);
  if (unknown.length > 0) throw new Error(`ports.yml lists ${unknown.join(", ")}, with no port`);

  for (const [id, entry] of Object.entries(registry)) {
    if (!(entry.category in CATEGORIES)) throw new Error(`ports.yml ${id}: unknown category`);
    if (!(entry.switches in SWITCHES)) throw new Error(`ports.yml ${id}: unknown switches`);
    if (!Array.isArray(entry.usage)) throw new Error(`ports.yml ${id}: no usage`);
    for (const step of entry.install ?? []) {
      const kinds = [step.link, step.copy, step.switch, step.run].filter((k) => k !== undefined);

      if (kinds.length !== 1) throw new Error(`ports.yml ${id}: a step does one thing`);
      for (const path of [step.link, step.copy, step.switch, step.to]) {
        if (path !== undefined && UNSAFE_IN_QUOTES.test(path)) {
          throw new Error(`ports.yml ${id}: ${path} has a character install.sh can't quote`);
        }
      }
      if (step.when !== undefined && !/^[\w.+\-]+$/v.test(step.when)) {
        throw new Error(`ports.yml ${id}: "when" names one command`);
      }
      if (step.run?.includes("'")) throw new Error(`ports.yml ${id}: a "run" can't hold a '`);
      if (step.run === undefined && step.to === undefined) {
        throw new Error(
          `ports.yml ${id}: a ${step.link ? "link" : step.copy ? "copy" : "switch"} step needs a "to"`,
        );
      }
    }
  }

  return registry;
};

/** The registry in README order: by category, then by name. */
export const sorted = (registry: Registry): [string, PortEntry][] =>
  Object.entries(registry).toSorted(
    ([, a], [, b]) =>
      Object.keys(CATEGORIES).indexOf(a.category) - Object.keys(CATEGORIES).indexOf(b.category) ||
      a.name.localeCompare(b.name),
  );
