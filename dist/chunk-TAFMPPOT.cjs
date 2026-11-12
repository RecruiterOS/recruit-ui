"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/recruit/sourcing-trace.tsx
var _collapsible = require('@epicbagel/saas-kit/primitives/collapsible');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _lazymarkdown = require('@epicbagel/saas-kit/primitives/lazy-markdown');
var _lucidereact = require('lucide-react');
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// src/recruit/chain-of-thought.tsx





var _utils = require('@epicbagel/saas-kit/lib/utils');


var _jsxruntime = require('react/jsx-runtime');
var ChainOfThoughtItem = ({
  children,
  className,
  ...props
}) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: _utils.cn.call(void 0, "text-muted-foreground min-w-0 text-sm wrap-anywhere", className), ...props, children });
var lineClassName = "text-muted-foreground flex max-w-full min-w-0 items-center justify-start gap-1 text-left text-sm leading-[1.8] transition-colors data-[status=error]:text-destructive data-[status=pending]:opacity-60";
function LineContent({
  children,
  leftIcon,
  description,
  status,
  swapIconOnHover = false
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "flex min-w-0 items-start gap-2", children: [
    leftIcon ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { className: "relative mt-[calc((1.8em_-_1rem)/2)] inline-flex size-4 shrink-0 items-center justify-center", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        "span",
        {
          className: _utils.cn.call(void 0,
            "transition-opacity",
            swapIconOnHover && "group-hover/chain-trigger:opacity-0"
          ),
          children: leftIcon
        }
      ),
      swapIconOnHover && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _lucidereact.ChevronDown, { "aria-hidden": "true", className: "absolute size-4 opacity-0 transition-opacity group-hover/chain-trigger:opacity-100 group-data-[state=open]/chain-trigger:rotate-180" })
    ] }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", className: "relative mt-[calc((1.8em_-_1rem)/2)] inline-flex size-4 shrink-0 items-center justify-center", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _lucidereact.Circle, { className: "size-2 fill-current" }) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { className: "flex min-w-0 flex-wrap items-baseline gap-x-2", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "chain-of-thought-title", className: _utils.cn.call(void 0, "min-w-0 wrap-anywhere", status === "running" && "shimmer motion-reduce:shimmer-none"), children }),
      description ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "chain-of-thought-description", className: "text-muted-foreground/70 min-w-0 tabular-nums wrap-anywhere", children: description }) : null
    ] })
  ] });
}
var ChainOfThoughtTrigger = ({
  children,
  className,
  leftIcon,
  description,
  status,
  swapIconOnHover = true,
  ...props
}) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
  _collapsible.CollapsibleTrigger,
  {
    "data-slot": "chain-of-thought-trigger",
    "data-status": status,
    className: _utils.cn.call(void 0,
      lineClassName,
      "group/chain-trigger min-h-8 cursor-pointer rounded-md outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[status=error]:hover:text-destructive [@media(pointer:coarse)]:min-h-[44px]",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, LineContent, { leftIcon, description, status, swapIconOnHover, children }),
      (!leftIcon || !swapIconOnHover) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _lucidereact.ChevronDown, { "aria-hidden": "true", className: "size-4 shrink-0 transition-transform group-data-[state=open]/chain-trigger:rotate-180" })
    ]
  }
);
var ChainOfThoughtStatic = ({
  children,
  className,
  leftIcon,
  description,
  status,
  ...props
}) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "chain-of-thought-static", "data-status": status, className: _utils.cn.call(void 0, lineClassName, "min-h-8", className), ...props, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, LineContent, { leftIcon, description, status, children }) });
var ChainOfThoughtContent = ({
  children,
  className,
  timeline = true,
  ...props
}) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  _collapsible.CollapsibleContent,
  {
    "data-slot": "chain-of-thought-content",
    className: _utils.cn.call(void 0,
      "text-popover-foreground min-w-0 overflow-hidden duration-200 [--radix-accordion-content-height:var(--radix-collapsible-content-height)] data-open:animate-accordion-down data-closed:animate-accordion-up motion-reduce:animate-none",
      className
    ),
    ...props,
    children: timeline ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "grid min-w-0 grid-cols-[min-content_minmax(0,1fr)] gap-x-4", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "aria-hidden": "true", className: "bg-primary/20 ml-1.75 h-full w-px group-data-[last=true]/chain-step:bg-transparent" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mt-2 min-w-0 space-y-2", children })
    ] }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mt-2 min-w-0", children })
  }
);
function ChainOfThought({ children, className, ...props }) {
  const childrenArray = _react2.default.Children.toArray(children);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "chain-of-thought", className: _utils.cn.call(void 0, "min-w-0 space-y-0", className), ...props, children: childrenArray.map(
    (child, index) => _react2.default.isValidElement(child) ? _react2.default.cloneElement(
      child,
      { isLast: index === childrenArray.length - 1 }
    ) : null
  ) });
}
var ChainOfThoughtStep = ({
  children,
  className,
  isLast = false,
  ...props
}) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
  _collapsible.Collapsible,
  {
    "data-slot": "chain-of-thought-step",
    className: _utils.cn.call(void 0, "group/chain-step min-w-0", className),
    "data-last": isLast,
    ...props,
    children: [
      children,
      !isLast && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "aria-hidden": "true", className: "flex justify-start", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "bg-primary/20 ml-1.75 h-4 w-px" }) })
    ]
  }
);

