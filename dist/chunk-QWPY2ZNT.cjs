"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/job-summary-card.tsx
var _definitionlist = require('@epicbagel/saas-kit/primitives/definition-list');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _interactivecard = require('@epicbagel/saas-kit/primitives/interactive-card');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _resourcecard = require('@epicbagel/saas-kit/primitives/resource-card');
var _spacer = require('@epicbagel/saas-kit/primitives/spacer');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _jsxruntime = require('react/jsx-runtime');
function shown(node) {
  return node != null && node !== false && node !== "";
}
function JobSummaryCard({
  title,
  subtitle,
  logo,
  badge,
  facts,
  onSelect,
  footer,
  footerAlign = "start",
  ...props
}) {
  const hasFooter = shown(footer);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _resourcecard.ResourceCard, { "data-slot": "job-summary-card", ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _interactivecard.InteractiveCard,
      {
        type: "button",
        display: "block",
        border: "none",
        joined: hasFooter ? "top" : "none",
        onClick: onSelect,
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { padding: "none", paddingX: "md", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", justify: "between", align: "center", wrap: true, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", basis: "sm", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", minWidth: "zero", children: [
              logo,
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { level: 3, as: "h3", children: title }),
                shown(subtitle) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", marginTop: "xs", children: subtitle }) : null
              ] })
            ] }) }),
            shown(badge) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { as: "span", minWidth: "zero", children: badge }) : null
          ] }) }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionList, { variant: "divided", inset: "lg", children: facts.map((fact) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: fact.label, children: fact.value }, fact.id)) }),
          hasFooter ? null : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _spacer.Spacer, { size: "lg" })
        ]
      }
    ),
    hasFooter ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _resourcecard.ResourceCardFooter, { align: footerAlign, wrap: true, children: footer }) : null
  ] });
}



exports.JobSummaryCard = JobSummaryCard;
