import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface CandidateAssessmentFact {
    label: ReactNode;
    value: ReactNode;
}
interface CandidateAssessmentLabels {
    summary: ReactNode;
    evidence: ReactNode;
    caveats: ReactNode;
    signals: ReactNode;
}
interface CandidateAssessmentProps extends HTMLAttributes<HTMLElement> {
    grade?: ReactNode;
    facts?: readonly CandidateAssessmentFact[];
    summary?: ReactNode;
    evidence?: ReactNode;
    caveats?: ReactNode;
    signals?: ReactNode;
    labels?: Partial<CandidateAssessmentLabels>;
}
/** Presentation-only assessment. Hosts own scoring, thresholds, and policy. */
declare function CandidateAssessment({ grade, facts, summary, evidence, caveats, signals, labels, ...props }: CandidateAssessmentProps): react.JSX.Element;

export { CandidateAssessment, type CandidateAssessmentFact, type CandidateAssessmentLabels, type CandidateAssessmentProps };
