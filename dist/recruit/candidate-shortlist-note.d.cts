import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface CandidateShortlistNoteProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
    /** Who the note is from, such as "A note from Jordan". It is the note's heading. */
    title: ReactNode;
    /**
     * The title's heading level: 2 (the default) for a note under the page's
     * own h1, or 3 or 4 where it sits deeper in the page's outline. Only the
     * tag changes: the title looks the same at every level.
     */
    titleLevel?: 2 | 3 | 4;
    /** The sender's face, usually a PersonAvatar. 44px reads best. */
    avatar?: ReactNode;
    /** A line under the title, such as the sender's role and firm. */
    meta?: ReactNode;
    /**
     * The note itself, set as rich text. Pass paragraphs, or Markdown the host
     * has already rendered (and sanitised): the note parses nothing.
     */
    message?: ReactNode;
    /** Under the message, such as an embedded video from the sender. */
    media?: ReactNode;
    /** A sign-off on the note's last line, such as "— Jordan". */
    signature?: ReactNode;
    /** Beside the sign-off, such as a link to book a call with the sender. */
    action?: ReactNode;
}
/**
 * A personal note from the person presenting a shortlist, set above it: the
 * sender's face, a title such as "A note from Jordan" and their role, then the
 * message, an optional media slot such as a video, and a last line with a
 * sign-off and an action, such as a link to book a call. Every value is a
 * slot, so the host decides what the note says and where its links go.
 *
 * The root is the kit's Card, which keeps its own `data-slot`. The title is a
 * kit Heading at `titleLevel`, an h2 unless the host says otherwise, so the
 * note never adds a second h1 to the page it sits on. A line holding neither
 * a `signature` nor an `action` isn't drawn.
 */
declare function CandidateShortlistNote({ title, titleLevel, avatar, meta, message, media, signature, action, ...props }: CandidateShortlistNoteProps): react.JSX.Element;

export { CandidateShortlistNote, type CandidateShortlistNoteProps };
