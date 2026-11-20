"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunk3YGB3RHVcjs = require('./chunk-3YGB3RHV.cjs');


var _chunkT2YQNA2Bcjs = require('./chunk-T2YQNA2B.cjs');


var _chunkSUDJGWV2cjs = require('./chunk-SUDJGWV2.cjs');


var _chunk24HXMKK7cjs = require('./chunk-24HXMKK7.cjs');



var _chunkKDK5CYGScjs = require('./chunk-KDK5CYGS.cjs');


var _chunkL2JVZDKScjs = require('./chunk-L2JVZDKS.cjs');



var _chunkYBUOBNBZcjs = require('./chunk-YBUOBNBZ.cjs');


var _chunkANK2TWM2cjs = require('./chunk-ANK2TWM2.cjs');


var _chunkLIC3YNUNcjs = require('./chunk-LIC3YNUN.cjs');



var _chunkD5BXTRVNcjs = require('./chunk-D5BXTRVN.cjs');


var _chunkX6GX3U3Xcjs = require('./chunk-X6GX3U3X.cjs');


var _chunkGTQAORPNcjs = require('./chunk-GTQAORPN.cjs');

// src/recruit/candidate-shared-profile-sections.tsx
var _utils = require('@epicbagel/saas-kit/lib/utils');
var _avatar = require('@epicbagel/saas-kit/primitives/avatar');
var _callout = require('@epicbagel/saas-kit/primitives/callout');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');

// src/recruit/shared-profile-attributes.ts
function sharedProfileRootAttributes(props) {
  const attributes = {};
  for (const [name, value] of Object.entries(props)) {
    if (name === "id" || name === "style" || name.startsWith("data-") || name.startsWith("aria-")) {
      attributes[name] = value;
    }
  }
  return attributes;
}
var SHARED_PROFILE_WRAP = "[overflow-wrap:anywhere]";

