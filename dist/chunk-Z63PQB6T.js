// src/recruit/candidate-review-action-row.tsx
import { Grid } from "@epicbagel/saas-kit/primitives/grid";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { jsx } from "react/jsx-runtime";
function CandidateReviewActionRow({
  children,
  isolateClicks = false,
  layout = "inline",
  gap = "sm",
  ...props
}) {
  const onClick = isolateClicks ? (event) => event.stopPropagation() : void 0;
  return /* @__PURE__ */ jsx(
    PanelSection,
    {
      "data-slot": "candidate-review-action-row",
      padding: "none",
      paddingX: "lg",
      paddingTop: "md",
      paddingBottom: "xs",
      ...props,
      children: layout === "split" ? /* @__PURE__ */ jsx(
        Grid,
        {
          columns: 2,
          responsive: false,
          gap: "compact",
          layout: "responsive-actions",
          onClick,
          children
        }
      ) : /* @__PURE__ */ jsx(
        Stack,
        {
          "data-slot": "candidate-review-action-row-controls",
          direction: "horizontal",
          gap,
          align: "center",
          wrap: true,
          border: "top",
          paddingTop: "md",
          onClick,
          children
        }
      )
    }
  );
}

export {
  CandidateReviewActionRow
};
