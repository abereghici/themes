/**
 * What `pnpm test` proves about each port by running the tool itself on the port's themes. The
 * port READMEs list these claims, so a claim in a README is a test that passes.
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { parse as parseToml } from "smol-toml";
import { parse as parseYaml } from "yaml";

import { APPEARANCES } from "@repo/palette";
import type { Palette } from "@repo/palette";

import { PORTS_DIR, ROOT } from "./paths.ts";
import type { Evidence } from "./readme.ts";
import type { PortEntry } from "./registry.ts";

/** How `pnpm test` checks each generated file, by extension. */
export const FORMATS = {
  ".json": "parses as JSON",
  ".yml": "parses as YAML",
  ".yaml": "parses as YAML",
  ".toml": "parses as TOML",
  ".tmTheme": "is well-formed XML",
  ".xml": "is well-formed XML",
  ".sh": "passes `bash -n`",
  ".zsh": "passes `zsh -n`",
  ".gitconfig": "is read by `git config --list`",
} as const satisfies Record<string, string>;

export interface ToolCheck {
  readonly port: string;
  /** The program, as installed by mise.toml or named in `version` */
  readonly tool: string;
  readonly command: string;
  /** For a tool mise.toml doesn't install: where its version comes from */
  readonly version?: string;
  /** False for a tool CI can't install, so CI skips it rather than fails */
  readonly ci?: false;
  /** The README's sentence: what passing proves */
  readonly claim: string;
  /** Throws, with the tool's output, when the tool doesn't accept the theme */
  readonly run: (palette: Palette) => void;
}

/** The version pnpm-workspace.yaml's catalog pins for a package. */
const catalogVersion = (name: string): string | undefined =>
  (
    parseYaml(readFileSync(join(ROOT, "pnpm-workspace.yaml"), "utf8")) as {
      catalog: Record<string, string>;
    }
  ).catalog[name];

const scratches: string[] = [];

const scratch = (): string => {
  const dir = mkdtempSync(join(tmpdir(), "bereghici-check-"));

  scratches.push(dir);

  return dir;
};

/** Removes the folders the checks ran in. */
export const cleanUp = (): void => {
  for (const dir of scratches.splice(0)) rmSync(dir, { recursive: true, force: true });
};

const themes = (port: string): string => join(PORTS_DIR, port, "themes");

/** The SGR parameters a 24-bit foreground of this color is written with. */
const fg = (hex: string): string => {
  const value = Number.parseInt(hex.slice(1), 16);

  return `38;2;${(value >> 16) & 255};${(value >> 8) & 255};${value & 255}`;
};

/** NO_COLOR, set in some CI environments, would turn off the colors under test. */
const withoutNoColor = (env: NodeJS.ProcessEnv): NodeJS.ProcessEnv =>
  Object.fromEntries(Object.entries(env).filter(([name]) => name !== "NO_COLOR"));

interface Result {
  readonly stdout: string;
  readonly stderr: string;
}

/** Runs a command, failing on a non-zero exit or anything on stderr. */
const run = (
  command: string,
  args: readonly string[],
  options: { env?: Record<string, string>; input?: string | undefined; cwd?: string } = {},
): Result => {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    input: options.input,
    cwd: options.cwd,
    // A 24-bit color terminal, as the themes target: without it, tools round colors to 256
    env: withoutNoColor({ ...process.env, COLORTERM: "truecolor", ...options.env }),
  });

  if (result.error !== undefined) throw result.error;
  if (result.status !== 0 || result.stderr !== "") {
    throw new Error(
      `${command} ${args.join(" ")} exited ${result.status}:\n${result.stderr}${result.stdout}`,
    );
  }

  return { stdout: result.stdout, stderr: result.stderr };
};

const expectIn = (output: string, sgr: string, what: string): void => {
  if (!output.includes(sgr)) {
    throw new Error(`expected ${what} (\\e[${sgr}m) in:\n${JSON.stringify(output)}`);
  }
};

const SAMPLE = "const answer = 42;\n";

