import * as react from 'react';
import { NoteCardProps, NoteCardLabels, NoteComposerProps, NoteComposerLabels, NoteKind, NoteListProps, NotePinned, NoteScope } from '@epicbagel/saas-kit/primitives/notes';

type CandidateNoteListProps = NoteListProps;
type CandidateNoteKind = NoteKind;
type CandidateNotePinned = NotePinned;
type CandidateNoteScope = NoteScope;
type CandidateNoteCardLabels = NoteCardLabels;
type CandidateNoteCardProps = NoteCardProps;
/** The existing five-label contract remains valid for current consumers. */
type CandidateNoteComposerLabels = Pick<NoteComposerLabels, "voice" | "type" | "placeholder" | "cancel" | "submit">;
interface CandidateNoteComposerProps extends Omit<NoteComposerProps, "labels"> {
    labels?: Partial<CandidateNoteComposerLabels>;
}
/** Counted candidate notes, with the existing list slot and composer. */
declare function CandidateNoteList(props: CandidateNoteListProps): react.JSX.Element;
/** Attributed note card. The shared Card keeps its theme-selectable slot. */
declare function CandidateNoteCard(props: CandidateNoteCardProps): react.JSX.Element;
/** Host-provided dictation or typing; failed saves retain an editable draft. */
declare function CandidateNoteComposer(props: CandidateNoteComposerProps): react.JSX.Element;

export { CandidateNoteCard, type CandidateNoteCardLabels, type CandidateNoteCardProps, CandidateNoteComposer, type CandidateNoteComposerLabels, type CandidateNoteComposerProps, type CandidateNoteKind, CandidateNoteList, type CandidateNoteListProps, type CandidateNotePinned, type CandidateNoteScope };
