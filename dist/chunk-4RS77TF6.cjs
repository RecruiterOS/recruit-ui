"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/recruit/candidate-fact-list.tsx
var _definitionlist = require('@epicbagel/saas-kit/primitives/definition-list');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _list = require('@epicbagel/saas-kit/primitives/list');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function CandidateFactList({
  title = "Facts",
  facts,
  border = "bottom",
  ...props
}) {
  if (facts.length === 0) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-fact-list", border, ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { icon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.History, size: "xs" }), label: title, count: facts.length }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionList, { children: facts.map((fact) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _definitionlist.DefinitionItem,
      {
        label: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", transform: "capitalize", children: fact.label }),
        children: fact.value
      },
      fact.id
    )) })
  ] });
}
function formatFactValue(value) {
  if (value === null || value === void 0) return "\u2014";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "\u2014";
    if (typeof value[0] === "string" || typeof value[0] === "number") return value.join(", ");
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.List, { spacing: "tight", children: value.map((item, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.ListItem, { textSize: "sm", children: formatSingleObject(item) }, index)) });
  }
  if (typeof value === "object") return formatSingleObject(value);
  return String(value);
}
function formatSingleObject(value) {
  if (!value || typeof value !== "object") return String(_nullishCoalesce(value, () => ( "\u2014")));
  const entries = Object.entries(value).filter(
    ([key, item]) => item !== null && item !== void 0 && item !== "" && key !== "color" && key !== "sentiment"
  );
  const [first] = entries;
  if (!first) return "\u2014";
  if (entries.length === 1) return formatLeaf(first[1]);
  return entries.map(([key, item], index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { variant: "inherit", as: "span", children: [
    index > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", tone: "muted", children: " \xB7 " }),
    formatLeaf(item)
  ] }, key));
}
function formatLeaf(value) {
  if (value === null || value === void 0) return "";
  if (typeof value === "string") return value.replace(/^null$/i, "").trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.filter(Boolean).map(String).join(", ");
  if (typeof value === "object") {
    return Object.values(value).filter((item) => item != null && item !== "").map(formatLeaf).filter(Boolean).join(" \xB7 ");
  }
  return String(value);
}




exports.CandidateFactList = CandidateFactList; exports.formatFactValue = formatFactValue;