// src/recruit/candidate-shared-profile-sections.tsx
var _jsxruntime = require('react/jsx-runtime');
function present(value) {
  return value != null && value !== false && value !== "";
}
var candidateSharedProfileLabels = Object.freeze({
  anonymous: "Confidential candidate",
  anonymousReference: "this candidate",
  yearsExperience: (years) => `${years} ${years === 1 ? "yr" : "yrs"} experience`,
  people: (count) => `${count} people shared with you`,
  opening: (name) => `Opening ${name}\u2026`,
  anonymousPerson: (position) => `Candidate ${position}`,
  switchFailed: () => "That profile didn't open. Try again.",
  archivedTitle: "This profile is archived",
  archivedDescription: "Its link has stopped working for the people it was shared with.",
  voiceNote: "A note from your recruiter",
  voiceNotePlayer: "Recruiter voice note",
  note: (author) => author ? `Note from ${author}` : "A note for you",
  fit: (roleTitle) => present(roleTitle) ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    "Fit for ",
    roleTitle
  ] }) : "Fit",
  summary: "Profile",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  answer: "Your answer",
  answerReadOnly: "Answer",
  notes: "Your notes",
  notesReadOnly: "Notes",
  notesEmpty: Object.freeze({ title: "No notes yet" }),
  you: "You",
  noteInput: (name) => `Note about ${name}`,
  notePlaceholder: "Add a note",
  noteVoiceTitle: (name) => `Leave a note about ${name}`,
  noteDiscard: "Discard unsaved note",
  noteFailed: () => "That note didn't save. Try again.",
  noteTooLong: (maxLength) => `That note is over ${maxLength} characters. Shorten it to save it.`
});
function CandidateSharedProfileSection({
  title,
  titleLevel = 2,
  printVisibility = "visible",
  className,
  children,
  ...props
}) {
  const titleId = _react.useId.call(void 0, );
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      as: "section",
      "data-slot": "candidate-shared-profile-section",
      "aria-labelledby": titleId,
      gap: "compact",
      className: _utils.cn.call(void 0, SHARED_PROFILE_WRAP, printVisibility === "hidden" && "print:hidden", className),
      ...sharedProfileRootAttributes(props),
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { id: titleId, level: 3, as: `h${titleLevel}`, children: title }),
        children
      ]
    }
  );
}
function CandidateSharedProfileSwitcher({
  people,
  value,
  onChange,
  opening,
  error,
  anonymised = false,
  labels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const captionId = _react.useId.call(void 0, );
  const request = _chunkX6GX3U3Xcjs.useLatestCall.call(void 0, onChange);
  if (people.length < 2 || !people.some((person) => person.id === value)) return null;
  const sharesName = (name) => people.filter((person) => person.name === name).length > 1;
  const shown = people.map((person, index) => ({
    id: person.id,
    name: anonymised ? text.anonymousPerson(index + 1) : sharesName(person.name) && person.detail ? `${person.name} \xB7 ${person.detail}` : person.name,
    avatar: anonymised ? void 0 : person.avatar
  }));
  const openingId = _nullishCoalesce(_nullishCoalesce(opening, () => ( _optionalChain([request, 'access', _ => _.pendingArgs, 'optionalAccess', _2 => _2[0]]))), () => ( null));
  const openingPerson = shown.find((person) => person.id === openingId);
  const failed = present(error) ? error : request.failure ? text.switchFailed(request.failure.cause) : null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      "data-slot": "candidate-shared-profile-switcher",
      "data-opening": openingId !== null || void 0,
      gap: "xs",
      className: _utils.cn.call(void 0, SHARED_PROFILE_WRAP, "print:hidden", className),
      ...sharedProfileRootAttributes(props),
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { id: captionId, variant: "caption", "aria-live": "polite", children: openingPerson ? text.opening(openingPerson.name) : text.people(people.length) }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkL2JVZDKScjs.ChoiceChips,
          {
            "aria-labelledby": captionId,
            chips: shown.map((person) => ({ id: person.id, label: person.name, leading: person.avatar })),
            value,
            disabled: !onChange,
            held: openingId !== null,
            onChange: request.run
          }
        ),
        failed !== null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "destructive", role: "alert", children: failed }) : null
      ]
    }
  );
}
function WithheldAvatar() {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _avatar.Avatar, { size: "2xl", "aria-hidden": "true", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _avatar.AvatarFallback, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.UserRound, size: "xl", tone: "muted" }) }) });
}
function CandidateSharedProfileHeader({
  person,
  anonymised = false,
  titleLevel = 1,
  padding,
  eyebrow,
  status,
  className,
  labels,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const name = anonymised ? void 0 : _optionalChain([person, 'access', _3 => _3.name, 'optionalAccess', _4 => _4.trim, 'call', _5 => _5()]) || void 0;
  const link = anonymised ? null : person.profileLink;
  const hasRole = present(person.title) || present(person.company);
  const hasFacts = present(person.location) || person.yearsExperience != null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunk24HXMKK7cjs.CandidateProfileHeader,
    {
      ...sharedProfileRootAttributes(props),
      className: _utils.cn.call(void 0, SHARED_PROFILE_WRAP, className),
      padding,
      eyebrow,
      status,
      titleLevel,
      name: _nullishCoalesce(name, () => ( text.anonymous)),
      cover: anonymised ? person.cover === null ? null : void 0 : person.cover,
      coverSeed: anonymised ? null : person.coverSeed,
      avatar: anonymised ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, WithheldAvatar, {}) : person.avatar,
      meta: hasRole || hasFacts ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", children: [
        hasRole ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { variant: "small", tone: "soft", children: [
          person.title,
          present(person.title) && present(person.company) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: " \xB7 " }) : null,
          present(person.company) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3YGB3RHVcjs.CurrentCompanyLabel, { company: person.company, size: "sm", tone: "inherit" }) : null
        ] }) : null,
        hasFacts ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { variant: "caption", children: [
          person.location,
          present(person.location) && person.yearsExperience != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: " \xB7 " }) : null,
          person.yearsExperience != null ? text.yearsExperience(person.yearsExperience) : null
        ] }) : null
      ] }) : void 0,
      actionsPlacement: "aside",
      actions: link ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        _chunkSUDJGWV2cjs.CandidateProfileLinkButton,
        {
          href: link.href,
          title: link.title,
          icon: link.icon,
          className: _utils.cn.call(void 0, "print:hidden", _chunkD5BXTRVNcjs.COARSE_POINTER_TOUCH_TARGET)
        }
      ) : void 0
    }
  );
}
function NativeAudio({ src, label }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "audio",
    {
      src,
      "aria-label": label,
      controls: true,
      preload: "metadata",
      className: "max-w-full dark:[color-scheme:dark]"
    }
  );
}
function CandidateSharedProfileVoiceNote({
  src,
  transcript,
  titleLevel = 2,
  renderAudio = NativeAudio,
  labels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const words = _optionalChain([transcript, 'optionalAccess', _6 => _6.trim, 'call', _7 => _7()]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    CandidateSharedProfileSection,
    {
      "data-slot": "candidate-shared-profile-voice-note",
      title: text.voiceNote,
      titleLevel,
      printVisibility: words ? "visible" : "hidden",
      className,
      ...sharedProfileRootAttributes(props),
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { gap: "none", align: "start", className: "print:hidden", children: renderAudio({ src, label: text.voiceNotePlayer }) }),
        words ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", tone: "muted", whitespace: "pre-line", children: words }) : null
      ] })
    }
  );
}
function CandidateSharedProfileNote({
  text: words,
  author,
  titleLevel = 2,
  labels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    CandidateSharedProfileSection,
    {
      "data-slot": "candidate-shared-profile-note",
      title: text.note(_optionalChain([author, 'optionalAccess', _8 => _8.trim, 'call', _9 => _9()]) || void 0),
      titleLevel,
      className,
      ...sharedProfileRootAttributes(props),
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _callout.Callout, { padding: "lg", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", whitespace: "pre-line", children: words }) })
    }
  );
}
var PRINT_COLOURS = "[-webkit-print-color-adjust:exact] [print-color-adjust:exact]";
function CandidateSharedProfileFit({
  roleTitle,
  grade,
  assessmentTags,
  summary,
  evidence,
  groups,
  titleLevel = 2,
  labels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const groupId = _react.useId.call(void 0, );
  const graded = grade != null && (present(grade.grade) || present(grade.label));
  const lines = _nullishCoalesce(evidence, () => ( []));
  const lists = (_nullishCoalesce(groups, () => ( []))).filter((group) => group.items.length > 0);
  if (!graded && !_optionalChain([assessmentTags, 'optionalAccess', _10 => _10.length]) && !present(summary) && lines.length === 0 && lists.length === 0) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    CandidateSharedProfileSection,
    {
      "data-slot": "candidate-shared-profile-fit",
      title: text.fit(roleTitle),
      titleLevel,
      className: _utils.cn.call(void 0, PRINT_COLOURS, className),
      ...sharedProfileRootAttributes(props),
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkYBUOBNBZcjs.CandidateAssessmentPills, { tags: assessmentTags, children: graded ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkYBUOBNBZcjs.CandidateGradeBadge,
          {
            as: "span",
            shrink: true,
            grade: grade.grade,
            label: grade.label,
            labels: grade.labels,
            tone: grade.tone,
            showLabel: grade.showLabel,
            size: grade.size,
            format: _nullishCoalesce(grade.format, () => ( "inline")),
            appearance: grade.appearance,
            sentiment: grade.sentiment,
            title: grade.title
          }
        ) : null }),
        present(summary) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", whitespace: "pre-line", children: summary }) : null,
        lines.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGTQAORPNcjs.CandidateSummaryBullets, { bullets: lines, presentation: "body" }) : null,
        lists.map((group, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          _stack.Stack,
          {
            as: "section",
            "data-slot": "candidate-shared-profile-fit-group",
            "aria-labelledby": `${groupId}-${index}`,
            gap: "sm",
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { id: `${groupId}-${index}`, level: 5, as: `h${titleLevel + 1}`, children: group.title }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGTQAORPNcjs.CandidateSummaryBullets, { bullets: group.items, presentation: "body" })
            ]
          },
          index
        ))
      ] })
    }
  );
}
function CandidateSharedProfileAnswer({
  candidateName,
  decision,
  reason,
  onDecide,
  reasonSuggestions,
  reasonOptional,
  reasonPrompt,
  reasonSheet,
  readOnly = false,
  disabled = false,
  titleLevel = 2,
  labels,
  decisionLabels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const titleId = _react.useId.call(void 0, );
  const answers = !readOnly && onDecide != null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _panelsection.PanelSection,
    {
      "data-slot": "candidate-shared-profile-answer",
      "aria-labelledby": titleId,
      border: "top",
      className: _utils.cn.call(void 0, SHARED_PROFILE_WRAP, "print:hidden", _chunkD5BXTRVNcjs.COARSE_POINTER_TOUCH_TARGETS_WITHIN, className),
      ...sharedProfileRootAttributes(props),
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _sectionheader.SectionHeader,
          {
            id: titleId,
            "aria-level": titleLevel,
            label: answers ? text.answer : text.answerReadOnly,
            spacing: "loose"
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkANK2TWM2cjs.CandidateClientDecision,
          {
            padding: "none",
            candidateName,
            decision,
            reason,
            readOnly: !answers,
            disabled,
            reasonOptional,
            reasonPrompt,
            reasonSheet,
            suggestions: reasonSuggestions,
            labels: decisionLabels,
            onDecide: async (choice, why) => {
              await _optionalChain([onDecide, 'optionalCall', _11 => _11(choice, why)]);
            }
          }
        )
      ]
    }
  );
}
function CandidateSharedProfileNotes({
  notes,
  candidateName,
  onAdd,
  readOnly = false,
  disabled = false,
  voice = true,
  maxLength,
  titleLevel = 2,
  labels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const writes = !readOnly && onAdd != null;
  const dictation = _chunkLIC3YNUNcjs.useDictationSupport.call(void 0, );
  const [draft, setDraft] = _react.useState.call(void 0, "");
  const [recovering, setRecovering] = _react.useState.call(void 0, false);
  const [problem, setProblem] = _react.useState.call(void 0, null);
  const [savingSpoken, setSavingSpoken] = _react.useState.call(void 0, false);
  const spokenInFlight = _react.useRef.call(void 0, false);
  const save = async (words) => {
    try {
      await _optionalChain([onAdd, 'optionalCall', _12 => _12(words)]);
      setDraft("");
      setRecovering(false);
      setProblem(null);
    } catch (cause) {
      setProblem(text.noteFailed(cause));
      throw cause;
    }
  };
  const recover = (words) => {
    setDraft(words);
    setRecovering(true);
  };
  const spoken = _chunkT2YQNA2Bcjs.useCandidateVoiceNote.call(void 0, {
    title: text.noteVoiceTitle(candidateName),
    onCommit: async (heard) => {
      const words = heard.trim();
      if (!words || spokenInFlight.current) return;
      if (maxLength != null && words.length > maxLength) {
        recover(words);
        setProblem(text.noteTooLong(maxLength));
        return;
      }
      spokenInFlight.current = true;
      setSavingSpoken(true);
      try {
        await save(words);
      } catch (e) {
        recover(words);
      } finally {
        spokenInFlight.current = false;
        setSavingSpoken(false);
      }
    }
  });
  const composerReady = !voice || dictation !== null;
  const speaks = voice && dictation === true;
  const title = writes ? text.notes : text.notesReadOnly;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      "data-slot": "candidate-shared-profile-notes",
      gap: "none",
      className: _utils.cn.call(void 0, SHARED_PROFILE_WRAP, "print:hidden", _chunkD5BXTRVNcjs.COARSE_POINTER_TOUCH_TARGETS_WITHIN, className),
      ...sharedProfileRootAttributes(props),
      children: [
        writes && speaks ? spoken.control : null,
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { "aria-label": title, border: "top", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { "aria-level": titleLevel, label: title, count: notes.length }),
          notes.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", marginTop: "md", children: notes.map((note) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkKDK5CYGScjs.CandidateNoteCard, { author: _nullishCoalesce(note.author, () => ( text.you)), date: note.date, text: note.text }, note.id)) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _emptystate.EmptyState,
            {
              variant: "empty",
              size: "inline",
              icon: _lucidereact.StickyNote,
              title: text.notesEmpty.title,
              description: _nullishCoalesce(text.notesEmpty.description, () => ( ""))
            }
          ),
          writes && composerReady ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkKDK5CYGScjs.CandidateNoteComposer,
            {
              value: draft,
              onValueChange: setDraft,
              editing: recovering ? true : void 0,
              onVoice: speaks ? spoken.open : void 0,
              onCancel: () => {
                setDraft("");
                setRecovering(false);
                setProblem(null);
              },
              onSubmit: save,
              disabled: disabled || savingSpoken,
              error: problem,
              maxLength,
              ...savingSpoken ? { "aria-busy": true } : null,
              labels: {
                input: text.noteInput(candidateName),
                placeholder: text.notePlaceholder,
                ...recovering ? { cancel: text.noteDiscard } : null
              }
            }
          ) : null
        ] })
      ]
    }
  );
}













exports.sharedProfileRootAttributes = sharedProfileRootAttributes; exports.SHARED_PROFILE_WRAP = SHARED_PROFILE_WRAP; exports.candidateSharedProfileLabels = candidateSharedProfileLabels; exports.CandidateSharedProfileSection = CandidateSharedProfileSection; exports.CandidateSharedProfileSwitcher = CandidateSharedProfileSwitcher; exports.CandidateSharedProfileHeader = CandidateSharedProfileHeader; exports.CandidateSharedProfileVoiceNote = CandidateSharedProfileVoiceNote; exports.CandidateSharedProfileNote = CandidateSharedProfileNote; exports.CandidateSharedProfileFit = CandidateSharedProfileFit; exports.CandidateSharedProfileAnswer = CandidateSharedProfileAnswer; exports.CandidateSharedProfileNotes = CandidateSharedProfileNotes;
