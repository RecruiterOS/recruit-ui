#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const coreRoot = join(root, "vendor/core");
const checksumPath = join(coreRoot, "SHA256SUMS");
const manifestPath = join(coreRoot, "export.json");

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    })
    .sort();
}

const expected = new Map(
  readFileSync(checksumPath, "utf8")
    .trim()
    .split("\n")
    .map((line) => {
      const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
      if (!match) throw new Error(`Invalid checksum line: ${line}`);
      return [match[2], match[1]];
    }),
);

const actualFiles = filesUnder(coreRoot)
  .filter((path) => path !== checksumPath)
  .map((path) => relative(coreRoot, path).split(sep).join("/"));

if (actualFiles.length !== expected.size) {
  throw new Error("Generated core file set does not match SHA256SUMS.");
}
for (const path of actualFiles) {
  const expectedDigest = expected.get(path);
  if (!expectedDigest) throw new Error(`Unchecksummed core file: ${path}`);
  const digest = createHash("sha256")
    .update(readFileSync(join(coreRoot, path)))
    .digest("hex");
  if (digest !== expectedDigest) throw new Error(`Generated core changed: ${path}`);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (manifest.schemaVersion !== 1 || manifest.name !== "recruit-core") {
  throw new Error("Unexpected generated core manifest identity.");
}
if (!Array.isArray(manifest.files) || manifest.files.length !== 34) {
  throw new Error("Expected the verified 34-file public core closure.");
}
for (const file of manifest.files) {
  if (!expected.has(file.path)) throw new Error(`Manifest file is not checksummed: ${file.path}`);
}

console.log(`generated core verified: ${manifest.files.length} files from ${manifest.sourceVersion}`);
