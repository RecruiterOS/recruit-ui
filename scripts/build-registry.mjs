#!/usr/bin/env node

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import {
  KIT,
  manifest,
  packageName,
  pinnedKit,
  readJson,
  retiredAliasIn,
  root,
  specifiers,
} from "./imports.mjs";

const outputFlag = process.argv.indexOf("--out");
const sourceOutputFlag = process.argv.indexOf("--source-out");
const outputRoot = resolve(
  root,
  outputFlag >= 0 && process.argv[outputFlag + 1]
    ? process.argv[outputFlag + 1]
    : "dist/registry",
);
const sourceOutputRoot = resolve(
  root,
  sourceOutputFlag >= 0 && process.argv[sourceOutputFlag + 1]
    ? process.argv[sourceOutputFlag + 1]
    : ".",
);
const tokensCatalog = readJson(join(root, "registry/recruit-tokens.json"));
const recruitCatalog = readJson(join(root, "registry/recruit-workflows.json"));
const packageManifest = manifest();
const kit = pinnedKit();

// A shadcn host already has React; the registry installs everything else the
// workflow files import.
const HOST_PACKAGES = new Set(["react", "react-dom"]);

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function registryTarget(sourcePath) {
  const normalized = sourcePath.split(sep).join("/");
  if (normalized === "src/core/calendar-date.ts") {
    return "components/recruit-ui/core/calendar-date.ts";
  }
  if (normalized.startsWith("src/recruit/")) {
    return normalized.replace(/^src\/recruit\//, "components/recruit-ui/recruit/");
  }
  throw new Error(`No registry target for ${sourcePath}`);
}

/** "name@range" from package.json, for a package the registry files import. */
function installSpec(name) {
  const range =
    packageManifest.dependencies?.[name] ?? packageManifest.peerDependencies?.[name];
  if (!range) throw new Error(`Registry files import ${name}, which package.json doesn't declare.`);
  return `${name}@${range}`;
}

// --- recruit-tokens: the base kit's neutral palette as append-only CSS vars --

// The palette comes from the pinned kit, so the values a registry install
// appends are the ones the package's primitives were built against. Every
// token is listed for light and dark; the shadcn CLI only appends a variable
// the host's stylesheet doesn't already declare (a registry:item never
// overwrites), so a host keeps its own palette and gains only what it lacks,
// such as --destructive-foreground on a current shadcn theme. Values are the
// bare `H S% L%` triples the kit uses; the CLI wraps them in hsl() for a
// Tailwind v4 stylesheet.
const { NEUTRAL, SEMANTIC_TOKENS, hexToHsl } = await import(`${KIT}/lib/neutral-theme`);
const palette = (mode) =>
  Object.fromEntries(SEMANTIC_TOKENS.map((token) => [token, hexToHsl(NEUTRAL[mode][token])]));

const tokensItem = {
  name: tokensCatalog.name,
  type: tokensCatalog.type,
  title: tokensCatalog.title,
  description: tokensCatalog.description,
  cssVars: { light: palette("light"), dark: palette("dark") },
};

// --- recruit-workflows: the canonical workflow sources ----------------------

const recruitSources = [...recruitCatalog.files]
  .sort()
  .map((sourcePath) => {
    const absolutePath = resolve(root, sourcePath);
    const pathFromRoot = relative(root, absolutePath);
    if (pathFromRoot.startsWith("..") || pathFromRoot.includes(`${sep}..${sep}`)) {
      throw new Error(`Registry source escapes repository: ${sourcePath}`);
    }
    const target = registryTarget(pathFromRoot);
    const content = readFileSync(absolutePath, "utf8");
    const alias = retiredAliasIn(content);
    if (alias) throw new Error(`Retired core alias ${alias} remains in ${sourcePath}`);
    return {
      target,
      sourcePath: pathFromRoot.split(sep).join("/"),
      content,
    };
  });

// The workflow files import the kit by package name, so the registry
// installs it (and anything else they import) as an npm dependency at the
// range package.json declares. Nothing from the kit is copied in.
const cssImports = recruitCatalog.css ?? [];
const importedPackages = [
  ...recruitSources.flatMap(({ content }) => specifiers(content)),
  ...cssImports,
]
  .map(packageName)
  .filter((name) => name && !HOST_PACKAGES.has(name));
const installDependencies = [...new Set(importedPackages)].sort().map(installSpec);
if (!installDependencies.includes(`${KIT}@${kit.range}`)) {
  throw new Error(`Workflow files must install ${KIT}@${kit.range}.`);
}

const licenseFiles = recruitCatalog.licenseFiles;
if (!Array.isArray(licenseFiles) || licenseFiles.length === 0) {
  throw new Error("Workflow catalog must declare the license files installed with its source.");
}
const registryLicenseFiles = licenseFiles.map((path) => ({
  path,
  target: `components/recruit-ui/${path}`,
  type: "registry:file",
}));

const recruitSourceFiles = [
  ...recruitSources.map(({ target, sourcePath }) => ({
    path: sourcePath,
    target,
    type: "registry:ui",
  })),
  ...registryLicenseFiles,
];
const recruitStaticFiles = [
  ...recruitSources.map(({ target, content }) => ({
    path: target,
    target,
    type: "registry:ui",
    content,
  })),
  ...registryLicenseFiles.map((file) => ({
    ...file,
    path: file.target,
    content: readFileSync(join(root, file.path), "utf8"),
  })),
];

const recruitSourceItem = {
  name: recruitCatalog.name,
  type: "registry:ui",
  title: recruitCatalog.title,
  description: recruitCatalog.description,
  dependencies: installDependencies,
  registryDependencies: recruitCatalog.registryDependencies,
  css: Object.fromEntries(cssImports.map((specifier) => [`@import "${specifier}"`, {}])),
  files: recruitSourceFiles,
};

// --- outputs -----------------------------------------------------------------

const registryHeader = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "recruit-ui",
  homepage: "https://github.com/RecruiterOS/recruit-ui",
};
const itemSchema = "https://ui.shadcn.com/schema/registry-item.json";

const sourceRegistry = { ...registryHeader, items: [tokensItem, recruitSourceItem] };
const tokensStaticItem = { $schema: itemSchema, ...tokensItem };
const recruitStaticItem = { $schema: itemSchema, ...recruitSourceItem, files: recruitStaticFiles };
const staticRegistry = { ...registryHeader, items: [tokensStaticItem, recruitStaticItem] };

writeJson(join(sourceOutputRoot, "registry.json"), sourceRegistry);
rmSync(outputRoot, { recursive: true, force: true });
writeJson(join(outputRoot, `${tokensCatalog.namespace}/${tokensItem.name}.json`), tokensStaticItem);
writeJson(join(outputRoot, `${recruitCatalog.namespace}/${recruitSourceItem.name}.json`), recruitStaticItem);
writeJson(join(outputRoot, "registry.json"), staticRegistry);

console.log(
  `registry built: ${SEMANTIC_TOKENS.length} tokens from ${KIT} ${kit.version}, ${recruitSources.length} workflow files (+${registryLicenseFiles.length} license files), ${installDependencies.length} npm dependencies`,
);