// src/recruit/sourcing-trace.tsx

var sourcingTraceLabels = {
  pending: "Up next",
  running: "In progress",
  done: "Done",
  error: "Failed",
  skipped: "Skipped",
  stopped: "Stopped",
  live: (agentName) => `How ${agentName} is sourcing`,
  settled: (agentName) => `How ${agentName} searched`
};
var unfinished = (status) => status === "pending" || status === "running";
function sourcingStepShownStatus(status, live) {
  return !live && unfinished(status) ? "stopped" : status;
}
function sourcingTraceSummary(steps) {
  const total = steps.length;
  let done = 0;
  let failed = 0;
  let skipped = 0;
  let stopped = 0;
  for (const step of steps) {
    if (step.status === "done") done += 1;
    else if (step.status === "error") failed += 1;
    else if (step.status === "skipped") skipped += 1;
    else stopped += 1;
  }
  const count = `${total} ${total === 1 ? "step" : "steps"}`;
  const parts = [done === total ? count : `${done} of ${count} done`];
  if (failed > 0) parts.push(`${failed} failed`);
  if (skipped > 0) parts.push(`${skipped} skipped`);
  if (stopped > 0) parts.push("stopped");
  return { description: parts.join(" \xB7 "), failed: failed > 0 };
}
var STEP_ICONS = {
  pending: _lucidereact.Circle,
  running: _lucidereact.CircleDot,
  done: _lucidereact.CircleCheck,
  error: _lucidereact.CircleX,
  skipped: _lucidereact.CircleMinus,
  stopped: _lucidereact.CircleStop
};
var LINE_STATUS = {
  pending: "pending",
  running: "running",
  done: void 0,
  error: "error",
  skipped: "pending",
  stopped: "pending"
};
function SourcingStepItem({
  step,
  live,
  labels,
  markdownComponents,
  isLast
}) {
  const [opened, setOpened] = _react.useState.call(void 0, null);
  const status = sourcingStepShownStatus(step.status, live);
  const line = {
    status: LINE_STATUS[status],
    "data-step-status": status,
    description: step.description,
    // The glyph is the only sign of the status, so a screen reader names it.
    leftIcon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: STEP_ICONS[status], role: "img", "aria-hidden": false, "aria-label": labels[status] })
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChainOfThoughtStep, { isLast, open: _nullishCoalesce(opened, () => ( status === "running")), onOpenChange: setOpened, children: step.detail ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChainOfThoughtTrigger, { ...line, swapIconOnHover: false, children: step.title }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChainOfThoughtContent, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChainOfThoughtItem, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _lazymarkdown.LazyMarkdown, { size: "sm", tone: "muted", components: markdownComponents, children: step.detail }) }) })
  ] }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChainOfThoughtStatic, { ...line, children: step.title }) });
}
function SourcingTrace({ steps, agentName, live = false, labels, markdownComponents }) {
  if (steps.length === 0) return null;
  const text = { ...sourcingTraceLabels, ...labels };
  const items = steps.map((step) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SourcingStepItem, { step, live, labels: text, markdownComponents }, step.key));
  if (live) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChainOfThought, { role: "group", "aria-label": text.live(agentName), children: items });
  }
  const summary = sourcingTraceSummary(steps);
  const title = text.settled(agentName);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _collapsible.Collapsible, { role: "group", "aria-label": title, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChainOfThoughtTrigger, { status: summary.failed ? "error" : void 0, description: summary.description, children: title }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChainOfThoughtContent, { timeline: false, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChainOfThought, { children: items }) })
  ] });
}






exports.sourcingTraceLabels = sourcingTraceLabels; exports.sourcingStepShownStatus = sourcingStepShownStatus; exports.sourcingTraceSummary = sourcingTraceSummary; exports.SourcingTrace = SourcingTrace;
