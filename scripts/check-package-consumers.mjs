#!/usr/bin/env node

import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixtureRoot = mkdtempSync(join(tmpdir(), "recruit-ui-consumers-"));
const packageLink = join(
  fixtureRoot,
  "node_modules",
  "@recruiteros",
  "recruit-ui",
);

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

const consumerSource = `
import { formatCalendarDate } from "@recruiteros/recruit-ui/core";
import {
  CandidateDecisionBar,
  CandidateProfileDialog,
} from "@recruiteros/recruit-ui/recruit";
import {
  CandidateDecisionReasonSheet,
  type CandidateDecisionReasonSheetProps,
} from "@recruiteros/recruit-ui/recruit/candidate-decision-reason-sheet";
import {
  CandidatePipelineBoard,
  type CandidatePipelineBoardProps,
} from "@recruiteros/recruit-ui/recruit/candidate-pipeline-board";
import { JobBriefChanges, type JobBriefChangesProps } from "@recruiteros/recruit-ui/recruit/job-brief-changes";
import {
  jobBriefChangeText,
  jobBriefVersionLabel,
  jobBriefView,
  type JobBriefChange,
  type JobBriefView,
} from "@recruiteros/recruit-ui/recruit/job-brief-view";

void formatCalendarDate;
void CandidateDecisionBar;
void CandidateProfileDialog;
void JobBriefChanges;
const view: JobBriefView = jobBriefView({ roleTitle: "Fictional role" });
void view;
const change: JobBriefChange = { kind: "added", field: "must-have", item: "Fictional skill" };
const props: JobBriefChangesProps = { changes: [change], version: 2 };
const words: string = jobBriefChangeText(change) + jobBriefVersionLabel({ number: 2, current: true });
void props;
void words;
void CandidateDecisionReasonSheet;
const sheet: CandidateDecisionReasonSheetProps = {
  open: true,
  decision: "no",
  reasons: ["Fictional reason"],
  onConfirm: async (reason?: string) => void reason,
  onClose: () => undefined,
};
void sheet;
void CandidatePipelineBoard;
interface FictionalPerson { id: number; name: string; stage: string }
const board: CandidatePipelineBoardProps<FictionalPerson> = {
  columns: [{ id: "fictional-stage", title: "Fictional stage", count: 1, tone: "success" }],
  items: [{ id: 1, name: "Fictional Person", stage: "fictional-stage" }],
  getId: (person) => person.id,
  getStage: (person) => person.stage,
  getName: (person) => person.name,
  onMove: async (person, toStage) => void [person.id, toStage],
  searchTerm: "",
  onSearchChange: (term) => void term,
};
void board;
`;

try {
  mkdirSync(dirname(packageLink), { recursive: true });
  symlinkSync(root, packageLink, "dir");

  const typescript = join(root, "node_modules", ".bin", "tsc");
  for (const fixture of [
    { name: "esm", type: "module", source: "index.ts" },
    { name: "commonjs", type: "commonjs", source: "index.cts" },
  ]) {
    const directory = join(fixtureRoot, fixture.name);
    mkdirSync(directory, { recursive: true });
    writeFileSync(
      join(directory, "package.json"),
      `${JSON.stringify({ private: true, type: fixture.type }, null, 2)}\n`,
    );
    writeFileSync(join(directory, fixture.source), consumerSource);
    run(
      typescript,
      [
        "--noEmit",
        "--strict",
        "--skipLibCheck",
        "--target",
        "ES2022",
        "--module",
        "NodeNext",
        "--moduleResolution",
        "NodeNext",
        fixture.source,
      ],
      directory,
    );
  }

  writeFileSync(
    join(fixtureRoot, "runtime.mjs"),
    `import * as recruit from "@recruiteros/recruit-ui/recruit";\nif (!recruit.CandidateProfileDialog || !recruit.JobBriefChanges || !recruit.CandidateDecisionReasonSheet || !recruit.CandidatePipelineBoard) process.exit(1);\n` +
      // A brief maps, and its changes and versions are worded, outside a client boundary too.
      `import { jobBriefChangeText, jobBriefVersionLabel, jobBriefView } from "@recruiteros/recruit-ui/recruit/job-brief-view";\nif (jobBriefView({ roleTitle: "Fictional role" }).title !== "Fictional role") process.exit(1);\n` +
      `if (jobBriefChangeText({ kind: "added", field: "must-have", item: "Fictional skill" }) !== "Added must-have: Fictional skill") process.exit(1);\n` +
      `if (jobBriefVersionLabel({ number: 2, current: false }) !== "v2 · Earlier") process.exit(1);\n`,
  );
  writeFileSync(
    join(fixtureRoot, "runtime.cjs"),
    `const recruit = require("@recruiteros/recruit-ui/recruit");\nif (!recruit.CandidateProfileDialog || !recruit.JobBriefChanges || !recruit.CandidateDecisionReasonSheet || !recruit.CandidatePipelineBoard) process.exit(1);\n` +
      `const { jobBriefChangeText, jobBriefVersionLabel, jobBriefView } = require("@recruiteros/recruit-ui/recruit/job-brief-view");\nif (jobBriefView({ roleTitle: "Fictional role" }).title !== "Fictional role") process.exit(1);\n` +
      `if (jobBriefChangeText({ kind: "added", field: "must-have", item: "Fictional skill" }) !== "Added must-have: Fictional skill") process.exit(1);\n` +
      `if (jobBriefVersionLabel({ number: 2, current: false }) !== "v2 · Earlier") process.exit(1);\n`,
  );
  run(process.execPath, ["runtime.mjs"], fixtureRoot);
  run(process.execPath, ["runtime.cjs"], fixtureRoot);
} finally {
  rmSync(fixtureRoot, { recursive: true, force: true });
}

console.log("ESM and CommonJS package consumers resolve types and runtime exports");
