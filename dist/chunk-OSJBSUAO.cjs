"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkGK6J55F4cjs = require('./chunk-GK6J55F4.cjs');

// src/recruit/candidate-grade.tsx
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
function CandidateGradeBadge({
  grade,
  label,
  labels = {},
  tone = "neutral",
  showLabel = true,
  className,
  ...props
}) {
  const normalized = normalizeCandidateGrade(grade);
  const resolvedLabel = label === void 0 ? candidateGradeLabel(normalized, labels) : label;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _chunkGK6J55F4cjs.Badge,
    {
      "data-slot": "candidate-grade",
      "data-grade": _nullishCoalesce(normalized, () => ( "ungraded")),
      variant: tone,
      className,
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-label": normalized ? `Grade ${normalized}` : "Not graded", children: _nullishCoalesce(normalized, () => ( "\u2014")) }),
        showLabel && resolvedLabel ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: resolvedLabel }) : null
      ]
    }
  );
}







exports.normalizeCandidateGrade = normalizeCandidateGrade; exports.candidateGradeLetter = candidateGradeLetter; exports.candidateGradeLabel = candidateGradeLabel; exports.candidateGradeDisplay = candidateGradeDisplay; exports.CandidateGradeBadge = CandidateGradeBadge;
