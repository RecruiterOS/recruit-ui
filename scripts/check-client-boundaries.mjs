#!/usr/bin/env node

import { readFileSync } from "node:fs";
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

for (const pathFromRoot of clientEntries) {
  const output = readFileSync(join(root, pathFromRoot), "utf8");
  if (!clientDirective.test(output)) {
    throw new Error(`Built client entry lost its directive: ${pathFromRoot}`);
  }
}

console.log(`client boundaries preserved in ${clientEntries.length} package entries`);
