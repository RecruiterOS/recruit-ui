import {
  Badge
} from "./chunk-L4AM6M3M.js";

// src/recruit/candidate-grade.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function normalizeCandidateGrade(grade) {
  const normalized = grade?.trim().toUpperCase();
  return normalized === "A" || normalized === "B" || normalized === "C" || normalized === "D" ? normalized : null;
}
function candidateGradeLetter(grade) {
  return normalizeCandidateGrade(grade) ?? "\u2014";
}
function candidateGradeLabel(grade, labels) {
  const normalized = normalizeCandidateGrade(grade);
  return normalized ? labels[normalized] ?? null : null;
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
  return /* @__PURE__ */ jsxs(
    Badge,
    {
      "data-slot": "candidate-grade",
      "data-grade": normalized ?? "ungraded",
      variant: tone,
      className,
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { "aria-label": normalized ? `Grade ${normalized}` : "Not graded", children: normalized ?? "\u2014" }),
        showLabel && resolvedLabel ? /* @__PURE__ */ jsx("span", { children: resolvedLabel }) : null
      ]
    }
  );
}

export {
  normalizeCandidateGrade,
  candidateGradeLetter,
  candidateGradeLabel,
  candidateGradeDisplay,
  CandidateGradeBadge
};
