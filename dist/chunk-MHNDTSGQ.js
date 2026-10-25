// src/recruit/candidate-fact-list.tsx
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { History as HistoryIcon } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateFactList({
  title = "Facts",
  facts,
  border = "bottom",
  ...props
}) {
  if (facts.length === 0) return null;
  return /* @__PURE__ */ jsxs(PanelSection, { "data-slot": "candidate-fact-list", border, ...props, children: [
    /* @__PURE__ */ jsx(SectionHeader, { icon: /* @__PURE__ */ jsx(Icon, { icon: HistoryIcon, size: "xs" }), label: title, count: facts.length }),
    /* @__PURE__ */ jsx(DefinitionList, { children: facts.map((fact) => /* @__PURE__ */ jsx(
      DefinitionItem,
      {
        label: /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", transform: "capitalize", children: fact.label }),
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
    return /* @__PURE__ */ jsx(List, { spacing: "tight", children: value.map((item, index) => /* @__PURE__ */ jsx(ListItem, { textSize: "sm", children: formatSingleObject(item) }, index)) });
  }
  if (typeof value === "object") return formatSingleObject(value);
  return String(value);
}
function formatSingleObject(value) {
  if (!value || typeof value !== "object") return String(value ?? "\u2014");
  const entries = Object.entries(value).filter(
    ([key, item]) => item !== null && item !== void 0 && item !== "" && key !== "color" && key !== "sentiment"
  );
  const [first] = entries;
  if (!first) return "\u2014";
  if (entries.length === 1) return formatLeaf(first[1]);
  return entries.map(([key, item], index) => /* @__PURE__ */ jsxs(Text, { variant: "inherit", as: "span", children: [
    index > 0 && /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", tone: "muted", children: " \xB7 " }),
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

export {
  CandidateFactList,
  formatFactValue
};
