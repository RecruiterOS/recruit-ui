// src/recruit/candidate-shortlist.tsx
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { UsersRound } from "lucide-react";
import { Children, useId } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateShortlist({
  title,
  eyebrow,
  description,
  status,
  count,
  children,
  footer,
  empty = { title: "No candidates shortlisted yet" },
  ...props
}) {
  const titleId = useId();
  const isEmpty = count === void 0 ? Children.toArray(children).length === 0 : count === 0;
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      as: "section",
      "data-slot": "candidate-shortlist",
      "aria-labelledby": titleId,
      gap: "md",
      width: "full",
      ...props,
      children: [
        /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "md", align: "start", justify: "between", children: [
          /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
            eyebrow ? /* @__PURE__ */ jsx(Text, { variant: "eyebrow", children: eyebrow }) : null,
            /* @__PURE__ */ jsx(Heading, { id: titleId, level: 2, children: title }),
            description ? /* @__PURE__ */ jsx(Text, { variant: "muted", children: description }) : null
          ] }),
          status
        ] }),
        isEmpty ? /* @__PURE__ */ jsx(
          EmptyState,
          {
            variant: "empty",
            size: "inline",
            icon: UsersRound,
            title: empty.title,
            description: empty.description ?? ""
          }
        ) : /* @__PURE__ */ jsx(Stack, { gap: "md", children }),
        isEmpty ? null : footer
      ]
    }
  );
}

export {
  CandidateShortlist
};
