#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function flag(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

// The core source is a separate checkout that provides a package script which
// writes the allowlisted export to `--out <dir>`. Both are passed explicitly.
const sourceFlag = flag("--source");
const script = flag("--script");
if (!sourceFlag || !script) {
  console.error("Usage: pnpm import:core --source <core checkout> --script <its export script>");
  process.exit(2);
}
const sourceRoot = resolve(root, sourceFlag);
const vendorRoot = join(root, "vendor");
const outputRoot = join(vendorRoot, "core");
const temporaryRoot = join(vendorRoot, `.core-import-${process.pid}`);

if (!existsSync(join(sourceRoot, "package.json"))) {
  throw new Error("Core checkout not found; pass --source with its path.");
}

mkdirSync(vendorRoot, { recursive: true });
rmSync(temporaryRoot, { recursive: true, force: true });

const result = spawnSync(
  "pnpm",
  ["--dir", sourceRoot, "run", "--silent", script, "--out", temporaryRoot],
  { encoding: "utf8", stdio: "pipe" },
);
if (result.status !== 0 || !existsSync(join(temporaryRoot, "export.json"))) {
  rmSync(temporaryRoot, { recursive: true, force: true });
  process.stderr.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  if (result.error) console.error(result.error.message);
  console.error("Core export failed; vendor/core is unchanged.");
  process.exit(result.status || 1);
}

writeFileSync(
  join(temporaryRoot, "DO_NOT_EDIT.md"),
  "# Generated core\n\nDO NOT EDIT. This directory is produced by the allowlisted core exporter. Run `pnpm import:core --source <core-checkout> --script <export-script>` from the repository root to refresh it.\n",
);

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    })
    .sort();
}

const checksums = filesUnder(temporaryRoot)
  .filter((path) => !path.endsWith(`${sep}SHA256SUMS`))
  .map((path) => {
    if (!statSync(path).isFile()) throw new Error(`Unexpected vendor entry: ${path}`);
    const digest = createHash("sha256").update(readFileSync(path)).digest("hex");
    const pathFromCore = relative(temporaryRoot, path).split(sep).join("/");
    return `${digest}  ${pathFromCore}`;
  });
writeFileSync(join(temporaryRoot, "SHA256SUMS"), `${checksums.join("\n")}\n`);

rmSync(outputRoot, { recursive: true, force: true });
renameSync(temporaryRoot, outputRoot);
console.log(`Imported ${checksums.length} checksummed core files.`);
