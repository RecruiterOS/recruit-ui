import * as react from 'react';
import { ReactNode } from 'react';
import { CandidateDecisionChoice } from './candidate-decision-buttons.js';

/** Host-owned wording for a client's decision on a candidate. */
interface CandidateClientDecisionLabels {
    yes: ReactNode;
    no: ReactNode;
    /** The recorded answer, such as "You said Yes". */
    saidYes: ReactNode;
    saidNo: ReactNode;
    /** Reopens the question once an answer is recorded. */
    change: ReactNode;
    /** The dialog's title for each answer, given the candidate's name. */
    yesTitle: (name: string) => ReactNode;
    noTitle: (name: string) => ReactNode;
    yesPlaceholder: string;
    noPlaceholder: string;
    confirmYes: ReactNode;
    confirmNo: ReactNode;
    /** The dialog's reason label. Defaults to "Why?", or to "Why? (optional)" with `reasonOptional`. */
    reason: ReactNode;
    /** Shown under the buttons when saving fails. */
    failed: ReactNode;
    /**
     * The recorded answer where it is only shown (`readOnly`), to someone other
     * than the client, such as "Said Yes". Optional in the type, like the two
     * after it, so code that builds this whole object needn't change.
     */
    readOnlyYes?: ReactNode;
    readOnlyNo?: ReactNode;
    /** A `readOnly` row the client hasn't answered. */
    unanswered?: ReactNode;
}
interface CandidateClientDecisionProps {
    /** The candidate's name as the dialog should say it. */
    candidateName: string;
    /** The answer already recorded, if any. */
    decision?: CandidateDecisionChoice | null;
    /** The reason recorded with it, shown under the answer. */
    reason?: ReactNode;
    /**
     * Saves the answer and its reason. The dialog stays open, its buttons
     * disabled, until the promise settles, then closes. When the promise
     * rejects, the buttons come back with an error line under them. The reason
     * is an empty string when `reasonOptional` let the client answer without
     * one.
     */
    onDecide: (decision: CandidateDecisionChoice, reason: string) => Promise<void>;
    /** One-tap reasons for each answer, already worded. */
    suggestions?: {
        yes?: readonly string[];
        no?: readonly string[];
    };
    /**
     * Lets the client answer without a reason: the dialog still asks why, and
     * saves with none given. The reason is required without it.
     */
    reasonOptional?: boolean;
    /**
     * Shows the answer and takes none, for someone looking at a client's
     * shortlist who can't answer for them: the recorded answer in words
     * (`labels.readOnlyYes`, `labels.readOnlyNo`) with its reason, or
     * `labels.unanswered`, and no Yes, No or Change. `onDecide` is never called.
     */
    readOnly?: boolean;
    labels?: Partial<CandidateClientDecisionLabels>;
}
/**
 * A client's Yes or No on a candidate, with why: the action row of a card on
 * a shortlist the client reviews.
 *
 * With no answer yet it shows Yes and No as equal buttons; pressing one asks
 * for the reason (`CandidateDecisionReasonDialog`) and only then calls
 * `onDecide`. The reason is required unless `reasonOptional` lets the answer
 * be saved without one. Once an answer is recorded (`decision`) it shows that
 * answer in words with its reason and a Change control that asks again. The
 * host owns the record: the component saves nothing and marks nothing
 * recorded before `decision` says so.
 *
 * `readOnly` shows the same row to someone who can't answer for the client:
 * the answer in words with its reason, or that there is none yet, and no
 * controls.
 *
 * Pass it as `CandidateReviewCard`'s `actions`: its root is a
 * `CandidateReviewActionRow`, marked `data-slot="candidate-client-decision"`
 * with the recorded answer in `data-decision`, and `data-read-only` on a
 * read-only row.
 */
declare function CandidateClientDecision({ candidateName, decision, reason, onDecide, suggestions, reasonOptional, readOnly, labels, }: CandidateClientDecisionProps): react.JSX.Element;

export { CandidateClientDecision, type CandidateClientDecisionLabels, type CandidateClientDecisionProps };
