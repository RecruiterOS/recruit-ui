import { Badge, type BadgeProps } from "@epicbagel/saas-kit/primitives/badge";
import { SentimentBadge, type Sentiment } from "@epicbagel/saas-kit/primitives/sentiment-dot";
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
  /** The kit badge size, such as `compact` for dense rows. */
  size?: BadgeProps["size"];
  /** Root element: a block-level `div` (default) or an inline `span`. */
  as?: "div" | "span";
  /** Keep the badge at its natural width in a flex row. */
  shrink?: boolean;
  /**
   * `split` (default): the letter and the label as separate spans, the letter
   * with an accessible name. `inline`: a single line of text, "A — Strong fit",
   * for a host that names the grade in a tooltip or the surrounding text.
   */
  format?: "split" | "inline";
  /**
   * `badge` (default): the kit Badge in `tone`. `sentiment`: the kit's
   * sentiment pill, a coloured dot and text, in `sentiment`. The pill takes
   * only `className`; other attributes are not passed to it.
   */
  appearance?: "badge" | "sentiment";
  /** Host-owned sentiment for `appearance="sentiment"`. */
  sentiment?: CandidateGradeSentiment;
}

/** The kit's sentiment scale, for `appearance="sentiment"`. */
export type CandidateGradeSentiment = Sentiment;

function inlineGradeText(
  grade: CandidateGrade | null,
  label: ReactNode,
): ReactNode {
  if (!grade) return "—";
  if (label == null || label === false || label === "") return grade;
  // One text node when the label is plain text, as candidateGradeDisplay
  // would format it.
  return typeof label === "string" || typeof label === "number"
    ? `${grade} — ${label}`
    : <>{grade} — {label}</>;
}

/**
 * The grade letter with an optional host label. The root is the kit Badge
 * (or its sentiment pill) and keeps the kit's own `data-slot`, which theme
 * stylesheets select on; `data-grade` names the grade, or `ungraded`.
 */
export function CandidateGradeBadge({
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
}: CandidateGradeBadgeProps) {
  const normalized = normalizeCandidateGrade(grade);
  const resolvedLabel = label === undefined
    ? candidateGradeLabel(normalized, labels)
    : label;
  const visibleLabel = showLabel ? resolvedLabel : null;

  const content = format === "inline"
    ? inlineGradeText(normalized, visibleLabel)
    : (
      <>
        <span aria-label={normalized ? `Grade ${normalized}` : "Not graded"}>
          {normalized ?? "—"}
        </span>
        {visibleLabel ? <span>{visibleLabel}</span> : null}
      </>
    );

  if (appearance === "sentiment") {
    return (
      <SentimentBadge sentiment={sentiment} className={className}>
        {content}
      </SentimentBadge>
    );
  }

  return (
    <Badge
      data-grade={normalized ?? "ungraded"}
      variant={tone}
      size={size}
      as={as}
      shrink={shrink}
      className={className}
      {...props}
    >
      {content}
    </Badge>
  );
}
