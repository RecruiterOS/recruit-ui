#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(root, "dist");
const snapshotRoot = mkdtempSync(join(tmpdir(), "recruit-ui-dist-"));
const snapshotDist = join(snapshotRoot, "dist");

function filesUnder(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    })
    .sort();
}

function relativeFiles(directory) {
  return filesUnder(directory).map((path) =>
    relative(directory, path).split(sep).join("/"),
  );
}

function compareDistributions() {
  const before = relativeFiles(snapshotDist);
  const after = relativeFiles(distRoot);
  if (JSON.stringify(before) !== JSON.stringify(after)) {
    throw new Error("Committed distribution file set is stale. Commit the rebuilt dist directory.");
  }
  for (const path of before) {
    if (!readFileSync(join(snapshotDist, path)).equals(readFileSync(join(distRoot, path)))) {
      throw new Error(`Committed distribution is stale: ${path}`);
    }
  }
}

try {
  if (!existsSync(distRoot)) {
    throw new Error("Committed dist directory is missing. Run pnpm build and commit it.");
  }
  cpSync(distRoot, snapshotDist, { recursive: true });
  const result = spawnSync("pnpm", ["build"], {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
  compareDistributions();
  console.log("committed package and registry distribution is deterministic and current");
} finally {
  rmSync(snapshotRoot, { recursive: true, force: true });
}
