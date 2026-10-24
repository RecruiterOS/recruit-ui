#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const clientEntryBases = [
  "index",
  "recruit/index",
  "recruit/candidate-career-history-timeline",
  "recruit/candidate-decision-bar",
  "recruit/candidate-destination-status",
  "recruit/candidate-inline-card",
  "recruit/candidate-profile-dialog",
  "recruit/candidate-review-card",
];
const clientEntries = clientEntryBases.flatMap((entry) => [
  `dist/${entry}.js`,
  `dist/${entry}.cjs`,
]);
const clientDirective = /^[\uFEFF\s]*["']use client["'];/;

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

for (const pathFromRoot of clientEntries) {
  const path = join(root, pathFromRoot);
  const output = readFileSync(path, "utf8");
  if (!clientDirective.test(output)) {
    writeFileSync(path, `"use client";\n${output}`);
  }
}

for (const path of filesUnder(join(root, "dist"))) {
  if (!/\.(?:c?js)$/.test(path)) continue;
  const output = readFileSync(path, "utf8");
  const normalized = output.replace(/[ \t]+(?=\r?\n)/g, "");
  if (normalized !== output) writeFileSync(path, normalized);
}

console.log(
  `client boundaries and generated whitespace normalized in ${clientEntries.length} package entries`,
);
