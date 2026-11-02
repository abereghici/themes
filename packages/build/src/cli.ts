/**
 * `pnpm build` renders every port into its committed files.
 * `pnpm check` renders without writing and fails when a committed file is out of date (CI).
 */
import { parseArgs, styleText } from "node:util";

import { build } from "./index.ts";

const { check } = parseArgs({
  options: { check: { type: "boolean", default: false } },
  strict: true,
}).values;
const { written, removed } = await build({ check });

if (written.length + removed.length === 0) {
  console.log("Every port is up to date.");
} else if (check) {
  console.error(styleText("red", "Out of date (run `pnpm build`):"));
  for (const path of [...written, ...removed]) console.error(`  ${path}`);
  process.exitCode = 1;
} else {
  for (const path of written) console.log(`${styleText("green", "wrote")} ${path}`);
  for (const path of removed) console.log(`${styleText("yellow", "removed")} ${path}`);
}
