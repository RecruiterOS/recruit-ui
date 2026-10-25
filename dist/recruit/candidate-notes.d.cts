import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';

interface CandidateNoteListProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** How many notes there are. Zero shows the empty state instead of `children`. */
    count: number;
    /** A skeleton row in place of the list, and no count yet. */
    loading?: boolean;
    /** The section heading. */
    title?: ReactNode;
    /** The blank slate's wording. Defaults to "No notes yet". */
    empty?: CandidateEmptyCopy;
    /** Below the notes, usually a CandidateNoteComposer. */
    composer?: ReactNode;
    /** The notes, usually CandidateNoteCards, newest or pinned first. */
    children?: ReactNode;
    /** The kit PanelSection's divider. */
    border?: "none" | "top" | "bottom";
}
/**
 * The notes on one person, as a counted section: a skeleton row while they
 * load, then the host's note cards, or the kit's empty state when there are
 * none, with the composer underneath so a new note lands below the last.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-note-list"`.
 */
declare function CandidateNoteList({ count, loading, title, empty, composer, children, border, ...props }: CandidateNoteListProps): react.JSX.Element;
/** How a note was left, which picks its glyph: dictated, written by an assistant, or typed. */
type CandidateNoteKind = "voice" | "agent" | "note";
/** Marks a note that stays at the top of the list and is edited elsewhere. */
interface CandidateNotePinned {
    /** The badge text, such as "Client note · pinned". */
    label: ReactNode;
    /** The badge tooltip, such as where to edit it. */
    title?: string;
}
/** Which role, if any, the note belongs to. */
interface CandidateNoteScope {
    /** The badge text, such as the role's title or "General". */
    label: ReactNode;
    /** The badge tooltip. */
    title?: string;
    /** An info-toned badge, for a note tied to a role, instead of the neutral one. */
    highlighted?: boolean;
}
interface CandidateNoteCardLabels {
    /** After the author on a dictated note. Pass `null` to leave it out. */
    voice: ReactNode;
    /** The delete button's tooltip and accessible name. */
    delete: string;
}
interface CandidateNoteCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /** Who left it, already resolved to a display name. */
    author: ReactNode;
    kind?: CandidateNoteKind;
    /** Pins the note: it sits on the card surface, not the muted one, with this badge. */
    pinned?: CandidateNotePinned;
    scope?: CandidateNoteScope;
    /** When it was left, already formatted. */
    date?: ReactNode;
    /** The note, kept as written: line breaks are preserved. */
    text?: ReactNode;
    /** Adds a delete button. Confirm in the host before deleting anything. */
    onDelete?: () => void;
    /** Whether the delete button is always shown or appears on hover. Use `always` on touch screens. */
    revealDelete?: "always" | "hover";
    labels?: Partial<CandidateNoteCardLabels>;
}
/**
 * One note on a person: who left it and how, an optional pinned badge, the
 * role it belongs to, when, and the text, with a delete button that appears
 * on hover or always. The host resolves authors and roles and confirms
 * deletes.
 *
 * The root is the kit Card and keeps the kit's own `data-slot="card"`, which
 * theme stylesheets select on.
 */
declare function CandidateNoteCard({ author, kind, pinned, scope, date, text, onDelete, revealDelete, labels, ...props }: CandidateNoteCardProps): react.JSX.Element;
interface CandidateNoteComposerLabels {
    /** Under the microphone, and its accessible name. */
    voice: string;
    /** The link that switches to typing. */
    type: string;
    placeholder: string;
    cancel: string;
    submit: string;
}
interface CandidateNoteComposerProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "onSubmit"> {
    /** Starts dictation. The host records the note and saves it. Without it the microphone does nothing. */
    onVoice?: () => void;
    /**
     * Saves a typed note or a picked suggestion, trimmed. Resolve once saved:
     * the composer then clears and closes. Reject and the typed text stays.
     */
    onSubmit: (text: string) => Promise<void>;
    /** One-tap notes under the microphone, each saved as written. */
    suggestions?: readonly string[];
    labels?: Partial<CandidateNoteComposerLabels>;
}
/**
 * Leaves a note on a person, voice first: a large microphone, a link to type
 * instead, and one-tap suggestions. Typing opens a text area with Cancel and
 * Add note; Add note stays disabled until there is text and shows a spinner
 * while the host saves.
 *
 * The root is marked `data-slot="candidate-note-composer"`.
 */
declare function CandidateNoteComposer({ onVoice, onSubmit, suggestions, labels, ...props }: CandidateNoteComposerProps): react.JSX.Element;

export { CandidateNoteCard, type CandidateNoteCardLabels, type CandidateNoteCardProps, CandidateNoteComposer, type CandidateNoteComposerLabels, type CandidateNoteComposerProps, type CandidateNoteKind, CandidateNoteList, type CandidateNoteListProps, type CandidateNotePinned, type CandidateNoteScope };
