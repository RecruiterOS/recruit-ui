#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const clientEntryBases = [
  "index",
  "recruit/index",
  "recruit/call-reconcile-card",
  "recruit/candidate-activity-timeline",
  "recruit/candidate-assessment",
  "recruit/candidate-call-card",
  "recruit/candidate-card-columns-toggle",
  "recruit/candidate-card-list",
  "recruit/candidate-career-history-panel",
  "recruit/candidate-career-history-timeline",
  "recruit/candidate-channel-actions",
  "recruit/candidate-contact-channels-menu",
  "recruit/candidate-decision-bar",
  "recruit/candidate-decision-buttons",
  "recruit/candidate-decision-reason-dialog",
  "recruit/candidate-destination-status",
  "recruit/candidate-detail-layout",
  "recruit/candidate-favourite-button",
  "recruit/candidate-filter-chips",
  "recruit/candidate-header-actions",
  "recruit/candidate-inline-card",
  "recruit/candidate-notes",
  "recruit/candidate-outreach-composer",
  "recruit/candidate-pipeline-card",
  "recruit/candidate-pipeline-list",
  "recruit/candidate-profile-dialog",
  "recruit/candidate-profile-link-button",
  "recruit/candidate-quote",
  "recruit/candidate-relationship-card",
  "recruit/candidate-review-action-row",
  "recruit/candidate-review-card",
  "recruit/candidate-role-matches",
  "recruit/candidate-selectable-avatar",
  "recruit/candidate-shared-profile-button",
  "recruit/candidate-shortlist",
  "recruit/candidate-signal-list",
  "recruit/candidate-signal-menu",
  "recruit/candidate-stage-actions",
  "recruit/candidate-stage-select",
  "recruit/candidate-voice-note",
  "recruit/current-company-popover",
  "recruit/job-summary-card",
  "recruit/matched-call-card",
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
