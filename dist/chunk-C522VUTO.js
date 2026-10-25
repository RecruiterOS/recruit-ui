import {
  CandidateCoverHeader
} from "./chunk-G4E57GP4.js";

// src/recruit/candidate-profile.tsx
import { cn } from "@epicbagel/saas-kit/lib/utils";
import { ContactHeader } from "@epicbagel/saas-kit/primitives/contact-header";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateProfile({
  header,
  children,
  footer,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      as: "article",
      "data-slot": "candidate-profile",
      gap: "none",
      surface: "card",
      radius: "xl",
      overflow: "hidden",
      className,
      ...props,
      children: [
        header,
        children,
        footer
      ]
    }
  );
}
function CandidateProfileHeader({
  name,
  avatar,
  cover,
  eyebrow,
  status,
  meta,
  summary,
  actions,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CandidateCoverHeader,
    {
      cover,
      padding: "lg",
      "data-slot": "candidate-profile-header",
      className,
      ...props,
      children: /* @__PURE__ */ jsxs(Stack, { gap: "sm", children: [
        eyebrow != null ? /* @__PURE__ */ jsx(Text, { variant: "eyebrow", children: eyebrow }) : null,
        /* @__PURE__ */ jsx(
          ContactHeader,
          {
            avatar,
            name,
            status,
            meta,
            actions,
            spacing: "none"
          }
        ),
        summary != null ? /* @__PURE__ */ jsx(Text, { variant: "muted", size: "sm", children: summary }) : null
      ] })
    }
  );
}
function CandidateProfileBody({
  children,
  divided = false,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    PanelSection,
    {
      as: "div",
      "data-slot": "candidate-profile-body",
      border: "top",
      className: cn(divided && "divide-y", className),
      ...props,
      children
    }
  );
}
function CandidateProfileFooter({
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    PanelSection,
    {
      as: "footer",
      "data-slot": "candidate-profile-footer",
      border: "top",
      layout: "row",
      gap: "sm",
      ...props,
      children
    }
  );
}

export {
  CandidateProfile,
  CandidateProfileHeader,
  CandidateProfileBody,
  CandidateProfileFooter
};
