import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

import { build, loadPorts, PORTS_DIR, ROOT } from "./index.ts";
import { loadRegistry } from "./registry.ts";

const template = (output: string, body: string, flavors?: string): string =>
  `---\noutput: ${output}\n${flavors === undefined ? "" : `flavors: [${flavors}]\n`}---\n${body}`;

/** A repository with one port, `example`, registered in ports.yml. */
const fixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), "bereghici-"));
  const port = join(root, "ports/example");

  mkdirSync(join(port, "templates/partials"), { recursive: true });
  writeFileSync(
    join(port, "templates/variant.conf.mustache"),
    template("themes/{{id}}.conf", "{{name}} <{{colors.red.ref}}>\n", "dark, light, terminal"),
  );
  writeFileSync(
    join(port, "templates/both.conf.mustache"),
    template("themes/both.conf", "{{#dark}}{{> line}}{{/dark}}{{#light}}{{> line}}{{/light}}"),
  );
  writeFileSync(
    join(port, "templates/partials/line.mustache"),
    "{{appearance}}={{colors.text.bare}}\n",
  );
  writeFileSync(
    join(root, "ports.yml"),
    [
      "example:",
      "  name: Example",
      "  url: https://example.com",
      "  category: cli",
      "  switches: live",
      "  install:",
      "    - link: themes",
      "      to: ~/.config/example/themes",
      "  usage:",
      "    - Select it.",
    ].join("\n"),
  );
  writeFileSync(
    join(root, "README.md"),
    ["palette", "contrast", "ports"]
      .map((name) => `<!-- generated:${name} -->\n<!-- /generated:${name} -->\n`)
      .join("\n"),
  );

  return root;
};

const read = (root: string, path: string): string => readFileSync(join(root, path), "utf8");

describe("build", () => {
  it("renders a template once per flavor it names, and once otherwise", async () => {
    const root = fixture();

    await build({ root });

    expect(read(root, "ports/example/themes/bereghici-dark.conf")).toBe(
      "Bereghici Dark <#e99989>\n",
    );
    expect(read(root, "ports/example/themes/bereghici-terminal.conf")).toBe(
      "Bereghici Terminal <1>\n",
    );
    expect(read(root, "ports/example/themes/both.conf")).toBe("dark=eeefe9\nlight=2e3229\n");
  });

  it("generates the README's port table and install.sh from ports.yml", async () => {
    const root = fixture();

    await build({ root });

    expect(read(root, "README.md")).toContain("| [Example](ports/example) | Command line | live");
    expect(read(root, "install.sh")).toContain(
      'link "$ports/example/themes" "$HOME/.config/example/themes"',
    );
  });

  it("reports stale files without writing them when checking", async () => {
    const root = fixture();

    expect((await build({ root, check: true })).written).toHaveLength(8);
    await build({ root });
    writeFileSync(join(root, "ports/example/themes/both.conf"), "edited by hand\n");

    expect((await build({ root, check: true })).written).toEqual([
      "ports/example/themes/both.conf",
    ]);
    expect(read(root, "ports/example/themes/both.conf")).toBe("edited by hand\n");
  });

  it("deletes files left in themes/ that no template renders any more", async () => {
    const root = fixture();
    const orphan = join(root, "ports/example/themes/old.yazi/flavor.toml");

    await build({ root });
    mkdirSync(dirname(orphan));
    writeFileSync(orphan, "stale\n");
    writeFileSync(join(root, "ports/example/themes/.DS_Store"), "");
    writeFileSync(join(root, "ports/example/themes/Cached Theme.pak"), "");

    expect(await build({ root, check: true })).toEqual({
      written: [],
      removed: ["ports/example/themes/old.yazi/flavor.toml"],
    });
    await build({ root });
    expect(existsSync(dirname(orphan))).toBe(false);
  });

  it("fails on a tag the view doesn't have, in partials and output paths too", async () => {
    const root = fixture();
    const partial = join(root, "ports/example/templates/partials/line.mustache");

    writeFileSync(partial, "{{appearance}}={{colors.purple.hex}}\n");
    await expect(build({ root })).rejects.toThrow(
      /line: \{\{colors\.purple\.hex\}\} is not in the view/v,
    );

    writeFileSync(partial, "");
    writeFileSync(
      join(root, "ports/example/templates/variant.conf.mustache"),
      template("themes/{{idd}}.conf", "", "dark"),
    );
    await expect(build({ root })).rejects.toThrow(/output: \{\{idd\}\} is not in the view/v);
  });

  it("fails on a color the flavor doesn't have, unless the template guards it", async () => {
    const root = fixture();
    const path = join(root, "ports/example/templates/variant.conf.mustache");

    writeFileSync(path, template("themes/{{id}}.conf", "{{colors.surface.ref}}\n", "terminal"));
    await expect(build({ root })).rejects.toThrow(
      /\{\{colors\.surface\.ref\}\} is not in the view/v,
    );

    writeFileSync(
      path,
      template(
        "themes/{{id}}.conf",
        "{{#colors.surface}}{{colors.surface.ref}}{{/colors.surface}}{{^colors.surface}}default{{/colors.surface}}\n",
        "dark, terminal",
      ),
    );
    await build({ root });
    expect(read(root, "ports/example/themes/bereghici-dark.conf")).toBe("#12150f\n");
    expect(read(root, "ports/example/themes/bereghici-terminal.conf")).toBe("default\n");
  });

  it("fails when ports.yml and the ports directory disagree", () => {
    const root = fixture();

    expect(() => loadRegistry(join(root, "ports.yml"), ["example", "other"])).toThrow(
      /no entry for other/v,
    );
    expect(() => loadRegistry(join(root, "ports.yml"), [])).toThrow(/lists example, with no port/v);
  });

  it("rejects install steps install.sh couldn't quote", () => {
    const root = fixture();
    const path = join(root, "ports.yml");
    const registry = read(root, "ports.yml");
    const withStep = (step: string) => {
      writeFileSync(path, registry.replace(/    - link: themes\n      to: .*\n/v, `${step}\n`));

      return () => loadRegistry(path, ["example"]);
    };

    expect(withStep('    - link: themes\n      to: "~/.config/$USER"')).toThrow(/can't quote/v);
    expect(withStep("    - link: themes\n      to: ~/.config/`x`")).toThrow(/can't quote/v);
    expect(withStep("    - run: echo 'done'\n      when: echo")).toThrow(/can't hold a '/v);
    expect(withStep("    - run: echo\n      when: echo two")).toThrow(/names one command/v);
  });

  it("registers every port in the repository", () => {
    const ids = loadPorts(PORTS_DIR).map((port) => port.id);

    expect(() => loadRegistry(join(ROOT, "ports.yml"), [...ids, "font"])).not.toThrow();
  });
});
