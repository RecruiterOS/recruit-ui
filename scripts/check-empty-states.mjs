#!/usr/bin/env node

// One blank-slate vocabulary in every shipped component.
//
// "Nothing to show" is the kit's EmptyState. A hand-rolled variant (a muted
// line of text, an alert, a bare `null` where a list used to be) drifts in
// size, alignment and tone from the hosts these components render in, which
// hold their own trees to the same rules.
//
// Rules, for every non-test .tsx file under src/:
//  1. <EmptyState> states its variant, size, icon and title explicitly. The
//     kit defaults (variant "select", size "md", no icon) are wrong for most
//     call sites, and an inline state lays out differently with and without
//     an icon, so leaving any of them implicit is how siblings end up
//     mismatched.
//  2. <EmptyState> owns its spacing and icon sizing: no className or
//     paddingY, size is a literal from inline | md | lg, and the icon is a
//     component reference, never an element.
//  3. <FeatureEmptyState> is a host's first-run screen for a whole feature,
//     so no workflow component renders one.
//  4. Rendered copy that announces absence ("No …", "Nothing …", "… yet")
//     sits inside an EmptyState (or the kit's CommandEmpty combobox slot).
//     A value that legitimately reads that way opts out with
//     `// empty-state-ok: <reason>` on the line above, so every exception is
//     visible in review. Host-overridable default labels are not rendered
//     positions and are not checked.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredEmptyStateProps = ["variant", "size", "icon", "title"];
// CommandEmpty is the kit's own no-match slot for a combobox: it shows only
// when the filtered list is empty, so it is the primitive there, not a bypass.
const containerTags = new Set(["EmptyState", "CommandEmpty"]);
// inline inside a populated surface (panel, drawer, popover, dialog, card);
// md when a whole list, tab or pane is empty; lg for a standalone page.
const allowedSizes = new Set(["inline", "md", "lg"]);
const absenceCopy = /^(no|nobody|none)\s+\S|^nothing\b|\byet[.!…]?$|^not (on|set|linked|yet)\b/i;
const optOut = /empty-state-ok:\s*\S/;

// Violations that predate this check, keyed by file and message rather than
// line so nearby edits don't trip them. A ratchet, not an exemption: a count
// may shrink but never grow, and an entry goes when its file is fixed.
// Fixing this one adds an icon to the empty career history every host
// renders today, so it waits for a release that means to change that.
const knownViolations = new Map([
  [
    "src/recruit/candidate-career-history-timeline.tsx",
    {
      "EmptyState must set icon explicitly": 1,
      "EmptyState owns its presentation; drop className": 1,
    },
  ],
]);

function sourceFiles(directory) {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      if (statSync(path).isDirectory()) return sourceFiles(path);
      if (/\.test\.tsx?$/.test(path) || `${sep}${relative(root, path)}`.includes(`${sep}test${sep}`)) return [];
      return path.endsWith(".tsx") ? [path] : [];
    })
    .sort();
}

function attribute(node, name) {
  return node.attributes.properties.find(
    (property) => ts.isJsxAttribute(property) && property.name.text === name,
  );
}

function tagOf(node) {
  if (ts.isJsxElement(node)) return node.openingElement.tagName.getText();
  if (ts.isJsxSelfClosingElement(node)) return node.tagName.getText();
  return undefined;
}

// Strings reach the screen as JSX children or through a rendered-value prop
// (`value=`, `fallback=`, `children=`). Walk up through ternaries, `||`, `??`,
// `&&` and parentheses to find which of those positions a literal sits in.
function renderedPosition(node) {
  let current = node;
  while (
    current.parent &&
    (ts.isConditionalExpression(current.parent) ||
      ts.isParenthesizedExpression(current.parent) ||
      (ts.isBinaryExpression(current.parent) &&
        [ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken, ts.SyntaxKind.AmpersandAmpersandToken]
          .includes(current.parent.operatorToken.kind) &&
        current.parent.right === current))
  ) {
    if (ts.isConditionalExpression(current.parent) && current.parent.condition === current) return false;
    current = current.parent;
  }
  const container = current.parent;
  if (!container || !ts.isJsxExpression(container)) return false;
  if (ts.isJsxElement(container.parent) || ts.isJsxFragment(container.parent)) return true;
  return ts.isJsxAttribute(container.parent) && ["value", "fallback", "children"].includes(container.parent.name.text);
}

