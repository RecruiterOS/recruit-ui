import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { BadgeProps } from '@epicbagel/saas-kit/primitives/badge';
import { Sentiment } from '@epicbagel/saas-kit/primitives/sentiment-dot';

type CandidateGrade = "A" | "B" | "C" | "D";
/** Host-owned wording for each display grade. */
type CandidateGradeLabels = Partial<Record<CandidateGrade, string>>;
/** Visual treatment selected by the host; Recruit UI does not infer grade policy. */
type CandidateGradeTone = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error" | "info" | "neutral";
declare function normalizeCandidateGrade(grade: string | null | undefined): CandidateGrade | null;
/** Return presentation only; grade assignment and vocabulary stay host-owned. */
declare function candidateGradeLetter(grade: string | null | undefined): string;
declare function candidateGradeLabel(grade: string | null | undefined, labels: CandidateGradeLabels): string | null;
declare function candidateGradeDisplay(grade: string | null | undefined, labels: CandidateGradeLabels): string;
interface CandidateGradeBadgeProps extends HTMLAttributes<HTMLDivElement> {
    grade: string | null | undefined;
    /**
     * One-off host wording. Takes precedence over `labels`. With no grade, the
     * inline format shows it alone, such as "Needs review", in place of the
     * dash.
     */
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
     * for a host that names the grade in a tooltip or the surrounding text; with
     * no grade, the label alone, or "—" without one.
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
type CandidateGradeSentiment = Sentiment;
/**
 * The grade letter with an optional host label. The root is the kit Badge
 * (or its sentiment pill) and keeps the kit's own `data-slot`, which theme
 * stylesheets select on; `data-grade` names the grade, or `ungraded`.
 */
declare function CandidateGradeBadge({ grade, label, labels, tone, showLabel, size, as, shrink, format, appearance, sentiment, className, ...props }: CandidateGradeBadgeProps): react.JSX.Element;

export { type CandidateGrade, CandidateGradeBadge, type CandidateGradeBadgeProps, type CandidateGradeLabels, type CandidateGradeSentiment, type CandidateGradeTone, candidateGradeDisplay, candidateGradeLabel, candidateGradeLetter, normalizeCandidateGrade };
