"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }


var _chunkK3VUGGWHcjs = require('./chunk-K3VUGGWH.cjs');


var _chunkDUEGVK55cjs = require('./chunk-DUEGVK55.cjs');

// src/recruit/candidate-relationship-card.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _countbadge = require('@epicbagel/saas-kit/primitives/count-badge');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _grid = require('@epicbagel/saas-kit/primitives/grid');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _interactivecard = require('@epicbagel/saas-kit/primitives/interactive-card');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function shown(node) {
  return node != null && node !== false && node !== "";
}
function Fact({ label, value, detail }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", minWidth: "zero", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", weight: "medium", transform: "uppercase", children: label }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", weight: "medium", lineClamp: 2, children: value }),
    shown(detail) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", lineClamp: 2, children: detail })
  ] });
}
function CandidateRelationshipCard({
  name,
  avatar,
  cover,
  verified = false,
  headline,
  company,
  location,
  actions,
  signal,
  facts,
  suggestion,
  note,
  selected = false,
  onSelect,
  onKeyDown,
  ...props
}) {
  const primaryTitle = suggestion ? _nullishCoalesce(suggestion.primaryTitle, () => ( (typeof suggestion.primary === "string" ? suggestion.primary : void 0))) : void 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _interactivecard.InteractiveCard,
    {
      as: _chunkK3VUGGWHcjs.CandidateCardRoot,
      height: "full",
      gap: "none",
      selected,
      clip: true,
      "data-slot": "candidate-relationship-card",
      ...props,
      ..._chunkK3VUGGWHcjs.candidateCardSelectProps.call(void 0, onSelect, { onKeyDown }),
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkDUEGVK55cjs.CandidateCoverHeader, { cover, padding: "lg", softenCoverUntilHover: true, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "md", align: "start", children: [
          avatar,
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { level: 3, truncate: true, children: name }),
              verified && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.CheckCircle, size: "sm", tone: "success" })
            ] }),
            shown(headline) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", truncate: true, children: headline }),
            (shown(company) || shown(location)) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", minWidth: "zero", children: [
              company,
              shown(location) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { variant: "inherit", as: "span", size: "sm", tone: "muted", truncate: true, children: [
                shown(company) && "\xB7 ",
                location
              ] })
            ] })
          ] }),
          actions
        ] }) }),
        signal && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { border: "top", gap: "xs", paddingX: "lg", paddingY: "md", surface: "muted", children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "between", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", weight: "medium", transform: "uppercase", children: signal.label }),
            signal.actions
          ] }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", weight: "medium", children: signal.summary }),
          shown(signal.more) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", children: signal.more })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { border: "top", padding: "lg", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _grid.Grid, { columns: 3, gap: "lg", responsive: true, children: facts.map((fact, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Fact, { label: fact.label, value: fact.value, detail: fact.detail }, _nullishCoalesce(fact.id, () => ( index)))) }) }),
        suggestion && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _button.Button,
          {
            variant: "ghost",
            size: "bare",
            width: "full",
            align: "start",
            onClick: (event) => {
              event.stopPropagation();
              suggestion.onOpen();
            },
            children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { border: "top", direction: "horizontal", gap: "sm", align: "center", padding: "lg", wrap: true, width: "full", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", weight: "medium", transform: "uppercase", children: suggestion.label }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { variant: "secondary", size: "compact", title: primaryTitle, children: suggestion.primary }),
              suggestion.grade,
              suggestion.more && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _countbadge.CountBadge, { value: suggestion.more.value, variant: "outline", title: suggestion.more.title })
            ] })
          }
        ),
        note && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { border: "top", gap: "sm", padding: "lg", surface: "muted", children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "between", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", weight: "medium", children: note.heading }),
            note.date
          ] }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", whitespace: "pre-wrap", lineClamp: 3, children: note.text })
        ] })
      ]
    }
  );
}



exports.CandidateRelationshipCard = CandidateRelationshipCard;
