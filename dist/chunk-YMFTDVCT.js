import {
  CandidateCoverHeader
} from "./chunk-KL7C75ZR.js";

// src/recruit/candidate-profile.tsx
import { cn } from "@epicbagel/saas-kit/lib/utils";
import { ContactHeader } from "@epicbagel/saas-kit/primitives/contact-header";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
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
function ProfileIdentity({
  level,
  avatar,
  name,
  status,
  meta,
  actions
}) {
  if (level === 1) {
    return /* @__PURE__ */ jsx(
      ContactHeader,
      {
        avatar,
        name,
        status,
        meta,
        actions,
        spacing: "none"
      }
    );
  }
  return /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "md", align: "start", children: [
    avatar ? /* @__PURE__ */ jsx(FlexItem, { shrink: false, children: avatar }) : null,
    /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
      /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "compact", align: "start", justify: "between", children: [
        /* @__PURE__ */ jsx(Heading, { level: 2, as: `h${level}`, className: "min-w-0 text-xl md:text-2xl", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex min-w-0 max-w-full items-center gap-2", children: [
          name,
          status
        ] }) }),
        actions ? /* @__PURE__ */ jsx(Stack, { direction: "horizontal", align: "center", shrink: false, className: "gap-1.5", children: actions }) : null
      ] }),
      meta ? /* @__PURE__ */ jsx(Stack, { direction: "horizontal", align: "center", wrap: true, className: "mt-1.5 gap-1.5", children: meta }) : null
    ] })
  ] });
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
  titleLevel = 1,
  className,
  ...props
}) {
  const aside = actionsPlacement === "aside" && actions != null;
  const identity = /* @__PURE__ */ jsx(
    ProfileIdentity,
    {
      level: titleLevel,
      avatar,
      name,
      status,
      meta,
      actions: aside ? void 0 : actions
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
