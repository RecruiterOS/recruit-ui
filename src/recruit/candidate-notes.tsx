"use client";

import {
  NoteCard,
  NoteComposer,
  NoteList,
  type NoteCardLabels,
  type NoteCardProps,
  type NoteComposerLabels,
  type NoteComposerProps,
  type NoteKind,
  type NoteListProps,
  type NotePinned,
  type NoteScope,
} from "@epicbagel/saas-kit/primitives/notes";

// Keep the recruiting API and data slots stable while SaaS Kit owns the
// reusable notes presentation, draft lifecycle and async-save controls.
export type CandidateNoteListProps = NoteListProps;
export type CandidateNoteKind = NoteKind;
export type CandidateNotePinned = NotePinned;
export type CandidateNoteScope = NoteScope;
export type CandidateNoteCardLabels = NoteCardLabels;
export type CandidateNoteCardProps = NoteCardProps;

/** The existing five-label contract remains valid for current consumers. */
export type CandidateNoteComposerLabels = Pick<
  NoteComposerLabels, "voice" | "type" | "placeholder" | "cancel" | "submit"
>;

export interface CandidateNoteComposerProps extends Omit<NoteComposerProps, "labels"> {
  labels?: Partial<CandidateNoteComposerLabels>;
}

/** Counted candidate notes, with the existing list slot and composer. */
export function CandidateNoteList(props: CandidateNoteListProps) {
  return <NoteList data-slot="candidate-note-list" {...props} />;
}

/** Attributed note card. The shared Card keeps its theme-selectable slot. */
export function CandidateNoteCard(props: CandidateNoteCardProps) {
  return <NoteCard {...props} />;
}

/** Host-provided dictation or typing; failed saves retain an editable draft. */
export function CandidateNoteComposer(props: CandidateNoteComposerProps) {
  return <NoteComposer data-slot="candidate-note-composer" {...props} />;
}
