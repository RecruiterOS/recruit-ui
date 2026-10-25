import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

/** An assistant reacting to the note. */
interface CandidatePendingNoteAgent {
    /** The assistant's display name. */
    name: string;
    /** Shows the assistant still working, in place of a message. */
    thinking?: boolean;
    /** What the assistant made of the note. */
    message?: ReactNode;
}
interface CandidatePendingNoteProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    /** The note as it was just written or dictated. */
    text: ReactNode;
    /** When it was left, already worded, such as "just now". */
    timeLabel: ReactNode;
    agent?: CandidatePendingNoteAgent;
}
/**
 * A note the person has just left on a candidate, shown on the card before
 * the host's records catch up, with an optional assistant comment under it.
 *
 * The note is quoted in a warning-toned callout so it reads as fresh. The
 * host owns saving the note and the assistant's reply. The root is marked
 * `data-slot="candidate-pending-note"`.
 */
declare function CandidatePendingNote({ text, timeLabel, agent, ...props }: CandidatePendingNoteProps): react.JSX.Element;

export { CandidatePendingNote, type CandidatePendingNoteAgent, type CandidatePendingNoteProps };
