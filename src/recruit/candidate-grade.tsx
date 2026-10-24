import { Badge } from "@/components/recruit-ui/core/primitives/badge";
import type { HTMLAttributes, ReactNode } from "react";

export type CandidateGrade = "A" | "B" | "C" | "D";

/** Host-owned wording for each display grade. */
export type CandidateGradeLabels = Partial<Record<CandidateGrade, string>>;

/** Visual treatment selected by the host; Recruit UI does not infer grade policy. */
export type CandidateGradeTone =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

export function normalizeCandidateGrade(
  grade: string | null | undefined,
): CandidateGrade | null {
  const normalized = grade?.trim().toUpperCase();
  return normalized === "A" ||
    normalized === "B" ||
    normalized === "C" ||
    normalized === "D"
    ? normalized
    : null;
}

/** Return presentation only; grade assignment and vocabulary stay host-owned. */
export function candidateGradeLetter(grade: string | null | undefined): string {
  return normalizeCandidateGrade(grade) ?? "—";
}

export function candidateGradeLabel(
  grade: string | null | undefined,
  labels: CandidateGradeLabels,
): string | null {
  const normalized = normalizeCandidateGrade(grade);
  return normalized ? labels[normalized] ?? null : null;
}

export function candidateGradeDisplay(
  grade: string | null | undefined,
  labels: CandidateGradeLabels,
): string {
  const normalized = normalizeCandidateGrade(grade);
  if (!normalized) return "—";
  const label = labels[normalized];
  return label ? `${normalized} — ${label}` : normalized;
}

export interface CandidateGradeBadgeProps
  extends HTMLAttributes<HTMLDivElement> {
  grade: string | null | undefined;
  /** One-off host wording. Takes precedence over `labels`. */
  label?: ReactNode;
  /** Host-owned wording map for shared badge instances. */
  labels?: CandidateGradeLabels;
  /** Host-owned semantic treatment; no meaning is inferred from the letter. */
  tone?: CandidateGradeTone;
  showLabel?: boolean;
}

export function CandidateGradeBadge({
  grade,
  label,
  labels = {},
  tone = "neutral",
  showLabel = true,
  className,
  ...props
}: CandidateGradeBadgeProps) {
  const normalized = normalizeCandidateGrade(grade);
  const resolvedLabel = label === undefined
    ? candidateGradeLabel(normalized, labels)
    : label;

  return (
    <Badge
      data-slot="candidate-grade"
      data-grade={normalized ?? "ungraded"}
      variant={tone}
      className={className}
      {...props}
    >
      <span aria-label={normalized ? `Grade ${normalized}` : "Not graded"}>
        {normalized ?? "—"}
      </span>
      {showLabel && resolvedLabel ? <span>{resolvedLabel}</span> : null}
    </Badge>
  );
}
