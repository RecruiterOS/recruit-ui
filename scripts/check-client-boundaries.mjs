#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const clientEntryBases = [
  "index",
  "recruit/index",
  "recruit/call-reconcile-card",
  "recruit/candidate-activity-timeline",
  "recruit/candidate-add-to-job-popover",
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
  "recruit/candidate-outreach-drafts",
  "recruit/candidate-pipeline-card",
  "recruit/candidate-pipeline-list",
  "recruit/candidate-presentation-recorder",
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
  "recruit/document-list",
  "recruit/job-brief-card",
  "recruit/job-summary-card",
  "recruit/matched-call-card",
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
