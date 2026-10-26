// src/recruit/candidate-shortlist-note.tsx
import { Card } from "@epicbagel/saas-kit/primitives/card";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { RichText } from "@epicbagel/saas-kit/primitives/rich-text";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateShortlistNote({
  title,
  titleLevel = 2,
  avatar,
  meta,
  message,
  media,
  signature,
  action,
  ...props
}) {
  const hasAvatar = avatar != null && avatar !== false;
  const hasMeta = meta != null && meta !== false && meta !== "";
  const hasSignature = signature != null && signature !== false && signature !== "";
  const hasAction = action != null && action !== false;
  return /* @__PURE__ */ jsx(Card, { padding: "md", ...props, children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
    /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "md", align: "start", children: [
      hasAvatar ? /* @__PURE__ */ jsx(FlexItem, { shrink: false, children: avatar }) : null,
      /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
        /* @__PURE__ */ jsx(Heading, { level: 2, as: `h${titleLevel}`, className: "text-xl md:text-2xl", children: title }),
        hasMeta ? /* @__PURE__ */ jsx(Stack, { direction: "horizontal", align: "center", wrap: true, className: "mt-1.5 gap-1.5", children: meta }) : null
      ] })
    ] }),
    message != null && message !== false && message !== "" ? /* @__PURE__ */ jsx(RichText, { children: message }) : null,
    media,
    hasSignature || hasAction ? /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "md", align: "center", wrap: true, children: [
      hasSignature ? /* @__PURE__ */ jsx(Text, { variant: "caption", children: signature }) : null,
      action
    ] }) : null
  ] }) });
}

export {
  CandidateShortlistNote
};
