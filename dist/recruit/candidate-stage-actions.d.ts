import * as react from 'react';
import { ReactNode } from 'react';
import { CandidateStageOption } from './candidate-stage-select.js';
import '@epicbagel/saas-kit/primitives/select';

/** The primary move: the candidate's immediate next stage. */
interface CandidateStageAdvance {
    label: ReactNode;
    /** A quieter outline button, for a logging step rather than a milestone. */
    outline?: boolean;
    onAdvance: () => void;
}
/** Host-owned wording for the stage actions. */
interface CandidateStageActionsLabels {
    /** A move option's menu item, from its label. */
    moveTo: (label: ReactNode) => ReactNode;
    /** The move menu's tooltip and accessible name. */
    moveMenu: string;
    /** The move menu's button text when there is no primary move. */
    moveTrigger: ReactNode;
    present: ReactNode;
    reject: ReactNode;
    rejectTitle: string;
    decline: ReactNode;
    declineTitle: string;
}
interface CandidateStageActionsProps<TValue extends string = string> {
    /** The primary move. With `moveOptions` it becomes a split button. */
    advance?: CandidateStageAdvance;
    /** Stages to jump straight to, in pipeline order. */
    moveOptions?: readonly CandidateStageOption<TValue>[];
    onMove?: (value: TValue) => void;
    /** A contact control placed after the move, such as a contact channels menu. */
    contact?: ReactNode;
    /** Shows the present action, for sharing the candidate with a client. */
    onPresent?: () => void;
    /** Shows the reject action. The host asks why, then moves the candidate. */
    onRequestReject?: () => void;
    /** Shows the declined action, for a candidate who opted out. */
    onRequestDecline?: () => void;
    labels?: Partial<CandidateStageActionsLabels>;
}
/**
 * The controls for working a candidate through a pipeline: advance to the
 * next stage (a split button whose menu jumps further ahead), contact,
 * present to a client, reject and declined.
 *
 * Renders the controls alone, usually inside `CandidateReviewActionRow`.
 * Every click stops propagating, because the controls sit inside clickable
 * candidate cards and React events bubble through portals along the
 * component tree. Reject and declined only request the move: the host opens
 * its own reason flow and saves.
 */
declare function CandidateStageActions<TValue extends string = string>({ advance, moveOptions, onMove, contact, onPresent, onRequestReject, onRequestDecline, labels, }: CandidateStageActionsProps<TValue>): react.JSX.Element;

export { CandidateStageActions, type CandidateStageActionsLabels, type CandidateStageActionsProps, type CandidateStageAdvance };
