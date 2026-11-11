// src/recruit/job-search-progress.tsx
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Timeline, TimelineRow } from "@epicbagel/saas-kit/primitives/timeline";
import { Check, Circle, CircleDot } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  done: "Done",
  current: "In progress",
  upcoming: "Not started"
};
var GLYPHS = { done: Check, current: CircleDot, upcoming: Circle };
function JobSearchProgress({ steps, labels, ...props }) {
  const text = { ...DEFAULT_LABELS, ...labels };
  return /* @__PURE__ */ jsx(Stack, { as: "section", "data-slot": "job-search-progress", gap: "none", ...props, children: /* @__PURE__ */ jsx(Timeline, { spacing: "tight", children: /* @__PURE__ */ jsx("ol", { className: "m-0 list-none space-y-2 p-0", children: steps.map((step) => /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "job-search-step",
      "data-state": step.state,
      "aria-current": step.state === "current" ? "step" : void 0,
      children: /* @__PURE__ */ jsx(
        TimelineRow,
        {
          surface: step.state === "current" ? "muted" : "transparent",
          icon: /* @__PURE__ */ jsxs(
            Text,
            {
              as: "span",
              variant: "inherit",
              tone: step.state === "upcoming" ? "muted" : void 0,
              children: [
                /* @__PURE__ */ jsx(Icon, { icon: GLYPHS[step.state], size: "sm" }),
                /* @__PURE__ */ jsxs("span", { className: "sr-only", children: [
                  text[step.state],
                  ": "
                ] })
              ]
            }
          ),
          title: /* @__PURE__ */ jsx(
            Text,
            {
              as: "span",
              variant: "inherit",
              weight: step.state === "current" ? "semibold" : void 0,
              tone: step.state === "upcoming" ? "muted" : void 0,
              children: step.title
            }
          ),
          subtitle: step.description,
          timestamp: step.meta,
          children: step.action != null && step.action !== false ? /* @__PURE__ */ jsx(Stack, { direction: "horizontal", gap: "sm", wrap: true, marginTop: "sm", children: step.action }) : null
        }
      )
    },
    step.id
  )) }) }) });
}

export {
  JobSearchProgress
};
