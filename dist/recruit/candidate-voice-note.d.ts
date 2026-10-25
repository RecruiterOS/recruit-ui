import { ReactNode } from 'react';

interface UseCandidateVoiceNoteOptions {
    /** Called with the transcript when a person finishes dictating. */
    onCommit: (text: string) => void | Promise<void>;
    /** The trigger's tooltip and the dictation overlay's title. */
    title?: string;
    /** The small caption in the dictation overlay. */
    caption?: string;
}
interface CandidateVoiceNote {
    /** A quiet mic icon action, for a card's header actions. */
    trigger: ReactNode;
    /**
     * The dictation control itself, visually hidden. Render it once, anywhere
     * inside the card: the trigger and `open` drive it.
     */
    control: ReactNode;
    /** Opens the dictation overlay, for a host control of its own. */
    open: () => void;
}
/**
 * Voice notes on a candidate card: a visible mic trigger and the hidden
 * dictation control it opens, already wired together with no host ref.
 *
 * Dictation uses the browser's speech recognition. Where the browser has
 * none, the control renders nothing and the trigger does nothing. Neither
 * click reaches a surrounding card. The host owns saving the note and
 * anything that reacts to it.
 */
declare function useCandidateVoiceNote({ onCommit, title, caption, }: UseCandidateVoiceNoteOptions): CandidateVoiceNote;

export { type CandidateVoiceNote, type UseCandidateVoiceNoteOptions, useCandidateVoiceNote };
