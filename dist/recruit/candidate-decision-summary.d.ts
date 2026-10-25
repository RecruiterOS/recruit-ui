import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { CandidateGradeTone } from './candidate-grade.js';
import '@epicbagel/saas-kit/primitives/badge';
import '@epicbagel/saas-kit/primitives/sentiment-dot';

/** A recorded decision on the person for one role. */
interface CandidateDecisionSummaryDecision {
    /** Whose decision it is, such as "Your decision". */
    heading: ReactNode;
    /** The verdict, such as "Yes". */
    verdict: ReactNode;
    /** Colours the flag tile and the verdict. */
    tone: "positive" | "negative";
    /** Where the decision left the person, such as their stage. */
    stage: ReactNode;
    /** Why, kept as written. */
    reason?: ReactNode;
}
/** An automated assessment of the person for the same role. */
interface CandidateDecisionSummaryAssessment {
    /** The grade in the tile, such as "A". */
    letter: ReactNode;
    /** The tile's badge tone. */
    tone: CandidateGradeTone;
    /** The tile's tooltip. */
    title?: string;
    /** The row's eyebrow, such as "AI assessment". */
    heading: ReactNode;
    /** What the grade means, and anything still pending. */
    label: ReactNode;
}
interface CandidateDecisionSummaryProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    decision?: CandidateDecisionSummaryDecision;
    assessment?: CandidateDecisionSummaryAssessment;
}
/**
 * The headline of a person's detail for the role in focus: the recorded
 * decision with a flag tile, and the assessment grade in a tile, in one card
 * on a muted band. Either row may be left out; with neither it renders
 * nothing. Unlike CandidateAssessment, which lays out a full write-up, this
 * is a two-line summary.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-decision-summary"`.
 */
declare function CandidateDecisionSummary({ decision, assessment, ...props }: CandidateDecisionSummaryProps): react.JSX.Element | null;

export { CandidateDecisionSummary, type CandidateDecisionSummaryAssessment, type CandidateDecisionSummaryDecision, type CandidateDecisionSummaryProps };
