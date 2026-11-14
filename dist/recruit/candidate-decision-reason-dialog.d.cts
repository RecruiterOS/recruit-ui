import * as react from 'react';
import { ReactNode } from 'react';

/** Host-owned wording for the dialog's fixed parts. */
interface CandidateDecisionReasonDialogLabels {
    /** The eyebrow over the suggestion chips. */
    suggestions: ReactNode;
    /**
     * The reason field's label. Defaults to "Why?", or to "Why? (optional)"
     * with `reasonOptional`.
     */
    reason: ReactNode;
    cancel: ReactNode;
}
interface CandidateDecisionReasonDialogProps {
    open: boolean;
    /**
     * Names the decision and who it is about, such as "Reject: Mei Tanaka", or
     * "Reject 12 candidates" for a decision on several people at once.
     */
    title: ReactNode;
    /** One-tap reasons, already worded. Tapping one adds it to the reason. */
    suggestions?: readonly string[];
    placeholder: string;
    confirmLabel: ReactNode;
    /** `destructive` for a rejection, `default` to move forward. */
    confirmTone?: "default" | "destructive";
    /**
     * Lets the decision be confirmed with no reason, for a quick decision
     * where a reason helps but mustn't slow it down, such as one on several
     * people at once. The reason is required without it.
     */
    reasonOptional?: boolean;
    /**
     * Called with the trimmed reason, which is an empty string when
     * `reasonOptional` let the person confirm without one. The confirm button
     * shows a spinner and the dialog's buttons stay disabled until it settles;
     * the host closes the dialog once the decision is saved.
     */
    onSubmit: (reason: string) => Promise<void>;
    /** Called from Cancel, Escape and the close button. */
    onClose: () => void;
    labels?: Partial<CandidateDecisionReasonDialogLabels>;
    /** The reason field's id. A generated one is used when omitted. */
    id?: string;
}
/**
 * Asks why before a decision is recorded, on one candidate or on several: a
 * typed reason, optionally started from one-tap suggestions. The reason is
 * required unless `reasonOptional` says the decision can go ahead without
 * one.
 *
 * The reason resets each time the dialog opens. The host owns the decision,
 * its wording (the title, the confirm label and `labels`) and what is saved;
 * the root is the kit's dialog content and keeps its
 * `data-slot="dialog-content"`.
 */
declare function CandidateDecisionReasonDialog(props: CandidateDecisionReasonDialogProps): react.JSX.Element;

export { CandidateDecisionReasonDialog, type CandidateDecisionReasonDialogLabels, type CandidateDecisionReasonDialogProps };
