import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, relative } from "node:path";

import { XMLValidator } from "fast-xml-parser";
import { parse as parseToml } from "smol-toml";
import { describe, expect, it } from "vitest";
import { parse as parseYaml } from "yaml";

import { PORTS_DIR, ROOT } from "./index.ts";

const outputs = readdirSync(PORTS_DIR, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && relative(PORTS_DIR, entry.parentPath).includes("themes"))
  .map((entry) => join(entry.parentPath, entry.name));

const byExtension = (...extensions: string[]): string[] =>
  outputs.filter((path) => extensions.includes(extname(path))).map((path) => relative(ROOT, path));

const read = (path: string): string => readFileSync(join(ROOT, path), "utf8");

/** The repository's physical path, which install.sh links from. */
const REPO = realpathSync(ROOT);

describe("every generated theme file parses", () => {
  it.each(byExtension(".json"))("%s is JSON", (path) => {
    expect(() => JSON.parse(read(path))).not.toThrow();
  });

  it.each(byExtension(".yml", ".yaml"))("%s is YAML", (path) => {
    expect(() => parseYaml(read(path))).not.toThrow();
  });

  it.each(byExtension(".toml"))("%s is TOML", (path) => {
    expect(() => parseToml(read(path))).not.toThrow();
  });

  it.each(byExtension(".tmTheme", ".xml"))("%s is well-formed XML", (path) => {
    expect(XMLValidator.validate(read(path))).toBe(true);
  });

  it.each(byExtension(".sh"))("%s is valid bash", (path) => {
    expect(() => execFileSync("bash", ["-n", join(ROOT, path)])).not.toThrow();
  });

  it.each(byExtension(".zsh"))("%s is valid zsh", (path) => {
    expect(() => execFileSync("zsh", ["-n", join(ROOT, path)])).not.toThrow();
  });

  it.each(byExtension(".gitconfig"))("%s is a git config file", (path) => {
    expect(() =>
      execFileSync("git", ["config", "--file", join(ROOT, path), "--list"]),
    ).not.toThrow();
  });
});

describe("the terminal ports leave the background to the terminal", () => {
  it("tmux's bar, popups and menus", () => {
    const tmux = read("ports/tmux/themes/bereghici.conf");

    for (const option of ["status-style", "popup-style", "menu-style"]) {
      expect(tmux).toMatch(new RegExp(`^set -g ${option} 'bg=default`, "mv"));
    }
  });

  it("herdr's sidebar", () => {
    for (const path of byExtension(".toml").filter((p) => p.startsWith("ports/herdr/"))) {
      expect(read(path)).toMatch(/^sidebar_bg = "reset"$/mv);
    }
  });

  it("fzf's terminal flavor", () => {
    expect(read("ports/fzf/themes/bereghici-terminal.sh")).toMatch(/bg:-1,.*gutter:-1/v);
  });
});

describe("install.sh", () => {
  /** Runs install.sh in a scratch home, without the tools its `run` steps call. */
  const install = (home: string, ...args: string[]) =>
    spawnSync("bash", [join(ROOT, "install.sh"), ...args], {
      encoding: "utf8",
      env: { HOME: home, PATH: "/usr/bin:/bin" },
    });
  const theme = (home: string) => join(home, ".claude/themes/bereghici.json");

  it("links every theme, and links again without changes", () => {
    const home = mkdtempSync(join(tmpdir(), "bereghici-home-"));
    const first = install(home);

    expect(first.status).toBe(0);
    expect(first.stderr).toBe("");
    expect(readlinkSync(theme(home))).toMatch(
      /claude-code\/themes\/bereghici-(?:dark|light)\.json$/v,
    );
    expect(install(home).status).toBe(0);
  });

  it("points the single-theme tools at an appearance", () => {
    const home = mkdtempSync(join(tmpdir(), "bereghici-home-"));

    install(home, "sync", "light");
    expect(install(home, "sync", "dark").status).toBe(0);
    expect(readlinkSync(theme(home))).toBe(
      join(REPO, "ports/claude-code/themes/bereghici-dark.json"),
    );
  });

  it("keeps a file or link of the user's, and replaces a broken link", () => {
    const home = mkdtempSync(join(tmpdir(), "bereghici-home-"));
    const codex = join(home, ".codex/themes/bereghici.tmTheme");

    mkdirSync(dirname(theme(home)), { recursive: true });
    mkdirSync(dirname(codex), { recursive: true });
    writeFileSync(theme(home), "mine");
    symlinkSync(join(home, "missing"), codex);

    const result = install(home, "sync", "dark");

    expect(result.status).toBe(0);
    expect(result.stderr).toContain("skipped");
    expect(readFileSync(theme(home), "utf8")).toBe("mine");
    expect(readlinkSync(codex)).toBe(join(REPO, "ports/codex/themes/bereghici-dark.tmTheme"));

    rmSync(theme(home));
    symlinkSync(join(home, ".zshrc"), theme(home));
    writeFileSync(join(home, ".zshrc"), "");
    install(home, "sync", "dark");
    expect(readlinkSync(theme(home))).toBe(join(home, ".zshrc"));
  });

  it("reports a step that fails, installs the rest and exits non-zero", () => {
    const home = mkdtempSync(join(tmpdir(), "bereghici-home-"));

    writeFileSync(join(home, ".codex"), "not a directory");

    const result = install(home, "sync", "dark");

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("failed: link");
    expect(existsSync(theme(home))).toBe(true);
  });

  it("is valid bash", () => {
    expect(() => execFileSync("bash", ["-n", join(ROOT, "install.sh")])).not.toThrow();
  });

  it("packages the VS Code extension with the catalog's vsce", () => {
    const { catalog } = parseYaml(read("pnpm-workspace.yaml")) as {
      catalog: Record<string, string>;
    };

    expect(read("install.sh")).toContain(`@vscode/vsce@${catalog["@vscode/vsce"]} `);
  });
});
