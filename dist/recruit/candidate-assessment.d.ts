import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { CandidateSummaryBullet } from './candidate-pipeline-list.js';
import '@epicbagel/saas-kit/primitives/sentiment-dot';
import './candidate-stage-select.js';
import '@epicbagel/saas-kit/primitives/select';
import '../candidate-empty-copy-CZmg2ZoX.js';

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
    /** The evidence section's content, as a slot. Takes precedence over `evidenceItems`. */
    evidence?: ReactNode;
    /**
     * The evidence as points, drawn as a list with a check mark on each. An
     * empty list draws no section.
     */
    evidenceItems?: readonly ReactNode[];
    /** The caveats section's content, as a slot. Takes precedence over `caveatItems`. */
    caveats?: ReactNode;
    /** The caveats as points, drawn as a bulleted list. An empty list draws no section. */
    caveatItems?: readonly ReactNode[];
    /** The signals section's content, as a slot. Takes precedence over `signalItems`. */
    signals?: ReactNode;
    /**
     * The signals as lines, each with the host's sentiment, drawn through
     * CandidateSummaryBullets. An empty list draws no section.
     */
    signalItems?: readonly CandidateSummaryBullet[];
    labels?: Partial<CandidateAssessmentLabels>;
    /**
     * The kit PanelSection's padding. `default` pads the assessment like a
     * card's section. `none` sits it flush in a container the host already
     * pads, such as a profile dialog's body, so it lines up with whatever
     * follows it there.
     */
    padding?: "none" | "compact" | "default";
}
/**
 * Presentation-only assessment. Hosts own scoring, thresholds, and policy.
 *
 * Evidence, caveats and signals each take a slot or items. Items are drawn in
 * the package's own lists: evidence with a check mark on each point, caveats
 * as bullets, and signals through CandidateSummaryBullets with the host's
 * sentiment on each line. A section with neither is left out. The root is the
 * kit PanelSection, marked `data-slot="candidate-assessment"`; the evidence
 * and caveat lists are marked `candidate-assessment-evidence` and
 * `candidate-assessment-caveats`.
 */
declare function CandidateAssessment({ grade, facts, summary, evidence, evidenceItems, caveats, caveatItems, signals, signalItems, labels, padding, ...props }: CandidateAssessmentProps): react.JSX.Element;

export { CandidateAssessment, type CandidateAssessmentFact, type CandidateAssessmentLabels, type CandidateAssessmentProps };
