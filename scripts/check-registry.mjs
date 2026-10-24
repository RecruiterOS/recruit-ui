#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expectedStaticRoot = join(root, "dist/registry");
const temporaryRoot = mkdtempSync(join(tmpdir(), "recruit-ui-registry-"));
const temporaryStaticRoot = join(temporaryRoot, "static");
const temporarySourceRoot = join(temporaryRoot, "source");

function filesUnder(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    })
    .sort();
}

function compareTrees(expectedRoot, actualRoot, label) {
  const expectedFiles = filesUnder(expectedRoot).map((path) =>
    relative(expectedRoot, path).split(sep).join("/"),
  );
  const actualFiles = filesUnder(actualRoot).map((path) =>
    relative(actualRoot, path).split(sep).join("/"),
  );
  if (JSON.stringify(expectedFiles) !== JSON.stringify(actualFiles)) {
    throw new Error(`${label} file set is stale.`);
  }
  for (const path of expectedFiles) {
    if (readFileSync(join(expectedRoot, path), "utf8") !== readFileSync(join(actualRoot, path), "utf8")) {
      throw new Error(`${label} is stale: ${path}`);
    }
  }
}

try {
  const result = spawnSync(
    process.execPath,
    [
      join(root, "scripts/build-registry.mjs"),
      "--out",
      temporaryStaticRoot,
      "--source-out",
      temporarySourceRoot,
    ],
    { cwd: root, encoding: "utf8" },
  );
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
  compareTrees(expectedStaticRoot, temporaryStaticRoot, "Static registry output");
  if (readFileSync(join(root, "registry.json"), "utf8") !== readFileSync(join(temporarySourceRoot, "registry.json"), "utf8")) {
    throw new Error("Root GitHub registry manifest is stale.");
  }
  console.log("registry output is deterministic and current");
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
