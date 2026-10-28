"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkK3VUGGWHcjs = require('./chunk-K3VUGGWH.cjs');


var _chunkKTFEHL5Xcjs = require('./chunk-KTFEHL5X.cjs');


var _chunkD5BXTRVNcjs = require('./chunk-D5BXTRVN.cjs');

// src/recruit/candidate-inline-card.tsx
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _interactivecard = require('@epicbagel/saas-kit/primitives/interactive-card');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var META_LINE_GLYPHS = "[&>svg]:inline-block [&>svg]:align-[-0.125em] [&>svg]:me-1.5";
function CandidateInlineCard({
  name,
  avatar,
  cover,
  coverSize = "default",
  headline,
  meta,
  assessment,
  status,
  actions,
  selected = false,
  subdued = false,
  onSelect,
  selectLabel = "Open candidate profile",
  density = "comfortable",
  nameSize = "default",
  headlineWrap = false,
  actionsAlign = "start",
  "aria-expanded": ariaExpanded,
  className,
  ...props
}) {
  const generatedId = _react.useId.call(void 0, );
  const nameId = `${generatedId}-name`;
  const actionId = `${generatedId}-action`;
  const compact = density === "compact";
  const centreActions = !compact && actionsAlign === "center";
  const hasCover = cover != null;
  const handleSelect = onSelect ? (event) => {
    if (!event.defaultPrevented && _chunkK3VUGGWHcjs.shouldActivateCandidateCard.call(void 0, event)) onSelect();
  } : void 0;
  const content = /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      "data-slot": "candidate-inline-card-content",
      className: compact ? hasCover ? "px-3 py-2" : "h-full px-3 py-2" : "px-5 py-4",
      onClick: hasCover ? void 0 : handleSelect,
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        _stack.Stack,
        {
          direction: "horizontal",
          gap: compact ? "sm" : "compact",
          align: compact ? "center" : "start",
          height: compact && !hasCover ? "full" : "auto",
          children: [
            avatar,
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", wrap: !compact, children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  _heading.Heading,
                  {
                    id: nameId,
                    level: 5,
                    appearance: compact ? "compact" : nameSize === "lg" ? "section" : "default",
                    truncate: true,
                    children: name
                  }
                ),
                status
              ] }),
              headline != null ? (
                // A compact row is a fixed height: the caption's relaxed leading would push the lines apart.
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  _text.Text,
                  {
                    "data-slot": "candidate-inline-card-headline",
                    variant: "caption",
                    size: compact ? "xs" : "sm",
                    leading: compact ? "snug" : "normal",
                    truncate: compact || !headlineWrap,
                    marginTop: compact ? "none" : "tight",
                    children: headline
                  }
                )
              ) : null,
              meta != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _text.Text,
                {
                  "data-slot": "candidate-inline-card-meta",
                  variant: "caption",
                  size: "xs",
                  leading: compact ? "snug" : "normal",
                  truncate: compact,
                  marginTop: compact ? "none" : "xs",
                  className: META_LINE_GLYPHS,
                  children: meta
                }
              ) : null,
              assessment != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { gap: "none", marginTop: compact ? "sm" : "md", children: assessment }) : null
            ] }),
            actions != null ? (
              // No box of its own, so the actions stay items of the row; it
              // only carries a compact row's touch targets, or the centring, to
              // its controls.
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "div",
                {
                  "data-slot": "candidate-inline-card-actions",
                  className: compact ? `contents ${_chunkD5BXTRVNcjs.COARSE_POINTER_TOUCH_TARGETS_WITHIN}` : centreActions ? "contents [&>*]:self-center" : "contents",
                  children: actions
                }
              )
            ) : null
          ]
        }
      )
    }
  );
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _interactivecard.InteractiveCard,
    {
      as: "article",
      "data-slot": "candidate-inline-card",
      "data-density": density,
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
        hasCover ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkKTFEHL5Xcjs.CandidateCoverHeader,
          {
            cover,
            coverSize,
            padding: "none",
            className: "rounded-[inherit]",
            onClick: handleSelect,
            children: content
          }
        ) : content
      ]
    }
  );
}



exports.CandidateInlineCard = CandidateInlineCard;
