import { readFileSync } from "node:fs";

import Mustache from "mustache";

import { sorted } from "./registry.ts";
import type { Registry } from "./registry.ts";

const TEMPLATE = readFileSync(`${import.meta.dirname}/../templates/install.sh.mustache`, "utf8");

const quoted = (path: string): string => `"${path.replace(/^~\//v, "$HOME/")}"`;

/** install.sh: every port's install steps, in README order. */
export const installScript = (registry: Registry): string => {
  const installs: string[] = [];
  const switches: string[] = [];

  for (const [id, entry] of sorted(registry)) {
    const from = (path: string) => `"$ports/${id}/${path}"`;

    for (const step of entry.install ?? []) {
      const to = quoted(step.to ?? "");

      if (step.link !== undefined) installs.push(`  link ${from(step.link)} ${to}`);
      if (step.copy !== undefined) installs.push(`  copy ${from(step.copy)} ${to}`);
      if (step.run !== undefined) installs.push(`  run_if ${step.when ?? "true"} '${step.run}'`);
      if (step.switch !== undefined) {
        switches.push(`  link ${from(step.switch.replaceAll("{appearance}", "$1"))} ${to}`);
      }
    }
  }

  return Mustache.render(TEMPLATE, {
    installs: installs.join("\n"),
    switches: switches.join("\n") || "  :",
  });
};
