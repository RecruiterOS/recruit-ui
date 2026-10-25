// src/recruit/candidate-suggested-roles-panel.tsx
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { BriefcaseBusiness } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateSuggestedRolesPanel({
  count,
  title = "Suggested roles",
  description,
  empty = { title: "No suggested roles yet" },
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(PanelSection, { "data-slot": "candidate-suggested-roles-panel", ...props, children: [
    /* @__PURE__ */ jsx(SectionHeader, { label: title, count }),
    description != null && description !== false && /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", marginBottom: "md", children: description }),
    count > 0 ? children : /* @__PURE__ */ jsx(
      EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: BriefcaseBusiness,
        title: empty.title,
        description: empty.description
      }
    )
  ] });
}

export {
  CandidateSuggestedRolesPanel
};
