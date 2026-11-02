import {
  chmodSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";

import { loadPalette } from "@repo/palette";

import { evidenceFor } from "./checks.ts";
import { installScript } from "./install.ts";
import {
  contrastTables,
  paletteTable,
  portReadme,
  portsTable,
  verificationTable,
  withSections,
} from "./readme.ts";
import type { ThemeFile } from "./readme.ts";
import { loadRegistry } from "./registry.ts";
import { swatchesSvg } from "./swatches.ts";
import { loadPorts, partialsIn, portDirs, renderPort } from "./templates.ts";
import type { RenderedFile } from "./templates.ts";

export { loadPorts } from "./templates.ts";

import { ROOT } from "./paths.ts";

export { PORTS_DIR, ROOT } from "./paths.ts";

/** Files other programs leave in `themes/` (gitignored): Finder's, and Chrome's in a loaded theme. */
const FOREIGN = new Set([".DS_Store", "Cached Theme.pak"]);

export interface BuildResult {
  /** Files whose committed content differs from a fresh render: written, unless `check` */
  readonly written: readonly string[];
  /** Files in a port's `themes/` that no template renders any more: deleted, unless `check` */
  readonly removed: readonly string[];
}

const missingEntry = (id: string): never => {
  throw new Error(`ports.yml has no entry for ${id}`);
};

/** Every file under `dir`, which a port's `themes/` holds only generated files in. */
const filesIn = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile() && !FOREIGN.has(entry.name))
        .map((entry) => join(entry.parentPath, entry.name))
    : [];

export async function build({ check = false, root = ROOT } = {}): Promise<BuildResult> {
  const portsDir = join(root, "ports");
  const palette = await loadPalette();
  const ports = loadPorts(portsDir);
  // Every port directory, with templates or not (the font is built by `pnpm font`)
  const portIds = portDirs(portsDir).map((dir) => basename(dir));
  const registry = loadRegistry(join(root, "ports.yml"), portIds);
  const entry = (id: string) => registry[id] ?? missingEntry(id);
  const shared = partialsIn(join(portsDir, "_shared/partials"));
  const written: string[] = [];
  const removed: string[] = [];

  const write = (file: RenderedFile): void => {
    const current = existsSync(file.path) ? readFileSync(file.path, "utf8") : undefined;

    if (current === file.content) return;

    written.push(relative(root, file.path));

    if (!check) {
      mkdirSync(dirname(file.path), { recursive: true });
      writeFileSync(file.path, file.content);
    }
  };

  for (const port of ports) {
    const rendered = renderPort(port, palette, shared);
    const renderedPaths = new Set(rendered.map((file) => file.path));

    if (renderedPaths.size < rendered.length) {
      throw new Error(`${port.dir}: two templates render to the same output`);
    }

    for (const file of rendered) write(file);

    // The port README lists each top-level entry of `themes/`
    const listed = new Map<string, ThemeFile>();

    for (const file of rendered) {
      const [folder, name] = relative(port.dir, file.path).split("/");

      if (folder === "themes" && name !== undefined && !listed.has(name)) {
        listed.set(name, { name, flavor: file.flavor ?? "both" });
      }
    }
    write({
      path: join(port.dir, "README.md"),
      content: portReadme(
        port.id,
        entry(port.id),
        [...listed.values()],
        evidenceFor(port.id, entry(port.id), new Set(rendered.map((file) => extname(file.path)))),
      ),
    });

    const themes = join(port.dir, "themes");
    const orphans = filesIn(themes).filter((path) => !renderedPaths.has(path));

    for (const orphan of orphans) {
      removed.push(relative(root, orphan));

      if (!check) {
        rmSync(orphan);
        // Drop the folders it leaves empty (a stale `themes/<id>.yazi/`), down to `themes/`
        for (let dir = dirname(orphan); dir !== port.dir; dir = dirname(dir)) {
          if (readdirSync(dir).length > 0) break;
          rmdirSync(dir);
        }
      }
    }
  }

  // A port without templates (the font, built by `pnpm font`) lists what its themes/ holds
  for (const id of portIds.filter((portId) => !ports.some((port) => port.id === portId))) {
    const names = existsSync(join(portsDir, id, "themes"))
      ? readdirSync(join(portsDir, id, "themes"))
      : [];

    write({
      path: join(portsDir, id, "README.md"),
      content: portReadme(
        id,
        entry(id),
        names.filter((name) => !FOREIGN.has(name)).map((name) => ({ name })),
        evidenceFor(id, entry(id), new Set(names.map((name) => extname(name)))),
      ),
    });
  }

  const readme = join(root, "README.md");

  write({
    path: readme,
    content: withSections(readFileSync(readme, "utf8"), {
      palette: paletteTable(palette),
      contrast: contrastTables(palette),
      ports: portsTable(registry),
      verification: verificationTable(registry),
    }),
  });
  write({ path: join(root, ".github/assets/palette.svg"), content: swatchesSvg(palette) });

  const install = join(root, "install.sh");

  write({ path: install, content: installScript(registry) });
  if (!check && existsSync(install)) chmodSync(install, 0o755);

  return { written, removed };
}
