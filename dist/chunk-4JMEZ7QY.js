// src/recruit/candidate-card-columns-toggle.tsx
import { useLayoutPreference } from "@epicbagel/saas-kit/hooks/use-layout-preference";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { ResponsiveView } from "@epicbagel/saas-kit/primitives/responsive-view";
import { ToggleGroup, ToggleGroupItem } from "@epicbagel/saas-kit/primitives/toggle-group";
import { Columns2, Rows3 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
function useCandidateCardColumns(viewId) {
  const { layout, setLayout } = useLayoutPreference(viewId);
  const columns = layout === "comfortable" ? 1 : 2;
  return {
    columns,
    setColumns: (next) => setLayout(next === 1 ? "comfortable" : "compact")
  };
}
var DEFAULT_LABELS = {
  group: "Cards per row",
  one: "One card per row",
  two: "Two cards per row"
};
function CandidateCardColumnsToggle({
  columns,
  onChange,
  roomy = false,
  labels,
  className
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const value = columns === 1 ? "one" : "two";
  return /* @__PURE__ */ jsx(
    ResponsiveView,
    {
      mobile: null,
      desktop: /* @__PURE__ */ jsxs(
        ToggleGroup,
        {
          type: "single",
          value,
          onValueChange: (next) => {
            if (next === "one") onChange(1);
            if (next === "two") onChange(2);
          },
          variant: "outline",
          size: roomy ? "icon-lg" : "icon",
          "aria-label": text.group,
          "data-slot": "candidate-card-columns-toggle",
          className,
          children: [
            /* @__PURE__ */ jsx(ToggleGroupItem, { value: "one", "aria-label": text.one, title: text.one, children: /* @__PURE__ */ jsx(Icon, { icon: Rows3, size: "sm" }) }),
            /* @__PURE__ */ jsx(ToggleGroupItem, { value: "two", "aria-label": text.two, title: text.two, children: /* @__PURE__ */ jsx(Icon, { icon: Columns2, size: "sm" }) })
          ]
        }
      )
    }
  );
}

export {
  useCandidateCardColumns,
  CandidateCardColumnsToggle
};
