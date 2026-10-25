#!/usr/bin/env node

// Fails the build when a source file
// - still imports through a retired path alias for the formerly vendored kit
//   (or through any `@/` alias),
// - imports a package that package.json doesn't declare (tests may also use
//   devDependencies; shipped sources only dependencies and peerDependencies),
// - or imports a subpath of the base kit that the pinned kit doesn't export.

import { readFileSync } from "node:fs";
import { relative, sep } from "node:path";
import {
  isTestFile,
  manifest,
  missingKitSubpaths,
  packageName,
  retiredAliasIn,
  root,
  sourceFiles,
  specifiers,
} from "./imports.mjs";

const pkg = manifest();
const shipped = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]);
const testOnly = new Set(Object.keys(pkg.devDependencies ?? {}));

const failures = [];
const files = sourceFiles().map((path) => ({
  path,
  label: relative(root, path).split(sep).join("/"),
  content: readFileSync(path, "utf8"),
}));

for (const { path, label, content } of files) {
  const alias = retiredAliasIn(content);
  if (alias) failures.push(`${label}: retired alias ${alias} (import @epicbagel/saas-kit/<primitives|lib>/<module> instead)`);
  for (const specifier of specifiers(content)) {
    // A host's `@/` alias exists only in a registry install; the package
    // build has none, so sources use relative paths and package names.
    if (specifier.startsWith("@/")) {
      if (!alias) failures.push(`${label}: imports ${specifier} through a path alias`);
      continue;
    }
    const name = packageName(specifier);
    if (!name) continue;
    if (shipped.has(name)) continue;
    if (isTestFile(path) && testOnly.has(name)) continue;
    failures.push(`${label}: imports ${specifier}, which package.json doesn't declare for ${isTestFile(path) ? "tests" : "shipped code"}`);
  }
}

failures.push(...missingKitSubpaths(files).map((entry) => `${entry} is not exported by the pinned kit`));

if (failures.length > 0) {
  console.error(`Import check failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  process.exit(1);
}

console.log(`imports checked in ${files.length} source files: declared packages only, every kit subpath exported`);
