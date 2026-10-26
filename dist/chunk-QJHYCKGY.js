import {
  CandidateCareerHistoryTimeline
} from "./chunk-QYAUTU7L.js";

// src/recruit/candidate-career-history-panel.tsx
import { ScrollArea } from "@epicbagel/saas-kit/primitives/scroll-area";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateCareerHistoryPanel({
  title = "Career history",
  items,
  loading = false,
  empty,
  detailedCompanyGroups,
  locale,
  scroll = "viewport",
  ...props
}) {
  const timeline = /* @__PURE__ */ jsx(
    CandidateCareerHistoryTimeline,
    {
      items,
      loading,
      empty,
      detailedCompanyGroups,
      locale
    }
  );
  return /* @__PURE__ */ jsxs(Stack, { direction: "vertical", gap: "md", "data-slot": "candidate-career-history-panel", ...props, children: [
    /* @__PURE__ */ jsx(SectionHeader, { label: title, count: loading ? void 0 : items.length }),
    scroll === "none" ? timeline : /* @__PURE__ */ jsx(ScrollArea, { "data-slot": "career-history-scroll", maxHeight: "viewport", paddingEnd: "sm", children: timeline })
  ] });
}

export {
  CandidateCareerHistoryPanel
};
