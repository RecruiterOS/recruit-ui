// src/recruit/candidate-quote.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function CandidateQuote({
  children,
  attribution,
  action,
  lineClamp,
  collapsible,
  ...props
}) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = collapsible?.threshold == null || typeof children !== "string" || children.length > collapsible.threshold;
  const clamp = collapsible ? expanded ? void 0 : collapsible.lines : lineClamp;
  const toggle = collapsible != null && canExpand ? /* @__PURE__ */ jsx(
    Button,
    {
      type: "button",
      variant: "link",
      size: "bare",
      shrink: true,
      onClick: (event) => {
        event.stopPropagation();
        setExpanded((value) => !value);
      },
      children: expanded ? collapsible.lessLabel : collapsible.moreLabel
    }
  ) : null;
  const actions = action != null && toggle != null ? /* @__PURE__ */ jsxs(Fragment, { children: [
    action,
    toggle
  ] }) : action ?? toggle;
  return /* @__PURE__ */ jsxs(
    PanelSection,
    {
      as: "blockquote",
      "data-slot": "candidate-quote",
      padding: "default",
      ...props,
      children: [
        /* @__PURE__ */ jsxs(Text, { as: "div", variant: "muted", size: "sm", italic: true, lineClamp: clamp, children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "\u201C" }),
          children,
          /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "\u201D" })
        ] }),
        attribution != null || actions != null ? /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "compact", align: "center", marginTop: "sm", children: [
          /* @__PURE__ */ jsx(FlexItem, { grow: true, minWidth: "zero", children: attribution != null ? /* @__PURE__ */ jsxs(Text, { as: "span", variant: "caption", size: "xs", tone: "subtle", children: [
            /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "\u2014 " }),
            attribution
          ] }) : null }),
          actions
        ] }) : null
      ]
    }
  );
}

export {
  CandidateQuote
};
