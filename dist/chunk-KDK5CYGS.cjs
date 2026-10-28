"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-notes.tsx




var _notes = require('@epicbagel/saas-kit/primitives/notes');
var _jsxruntime = require('react/jsx-runtime');
function CandidateNoteList(props) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _notes.NoteList, { "data-slot": "candidate-note-list", ...props });
}
function CandidateNoteCard(props) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _notes.NoteCard, { ...props });
}
function CandidateNoteComposer(props) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _notes.NoteComposer, { "data-slot": "candidate-note-composer", ...props });
}





exports.CandidateNoteList = CandidateNoteList; exports.CandidateNoteCard = CandidateNoteCard; exports.CandidateNoteComposer = CandidateNoteComposer;
