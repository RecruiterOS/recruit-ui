import {
  Text
} from "./chunk-BUGVD7FT.js";
import {
  CandidateCoverHeader
} from "./chunk-THJB574S.js";
import {
  PanelSection
} from "./chunk-BS52KYLO.js";
import {
  Stack
} from "./chunk-PPARPLPM.js";
import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/contact-header.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function ContactHeader({
  avatar,
  name,
  status,
  meta,
  actions,
  onClose,
  closeLabel = "Close",
  className,
  spacing = "default"
}) {
  const hasTrailing = !!actions || !!onClose;
  return /* @__PURE__ */ jsxs("div", { className: cn("flex items-start gap-4", spacing === "default" && "mb-6", className), children: [
    avatar && /* @__PURE__ */ jsx("div", { className: "shrink-0", children: avatar }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsx("h1", { className: "min-w-0 text-xl font-semibold tracking-tight md:text-2xl", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex min-w-0 max-w-full items-center gap-2", children: [
          name,
          status
        ] }) }),
        hasTrailing && /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [
          actions,
          onClose && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "aria-label": closeLabel,
              className: "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  className: "h-4 w-4",
                  "aria-hidden": true,
                  children: /* @__PURE__ */ jsx("path", { d: "M18 6 6 18M6 6l12 12" })
                }
              )
            }
          )
        ] })
      ] }),
      meta && /* @__PURE__ */ jsx("div", { className: "mt-1.5 flex flex-wrap items-center gap-1.5", children: meta })
    ] })
  ] });
}

// src/recruit/candidate-profile.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function CandidateProfile({
  header,
  children,
  footer,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs2(
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
  return /* @__PURE__ */ jsx2(
    CandidateCoverHeader,
    {
      cover,
      padding: "lg",
      "data-slot": "candidate-profile-header",
      className,
      ...props,
      children: /* @__PURE__ */ jsxs2(Stack, { gap: "sm", children: [
        eyebrow != null ? /* @__PURE__ */ jsx2(Text, { variant: "eyebrow", children: eyebrow }) : null,
        /* @__PURE__ */ jsx2(
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
        summary != null ? /* @__PURE__ */ jsx2(Text, { variant: "muted", size: "sm", children: summary }) : null
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
  return /* @__PURE__ */ jsx2(
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
  return /* @__PURE__ */ jsx2(
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
