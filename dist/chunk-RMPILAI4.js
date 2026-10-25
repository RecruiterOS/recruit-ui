// src/recruit/job-summary-card.tsx
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { ResourceCard, ResourceCardFooter } from "@epicbagel/saas-kit/primitives/resource-card";
import { Spacer } from "@epicbagel/saas-kit/primitives/spacer";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { jsx, jsxs } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs(ResourceCard, { "data-slot": "job-summary-card", ...props, children: [
    /* @__PURE__ */ jsxs(
      InteractiveCard,
      {
        type: "button",
        display: "block",
        border: "none",
        joined: hasFooter ? "top" : "none",
        onClick: onSelect,
        children: [
          /* @__PURE__ */ jsx(PanelSection, { padding: "none", paddingX: "md", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", justify: "between", align: "center", wrap: true, children: [
            /* @__PURE__ */ jsx(FlexItem, { grow: true, minWidth: "zero", basis: "sm", children: /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", minWidth: "zero", children: [
              logo,
              /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
                /* @__PURE__ */ jsx(Heading, { level: 3, as: "h3", children: title }),
                shown(subtitle) ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", marginTop: "xs", children: subtitle }) : null
              ] })
            ] }) }),
            shown(badge) ? /* @__PURE__ */ jsx(Stack, { as: "span", minWidth: "zero", children: badge }) : null
          ] }) }),
          /* @__PURE__ */ jsx(DefinitionList, { variant: "divided", inset: "lg", children: facts.map((fact) => /* @__PURE__ */ jsx(DefinitionItem, { label: fact.label, children: fact.value }, fact.id)) }),
          hasFooter ? null : /* @__PURE__ */ jsx(Spacer, { size: "lg" })
        ]
      }
    ),
    hasFooter ? /* @__PURE__ */ jsx(ResourceCardFooter, { align: footerAlign, wrap: true, children: footer }) : null
  ] });
}

export {
  JobSummaryCard
};
