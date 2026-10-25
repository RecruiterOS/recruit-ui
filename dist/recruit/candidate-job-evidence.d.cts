import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

/** One titled passage of evidence. */
interface CandidateJobEvidenceEntry {
    /** The heading, such as "Why sourced for Staff Engineer". */
    title: ReactNode;
    /** The passage, kept as written: line breaks are preserved. */
    text: ReactNode;
}
/** A person's judgement of the candidate for the role. */
interface CandidateJobEvidenceFeedback extends CandidateJobEvidenceEntry {
    /** Who gave it and when, already worded, under the passage. */
    byline?: ReactNode;
}
interface CandidateJobEvidenceProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    /** Why the person was put forward for the role. */
    sourced?: CandidateJobEvidenceEntry;
    /** A recruiter's feedback on the person for the role. */
    feedback?: CandidateJobEvidenceFeedback;
    /** The kit PanelSection's padding. */
    padding?: "none" | "compact" | "default";
    /** The kit PanelSection's divider. */
    border?: "none" | "top" | "bottom";
}
/**
 * The evidence attached to a person for one role, kept with that role: why
 * they were sourced for it, and a recruiter's feedback with its byline.
 * Render one per role so neither passage is mistaken for another role's.
 * With neither passage it renders nothing.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-job-evidence"`.
 */
declare function CandidateJobEvidence({ sourced, feedback, padding, border, ...props }: CandidateJobEvidenceProps): react.JSX.Element | null;

export { CandidateJobEvidence, type CandidateJobEvidenceEntry, type CandidateJobEvidenceFeedback, type CandidateJobEvidenceProps };
