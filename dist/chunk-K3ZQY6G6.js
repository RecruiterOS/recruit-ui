import {
  FlexItem
} from "./chunk-GH26CGAD.js";
import {
  Text
} from "./chunk-BUGVD7FT.js";
import {
  PanelSection
} from "./chunk-BS52KYLO.js";
import {
  Stack
} from "./chunk-PPARPLPM.js";

// src/recruit/candidate-quote.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateQuote({
  children,
  attribution,
  action,
  lineClamp,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    PanelSection,
    {
      as: "blockquote",
      "data-slot": "candidate-quote",
      padding: "default",
      ...props,
      children: [
        /* @__PURE__ */ jsxs(Text, { as: "div", variant: "muted", size: "sm", italic: true, lineClamp, children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "\u201C" }),
          children,
          /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "\u201D" })
        ] }),
        attribution != null || action != null ? /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "compact", align: "center", marginTop: "sm", children: [
          /* @__PURE__ */ jsx(FlexItem, { grow: true, minWidth: "zero", children: attribution != null ? /* @__PURE__ */ jsxs(Text, { as: "span", variant: "caption", size: "xs", tone: "subtle", children: [
            /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "\u2014 " }),
            attribution
          ] }) : null }),
          action
        ] }) : null
      ]
    }
  );
}

export {
  CandidateQuote
};
