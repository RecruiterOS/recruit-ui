import * as react from 'react';
import { ReactNode } from 'react';
import { CandidateDecisionChoice } from './candidate-decision-buttons.cjs';
import { CandidateDecisionReasonSheetProps } from './candidate-decision-reason-sheet.cjs';

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
    /**
     * Shown under the buttons when saving fails: a line, or a function given
     * what `onDecide` rejected with, for a host whose rejection says why.
     */
    failed: ReactNode | ((cause: unknown) => ReactNode);
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
/** How a client's decision asks for its reason. */
type CandidateClientDecisionReasonPrompt = "dialog" | "sheet";
/**
 * The voice-first sheet's own settings, for a row that asks through it
 * (`reasonPrompt="sheet"`): its wording, whether several reasons can be
 * picked at once, what sits in its footer, and its dictation. The row itself supplies the answer, the candidate's name, the
 * one-tap reasons and whether a reason is required.
 */
type CandidateClientDecisionSheetProps = Pick<CandidateDecisionReasonSheetProps, "title" | "subtitle" | "voiceTitle" | "skipLabel" | "confirmLabel" | "multipleReasons" | "defaultReasonSelection" | "footer" | "actions" | "voice" | "voiceLang" | "labels">;
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
     * How the reason is asked for. `dialog` (the default) is a typed reason in
     * `CandidateDecisionReasonDialog`. `sheet` is the voice-first
     * `CandidateDecisionReasonSheet`: speaking is the default, a suggested
     * reason is one tap, typing is a tap away, and Skip saves with no reason
     * where `reasonOptional` allows it. The sheet holds itself on a saving
     * state while `onDecide`'s promise is pending and, when it rejects, keeps
     * the reason and says so there, so the row shows no error of its own. If
     * the sheet can't be downloaded, the row asks in the dialog.
     */
    reasonPrompt?: CandidateClientDecisionReasonPrompt;
    /**
     * The sheet's own settings for `reasonPrompt="sheet"`, or a function of
     * the answer being explained that returns them, for wording that names
     * the answer.
     */
    reasonSheet?: CandidateClientDecisionSheetProps | ((decision: CandidateDecisionChoice) => CandidateClientDecisionSheetProps);
    /**
     * Shows the answer and takes none, for someone looking at a client's
     * shortlist who can't answer for them: the recorded answer in words
     * (`labels.readOnlyYes`, `labels.readOnlyNo`) with its reason, or
     * `labels.unanswered`, and no Yes, No or Change. `onDecide` is never called.
     */
    readOnly?: boolean;
    /**
     * Holds Yes, No and Change without hiding them, such as while the page
     * the row sits on is loading someone else. A reason being asked for when
     * it turns on is dropped, and nothing is decided.
     */
    disabled?: boolean;
    /**
     * `default` is the action row of a review card: inset like the card, under
     * a keyline. `none` sits the row flush, with no keyline, in a container
     * that already pads and rules it, such as a section of a profile.
     */
    padding?: "default" | "none";
    labels?: Partial<CandidateClientDecisionLabels>;
}
/**
 * A client's Yes or No on a candidate, with why: the action row of a card on
 * a shortlist the client reviews.
 *
 * With no answer yet it shows Yes and No as equal buttons; pressing one asks
 * for the reason and only then calls `onDecide`. The reason is typed in
 * `CandidateDecisionReasonDialog`, or with `reasonPrompt="sheet"` spoken,
 * picked or typed in the voice-first `CandidateDecisionReasonSheet`, which is
 * downloaded only by a row that asks through it. The reason is required
 * unless `reasonOptional` lets the answer be saved without one. Once an
 * answer is recorded (`decision`) it shows that answer in words with its
 * reason and a Change control that asks again. The host owns the record: the
 * component saves nothing and marks nothing recorded before `decision` says
 * so.
 *
 * `readOnly` shows the same row to someone who can't answer for the client:
 * the answer in words with its reason, or that there is none yet, and no
 * controls. `disabled` keeps the controls and holds them. They are held
 * while a save is on its way too, so closing what asks for the reason and
 * answering again can't send two answers at once; a save that fails after
 * it was closed says so under the buttons.
 *
 * Pass it as `CandidateReviewCard`'s `actions`: its root is a
 * `CandidateReviewActionRow`, marked `data-slot="candidate-client-decision"`
 * with the recorded answer in `data-decision`, and `data-read-only` on a
 * read-only row. With `padding="none"` the root is a plain row with the same
 * marks, for a container that pads it.
 */
declare function CandidateClientDecision({ candidateName, decision, reason, onDecide, suggestions, reasonOptional, reasonPrompt, reasonSheet, readOnly, disabled, padding, labels, }: CandidateClientDecisionProps): react.JSX.Element;

export { CandidateClientDecision, type CandidateClientDecisionLabels, type CandidateClientDecisionProps, type CandidateClientDecisionReasonPrompt, type CandidateClientDecisionSheetProps };
