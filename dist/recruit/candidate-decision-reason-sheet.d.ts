import * as react from 'react';
import { ReactNode } from 'react';
import { CandidateDecisionChoice } from './candidate-decision-buttons.js';

/** Host-owned wording for the sheet's fixed parts. */
interface CandidateDecisionReasonSheetLabels {
    /** The close button's tooltip and accessible name. Closing decides nothing. */
    cancel: string;
    /** Under the mic. */
    speak: ReactNode;
    /** The switch from speaking to typing. */
    typeInstead: ReactNode;
    /** Over the one-tap reasons. */
    reasons: string;
    /** The typed reason's placeholder. */
    placeholder: string;
    /** In place of the composer while a promise from `onConfirm` is pending. */
    saving: string;
    /** Under the composer when a promise from `onConfirm` rejects. */
    failed: string;
}
interface CandidateDecisionReasonSheetProps {
    open: boolean;
    /** Called from the close button and Escape. Nothing is decided. */
    onClose: () => void;
    /**
     * The answer being explained. It only words the defaults ("Why no?",
     * "Skip — just mark No"): the sheet neither holds nor saves a decision, so
     * leave it out for any other question and pass the wording yourself.
     */
    decision?: CandidateDecisionChoice;
    /** The candidate's name, for the default wording only. */
    candidateName?: string;
    /** The question, as the sheet's heading and its accessible name. */
    title?: ReactNode;
    /** The line under the question, which also describes the sheet to a screen reader. */
    subtitle?: ReactNode;
    /** The dictation overlay's title, such as "Why no on Mei Tanaka?". */
    voiceTitle?: string;
    /** One-tap reasons, already worded. Picking one confirms with it. */
    reasons?: readonly string[];
    /**
     * Called with the reason a person spoke, typed or picked, trimmed, or with
     * none when they skipped. The host saves the decision and closes the sheet.
     * It may return a promise: while that is pending the sheet shows
     * `labels.saving` in place of the composer and Skip is disabled, though
     * the sheet can still be closed; if it rejects, the composer comes back
     * with a typed or spoken reason still in it and `labels.failed` under it.
     */
    onConfirm: (reason?: string) => unknown;
    /**
     * Takes Skip away, so the only ways out are a reason or the close button.
     * A reason is optional without it: encouraged, never demanded.
     */
    reasonRequired?: boolean;
    /** Skip's wording, such as "Skip — just reject Mei Tanaka". */
    skipLabel?: ReactNode;
    /**
     * Host content over the bottom row, such as a switch that changes what the
     * decision does. Its state stays the host's, read when `onConfirm` runs.
     */
    footer?: ReactNode;
    /** Host controls in the bottom row, before Skip, such as another way to decide. */
    actions?: ReactNode;
    /**
     * `false` leaves dictation out, and the sheet opens on the typed reason.
     * It also opens there wherever dictation can't run.
     */
    voice?: boolean;
    /** The language dictation listens for, as a BCP 47 tag. */
    voiceLang?: string;
    labels?: Partial<CandidateDecisionReasonSheetLabels>;
}
/**
 * The voice-first "Why?" asked once a reviewer has decided: speaking the
 * reason is the default, a suggested reason is one tap, and typing is a tap
 * away. Each of them calls `onConfirm` with that reason; Skip calls it with
 * none; the close button and Escape call `onClose`, and nothing is decided.
 *
 * The mic, the reason chips and the composer are the kit's `Chat` in its
 * voice-first empty state, inside the kit's `Dialog`, so the sheet keeps its
 * focus when it opens from another dialog, such as a candidate's profile.
 * Dictation is wired as everywhere else in this library: the kit's mic uses
 * the transport of the host's `DictationProvider`
 * (`@epicbagel/saas-kit/primitives/dictation-provider`), or the browser's
 * speech recognition without one. Where neither can run, or with
 * `voice={false}`, the sheet opens on the typed reason instead.
 *
 * Clicks and key presses inside the sheet stop at it, so it can be rendered
 * inside a clickable candidate card, whose handlers they would otherwise
 * reach through the portal. Nothing of the sheet is mounted while it is
 * closed, so each opening starts afresh, and when it closes focus goes back
 * to the control it was opened from, if that is still there. The host owns
 * the decision, the suggested reasons and every word.
 *
 * The root is the kit's dialog content and keeps its
 * `data-slot="dialog-content"`; the sheet's own layout inside it is marked
 * `data-slot="candidate-decision-reason-sheet"`, with `data-decision` when a
 * `decision` is given, and its bottom bar
 * `data-slot="candidate-decision-reason-sheet-footer"`.
 */
declare function CandidateDecisionReasonSheet({ open, onClose, decision, candidateName, title, subtitle, reasons, ...body }: CandidateDecisionReasonSheetProps): react.JSX.Element | null;

export { CandidateDecisionReasonSheet, type CandidateDecisionReasonSheetLabels, type CandidateDecisionReasonSheetProps };
