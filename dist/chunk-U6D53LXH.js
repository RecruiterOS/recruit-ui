// src/recruit/candidate-grade.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { SentimentBadge } from "@epicbagel/saas-kit/primitives/sentiment-dot";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
function inlineGradeText(grade, label) {
  const hasLabel = !(label == null || label === false || label === "");
  if (!grade) return hasLabel ? label : "\u2014";
  if (!hasLabel) return grade;
  return typeof label === "string" || typeof label === "number" ? `${grade} \u2014 ${label}` : /* @__PURE__ */ jsxs(Fragment, { children: [
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
  const content = format === "inline" ? inlineGradeText(normalized, visibleLabel) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("span", { "aria-label": normalized ? `Grade ${normalized}` : "Not graded", children: normalized ?? "\u2014" }),
    visibleLabel ? /* @__PURE__ */ jsx("span", { children: visibleLabel }) : null
  ] });
  if (appearance === "sentiment") {
    return /* @__PURE__ */ jsx(SentimentBadge, { sentiment, className, children: content });
  }
  return /* @__PURE__ */ jsx(
    Badge,
    {
      "data-grade": normalized ?? "ungraded",
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

export {
  normalizeCandidateGrade,
  candidateGradeLetter,
  candidateGradeLabel,
  candidateGradeDisplay,
  CandidateGradeBadge
};
