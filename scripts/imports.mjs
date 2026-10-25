// Import analysis shared by check-imports, build-registry and check-registry:
// which packages the sources import, and whether every subpath of the base
// kit they import is one the pinned kit actually exports.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const KIT = "@epicbagel/saas-kit";

/**
 * Path aliases that resolved to the copy of the base kit this repository
 * used to vendor. Sources import the kit package instead; any of these left
 * behind would build against nothing.
 */
export const RETIRED_ALIASES = ["@/components/recruit-ui/core/", "@recruit-ui/core/"];

// Static and dynamic imports, re-exports, require() and vi.mock() specifiers.
const SPECIFIER =
  /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*|\bmock\s*\(\s*)["']([^"'\s]+)["']/g;

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function manifest() {
  return readJson(join(root, "package.json"));
}

export function sourceFiles(directory = join(root, "src")) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(path);
      return /\.(?:ts|tsx)$/.test(entry.name) ? [path] : [];
    })
    .sort();
}

export function isTestFile(path) {
  return /(?:\.test\.tsx?$|[\\/]test[\\/])/.test(path);
}

/** Every module specifier in a source text, in order of appearance. */
export function specifiers(source) {
  return [...source.matchAll(SPECIFIER)].map((match) => match[1]);
}

/** "@scope/name/sub" → "@scope/name", "name/sub" → "name"; null for relative or node: imports. */
export function packageName(specifier) {
  if (specifier.startsWith(".") || specifier.startsWith("/") || specifier.startsWith("node:")) return null;
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/** The kit subpaths ("./primitives/text") a source text imports. */
export function kitSubpaths(source) {
  return specifiers(source)
    .filter((specifier) => specifier === KIT || specifier.startsWith(`${KIT}/`))
    .map((specifier) => (specifier === KIT ? "." : `.${specifier.slice(KIT.length)}`));
}

export function retiredAliasIn(source) {
  return RETIRED_ALIASES.find((alias) => source.includes(alias));
}

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  return match ? match.slice(1).map(Number) : null;
}

/** Enough of semver for this repository's own ranges: exact versions and ^x.y.z. */
export function satisfies(version, range) {
  const actual = parseVersion(version);
  if (!actual) return false;
  if (!range.startsWith("^")) return version === range;
  const floor = parseVersion(range.slice(1));
  if (!floor) return false;
  const [major, minor, patch] = floor;
  if (actual[0] !== major) return false;
  if (major === 0 && actual[1] !== minor) return false;
  for (let index = 0; index < 3; index += 1) {
    if (actual[index] !== floor[index]) return actual[index] > floor[index];
  }
  return true;
}

/**
 * The installed base kit, checked against package.json: it must be the exact
 * devDependency pin, and that pin must satisfy the peer range consumers see.
 */
export function pinnedKit() {
  const pkg = manifest();
  const pin = pkg.devDependencies?.[KIT];
  const range = pkg.peerDependencies?.[KIT];
  if (!pin || !range) throw new Error(`${KIT} must be both a peerDependency and an exact devDependency.`);
  if (!parseVersion(pin)) throw new Error(`${KIT} devDependency must be an exact version, not ${pin}.`);
  if (!satisfies(pin, range)) throw new Error(`${KIT} pin ${pin} does not satisfy the peer range ${range}.`);
  const kitManifestPath = join(root, "node_modules", KIT, "package.json");
  if (!existsSync(kitManifestPath)) throw new Error(`${KIT} is not installed; run pnpm install.`);
  const kit = readJson(kitManifestPath);
  if (kit.version !== pin) {
    throw new Error(`Installed ${KIT} is ${kit.version}, but package.json pins ${pin}; run pnpm install.`);
  }
  return { version: kit.version, range, exports: new Set(Object.keys(kit.exports ?? {})) };
}

/** Kit subpaths in `files` ([{ label, content }]) that the pinned kit doesn't export. */
export function missingKitSubpaths(files, kit = pinnedKit()) {
  return files.flatMap(({ label, content }) =>
    kitSubpaths(content)
      .filter((subpath) => !kit.exports.has(subpath))
      .map((subpath) => `${label}: ${KIT}${subpath === "." ? "" : subpath.slice(1)}`),
  );
}
