"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }











var _chunkAYRQL2AFcjs = require('./chunk-AYRQL2AF.cjs');




var _chunk24HXMKK7cjs = require('./chunk-24HXMKK7.cjs');


var _chunkX6GX3U3Xcjs = require('./chunk-X6GX3U3X.cjs');


var _chunkOYFPWTSRcjs = require('./chunk-OYFPWTSR.cjs');

// src/recruit/candidate-shared-profile.tsx
var _utils = require('@epicbagel/saas-kit/lib/utils');
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _callout = require('@epicbagel/saas-kit/primitives/callout');
var _grid = require('@epicbagel/saas-kit/primitives/grid');
var _list = require('@epicbagel/saas-kit/primitives/list');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var PRINT_WITHOUT_CONTROLS = "print:[&_button]:hidden";
function present(value) {
  return value != null && value !== false && value !== "";
}
function CandidateSharedProfile({
  person,
  anonymised = false,
  eyebrow,
  people,
  personId,
  onPersonChange,
  openingPersonId,
  archived = false,
  voiceNote,
  note,
  fit,
  summary,
  experience,
  experienceOptions,
  education,
  skills,
  certifications,
  languages,
  children,
  decision,
  decisionReason,
  onDecide,
  reasonOptional,
  reasonSuggestions,
  reasonPrompt,
  reasonSheet,
  clientNotes,
  onAddNote,
  noteVoice,
  noteMaxLength,
  readOnly = false,
  credit,
  titleLevel = 1,
  renderAudio,
  labels,
  decisionLabels,
  className,
  ...props
}) {
  const text = { ..._chunkAYRQL2AFcjs.candidateSharedProfileLabels, ...labels };
  const switching = _chunkX6GX3U3Xcjs.useLatestCall.call(void 0, onPersonChange);
  const opening = _nullishCoalesce(_nullishCoalesce(openingPersonId, () => ( _optionalChain([switching, 'access', _ => _.pendingArgs, 'optionalAccess', _2 => _2[0]]))), () => ( null));
  const held = opening !== null;
  const sectionLevel = Math.min(titleLevel + 1, 5);
  const roleLevel = Math.min(sectionLevel + 1, 6);
  const nameInWords = (anonymised ? "" : _optionalChain([person, 'access', _3 => _3.name, 'optionalAccess', _4 => _4.trim, 'call', _5 => _5()])) || text.anonymousReference;
  const careerItems = _nullishCoalesce(experience, () => ( []));
  const educationRows = (_nullishCoalesce(education, () => ( []))).filter((item) => present(item.title) || present(item.institution)).map((item) => ({
    title: present(item.title) ? item.title : item.institution,
    company: present(item.title) && present(item.institution) ? item.institution : void 0,
    dateRange: present(item.date) ? item.date : void 0
  }));
  const skillTags = (_nullishCoalesce(skills, () => ( []))).filter(present);
  const certificationLines = (_nullishCoalesce(certifications, () => ( []))).filter(present);
  const languageLines = (_nullishCoalesce(languages, () => ( []))).filter(present);
  const hasFit = fit != null && (fit.grade != null && (present(fit.grade.grade) || present(fit.grade.label)) || present(fit.summary) || (_nullishCoalesce(_optionalChain([fit, 'access', _6 => _6.evidence, 'optionalAccess', _7 => _7.length]), () => ( 0))) > 0 || (_nullishCoalesce(fit.groups, () => ( []))).some((group) => group.items.length > 0));
  const recording = voiceNote != null && voiceNote.src.trim() !== "" ? voiceNote : null;
  const writtenNote = note != null && note.text.trim() !== "" ? note : null;
  const hasBody = recording !== null || writtenNote !== null || hasFit || present(summary) || careerItems.length > 0 || educationRows.length > 0 || skillTags.length > 0 || certificationLines.length > 0 || languageLines.length > 0 || // An empty list of the host's own sections is no section.
  _react.Children.toArray(children).length > 0;
  const answered = decision === "yes" || decision === "no";
  const showsAnswer = onDecide != null || answered;
  const notes = _nullishCoalesce(clientNotes, () => ( []));
  const showsNotes = onAddNote != null || notes.length > 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      "data-slot": "candidate-shared-profile",
      "data-anonymised": anonymised || void 0,
      "data-archived": archived || void 0,
      gap: "md",
      width: "full",
      className: _utils.cn.call(void 0, _chunkAYRQL2AFcjs.SHARED_PROFILE_WRAP, className),
      ..._chunkAYRQL2AFcjs.sharedProfileRootAttributes.call(void 0, props),
      children: [
        present(eyebrow) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "eyebrow", children: eyebrow }) : null,
        people && personId != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkAYRQL2AFcjs.CandidateSharedProfileSwitcher,
          {
            people,
            value: personId,
            onChange: onPersonChange ? switching.run : void 0,
            opening,
            error: switching.failure ? text.switchFailed(switching.failure.cause) : void 0,
            anonymised,
            labels
          }
        ) : null,
        archived ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { "data-slot": "candidate-shared-profile-archived", gap: "none", className: "print:hidden", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _callout.Callout, { tone: "warning", padding: "lg", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { weight: "semibold", children: text.archivedTitle }),
          present(text.archivedDescription) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", tone: "muted", children: text.archivedDescription }) : null
        ] }) }) }) : null,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _stack.Stack,
          {
            gap: "none",
            width: "full",
            opacity: archived ? "soft" : "full",
            "aria-busy": held || void 0,
            className: "print:opacity-100",
            children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
              _chunk24HXMKK7cjs.CandidateProfile,
              {
                printMode: "flat",
                header: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  _chunkAYRQL2AFcjs.CandidateSharedProfileHeader,
                  {
                    person,
                    anonymised,
                    titleLevel,
                    labels
                  }
                ),
                footer: present(credit) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk24HXMKK7cjs.CandidateProfileFooter, { justify: "center", padding: "compact", printVisibility: "hidden", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "caption", children: credit }) }) : void 0,
                children: [
                  hasBody ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk24HXMKK7cjs.CandidateProfileBody, { children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "lg", children: [
                    recording !== null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      _chunkAYRQL2AFcjs.CandidateSharedProfileVoiceNote,
                      {
                        src: recording.src,
                        transcript: recording.transcript,
                        titleLevel: sectionLevel,
                        renderAudio,
                        labels
                      }
                    ) : null,
                    writtenNote !== null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      _chunkAYRQL2AFcjs.CandidateSharedProfileNote,
                      {
                        text: writtenNote.text,
                        author: writtenNote.author,
                        titleLevel: sectionLevel,
                        labels
                      }
                    ) : null,
                    fit != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      _chunkAYRQL2AFcjs.CandidateSharedProfileFit,
                      {
                        roleTitle: fit.roleTitle,
                        grade: fit.grade,
                        summary: fit.summary,
                        evidence: fit.evidence,
                        groups: fit.groups,
                        titleLevel: sectionLevel,
                        labels
                      }
                    ) : null,
                    present(summary) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      _chunkAYRQL2AFcjs.CandidateSharedProfileSection,
                      {
                        "data-slot": "candidate-shared-profile-summary",
                        title: text.summary,
                        titleLevel: sectionLevel,
                        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", whitespace: "pre-line", children: summary })
                      }
                    ) : null,
                    careerItems.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      _chunkAYRQL2AFcjs.CandidateSharedProfileSection,
                      {
                        "data-slot": "candidate-shared-profile-experience",
                        title: text.experience,
                        titleLevel: sectionLevel,
                        className: PRINT_WITHOUT_CONTROLS,
                        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                          _chunkOYFPWTSRcjs.CandidateCareerHistoryTimeline,
                          {
                            items: careerItems,
                            detailedCompanyGroups: _optionalChain([experienceOptions, 'optionalAccess', _8 => _8.detailedCompanyGroups]),
                            earlierLabel: _optionalChain([experienceOptions, 'optionalAccess', _9 => _9.earlierLabel]),
                            presentLabel: _optionalChain([experienceOptions, 'optionalAccess', _10 => _10.presentLabel]),
                            locale: _optionalChain([experienceOptions, 'optionalAccess', _11 => _11.locale]),
                            titleLevel: roleLevel
                          }
                        )
                      }
                    ) : null,
                    educationRows.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      _chunkAYRQL2AFcjs.CandidateSharedProfileSection,
                      {
                        "data-slot": "candidate-shared-profile-education",
                        title: text.education,
                        titleLevel: sectionLevel,
                        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                          _chunkOYFPWTSRcjs.CandidateCareerHistoryTimeline,
                          {
                            items: educationRows,
                            detailedCompanyGroups: educationRows.length,
                            titleLevel: roleLevel
                          }
                        )
                      }
                    ) : null,
                    skillTags.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      _chunkAYRQL2AFcjs.CandidateSharedProfileSection,
                      {
                        "data-slot": "candidate-shared-profile-skills",
                        title: text.skills,
                        titleLevel: sectionLevel,
                        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { as: "ul", role: "list", direction: "horizontal", gap: "sm", wrap: true, children: skillTags.map((skill, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { as: "li", variant: "neutral", children: skill }, index)) })
                      }
                    ) : null,
                    certificationLines.length > 0 || languageLines.length > 0 ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _grid.Grid, { columns: 2, gap: "lg", children: [
                      certificationLines.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                        _chunkAYRQL2AFcjs.CandidateSharedProfileSection,
                        {
                          "data-slot": "candidate-shared-profile-certifications",
                          title: text.certifications,
                          titleLevel: sectionLevel,
                          children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.List, { marker: "disc", spacing: "tight", textSize: "sm", children: certificationLines.map((line, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.ListItem, { children: line }, index)) })
                        }
                      ) : null,
                      languageLines.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                        _chunkAYRQL2AFcjs.CandidateSharedProfileSection,
                        {
                          "data-slot": "candidate-shared-profile-languages",
                          title: text.languages,
                          titleLevel: sectionLevel,
                          children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.List, { marker: "disc", spacing: "tight", textSize: "sm", children: languageLines.map((line, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.ListItem, { children: line }, index)) })
                        }
                      ) : null
                    ] }) : null,
                    children
                  ] }) }) : null,
                  showsAnswer ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    _chunkAYRQL2AFcjs.CandidateSharedProfileAnswer,
                    {
                      candidateName: nameInWords,
                      decision,
                      reason: decisionReason,
                      onDecide,
                      reasonOptional,
                      reasonSuggestions,
                      reasonPrompt,
                      reasonSheet,
                      readOnly,
                      disabled: held,
                      titleLevel: sectionLevel,
                      labels,
                      decisionLabels
                    },
                    `answer:${_nullishCoalesce(personId, () => ( ""))}`
                  ) : null,
                  showsNotes ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    _chunkAYRQL2AFcjs.CandidateSharedProfileNotes,
                    {
                      notes,
                      candidateName: nameInWords,
                      onAdd: onAddNote,
                      readOnly,
                      disabled: held,
                      voice: noteVoice,
                      maxLength: noteMaxLength,
                      titleLevel: sectionLevel,
                      labels
                    },
                    `notes:${_nullishCoalesce(personId, () => ( ""))}`
                  ) : null
                ]
              }
            )
          }
        )
      ]
    }
  );
}



exports.CandidateSharedProfile = CandidateSharedProfile;