/** Builds bat's cache from these TextMate themes, then highlights TypeScript with each. */
const batAccepts =
  (files: readonly { name: string; path: string }[]) =>
  (palette: Palette): void => {
    const dir = scratch();

    mkdirSync(join(dir, "config/themes"), { recursive: true });
    for (const file of files)
      copyFileSync(file.path, join(dir, "config/themes", `${file.name}.tmTheme`));
    writeFileSync(join(dir, "sample.ts"), SAMPLE);

    const env = { BAT_CONFIG_DIR: join(dir, "config"), BAT_CACHE_PATH: join(dir, "cache") };

    run("bat", ["cache", "--build"], { env });
    for (const file of files) {
      const appearance = file.name.endsWith("light") ? "light" : "dark";
      const { stdout } = run(
        "bat",
        ["--theme", file.name, "--color=always", "--style=plain", "--paging=never", "sample.ts"],
        { env, cwd: dir },
      );

      expectIn(stdout, fg(palette[appearance].colors.magenta.hex), `${file.name}'s keyword color`);
    }
  };

const tmThemes = (port: string) =>
  readdirSync(themes(port))
    .filter((name) => name.endsWith(".tmTheme"))
    .map((name) => ({ name: name.replace(/\.tmTheme$/v, ""), path: join(themes(port), name) }));

/** Sources a theme's shell file, then runs a command with what it exported. */
const sourced = (file: string, command: string, input?: string): Result =>
  run("bash", ["-c", `source "$1"; ${command}`, "bash", file], { input });

