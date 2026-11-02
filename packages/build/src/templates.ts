/**
 * A port's `templates/*.mustache`, whose YAML frontmatter names the output and the flavors to
 * render it in, as Catppuccin's Whiskers templates do. CONTRIBUTING.md documents the format.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import Mustache from "mustache";
import type { TemplateSpans } from "mustache";
import { parse } from "yaml";

import { FLAVORS } from "@repo/palette";
import type { FlavorId, Palette } from "@repo/palette";

/** Theme files aren't HTML: write every value as is. */
Mustache.escape = (text: string) => text;

export interface Template {
  readonly path: string;
  readonly output: string;
  readonly flavors?: readonly FlavorId[];
  readonly copy?: string;
  readonly body: string;
}

export interface Port {
  /** The directory name, which is its key in ports.yml */
  readonly id: string;
  readonly dir: string;
  readonly templates: readonly Template[];
}

export interface RenderedFile {
  readonly path: string;
  readonly content: string;
  /** The flavor it was rendered in, when its template names flavors */
  readonly flavor?: FlavorId;
}

const FRONTMATTER = /^---\n(?<yaml>.*?)\n---\n/sv;

const parseTemplate = (path: string): Template => {
  const source = readFileSync(path, "utf8");
  const match = FRONTMATTER.exec(source);

  if (match?.groups === undefined) throw new Error(`${path}: no frontmatter`);

  const meta = parse(match.groups["yaml"] ?? "") as Partial<Template> | null;

  if (typeof meta?.output !== "string") throw new Error(`${path}: frontmatter has no output`);
  for (const flavor of meta.flavors ?? []) {
    if (!(FLAVORS as readonly string[]).includes(flavor)) {
      throw new Error(`${path}: unknown flavor "${flavor}"`);
    }
  }

  return { ...meta, output: meta.output, path, body: source.slice(match[0].length) };
};

/** Every directory under `portsDir` with templates (`_shared` holds what they share). */
export const loadPorts = (portsDir: string): Port[] =>
  readdirSync(portsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => join(portsDir, entry.name))
    .filter((dir) => existsSync(join(dir, "templates")))
    .map((dir) => ({
      id: basename(dir),
      dir,
      templates: readdirSync(join(dir, "templates"))
        .filter((file) => file.endsWith(".mustache"))
        .map((file) => parseTemplate(join(dir, "templates", file))),
    }));

/** The `<name>.mustache` files of `dir`, as Mustache partials keyed by name. */
export const partialsIn = (dir: string): Record<string, string> =>
  existsSync(dir)
    ? Object.fromEntries(
        readdirSync(dir)
          .filter((file) => file.endsWith(".mustache"))
          .map((file) => [
            file.slice(0, -".mustache".length),
            readFileSync(join(dir, file), "utf8"),
          ]),
      )
    : {};

/** Resolves a tag name as Mustache does: in the innermost context that has its first segment. */
const lookup = (stack: readonly unknown[], name: string): { found: boolean; value: unknown } => {
  if (name === ".") return { found: true, value: stack.at(-1) };

  const [head = "", ...rest] = name.split(".");
  const context = stack.findLast((ctx) => typeof ctx === "object" && ctx !== null && head in ctx);

  if (context === undefined) return { found: false, value: undefined };

  let value: unknown = Reflect.get(context as object, head);

  for (const key of rest) {
    if (typeof value !== "object" || value === null || !(key in value)) {
      return { found: false, value: undefined };
    }
    value = Reflect.get(value, key);
  }

  return { found: true, value };
};

/**
 * Throws on a tag the view can't resolve, which Mustache would render as nothing: a typo such
 * as `{{colors.purple.hex}}`, or a color the flavor doesn't have (the terminal flavor has no
 * `hex`), would otherwise ship a theme with a missing color. A section is checked where it
 * renders: `{{#isDark}}` in the dark flavor, `{{^colors.surface}}` (the guard for a color the
 * terminal flavor has as `null`) in the terminal one. `including` is the chain of partials being
 * checked, so a recursive one is checked once.
 */
const assertResolvable = (
  spans: TemplateSpans,
  stack: readonly unknown[],
  partials: Readonly<Record<string, string>>,
  where: string,
  including: readonly string[] = [],
): void => {
  for (const [type, name, , , children] of spans) {
    if (type === "text" || type === "!" || type === "=") continue;

    if (type === ">") {
      const partial = partials[name];

      if (partial === undefined) throw new Error(`${where}: no partial named "${name}"`);
      if (including.includes(name)) continue;
      assertResolvable(Mustache.parse(partial), stack, partials, `${where} > ${name}`, [
        ...including,
        name,
      ]);
      continue;
    }

    const { found, value } = lookup(stack, name);

    if (!found) throw new Error(`${where}: {{${name}}} is not in the view`);

    if ((type === "#" || type === "^") && Array.isArray(children)) {
      const item: unknown = Array.isArray(value) ? value[0] : value;
      const inner =
        type === "#" && typeof item === "object" && item !== null ? [...stack, item] : stack;

      // A section over a false or null value never renders, nor an inverted one over a true one
      if (type === "#" ? !value : Boolean(value)) continue;
      assertResolvable(children as TemplateSpans, inner, partials, where, including);
    }
  }
};

export const renderPort = (
  port: Port,
  palette: Palette,
  shared: Readonly<Record<string, string>>,
): RenderedFile[] => {
  // `ports/_shared/partials` serve every port; a port's own `templates/partials` win
  const partials = { ...shared, ...partialsIn(join(port.dir, "templates/partials")) };

  return port.templates.flatMap((template) => {
    const views = template.flavors?.map((flavor) => palette[flavor]) ?? [palette];

    return views.map((view) => {
      const flavor = "flavor" in view ? { flavor: view.flavor } : {};

      assertResolvable(Mustache.parse(template.output), [view], {}, `${template.path} output`);

      if (template.copy !== undefined) {
        return {
          path: join(port.dir, Mustache.render(template.output, view)),
          content: readFileSync(join(port.dir, template.copy), "utf8"),
          ...flavor,
        };
      }

      assertResolvable(Mustache.parse(template.body), [view], partials, template.path);

      return {
        path: join(port.dir, Mustache.render(template.output, view)),
        content: Mustache.render(template.body, view, partials),
        ...flavor,
      };
    });
  });
};
