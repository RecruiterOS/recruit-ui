// src/recruit/candidate-call-list.tsx
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Phone } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateCallList({
  count,
  loading = false,
  title = "Calls",
  empty = { title: "No calls yet" },
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(PanelSection, { "data-slot": "candidate-call-list", ...props, children: [
    /* @__PURE__ */ jsx(SectionHeader, { label: title, count: loading ? void 0 : count }),
    loading ? /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "sm", marginTop: "md", children: /* @__PURE__ */ jsx(Skeleton, { preset: "card-sm", radius: "xl" }) }) : count === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: Phone,
        title: empty.title,
        description: empty.description
      }
    ) : /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "sm", marginTop: "md", children })
  ] });
}

export {
  CandidateCallList
};
