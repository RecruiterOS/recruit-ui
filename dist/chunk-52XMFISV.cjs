"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _chunk5ZGBOOWMcjs = require('./chunk-5ZGBOOWM.cjs');


var _chunkJIEUQ5CKcjs = require('./chunk-JIEUQ5CK.cjs');


var _chunk52HKAJMEcjs = require('./chunk-52HKAJME.cjs');


var _chunkRTB3COSUcjs = require('./chunk-RTB3COSU.cjs');


var _chunkYMPXXC7Bcjs = require('./chunk-YMPXXC7B.cjs');

// src/recruit/candidate-inline-card.tsx
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function CandidateInlineCard({
  name,
  avatar,
  headline,
  meta,
  assessment,
  status,
  actions,
  selected = false,
  subdued = false,
  onSelect,
  selectLabel = "Open candidate profile",
  "aria-expanded": ariaExpanded,
  className,
  ...props
}) {
  const generatedId = _react.useId.call(void 0, );
  const nameId = `${generatedId}-name`;
  const actionId = `${generatedId}-action`;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _chunk5ZGBOOWMcjs.InteractiveCard,
    {
      as: "article",
      "data-slot": "candidate-inline-card",
      selected,
      borderWidth: "thin",
      padding: "none",
      opacity: subdued ? "subdued" : "full",
      className,
      ...props,
      children: [
        onSelect ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "button",
          {
            type: "button",
            "data-slot": "candidate-inline-card-trigger",
            "aria-label": selectLabel === "Open candidate profile" ? void 0 : selectLabel,
            "aria-labelledby": selectLabel === "Open candidate profile" ? `${actionId} ${nameId}` : void 0,
            "aria-current": selected || void 0,
            "aria-expanded": ariaExpanded,
            className: "pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-0 bg-transparent p-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            onClick: onSelect,
            children: selectLabel === "Open candidate profile" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: actionId, className: "sr-only", children: selectLabel }) : null
          }
        ) : null,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            "data-slot": "candidate-inline-card-content",
            className: "px-5 py-4",
            onClick: onSelect ? (event) => {
              if (_chunk5ZGBOOWMcjs.shouldActivateCandidateCard.call(void 0, event)) onSelect();
            } : void 0,
            children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { direction: "horizontal", gap: "compact", align: "start", children: [
              avatar,
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkJIEUQ5CKcjs.FlexItem, { grow: true, minWidth: "zero", children: [
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { direction: "horizontal", gap: "sm", align: "center", wrap: true, children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk52HKAJMEcjs.Heading, { id: nameId, level: 5, truncate: true, children: name }),
                  status
                ] }),
                headline != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkRTB3COSUcjs.Text, { variant: "caption", size: "sm", truncate: true, marginTop: "tight", children: headline }) : null,
                meta != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkRTB3COSUcjs.Text, { variant: "caption", size: "xs", marginTop: "xs", children: meta }) : null,
                assessment != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkYMPXXC7Bcjs.Stack, { gap: "none", marginTop: "md", children: assessment }) : null
              ] }),
              actions
            ] })
          }
        )
      ]
    }
  );
}



exports.CandidateInlineCard = CandidateInlineCard;
