import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { loadPalette } from "@repo/palette";

import { CHECKS, cleanUp, installed, pinnedVersion } from "./checks.ts";
import { ROOT } from "./paths.ts";

const palette = await loadPalette();

afterAll(cleanUp);

describe("the tools accept the themes", () => {
  for (const check of CHECKS) {
    it.skipIf(!installed(check.tool))(`${check.port}: ${check.claim}`, () => {
      expect(() => check.run(palette)).not.toThrow();
    });
  }

  // CI installs every tool it can (mise.toml, and tmux from source), so none may be skipped there
  it.runIf(process.env["CI"] !== undefined)("runs every check CI can", () => {
    const missing = CHECKS.filter((check) => check.ci !== false && !installed(check.tool));

    expect(missing.map((check) => check.tool)).toEqual([]);
  });

  it("names the tmux version CI builds", () => {
    const tmux = CHECKS.find((check) => check.tool === "tmux");
    const workflow = readFileSync(join(ROOT, ".github/workflows/ci.yml"), "utf8");

    expect(tmux?.version).toMatch(
      new RegExp(`^tmux ${/TMUX_VERSION: "([\d.a-z]+)"/v.exec(workflow)?.[1]},`, "v"),
    );
  });

  it("names a version for every tool it runs", () => {
    const unversioned = CHECKS.filter(
      (check) => (check.version ?? pinnedVersion(check.tool)) === undefined,
    );

    expect(unversioned.map((check) => check.tool)).toEqual([]);
  });
});
