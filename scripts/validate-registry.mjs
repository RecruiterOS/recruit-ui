#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRegistry = readJson(join(root, "registry.json"));
const staticRegistry = readJson(join(root, "dist/registry/registry.json"));
const manifest = readJson(join(root, "package.json"));

const KIT = "@epicbagel/saas-kit";
const RETIRED_ALIASES = ["@/components/recruit-ui/core/", "@recruit-ui/core/"];
const EXPECTED_CSS = [
  `@import "${KIT}/styles/utilities.css"`,
  `@import "${KIT}/styles/source.css"`,
];
// The kit's semantic token contract (lib/neutral-theme SEMANTIC_TOKENS).
const TOKEN_NAME = /^(?:background|foreground|(?:card|popover|primary|secondary|muted|accent|destructive)(?:-foreground)?|border|input|ring|chart-[1-5]|sidebar-(?:background|foreground|primary|primary-foreground|accent|accent-foreground|border|ring))$/;
const HSL_TRIPLE = /^\d+(?:\.\d+)? \d+(?:\.\d+)?% \d+(?:\.\d+)?%$/;

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function validateTokens(item) {
  // registry:item, never registry:theme or registry:style: the shadcn CLI
  // overwrites a host's existing variables only for those types, and these
  // must only ever fill gaps in the host's palette.
  if (item.type !== "registry:item") {
    throw new Error("recruit-tokens must be a registry:item so its variables are append-only.");
  }
  if (item.files?.length) throw new Error("recruit-tokens installs variables only, no files.");
  const modes = Object.keys(item.cssVars ?? {});
  if (JSON.stringify(modes) !== JSON.stringify(["light", "dark"])) {
    throw new Error(`recruit-tokens must define light and dark variables only, not: ${modes.join(", ")}`);
  }
  const lightNames = Object.keys(item.cssVars.light);
  if (JSON.stringify(lightNames) !== JSON.stringify(Object.keys(item.cssVars.dark))) {
    throw new Error("recruit-tokens light and dark modes must define the same variables.");
  }
  if (!lightNames.includes("destructive-foreground")) {
    throw new Error("recruit-tokens must supply --destructive-foreground, which current shadcn themes omit.");
  }
  for (const mode of modes) {
    for (const [name, value] of Object.entries(item.cssVars[mode])) {
      if (!TOKEN_NAME.test(name)) throw new Error(`recruit-tokens ${mode} defines unknown token ${name}`);
      if (!HSL_TRIPLE.test(value)) throw new Error(`recruit-tokens ${mode} ${name} is not an H S% L% triple: ${value}`);
    }
  }
}

function validateWorkflows(item, { source }) {
  if (item.type !== "registry:ui" || !Array.isArray(item.files) || item.files.length === 0) {
    throw new Error(`Invalid registry item: ${item.name}`);
  }
  const targets = new Set();
  for (const file of item.files) {
    if (!file.target.startsWith("components/recruit-ui/")) {
      throw new Error(`Unsafe registry target: ${file.target}`);
    }
    if (targets.has(file.target)) throw new Error(`Duplicate registry target: ${file.target}`);
    targets.add(file.target);
    if (source) {
      if (!existsSync(join(root, file.path))) {
        throw new Error(`Missing GitHub registry source: ${file.path}`);
      }
    } else if (typeof file.content !== "string" || file.content.length === 0) {
      throw new Error(`Missing static registry content: ${file.target}`);
    }
    const content = source
      ? readFileSync(join(root, file.path), "utf8")
      : file.content;
    const alias = RETIRED_ALIASES.find((candidate) => content.includes(candidate));
    if (alias) {
      throw new Error(`Retired core alias ${alias} in registry target: ${file.target}`);
    }
    if (/sourceMappingURL|\.map(?:["']|$)/.test(content)) {
      throw new Error(`Source-map reference in registry target: ${file.target}`);
    }
  }

  const expectedDependency = ["RecruiterOS/recruit-ui/recruit-tokens"];
  if (JSON.stringify(item.registryDependencies) !== JSON.stringify(expectedDependency)) {
    throw new Error("Recruit workflows must depend on the tokens item by its full same-repository address.");
  }

  const kitDependency = `${KIT}@${manifest.peerDependencies?.[KIT]}`;
  if (!item.dependencies?.includes(kitDependency)) {
    throw new Error(`Recruit workflows must install ${kitDependency}, the peer range package.json declares.`);
  }
  for (const dependency of item.dependencies) {
    if (/^@radix-ui\/|^(?:class-variance-authority|clsx|tailwind-merge|vaul|react-responsive)@/.test(dependency)) {
      throw new Error(`Recruit workflows install ${dependency}, which only the kit uses; the kit brings its own.`);
    }
  }

  if (JSON.stringify(Object.keys(item.css ?? {})) !== JSON.stringify(EXPECTED_CSS)) {
    throw new Error(`Recruit workflows must import exactly: ${EXPECTED_CSS.join(", ")}`);
  }

  for (const legalTarget of ["LICENSE", "NOTICE", "THIRD_PARTY_NOTICES.md"]) {
    if (!targets.has(`components/recruit-ui/${legalTarget}`)) {
      throw new Error(`Recruit workflows must install ${legalTarget}.`);
    }
  }
}

function validateCatalog(registry, { source }) {
  if (registry.name !== "recruit-ui" || registry.items?.length !== 2) {
    throw new Error("Registry must contain exactly the tokens and recruit namespaces.");
  }
  const names = registry.items.map((item) => item.name);
  if (JSON.stringify(names) !== JSON.stringify(["recruit-tokens", "recruit-workflows"])) {
    throw new Error(`Unexpected registry items: ${names.join(", ")}`);
  }
  validateTokens(registry.items[0]);
  validateWorkflows(registry.items[1], { source });
}

validateCatalog(sourceRegistry, { source: true });
validateCatalog(staticRegistry, { source: false });
console.log("registry valid: GitHub source and static outputs agree on the tokens and workflows items");
