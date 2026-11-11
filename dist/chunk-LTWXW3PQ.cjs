"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/job-search-progress.tsx
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _timeline = require('@epicbagel/saas-kit/primitives/timeline');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  done: "Done",
  current: "In progress",
  upcoming: "Not started"
};
var GLYPHS = { done: _lucidereact.Check, current: _lucidereact.CircleDot, upcoming: _lucidereact.Circle };
function JobSearchProgress({ steps, labels, ...props }) {
  const text = { ...DEFAULT_LABELS, ...labels };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { as: "section", "data-slot": "job-search-progress", gap: "none", ...props, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _timeline.Timeline, { spacing: "tight", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ol", { className: "m-0 list-none space-y-2 p-0", children: steps.map((step) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "li",
    {
      "data-slot": "job-search-step",
      "data-state": step.state,
      "aria-current": step.state === "current" ? "step" : void 0,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        _timeline.TimelineRow,
        {
          surface: step.state === "current" ? "muted" : "transparent",
          icon: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            _text.Text,
            {
              as: "span",
              variant: "inherit",
              tone: step.state === "upcoming" ? "muted" : void 0,
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: GLYPHS[step.state], size: "sm" }),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { className: "sr-only", children: [
                  text[step.state],
                  ": "
                ] })
              ]
            }
          ),
          title: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _text.Text,
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
          children: step.action != null && step.action !== false ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", wrap: true, marginTop: "sm", children: step.action }) : null
        }
      )
    },
    step.id
  )) }) }) });
}



exports.JobSearchProgress = JobSearchProgress;
