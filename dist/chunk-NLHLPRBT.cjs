"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-outreach-composer.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _textarea = require('@epicbagel/saas-kit/primitives/textarea');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function present(value) {
  return value != null && value !== false && value !== "";
}
var LABELS = {
  title: "Outreach",
  guidanceHeading: (channel) => `${channel} tone`,
  reset: "Reset default",
  cancel: "Cancel",
  save: "Save",
  custom: "custom",
  draft: (channel) => `Draft ${channel} message`,
  drafting: "Drafting...",
  subject: "Subject: ",
  tone: "Tone: ",
  redo: "Redo",
  copy: "Copy",
  copied: "Copied"
};
function CandidateOutreachComposer({
  channels,
  channel,
  onChannelChange,
  guidance,
  draft,
  drafting = false,
  error,
  copied = false,
  onDraft,
  onCopy,
  onEditDraft,
  labels,
  border = "bottom",
  ...props
}) {
  const wording = { ...LABELS, ...labels };
  const channelLabel = _nullishCoalesce(_optionalChain([channels, 'access', _ => _.find, 'call', _2 => _2((option) => option.value === channel), 'optionalAccess', _3 => _3.label]), () => ( channel));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-outreach-composer", border, ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _sectionheader.SectionHeader,
      {
        label: wording.title,
        action: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", children: channels.map((option) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _button.Button,
          {
            variant: channel === option.value ? "default" : "outline",
            size: "compact",
            onClick: () => onChannelChange(option.value),
            children: option.label
          },
          option.value
        )) })
      }
    ),
    guidance.editing ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "vertical", gap: "xs", marginBottom: "md", radius: "md", border: "dashed", padding: "sm", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "none", align: "center", justify: "between", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "micro", as: "span", weight: "medium", tone: "muted", transform: "uppercase", children: wording.guidanceHeading(channelLabel) }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "link-muted", size: "bare", onClick: () => guidance.onReset(), children: wording.reset })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        _textarea.Textarea,
        {
          value: guidance.value,
          onChange: (event) => guidance.onChange(event.target.value),
          rows: 2,
          textSize: "xs",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", justify: "end", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "micro", variant: "ghost", onClick: () => guidance.onCancel(), children: wording.cancel }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _button.Button,
          {
            size: "micro",
            onClick: () => guidance.onSave(),
            disabled: !!guidance.saving || guidance.canSave === false,
            children: guidance.saving ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: "xs", spin: true }) : wording.save
          }
        )
      ] })
    ] }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { type: "button", variant: "quiet", size: "tone", onClick: () => guidance.onEdit(), children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Settings2, size: "xs", tone: "muted" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "micro", as: "span", tone: "muted", truncate: true, grow: true, align: "start", children: guidance.text }),
      guidance.custom && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { as: "span", variant: "info", size: "tiny", weight: "normal", shrink: true, children: wording.custom })
    ] }),
    !draft ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { variant: "outline", size: "sm", width: "full", onClick: () => onDraft(), disabled: drafting, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: drafting ? _lucidereact.Loader2 : _lucidereact.MessageSquare, size: "sm", spin: drafting }),
      drafting ? wording.drafting : wording.draft(channelLabel)
    ] }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "vertical", gap: "sm", children: [
      draft.subject != null && draft.subject !== false && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { as: "div", variant: "inherit", size: "xs", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", tone: "muted", children: wording.subject }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", weight: "medium", children: draft.subject })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _textarea.Textarea, { value: draft.message, onChange: (event) => onEditDraft(event.target.value), rows: 6, textSize: "xs" }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "none", align: "center", justify: "between", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "micro", as: "span", tone: "muted", children: present(draft.tone) ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          wording.tone,
          draft.tone
        ] }) : null }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { variant: "outline", size: "compact", onClick: () => onDraft(), disabled: drafting, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: drafting ? _lucidereact.Loader2 : _lucidereact.RefreshCw, size: "xs", spin: drafting, marginEnd: "md" }),
            wording.redo
          ] }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { variant: "default", size: "compact", onClick: () => onCopy(), children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: copied ? _lucidereact.Check : _lucidereact.Copy, size: "xs", marginEnd: "md" }),
            copied ? wording.copied : wording.copy
          ] })
        ] })
      ] })
    ] }),
    present(error) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "destructive", marginTop: "xs", children: error })
  ] });
}



exports.CandidateOutreachComposer = CandidateOutreachComposer;
