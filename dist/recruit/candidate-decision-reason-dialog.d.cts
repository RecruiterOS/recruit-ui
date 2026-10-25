import * as react from 'react';
import { ReactNode } from 'react';

/** Host-owned wording for the dialog's fixed parts. */
interface CandidateDecisionReasonDialogLabels {
    /** The eyebrow over the suggestion chips. */
    suggestions: ReactNode;
    /** The reason field's label. */
    reason: ReactNode;
    cancel: ReactNode;
}
interface CandidateDecisionReasonDialogProps {
    open: boolean;
    /** Names the decision and the candidate, such as "Reject: Mei Tanaka". */
    title: ReactNode;
    /** One-tap reasons, already worded. Tapping one adds it to the reason. */
    suggestions?: readonly string[];
    placeholder: string;
    confirmLabel: ReactNode;
    /** `destructive` for a rejection, `default` to move forward. */
    confirmTone?: "default" | "destructive";
    /**
     * Called with the trimmed reason. The confirm button shows a spinner and
     * the dialog's buttons stay disabled until it settles; the host closes the
     * dialog once the decision is saved.
     */
    onSubmit: (reason: string) => Promise<void>;
    /** Called from Cancel, Escape and the close button. */
    onClose: () => void;
    labels?: Partial<CandidateDecisionReasonDialogLabels>;
    /** The reason field's id. A generated one is used when omitted. */
    id?: string;
}
/**
 * Asks why before a decision on a candidate is recorded: a required reason,
 * optionally started from one-tap suggestions.
 *
 * The reason resets each time the dialog opens. The host owns the decision,
 * its wording and what is saved; the root is the kit's dialog content and
 * keeps its `data-slot="dialog-content"`.
 */
declare function CandidateDecisionReasonDialog(props: CandidateDecisionReasonDialogProps): react.JSX.Element;

export { CandidateDecisionReasonDialog, type CandidateDecisionReasonDialogLabels, type CandidateDecisionReasonDialogProps };
