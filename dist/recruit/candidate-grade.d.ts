import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

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
    /** One-off host wording. Takes precedence over `labels`. */
    label?: ReactNode;
    /** Host-owned wording map for shared badge instances. */
    labels?: CandidateGradeLabels;
    /** Host-owned semantic treatment; no meaning is inferred from the letter. */
    tone?: CandidateGradeTone;
    showLabel?: boolean;
}
declare function CandidateGradeBadge({ grade, label, labels, tone, showLabel, className, ...props }: CandidateGradeBadgeProps): react.JSX.Element;

export { type CandidateGrade, CandidateGradeBadge, type CandidateGradeBadgeProps, type CandidateGradeLabels, type CandidateGradeTone, candidateGradeDisplay, candidateGradeLabel, candidateGradeLetter, normalizeCandidateGrade };
