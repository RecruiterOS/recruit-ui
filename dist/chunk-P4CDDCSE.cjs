"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-notes.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _card = require('@epicbagel/saas-kit/primitives/card');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _skeleton = require('@epicbagel/saas-kit/primitives/skeleton');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _textarea = require('@epicbagel/saas-kit/primitives/textarea');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function present(value) {
  return value != null && value !== false && value !== "";
}
function CandidateNoteList({
  count,
  loading = false,
  title = "Notes",
  empty = { title: "No notes yet" },
  composer,
  children,
  border = "bottom",
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-note-list", border, ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label: title, count: loading ? void 0 : count }),
    loading ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", marginTop: "md", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "row", radius: "xl" }) }) : count > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", marginTop: "md", children }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _emptystate.EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: _lucidereact.StickyNote,
        title: empty.title,
        description: empty.description
      }
    ),
    composer
  ] });
}
var NOTE_CARD_LABELS = {
  voice: "\xB7 voice",
  delete: "Delete note"
};
var NOTE_ICON = { voice: _lucidereact.Mic, agent: _lucidereact.Sparkles, note: _lucidereact.MessageSquare };
function CandidateNoteCard({
  author,
  kind = "note",
  pinned,
  scope,
  date,
  text,
  onDelete,
  revealDelete = "hover",
  labels,
  ...props
}) {
  const voiceLabel = _optionalChain([labels, 'optionalAccess', _ => _.voice]) !== void 0 ? labels.voice : NOTE_CARD_LABELS.voice;
  const deleteLabel = _nullishCoalesce(_optionalChain([labels, 'optionalAccess', _2 => _2.delete]), () => ( NOTE_CARD_LABELS.delete));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _card.Card, { interaction: "group", surface: pinned ? "card" : "muted", padding: "row", ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "none", align: "center", justify: "between", marginBottom: "md", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", textSize: "xs", tone: "muted", wrap: true, children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { variant: "inherit", as: "span", display: "inline-flex", weight: "medium", tone: "soft", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: NOTE_ICON[kind], size: "xs" }),
          author
        ] }),
        pinned && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { as: "span", variant: "info", size: "micro", weight: "semibold", title: pinned.title, children: pinned.label }),
        kind === "voice" && present(voiceLabel) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", tone: "subtle", children: voiceLabel }),
        scope && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _badge.Badge,
          {
            as: "span",
            variant: scope.highlighted ? "info" : "default",
            size: "micro",
            weight: "semibold",
            title: scope.title,
            children: scope.label
          }
        )
      ] }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", children: [
        date,
        onDelete && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _button.Button,
          {
            type: "button",
            size: "icon-sm",
            reveal: revealDelete === "always" ? "always" : "parent-hover-responsive",
            variant: "ghost-destructive",
            onClick: () => onDelete(),
            title: deleteLabel,
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Trash2, size: "sm" })
          }
        )
      ] })
    ] }),
    present(text) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", whitespace: "pre-wrap", children: text })
  ] });
}
var COMPOSER_LABELS = {
  voice: "Tap to speak",
  type: "or type instead",
  placeholder: "Type your note\u2026",
  cancel: "Cancel",
  submit: "Add note"
};
function CandidateNoteComposer({
  onVoice,
  onSubmit,
  suggestions = [],
  labels,
  ...props
}) {
  const copy = { ...COMPOSER_LABELS, ...labels };
  const [typing, setTyping] = _react.useState.call(void 0, false);
  const [text, setText] = _react.useState.call(void 0, "");
  const [saving, setSaving] = _react.useState.call(void 0, false);
  const submit = async (note) => {
    const trimmed = note.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await onSubmit(trimmed);
      setText("");
      setTyping(false);
    } catch (e) {
    } finally {
      setSaving(false);
    }
  };
  if (typing) {
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-note-composer", direction: "vertical", gap: "sm", marginTop: "md", ...props, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        _textarea.Textarea,
        {
          resize: "none",
          placeholder: copy.placeholder,
          value: text,
          onChange: (event) => setText(event.target.value),
          autoFocus: true
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", variant: "ghost", onClick: () => {
          setTyping(false);
          setText("");
        }, children: copy.cancel }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", onClick: () => void submit(text), disabled: !text.trim() || saving, children: saving ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: "sm", spin: true }) : copy.submit })
      ] })
    ] });
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-note-composer", direction: "vertical", gap: "sm", marginTop: "md", ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", align: "center", paddingY: "md", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "outline", size: "voice", "aria-label": copy.voice, onClick: () => _optionalChain([onVoice, 'optionalCall', _3 => _3()]), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Mic, size: 28, tone: "muted" }) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", size: "sm", weight: "medium", children: copy.voice }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "quiet", size: "bare", onClick: () => setTyping(true), children: copy.type })
    ] }),
    suggestions.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", justify: "center", wrap: true, children: suggestions.map((suggestion) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _button.Button,
      {
        type: "button",
        variant: "outline-muted",
        size: "suggestion",
        onClick: () => void submit(suggestion),
        children: suggestion
      },
      suggestion
    )) })
  ] });
}





exports.CandidateNoteList = CandidateNoteList; exports.CandidateNoteCard = CandidateNoteCard; exports.CandidateNoteComposer = CandidateNoteComposer;
