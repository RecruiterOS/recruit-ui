#!/usr/bin/env node

import {
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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
const coreCatalog = readJson(join(root, "registry/core-support.json"));
const recruitCatalog = readJson(join(root, "registry/recruit-workflows.json"));
const vendorManifest = readJson(join(root, coreCatalog.vendorManifest));
const packageManifest = readJson(join(root, "package.json"));

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

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

const installDependencies = vendorManifest.dependencies.map((name) => {
  const version = packageManifest.dependencies?.[name];
  if (!version) throw new Error(`Missing package dependency for generated core: ${name}`);
  return `${name}@${version}`;
});

const licenseFiles = coreCatalog.licenseFiles;
if (!Array.isArray(licenseFiles) || licenseFiles.length === 0) {
  throw new Error("Core catalog must declare the license files installed with its source.");
}
const registryLicenseFiles = licenseFiles.map((path) => ({
  path,
  target: `components/recruit-ui/${path}`,
  type: "registry:file",
}));
const coreSourceFiles = [
  ...vendorManifest.files.map((file) => ({
    path: `vendor/core/${file.path}`,
    target: file.target,
    type: file.type,
  })),
  ...registryLicenseFiles,
];
const coreStaticFiles = [
  ...vendorManifest.files.map((file) => ({
    ...file,
    path: file.target,
    content: readFileSync(join(root, "vendor/core", file.path), "utf8"),
  })),
  ...registryLicenseFiles.map((file) => ({
    ...file,
    path: file.target,
    content: readFileSync(join(root, file.path), "utf8"),
  })),
];

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
    if (content.includes("@recruit-ui/core/")) {
      throw new Error(`Legacy core alias remains in ${sourcePath}`);
    }
    return {
      target,
      sourcePath: pathFromRoot.split(sep).join("/"),
      content,
    };
  });

const recruitSourceFiles = recruitSources.map(({ target, sourcePath }) => ({
  path: sourcePath,
  target,
  type: "registry:ui",
}));
const recruitStaticFiles = recruitSources.map(({ target, content }) => ({
  path: target,
  target,
  type: "registry:ui",
  content,
}));

const coreSourceItem = {
  name: coreCatalog.name,
  type: "registry:ui",
  title: coreCatalog.title,
  description: coreCatalog.description,
  dependencies: installDependencies,
  files: coreSourceFiles,
};
const recruitSourceItem = {
  name: recruitCatalog.name,
  type: "registry:ui",
  title: recruitCatalog.title,
  description: recruitCatalog.description,
  registryDependencies: recruitCatalog.registryDependencies,
  files: recruitSourceFiles,
};
const sourceRegistry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "recruit-ui",
  homepage: "https://github.com/RecruiterOS/recruit-ui",
  items: [coreSourceItem, recruitSourceItem],
};

const coreStaticItem = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  ...coreSourceItem,
  files: coreStaticFiles,
};
const recruitStaticItem = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  ...recruitSourceItem,
  files: recruitStaticFiles,
};
const staticRegistry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "recruit-ui",
  homepage: "https://github.com/RecruiterOS/recruit-ui",
  items: [coreStaticItem, recruitStaticItem],
};

writeJson(join(sourceOutputRoot, "registry.json"), sourceRegistry);
rmSync(outputRoot, { recursive: true, force: true });
writeJson(join(outputRoot, "core/recruit-core.json"), coreStaticItem);
writeJson(join(outputRoot, "recruit/recruit-workflows.json"), recruitStaticItem);
writeJson(join(outputRoot, "registry.json"), staticRegistry);

console.log(
  `registry built: ${coreSourceFiles.length} core files, ${recruitSourceFiles.length} workflow files`,
);
