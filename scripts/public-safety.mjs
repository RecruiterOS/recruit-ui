#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRECTORIES = new Set([".git", "node_modules", "coverage"]);
const TEXT_EXTENSIONS = new Set([
  "",
  ".cjs",
  ".css",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);
const FORBIDDEN_FILE_NAMES = [
  /^\.env(?:\..+)?$/i,
  /^\.npmrc$/i,
  /\.(?:key|pem|p12|pfx|sqlite|sqlite3|db|log|map)$/i,
];
const knownSecretPrefixPattern = /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16}|sk_(?:live|test)_[A-Za-z0-9]{12,})\b/;
const FORBIDDEN_CONTENT = [
  {
    label: "private key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  },
  {
    label: "credential-shaped assignment",
    pattern: /\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|password)\b\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{8,}/i,
  },
  {
    label: "authorization credential",
    pattern: /\bAuthorization\s*:\s*(?:Bearer|Basic)\s+[A-Za-z0-9+/._=-]{8,}/i,
  },
  {
    label: "known secret prefix",
    pattern: knownSecretPrefixPattern,
  },
  {
    label: "prefixed service token",
    pattern: /\b[a-z]{2,5}_[A-Za-z0-9]{24,}\b/,
  },
  {
    label: "email address",
    pattern: /\b[A-Z0-9._%+-]+@(?!example\.(?:com|org|net)\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  },
  {
    label: "phone number",
    pattern: /\+\d{1,3}[\s().-]+\d{2,4}[\s().-]+\d{3,4}[\s.-]+\d{3,4}\b/,
  },
  {
    label: "private or local URL",
    pattern: /https?:\/\/(?:[^\s/@]+:[^\s/@]+@)?(?:localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+|[^\s/]+\.(?:internal|local|corp))(?:[/:?#]|\b)/i,
  },
  {
    label: "private package registry",
    pattern: /npm\.pkg\.github\.com/i,
  },
  {
    label: "absolute workstation path",
    pattern: /(?:\/home\/[^/\s]+|\/Users\/[^/\s]+|[A-Z]:\\Users\\[^\\\s]+)/,
  },
  {
    label: "record identifier",
    pattern: /\b(?:candidate|user|account|tenant|workspace|organization|job|project)_[A-Za-z0-9_-]{8,}\b/i,
  },
  {
    label: "UUID",
    pattern: /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i,
  },
];

// Scoped packages are checked against an allowlist rather than a deny-list:
// every scoped package that a file imports, or that a registry item installs,
// must be this package or one it declares in package.json. The rule names no
// package that it rejects.
const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const DECLARED_PACKAGES = new Set([
  manifest.name,
  ...["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"].flatMap((field) =>
    Object.keys(manifest[field] ?? {}),
  ),
]);
// Module specifiers in JS/TS (also JSON-escaped, as inlined in registry
// payloads) and in CSS at-rules, plus installed-package paths such as a
// Tailwind `@source` into node_modules. `@/…` path aliases have no scope and
// never match.
const SCOPED_SPECIFIERS = [
  /(?:\bfrom|\bimport|\bimport\s*\(|\brequire\s*\(|\bmodule|\bmock\s*\(|@source|@plugin|@reference)\s*\\?["'`](@[^\s"'`\\/]+\/[^\s"'`\\/]+)/g,
  /\bnode_modules\/(@[^\s"'`\\/]+\/[^\s"'`\\/]+)/g,
];
const UNDECLARED_PACKAGE = "package outside the dependency allowlist";
// The lockfile lists transitive packages of the declared ones.
const LOCKFILE = "pnpm-lock.yaml";

function registryDependencies(value, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) registryDependencies(item, found);
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if ((key === "dependencies" || key === "devDependencies") && Array.isArray(child)) {
        for (const entry of child) if (typeof entry === "string") found.push(entry);
      } else {
        registryDependencies(child, found);
      }
    }
  }
  return found;
}

function hasUndeclaredPackage(source, pathFromRoot) {
  if (basename(pathFromRoot) === LOCKFILE) return false;
  for (const pattern of SCOPED_SPECIFIERS) {
    for (const match of source.matchAll(pattern)) {
      if (!DECLARED_PACKAGES.has(match[1])) return true;
    }
  }
  if (extname(pathFromRoot).toLowerCase() !== ".json") return false;
  let parsed;
  try {
    parsed = JSON.parse(source);
  } catch {
    return false;
  }
  return registryDependencies(parsed).some((entry) => {
    const scoped = /^(@[^/@\s]+\/[^/@\s]+)/.exec(entry);
    return scoped !== null && !DECLARED_PACKAGES.has(scoped[1]);
  });
}

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && SKIP_DIRECTORIES.has(entry.name)) return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

const findings = new Set();

function scanSource(source, pathFromRoot, origin = "working tree") {
  if (source.includes("\0")) {
    findings.add(`${origin}:${pathFromRoot}: unexpected binary content`);
    return;
  }
  for (const { label, pattern } of FORBIDDEN_CONTENT) {
    if (pattern.test(source)) findings.add(`${origin}:${pathFromRoot}: ${label}`);
  }
  if (hasUndeclaredPackage(source, pathFromRoot)) {
    findings.add(`${origin}:${pathFromRoot}: ${UNDECLARED_PACKAGE}`);
  }
}

for (const path of filesUnder(root)) {
  const pathFromRoot = relative(root, path).split(sep).join("/");
  const name = basename(path);
  if (FORBIDDEN_FILE_NAMES.some((pattern) => pattern.test(name))) {
    findings.add(`working tree:${pathFromRoot}: forbidden file type or name`);
    continue;
  }
  if (pathFromRoot === "scripts/public-safety.mjs") continue;
  if (!statSync(path).isFile() || !TEXT_EXTENSIONS.has(extname(path).toLowerCase())) continue;
  scanSource(readFileSync(path, "utf8"), pathFromRoot);
}

function git(args, input) {
  return spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    input,
    maxBuffer: 128 * 1024 * 1024,
  });
}

function scanGitBlob(objectId, pathFromRoot, origin) {
  if (!pathFromRoot || pathFromRoot === "scripts/public-safety.mjs") return;
  const name = basename(pathFromRoot);
  if (FORBIDDEN_FILE_NAMES.some((pattern) => pattern.test(name))) {
    findings.add(`${origin}:${pathFromRoot}: forbidden file type or name`);
    return;
  }
  if (!TEXT_EXTENSIONS.has(extname(pathFromRoot).toLowerCase())) return;
  const object = git(["cat-file", "blob", objectId]);
  if (object.status !== 0) return;
  scanSource(object.stdout, pathFromRoot, origin);
}

const staged = git(["ls-files", "-s", "-z"]);
if (staged.status === 0 && staged.stdout) {
  for (const entry of staged.stdout.split("\0")) {
    if (!entry) continue;
    const match = /^\d+ ([a-f0-9]+) \d+\t(.+)$/.exec(entry);
    if (match) scanGitBlob(match[1], match[2], "git index");
  }
}

const reachable = git(["rev-list", "--objects", "--all"]);
if (reachable.status === 0 && reachable.stdout) {
  for (const line of reachable.stdout.trim().split("\n")) {
    const separator = line.indexOf(" ");
    if (separator < 0) continue;
    const objectId = line.slice(0, separator);
    const pathFromRoot = line.slice(separator + 1);
    scanGitBlob(objectId, pathFromRoot, "git history");
  }
}

if (findings.size > 0) {
  console.error("Public-safety check failed:\n" + [...findings].map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("public-safety check passed: no secrets, PII, private identities, or unsafe artifacts");
