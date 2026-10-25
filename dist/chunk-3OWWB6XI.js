// src/recruit/candidate-pending-note.tsx
import { AgentComment } from "@epicbagel/saas-kit/primitives/agent-comment";
import { Callout } from "@epicbagel/saas-kit/primitives/callout";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidatePendingNote({
  text,
  timeLabel,
  agent,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      "data-slot": "candidate-pending-note",
      direction: "vertical",
      gap: "xs",
      padding: "card-footer",
      ...props,
      children: [
        /* @__PURE__ */ jsx(Callout, { tone: "warning", padding: "compact", children: /* @__PURE__ */ jsxs(Text, { size: "sm", italic: true, tone: "warning", children: [
          "\u201C",
          text,
          "\u201D",
          /* @__PURE__ */ jsxs(Text, { variant: "inherit", as: "span", size: "xs", italic: false, marginStart: "sm", children: [
            "\u2014 ",
            timeLabel
          ] })
        ] }) }),
        agent?.thinking ? /* @__PURE__ */ jsx(AgentComment, { agent: agent.name, thinking: true, children: "" }) : agent?.message != null && agent.message !== false && agent.message !== "" ? /* @__PURE__ */ jsx(AgentComment, { agent: agent.name, children: agent.message }) : null
      ]
    }
  );
}

export {
  CandidatePendingNote
};
