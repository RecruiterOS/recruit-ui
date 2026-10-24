#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRegistry = readJson(join(root, "registry.json"));
const staticRegistry = readJson(join(root, "dist/registry/registry.json"));

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function validateCatalog(registry, { source }) {
  if (registry.name !== "recruit-ui" || registry.items?.length !== 2) {
    throw new Error("Registry must contain exactly the core and recruit namespaces.");
  }
  const names = registry.items.map((item) => item.name);
  if (JSON.stringify(names) !== JSON.stringify(["recruit-core", "recruit-workflows"])) {
    throw new Error(`Unexpected registry items: ${names.join(", ")}`);
  }

  for (const item of registry.items) {
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
      if (content.includes("@recruit-ui/core/")) {
        throw new Error(`Legacy core alias in registry target: ${file.target}`);
      }
      if (/sourceMappingURL|\.map(?:["']|$)/.test(content)) {
        throw new Error(`Source-map reference in registry target: ${file.target}`);
      }
    }
  }

  const recruit = registry.items[1];
  const expectedDependency = ["RecruiterOS/recruit-ui/recruit-core"];
  if (JSON.stringify(recruit.registryDependencies) !== JSON.stringify(expectedDependency)) {
    throw new Error("Recruit workflows must use the full same-repository core address.");
  }

  const coreTargets = new Set(registry.items[0].files.map((file) => file.target));
  for (const legalTarget of ["LICENSE", "NOTICE", "THIRD_PARTY_NOTICES.md"]) {
    if (!coreTargets.has(`components/recruit-ui/${legalTarget}`)) {
      throw new Error(`Core registry item must install ${legalTarget}.`);
    }
  }
}

validateCatalog(sourceRegistry, { source: true });
validateCatalog(staticRegistry, { source: false });
console.log("registry valid: GitHub source and static outputs agree on two namespaces");