export const CHECKS: readonly ToolCheck[] = [
  {
    port: "bat",
    tool: "bat",
    command: "bat cache --build",
    claim:
      "bat builds its cache from both themes without a warning and highlights TypeScript with them",
    run: batAccepts(tmThemes("bat")),
  },
  {
    port: "codex",
    tool: "bat",
    command: "bat cache --build",
    claim:
      "bat, which reads TextMate themes with the same library as Codex (syntect), loads both themes and highlights TypeScript with them",
    run: batAccepts(tmThemes("codex")),
  },
  {
    port: "yazi",
    tool: "bat",
    command: "bat cache --build",
    claim:
      "bat, which reads TextMate themes with the same library as Yazi (syntect), loads each flavor's `tmtheme.xml` and highlights TypeScript with it",
    run: batAccepts(
      APPEARANCES.map((appearance) => ({
        name: `bereghici-${appearance}`,
        path: join(themes("yazi"), `bereghici-${appearance}.yazi/tmtheme.xml`),
      })),
    ),
  },
  {
    port: "delta",
    tool: "delta",
    command: "delta --features",
    claim:
      "delta renders a diff with each feature, and its output carries the feature's added and removed line backgrounds",
    run: () => {
      const dir = scratch();
      const gitconfig = join(themes("delta"), "bereghici.gitconfig");
      const config = readFileSync(gitconfig, "utf8");
      const diff = "--- a/a.ts\n+++ b/a.ts\n@@ -1 +1 @@\n-const a = 1;\n+const a = 2;\n";

      mkdirSync(join(dir, "bat/themes"), { recursive: true });
      for (const theme of tmThemes("bat")) {
        copyFileSync(theme.path, join(dir, "bat/themes", `${theme.name}.tmTheme`));
      }
      writeFileSync(join(dir, "gitconfig"), `[include]\n  path = ${gitconfig}\n`);
      const env = { BAT_CONFIG_DIR: join(dir, "bat"), BAT_CACHE_PATH: join(dir, "cache") };

      run("bat", ["cache", "--build"], { env });
      for (const appearance of APPEARANCES) {
        const feature =
          config.split(`[delta "bereghici-${appearance}"]`)[1]?.split("[delta")[0] ?? "";
        const { stdout } = run(
          "delta",
          ["--features", `bereghici-${appearance}`, "--true-color", "always"],
          {
            env: { ...env, GIT_CONFIG_GLOBAL: join(dir, "gitconfig") },
            input: diff,
          },
        );

        for (const key of ["minus-style", "plus-style"]) {
          const hex = new RegExp(`^\\s*${key} = .*"(#[0-9a-f]{6})"`, "mv").exec(feature)?.[1];

          if (hex === undefined) throw new Error(`bereghici-${appearance} has no ${key}`);
          expectIn(stdout, fg(hex).replace("38;", "48;"), `bereghici-${appearance}'s ${key}`);
        }
      }
    },
  },
  {
    port: "eza",
    tool: "eza",
    command: "eza with EZA_CONFIG_DIR",
    claim: "eza reads each theme as its `theme.yml` and draws directories in the theme's blue",
    run: (palette) => {
      for (const appearance of APPEARANCES) {
        const dir = scratch();

        mkdirSync(join(dir, "config"));
        mkdirSync(join(dir, "list/folder"), { recursive: true });
        copyFileSync(
          join(themes("eza"), `bereghici-${appearance}.yml`),
          join(dir, "config/theme.yml"),
        );
        const { stdout } = run("eza", ["--color=always", join(dir, "list")], {
          env: { EZA_CONFIG_DIR: join(dir, "config"), LS_COLORS: "" },
        });

        expectIn(
          stdout,
          fg(palette[appearance].colors.blue.hex),
          `bereghici-${appearance}'s directory color`,
        );
      }
    },
  },
  {
    port: "ls-colors",
    tool: "eza",
    command: "eza with LS_COLORS",
    claim: "eza reads each `LS_COLORS` and draws directories in the theme's blue",
    run: (palette) => {
      for (const appearance of APPEARANCES) {
        const dir = scratch();

        mkdirSync(join(dir, "list/folder"), { recursive: true });
        const { stdout } = sourced(
          join(themes("ls-colors"), `bereghici-${appearance}.sh`),
          `EZA_CONFIG_DIR=${dir} eza --color=always ${dir}/list`,
        );

        expectIn(
          stdout,
          fg(palette[appearance].colors.blue.hex),
          `bereghici-${appearance}'s directory color`,
        );
      }
    },
  },
  {
    port: "fzf",
    tool: "fzf",
    command: "fzf --filter",
    claim:
      "fzf accepts every theme's `--color` (it exits with an error on an unknown color name or value)",
    run: () => {
      for (const name of readdirSync(themes("fzf"))) {
        sourced(join(themes("fzf"), name), "fzf --filter=match", "match\n");
      }
    },
  },
  {
    port: "jq",
    tool: "jq",
    command: "jq -C",
    claim:
      "jq accepts every theme's `JQ_COLORS` (it warns on an invalid one) and colors object keys with the theme's blue",
    run: (palette) => {
      for (const appearance of APPEARANCES) {
        const { stdout } = sourced(
          join(themes("jq"), `bereghici-${appearance}.sh`),
          "jq -C .",
          '{"key":1}',
        );

        expectIn(
          stdout,
          fg(palette[appearance].colors.blue.hex),
          `bereghici-${appearance}'s key color`,
        );
      }
      sourced(join(themes("jq"), "bereghici-terminal.sh"), "jq -C .", '{"key":1}');
    },
  },
  {
    port: "ripgrep",
    tool: "rg",
    command: "rg --colors",
    claim:
      "ripgrep accepts every theme's `--colors` (it exits with an error on an invalid one) and marks matches in the theme's red",
    run: (palette) => {
      const dir = scratch();

      writeFileSync(join(dir, "file"), "needle\n");
      for (const name of readdirSync(themes("ripgrep"))) {
        const appearance = APPEARANCES.find((a) => name.includes(a));
        const { stdout } = run("rg", ["--color=always", "needle", "file"], {
          env: { RIPGREP_CONFIG_PATH: join(themes("ripgrep"), name) },
          cwd: dir,
        });

        if (appearance !== undefined) {
          expectIn(stdout, fg(palette[appearance].colors.red.hex), `${name}'s match color`);
        }
      }
    },
  },
  {
    port: "starship",
    tool: "starship",
    command: "starship prompt",
    claim:
      "Starship draws each palette's colors by role name exactly as it draws their values (it ignores a name it doesn't know)",
    run: () => {
      for (const name of readdirSync(themes("starship"))) {
        const table = readFileSync(join(themes("starship"), name), "utf8");
        const palettes = (parseToml(table) as { palettes: Record<string, Record<string, string>> })
          .palettes;

        for (const [palette, colors] of Object.entries(palettes)) {
          const dir = scratch();
          const prompt = (format: string, extra = "") => {
            writeFileSync(join(dir, "starship.toml"), `format = "${format}"\n${extra}`);

            return run("starship", ["prompt"], {
              env: { STARSHIP_CONFIG: join(dir, "starship.toml") },
            }).stdout;
          };
          const byRole = Object.keys(colors).map((role) => `[${role}](fg:${role})`);
          const byValue = Object.entries(colors).map(([role, value]) => `[${role}](fg:${value})`);

          const drawn = prompt(byValue.join(" "));

          for (const role of Object.keys(colors)) {
            if (!new RegExp(`\\u001B\\[[\\d;]+m%\\}${role}%`, "v").test(drawn)) {
              throw new Error(`${palette}.${role} = ${colors[role]} isn't a color Starship draws`);
            }
          }
          if (prompt(byRole.join(" "), `palette = "${palette}"\n${table}`) !== drawn) {
            throw new Error(`${palette}: a role doesn't draw as its value`);
          }
        }
      }
    },
  },
  {
    port: "tmux",
    tool: "tmux",
    command: "tmux source-file",
    version: "tmux 3.8, built from source in CI",
    claim:
      "tmux sources the theme without an error, and the status bar keeps the terminal's background",
    run: () => {
      const { stdout } = run("tmux", [
        "-L",
        `bereghici-${process.pid}`,
        "-f",
        "/dev/null",
        "start-server",
        ";",
        "source-file",
        join(themes("tmux"), "bereghici.conf"),
        ";",
        "show",
        "-gv",
        "status-style",
        ";",
        "kill-server",
      ]);

      // tmux reports a bad option on stdout and still exits 0: only the value may be printed
      if (!/^bg=default\b[^\n]*\n$/v.test(stdout)) throw new Error(`tmux printed:\n${stdout}`);
    },
  },
  {
    port: "ghostty",
    tool: "ghostty",
    command: "ghostty +validate-config",
    version: "Ghostty on the maintainer's Mac; CI can't install it",
    ci: false,
    claim: "`ghostty +validate-config` accepts a config that sets each theme",
    run: () => {
      for (const name of readdirSync(themes("ghostty"))) {
        const config = join(scratch(), "config");

        writeFileSync(config, `theme = ${join(themes("ghostty"), name)}\n`);
        run("ghostty", ["+validate-config", `--config-file=${config}`]);
      }
    },
  },
  {
    port: "herdr",
    tool: "herdr",
    command: "herdr config check",
    version: "herdr on the maintainer's Mac; CI can't install it",
    ci: false,
    claim:
      "`herdr config check` reports no issue with the theme as `config.toml` (it reports unknown keys)",
    run: () => {
      const dir = scratch();

      mkdirSync(join(dir, "herdr"));
      copyFileSync(join(themes("herdr"), "bereghici.toml"), join(dir, "herdr/config.toml"));
      const { stdout } = run("herdr", ["config", "check"], { env: { XDG_CONFIG_HOME: dir } });

      if (stdout.trim() !== "config: ok") throw new Error(`herdr config check printed:\n${stdout}`);
    },
  },
  {
    port: "vscode",
    tool: "vsce",
    command: "vsce package",
    version: `@vscode/vsce ${catalogVersion("@vscode/vsce") ?? ""}, from pnpm-workspace.yaml`,
    claim:
      "`vsce package` packages the extension, and the package holds every theme the manifest contributes",
    run: () => {
      const vsce = join(ROOT, "node_modules/.bin/vsce");
      const cwd = join(PORTS_DIR, "vscode");
      const manifest = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as {
        contributes: { themes: { path: string }[] };
      };

      run(vsce, ["package", "--no-dependencies", "--out", join(scratch(), "bereghici.vsix")], {
        cwd,
      });
      const packaged = run(vsce, ["ls", "--no-dependencies"], { cwd }).stdout.split("\n");

      for (const { path } of manifest.contributes.themes) {
        if (!packaged.includes(path.replace(/^\.\//v, "")))
          throw new Error(`${path} isn't packaged`);
      }
    },
  },
];

/** The version mise.toml pins for a tool, by the last part of its package name. */
export const pinnedVersion = (tool: string): string | undefined => {
  const config = parseToml(readFileSync(join(ROOT, "mise.toml"), "utf8")) as {
    tools: Record<string, string | { version: string }>;
  };
  const names: Record<string, string> = { rg: "ripgrep", nvim: "neovim" };
  const entry = Object.entries(config.tools).find(([name]) =>
    name.toLowerCase().endsWith(`/${names[tool] ?? tool}`),
  )?.[1];

  return typeof entry === "string" ? entry : entry?.version;
};

const TOOLS_TEST = "packages/build/src/tools.test.ts";
const OUTPUTS_TEST = "packages/build/src/outputs.test.ts";
const EDITORS_TEST = "packages/build/src/editors.test.ts";

/** What the other tests prove about particular ports. */
const TESTED: readonly (Evidence & { readonly port: string })[] = [
  {
    port: "nvim",
    claim:
      "Neovim loads both variants, with and without `transparent`, and every highlight link has a target and every color is a hex color",
    test: EDITORS_TEST,
    tool: `Neovim ${pinnedVersion("nvim") ?? ""}, from mise.toml`,
  },
  {
    port: "nvim",
    claim:
      "`transparent = true` leaves the editor, floats, sign column, status and tab lines, folds, inlay hints and diagnostics without a background",
    test: EDITORS_TEST,
  },
  ...["nvim", "vscode", "bat"].map((port) => ({
    port,
    claim:
      "Neovim, VS Code and the TextMate theme color a sample of each row of [CONTRIBUTING's syntax table](../../CONTRIBUTING.md#syntax) with the same role",
    test: EDITORS_TEST,
  })),
  {
    port: "tmux",
    claim: "The status bar, popups and menus keep the terminal's background",
    test: OUTPUTS_TEST,
  },
  { port: "herdr", claim: "The sidebar keeps the terminal's background", test: OUTPUTS_TEST },
  { port: "fzf", claim: "The terminal flavor keeps the terminal's background", test: OUTPUTS_TEST },
  ...["claude-code", "codex"].map((port) => ({
    port,
    claim: "`install.sh sync dark|light` points the theme at that appearance's",
    test: OUTPUTS_TEST,
  })),
  {
    port: "font",
    claim: "The font is named Bereghici Symbols and draws the logo at U+100000",
    test: "packages/font/scripts/font.test.ts",
  },
];

/** What a port's README says `pnpm test` proves, each with the test that proves it. */
export const evidenceFor = (
  port: string,
  entry: PortEntry,
  extensions: ReadonlySet<string>,
): Evidence[] => [
  ...CHECKS.filter((check) => check.port === port).map((check) => ({
    claim: check.claim,
    test: TOOLS_TEST,
    tool:
      check.version ?? `${toolName(check.tool)} ${pinnedVersion(check.tool) ?? ""}, from mise.toml`,
  })),
  ...TESTED.filter((evidence) => evidence.port === port).map(({ claim, test, tool }) =>
    tool === undefined ? { claim, test } : { claim, test, tool },
  ),
  ...Object.entries(FORMATS)
    .filter(([extension]) => extensions.has(extension))
    .map(([extension, check]) => ({
      claim: `Every \`${extension}\` file ${check}`,
      test: OUTPUTS_TEST,
    })),
  ...(entry.install === undefined
    ? []
    : [
        {
          claim:
            "`install.sh` puts each file above in place in an empty home folder, and keeps a file or link of yours",
          test: OUTPUTS_TEST,
        },
      ]),
];

/** A tool's name, where its program is named otherwise. */
export const toolName = (tool: string): string => (tool === "rg" ? "ripgrep" : tool);

/** Whether a program is on PATH. */
export const installed = (program: string): boolean =>
  spawnSync("sh", ["-c", 'command -v "$1"', "sh", program]).status === 0;
