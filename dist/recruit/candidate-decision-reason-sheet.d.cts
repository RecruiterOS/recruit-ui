import * as react from 'react';
import { ReactNode } from 'react';
import { CandidateDecisionChoice } from './candidate-decision-buttons.cjs';

/**
 * How the one-tap reasons are picked: `single`, where a tap confirms with
 * that reason at once, or `multiple`, where each tap ticks or unticks a
 * reason and the bottom button confirms with those ticked.
 */
type CandidateDecisionReasonSelection = "single" | "multiple";
/** What a person gave, handed to `onConfirm` after the one-line reason. */
interface CandidateDecisionReasonAnswer {
    /**
     * Every reason given, each its own entry: the ones picked, in the order
     * they are shown, then what was spoken or typed. Empty for a skip.
     */
    reasons: readonly string[];
}
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
    /** The switch between one reason and several, named for a screen reader. */
    selection: string;
    /** The switch's option where a tap on a reason confirms with it. */
    single: ReactNode;
    /** The switch's option where reasons are ticked, then confirmed together. */
    multiple: ReactNode;
    /** The typed reason's placeholder. */
    placeholder: string;
    /** In place of the composer while a promise from `onConfirm` is pending. */
    saving: string;
    /**
     * Under the composer when a promise from `onConfirm` rejects: a line, or
     * a function given what it rejected with, for a host whose rejection says
     * why.
     */
    failed: string | ((cause: unknown) => string);
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
    /**
     * The line under the question, which also describes the sheet to a screen
     * reader. A function is given how reasons are being picked, for a line
     * that says "pick a reason" or "pick one or more".
     */
    subtitle?: ReactNode | ((selection: CandidateDecisionReasonSelection) => ReactNode);
    /** The dictation overlay's title, such as "Why no on Mei Tanaka?". */
    voiceTitle?: string;
    /**
     * One-tap reasons, already worded. Picking one confirms with it; with
     * several picked at once (see `multipleReasons`), the bottom button does.
     */
    reasons?: readonly string[];
    /**
     * With two or more `reasons`, the sheet offers a switch between Single,
     * where a tap on a reason confirms with it, and Multiple, where reasons
     * are ticked and the bottom button confirms with them all. `false` leaves
     * the switch out, and a tap always confirms.
     */
    multipleReasons?: boolean;
    /**
     * Which of the two the switch is on, for a host that keeps the choice
     * itself, with `onReasonSelectionChange`. Left out, the sheet keeps it:
     * it opens on `defaultReasonSelection`, or on what this person last chose
     * in this browser session.
     */
    reasonSelection?: CandidateDecisionReasonSelection;
    /** Where the switch starts until someone chooses. `single` when left out. */
    defaultReasonSelection?: CandidateDecisionReasonSelection;
    onReasonSelectionChange?: (selection: CandidateDecisionReasonSelection) => void;
    /**
     * Called with the reason a person spoke, typed or picked, trimmed, or with
     * none when they skipped. Several reasons arrive as one line, joined with
     * "; ", and each on its own in the second argument's `reasons`, for a host
     * that keeps them apart. The host saves the decision and closes the sheet.
     * It may return a promise: while that is pending the sheet shows
     * `labels.saving` in place of the composer and the bottom button is
     * disabled, though the sheet can still be closed; if it rejects, the
     * composer comes back with a typed or spoken reason still in it, ticked
     * reasons still ticked, and `labels.failed` under it.
     */
    onConfirm: (reason: string | undefined, answer: CandidateDecisionReasonAnswer) => unknown;
    /**
     * Takes Skip away, so the only ways out are a reason or the close button.
     * A reason is optional without it: encouraged, never demanded.
     */
    reasonRequired?: boolean;
    /** Skip's wording, such as "Skip — just reject Mei Tanaka". */
    skipLabel?: ReactNode;
    /**
     * The bottom button's wording once reasons are ticked, when it confirms
     * with them in Skip's place, such as "Reject Mei Tanaka". A function is
     * given the ticked reasons, for a label that counts them.
     */
    confirmLabel?: ReactNode | ((reasons: readonly string[]) => ReactNode);
    /**
     * Host controls for what the decision does, under the reasons and over a
     * rule, such as whether the person has been contacted already. They leave
     * the screen while a save is pending. Their state stays the host's, read
     * when `onConfirm` runs.
     */
    outcome?: ReactNode;
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
 * With two or more suggested reasons, a switch over them chooses between
 * Single, where a tap on a reason confirms with it, and Multiple, where a
 * tap ticks or unticks a reason. Once any are ticked the bottom button
 * confirms with them in Skip's place, and a spoken or typed reason is added
 * to them. The sheet opens on Single, then on whichever the person last
 * chose in this browser session; `multipleReasons={false}` leaves the switch
 * out.
 *
 * The mic and the composer are the kit's `Chat` in its voice-first empty
 * state, with the reasons under it, inside the kit's `Dialog`, so the sheet
 * keeps its focus when it opens from another dialog, such as a candidate's
 * profile. Dictation is wired as everywhere else in this library: the kit's
 * mic uses the transport of the host's `DictationProvider`
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
 * `decision` is given, its reasons
 * `data-slot="candidate-decision-reason-sheet-reasons"` with
 * `data-selection`, the host's `outcome`
 * `data-slot="candidate-decision-reason-sheet-outcome"`, and its bottom bar
 * `data-slot="candidate-decision-reason-sheet-footer"`.
 */
declare function CandidateDecisionReasonSheet({ open, ...sheet }: CandidateDecisionReasonSheetProps): react.JSX.Element | null;

export { type CandidateDecisionReasonAnswer, type CandidateDecisionReasonSelection, CandidateDecisionReasonSheet, type CandidateDecisionReasonSheetLabels, type CandidateDecisionReasonSheetProps };
