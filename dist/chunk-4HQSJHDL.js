import {
  CandidateCoverHeader
} from "./chunk-NBAJDT3O.js";

// src/recruit/candidate-profile.tsx
import { cn } from "@epicbagel/saas-kit/lib/utils";
import { ContactHeader } from "@epicbagel/saas-kit/primitives/contact-header";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateProfile({
  header,
  children,
  footer,
  printMode = "default",
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
      className: cn(printMode === "flat" && "print:border-0 print:shadow-none", className),
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
  actionsPlacement = "name",
  padding = "lg",
  className,
  ...props
}) {
  const aside = actionsPlacement === "aside" && actions != null;
  const identity = /* @__PURE__ */ jsx(
    ContactHeader,
    {
      avatar,
      name,
      status,
      meta,
      actions: aside ? void 0 : actions,
      spacing: "none"
    }
  );
  return /* @__PURE__ */ jsx(
    CandidateCoverHeader,
    {
      cover,
      padding,
      "data-slot": "candidate-profile-header",
      className,
      ...props,
      children: /* @__PURE__ */ jsxs(Stack, { gap: "sm", children: [
        eyebrow != null ? /* @__PURE__ */ jsx(Text, { variant: "eyebrow", children: eyebrow }) : null,
        aside ? /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "start", children: [
          /* @__PURE__ */ jsx(FlexItem, { grow: true, minWidth: "zero", children: identity }),
          /* @__PURE__ */ jsx(
            Stack,
            {
              "data-slot": "candidate-profile-header-actions",
              direction: "horizontal",
              gap: "xs",
              align: "center",
              shrink: false,
              children: actions
            }
          )
        ] }) : identity,
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
var FOOTER_JUSTIFY = {
  start: "",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between"
};
function CandidateProfileFooter({
  children,
  justify = "start",
  padding = "default",
  printVisibility = "visible",
  className,
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
      padding,
      className: cn(
        FOOTER_JUSTIFY[justify],
        printVisibility === "hidden" && "print:hidden",
        className
      ),
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
