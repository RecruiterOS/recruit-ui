"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-grade.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _sentimentdot = require('@epicbagel/saas-kit/primitives/sentiment-dot');
var _jsxruntime = require('react/jsx-runtime');
function normalizeCandidateGrade(grade) {
  const normalized = _optionalChain([grade, 'optionalAccess', _ => _.trim, 'call', _2 => _2(), 'access', _3 => _3.toUpperCase, 'call', _4 => _4()]);
  return normalized === "A" || normalized === "B" || normalized === "C" || normalized === "D" ? normalized : null;
}
function candidateGradeLetter(grade) {
  return _nullishCoalesce(normalizeCandidateGrade(grade), () => ( "\u2014"));
}
function candidateGradeLabel(grade, labels) {
  const normalized = normalizeCandidateGrade(grade);
  return normalized ? _nullishCoalesce(labels[normalized], () => ( null)) : null;
}
function candidateGradeDisplay(grade, labels) {
  const normalized = normalizeCandidateGrade(grade);
  if (!normalized) return "\u2014";
  const label = labels[normalized];
  return label ? `${normalized} \u2014 ${label}` : normalized;
}
function inlineGradeText(grade, label) {
  const hasLabel = !(label == null || label === false || label === "");
  if (!grade) return hasLabel ? label : "\u2014";
  if (!hasLabel) return grade;
  return typeof label === "string" || typeof label === "number" ? `${grade} \u2014 ${label}` : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    grade,
    " \u2014 ",
    label
  ] });
}
function CandidateGradeBadge({
  grade,
  label,
  labels = {},
  tone = "neutral",
  showLabel = true,
  size,
  as,
  shrink,
  format = "split",
  appearance = "badge",
  sentiment = "neutral",
  className,
  ...props
}) {
  const normalized = normalizeCandidateGrade(grade);
  const resolvedLabel = label === void 0 ? candidateGradeLabel(normalized, labels) : label;
  const visibleLabel = showLabel ? resolvedLabel : null;
  const content = format === "inline" ? inlineGradeText(normalized, visibleLabel) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-label": normalized ? `Grade ${normalized}` : "Not graded", children: _nullishCoalesce(normalized, () => ( "\u2014")) }),
    visibleLabel ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: visibleLabel }) : null
  ] });
  if (appearance === "sentiment") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sentimentdot.SentimentBadge, { sentiment, className, children: content });
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _badge.Badge,
    {
      "data-grade": _nullishCoalesce(normalized, () => ( "ungraded")),
      variant: tone,
      size,
      as,
      shrink,
      className,
      ...props,
      children: content
    }
  );
}







exports.normalizeCandidateGrade = normalizeCandidateGrade; exports.candidateGradeLetter = candidateGradeLetter; exports.candidateGradeLabel = candidateGradeLabel; exports.candidateGradeDisplay = candidateGradeDisplay; exports.CandidateGradeBadge = CandidateGradeBadge;
