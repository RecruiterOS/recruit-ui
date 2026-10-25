"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



var _chunk4VHYW2RDcjs = require('./chunk-4VHYW2RD.cjs');

// src/recruit/call-reconcile-card.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _callcard = require('@epicbagel/saas-kit/primitives/call-card');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _input = require('@epicbagel/saas-kit/primitives/input');
var _interactivecard = require('@epicbagel/saas-kit/primitives/interactive-card');
var _list = require('@epicbagel/saas-kit/primitives/list');






var _responsivedialog = require('@epicbagel/saas-kit/primitives/responsive-dialog');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  untitled: "Untitled call",
  showTranscript: "Show full transcript",
  heading: "Attach this call to a person",
  dismiss: "Dismiss",
  notFound: (name) => `We couldn't find ${name}.`,
  hint: "Search or add them below to attach the conversation and keep their history and future recommendations together.",
  possibleMatches: "Possible matches",
  searchPlaceholder: (name) => name === void 0 ? "Search by name" : `Search for ${name}`,
  addManually: "Manually add",
  searching: "Searching\u2026",
  noMatchesTitle: "No people match that name",
  noMatchesDescription: "Try a different spelling, or add them manually.",
  createTitle: "Create candidate from this call",
  useParticipant: "Use a participant",
  name: "Name",
  namePlaceholder: "Full name",
  email: "Email",
  emailPlaceholder: "email@example.com",
  createSubmit: "Create & attach this call",
  previewTitle: "Candidate preview",
  cancel: "Cancel",
  attach: "Attach this call"
};
function CallReconcileCard({
  title,
  source,
  summary,
  timestamp,
  participants = [],
  transcript,
  segments,
  loadTranscript,
  owner,
  guesses = [],
  suggestedPerson,
  searchPeople,
  externalSearch,
  onDismiss,
  onAttach,
  onCreateAttach,
  renderPreview,
  labels,
  className
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const call = _chunk4VHYW2RDcjs.useCallTranscript.call(void 0, { transcript, segments, loadTranscript });
  const [query, setQuery] = _react.useState.call(void 0, "");
  const { results, searching } = _chunk4VHYW2RDcjs.useCallPeopleSearch.call(void 0, query, true, searchPeople);
  const [preview, setPreview] = _react.useState.call(void 0, null);
  const [createOpen, setCreateOpen] = _react.useState.call(void 0, false);
  const [newName, setNewName] = _react.useState.call(void 0, "");
  const [newEmail, setNewEmail] = _react.useState.call(void 0, "");
  const closePreview = () => setPreview(null);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _callcard.CallCard,
      {
        className,
        title: title || text.untitled,
        source,
        headerAside: owner ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { variant: owner.isViewer ? "secondary" : "outline", shrink: true, children: owner.label }) : void 0,
        summary,
        timestamp,
        participants,
        transcript: call.transcript,
        segments: call.segments,
        transcriptLabel: text.showTranscript,
        onLoadTranscript: call.onLoadTranscript,
        actions: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", width: "full", textAlign: "start", padding: "sm", children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "md", align: "center", justify: "between", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", weight: "medium", children: text.heading }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { variant: "quiet", size: "compact", shrink: true, onClick: () => onDismiss(), children: text.dismiss })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { size: "xs", tone: "muted", children: [
              suggestedPerson && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                text.notFound(suggestedPerson.name),
                " "
              ] }),
              text.hint
            ] })
          ] }),
          guesses.length > 0 && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", border: "top", paddingTop: "md", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", children: text.possibleMatches }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", wrap: true, children: guesses.map((guess) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", variant: "outline", onClick: () => setPreview(guess), children: guess.name }, guess.id)) })
          ] }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", wrap: true, border: "top", paddingTop: "md", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", basis: "md", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _input.Input,
              {
                type: "text",
                value: query,
                onChange: (event) => setQuery(event.target.value),
                placeholder: text.searchPlaceholder(suggestedPerson ? suggestedPerson.name : void 0)
              }
            ) }),
            externalSearch,
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _button.Button,
              {
                variant: "outline",
                size: "sm",
                shrink: true,
                onClick: () => {
                  const seed = _nullishCoalesce(participants.find((participant) => participant.email), () => ( participants[0]));
                  setNewName(_nullishCoalesce(_nullishCoalesce(_optionalChain([suggestedPerson, 'optionalAccess', _ => _.name]), () => ( _optionalChain([seed, 'optionalAccess', _2 => _2.name]))), () => ( "")));
                  setNewEmail(_nullishCoalesce(_nullishCoalesce(_optionalChain([suggestedPerson, 'optionalAccess', _3 => _3.email]), () => ( _optionalChain([seed, 'optionalAccess', _4 => _4.email]))), () => ( "")));
                  setCreateOpen(true);
                },
                children: text.addManually
              }
            )
          ] }),
          (results.length > 0 || searching) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _list.List, { surface: "bordered", radius: "md", children: [
            searching && results.length === 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.ListItem, { padding: "md", textSize: "xs", tone: "soft", children: text.searching }),
            results.map((person) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.ListItem, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _interactivecard.InteractiveCard,
              {
                display: "block",
                radius: "none",
                border: "none",
                padding: "row",
                textSize: "sm",
                onClick: () => setPreview(person),
                children: person.name
              }
            ) }, person.id))
          ] }),
          !searching && query.trim().length >= _chunk4VHYW2RDcjs.CALL_PEOPLE_SEARCH_MIN_LENGTH && results.length === 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _emptystate.EmptyState,
            {
              variant: "search",
              size: "inline",
              icon: _lucidereact.UserSearch,
              title: text.noMatchesTitle,
              description: text.noMatchesDescription
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialog, { open: createOpen, onOpenChange: setCreateOpen, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialogContent, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogHeader, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTitle, { children: text.createTitle }) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogBody, { children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", children: [
        participants.length > 0 && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", tone: "muted", children: text.useParticipant }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", wrap: true, children: participants.map((participant, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _button.Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => {
                setNewName(_nullishCoalesce(participant.name, () => ( "")));
                setNewEmail(_nullishCoalesce(participant.email, () => ( "")));
              },
              children: participant.name || participant.email
            },
            `${_nullishCoalesce(participant.email, () => ( participant.name))}-${index}`
          )) })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", tone: "muted", children: text.name }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _input.Input, { value: newName, onChange: (event) => setNewName(event.target.value), placeholder: text.namePlaceholder })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", tone: "muted", children: text.email }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _input.Input, { type: "email", value: newEmail, onChange: (event) => setNewEmail(event.target.value), placeholder: text.emailPlaceholder })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _button.Button,
          {
            size: "sm",
            disabled: !newName.trim(),
            onClick: () => {
              const name = newName.trim();
              const email = newEmail.trim();
              setCreateOpen(false);
              onCreateAttach({ name, email: email || void 0 });
            },
            children: text.createSubmit
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialog, { open: preview !== null, onOpenChange: (open) => !open && closePreview(), children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialogContent, { presentation: "preview", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogHeader, { visibility: "screen-reader", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTitle, { children: text.previewTitle }) }),
      preview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "none", minHeight: "zero", grow: true, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { grow: true, minHeight: "zero", overflow: "hidden", children: renderPreview(preview, closePreview) }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "end", border: "top", surface: "background", padding: "action-row", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { variant: "outline", size: "sm", onClick: closePreview, children: text.cancel }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _button.Button,
            {
              size: "sm",
              onClick: () => {
                const person = preview;
                setPreview(null);
                onAttach(person);
              },
              children: text.attach
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}



exports.CallReconcileCard = CallReconcileCard;
