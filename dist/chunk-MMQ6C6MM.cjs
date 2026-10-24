"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkRTB3COSUcjs = require('./chunk-RTB3COSU.cjs');


var _chunkVCJ24CC5cjs = require('./chunk-VCJ24CC5.cjs');


var _chunkR52RM2CDcjs = require('./chunk-R52RM2CD.cjs');


var _chunkYMPXXC7Bcjs = require('./chunk-YMPXXC7B.cjs');


var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/contact-header.tsx
var _jsxruntime = require('react/jsx-runtime');
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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: _chunk42BCVSWNcjs.cn.call(void 0, "flex items-start gap-4", spacing === "default" && "mb-6", className), children: [
    avatar && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "shrink-0", children: avatar }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h1", { className: "min-w-0 text-xl font-semibold tracking-tight md:text-2xl", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { className: "inline-flex min-w-0 max-w-full items-center gap-2", children: [
          name,
          status
        ] }) }),
        hasTrailing && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "flex shrink-0 items-center gap-1.5", children: [
          actions,
          onClose && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "button",
            {
              type: "button",
              onClick: onClose,
              "aria-label": closeLabel,
              className: "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "svg",
                {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  className: "h-4 w-4",
                  "aria-hidden": true,
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M18 6 6 18M6 6l12 12" })
                }
              )
            }
          )
        ] })
      ] }),
      meta && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mt-1.5 flex flex-wrap items-center gap-1.5", children: meta })
    ] })
  ] });
}

// src/recruit/candidate-profile.tsx

function CandidateProfile({
  header,
  children,
  footer,
  className,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _chunkYMPXXC7Bcjs.Stack,
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkVCJ24CC5cjs.CandidateCoverHeader,
    {
      cover,
      padding: "lg",
      "data-slot": "candidate-profile-header",
      className,
      ...props,
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { gap: "sm", children: [
        eyebrow != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkRTB3COSUcjs.Text, { variant: "eyebrow", children: eyebrow }) : null,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
        summary != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkRTB3COSUcjs.Text, { variant: "muted", size: "sm", children: summary }) : null
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkR52RM2CDcjs.PanelSection,
    {
      as: "div",
      "data-slot": "candidate-profile-body",
      border: "top",
      className: _chunk42BCVSWNcjs.cn.call(void 0, divided && "divide-y", className),
      ...props,
      children
    }
  );
}
function CandidateProfileFooter({
  children,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkR52RM2CDcjs.PanelSection,
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






exports.CandidateProfile = CandidateProfile; exports.CandidateProfileHeader = CandidateProfileHeader; exports.CandidateProfileBody = CandidateProfileBody; exports.CandidateProfileFooter = CandidateProfileFooter;
