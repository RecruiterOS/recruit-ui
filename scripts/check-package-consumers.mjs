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
import { jobBriefView, type JobBriefView } from "@recruiteros/recruit-ui/recruit/job-brief-view";

void formatCalendarDate;
void CandidateDecisionBar;
void CandidateProfileDialog;
const view: JobBriefView = jobBriefView({ roleTitle: "Fictional role" });
void view;
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
    `import * as recruit from "@recruiteros/recruit-ui/recruit";\nif (!recruit.CandidateProfileDialog) process.exit(1);\n` +
      // A brief maps outside a client boundary too.
      `import { jobBriefView } from "@recruiteros/recruit-ui/recruit/job-brief-view";\nif (jobBriefView({ roleTitle: "Fictional role" }).title !== "Fictional role") process.exit(1);\n`,
  );
  writeFileSync(
    join(fixtureRoot, "runtime.cjs"),
    `const recruit = require("@recruiteros/recruit-ui/recruit");\nif (!recruit.CandidateProfileDialog) process.exit(1);\n` +
      `const { jobBriefView } = require("@recruiteros/recruit-ui/recruit/job-brief-view");\nif (jobBriefView({ roleTitle: "Fictional role" }).title !== "Fictional role") process.exit(1);\n`,
  );
  run(process.execPath, ["runtime.mjs"], fixtureRoot);
  run(process.execPath, ["runtime.cjs"], fixtureRoot);
} finally {
  rmSync(fixtureRoot, { recursive: true, force: true });
}

console.log("ESM and CommonJS package consumers resolve types and runtime exports");