function insideContainer(node) {
  for (let current = node.parent; current; current = current.parent) {
    const tag = tagOf(current);
    if (tag && containerTags.has(tag)) return true;
    // An EmptyState prop (title, description) is an attribute on its opening tag.
    if ((ts.isJsxOpeningElement(current) || ts.isJsxSelfClosingElement(current)) &&
      containerTags.has(current.tagName.getText())) return true;
  }
  return false;
}

const found = [];
const files = sourceFiles(join(root, "src"));

for (const path of files) {
  const file = relative(root, path).split(sep).join("/");
  const text = readFileSync(path, "utf8");
  const lines = text.split(/\r?\n/);
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const report = (node, message) => {
    const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
    if (optOut.test(lines[line - 1] ?? "") || optOut.test(lines[line] ?? "")) return;
    found.push({ file, message, location: `${file}:${line + 1}:${character + 1}` });
  };

  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      if (tag === "EmptyState") {
        const missing = requiredEmptyStateProps.filter((name) => !attribute(node, name));
        if (missing.length) report(node, `EmptyState must set ${missing.join(", ")} explicitly`);
        const size = attribute(node, "size");
        const sizeValue = size?.initializer && ts.isStringLiteral(size.initializer) ? size.initializer.text : undefined;
        if (size && !sizeValue) report(size, "EmptyState size must be a literal so the placement is reviewable");
        if (sizeValue && !allowedSizes.has(sizeValue)) report(size, `EmptyState size "${sizeValue}" is not in the vocabulary (inline | md | lg)`);
        for (const name of ["className", "paddingY", "showGradient", "entityType"]) {
          if (attribute(node, name)) report(node, `EmptyState owns its presentation; drop ${name}`);
        }
        const icon = attribute(node, "icon");
        const expression = icon?.initializer && ts.isJsxExpression(icon.initializer) && icon.initializer.expression;
        if (expression && (ts.isJsxElement(expression) || ts.isJsxSelfClosingElement(expression))) {
          report(icon, "EmptyState owns icon sizing; pass the icon component reference, not an element");
        }
      }
      if (tag === "FeatureEmptyState") {
        report(node, "FeatureEmptyState is a host's first-run screen; workflow components render EmptyState");
      }
    }

    const literal =
      ts.isJsxText(node) ? node.text.trim()
        : (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && renderedPosition(node) ? node.text.trim()
          : undefined;
    if (literal && absenceCopy.test(literal) && !insideContainer(node)) {
      report(node, `hand-rolled blank slate "${literal.slice(0, 60)}"; render it with the kit's EmptyState`);
    }

    ts.forEachChild(node, visit);
  };
  visit(source);
}

// Spend each file's known allowance on its matching findings; anything over
// it, or a finding no allowance covers, fails. An allowance left unspent is
// stale and fails too, so the list can only shrink.
const remaining = new Map(
  [...knownViolations].map(([file, counts]) => [file, new Map(Object.entries(counts))]),
);
const violations = [];
for (const { file, message, location } of found) {
  const allowance = remaining.get(file);
  const left = allowance?.get(message) ?? 0;
  if (left > 0) {
    allowance.set(message, left - 1);
    continue;
  }
  violations.push(`${location} ${message}`);
}
for (const [file, counts] of remaining) {
  for (const [message, left] of counts) {
    if (left > 0) violations.push(`${file}: known violation "${message}" is fixed; remove it from knownViolations`);
  }
}

if (violations.length > 0) {
  console.error(`Blank-slate violations (${violations.length}):\n${violations.map((line) => `- ${line}`).join("\n")}`);
  process.exit(1);
}
console.log(`blank slates checked in ${files.length} component files: every empty surface is an explicit EmptyState`);
