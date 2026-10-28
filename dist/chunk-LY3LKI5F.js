// src/recruit/candidate-notes.tsx
import {
  NoteCard,
  NoteComposer,
  NoteList
} from "@epicbagel/saas-kit/primitives/notes";
import { jsx } from "react/jsx-runtime";
function CandidateNoteList(props) {
  return /* @__PURE__ */ jsx(NoteList, { "data-slot": "candidate-note-list", ...props });
}
function CandidateNoteCard(props) {
  return /* @__PURE__ */ jsx(NoteCard, { ...props });
}
function CandidateNoteComposer(props) {
  return /* @__PURE__ */ jsx(NoteComposer, { "data-slot": "candidate-note-composer", ...props });
}

export {
  CandidateNoteList,
  CandidateNoteCard,
  CandidateNoteComposer
};
