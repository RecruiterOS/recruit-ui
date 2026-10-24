"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkGK6J55F4cjs = require('./chunk-GK6J55F4.cjs');


var _chunkJ5RZWWAWcjs = require('./chunk-J5RZWWAW.cjs');


var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/connection-status-bar.tsx
var _reactcollapsible = require('@radix-ui/react-collapsible'); var CollapsiblePrimitive = _interopRequireWildcard(_reactcollapsible);







var _lucidereact = require('lucide-react');


var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var statePresentation = {
  disconnected: { icon: _lucidereact.Plug, iconClassName: "text-muted-foreground" },
  syncing: { icon: _lucidereact.RefreshCw, iconClassName: "text-blue-600 dark:text-blue-400" },
  connected: { icon: _lucidereact.CheckCircle2, iconClassName: "text-emerald-600 dark:text-emerald-400" },
  error: { icon: _lucidereact.AlertCircle, iconClassName: "text-destructive" }
};
function StatusAction({
  action,
  state
}) {
  const external = action.external || action.target === "_blank";
  const ariaLabel = _nullishCoalesce(action.ariaLabel, () => ( (typeof action.label === "string" ? action.label : void 0)));
  const showSyncIcon = !external && (state === "connected" || state === "syncing");
  const content = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    showSyncIcon ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _lucidereact.RefreshCw,
      {
        "aria-hidden": "true",
        className: state === "syncing" ? "animate-spin" : void 0
      }
    ) : null,
    action.iconOnly ? null : action.label,
    external ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _lucidereact.ExternalLink, { "aria-hidden": "true" }) : null
  ] });
  const className = _chunk42BCVSWNcjs.cn.call(void 0,
    state === "disconnected" && "bg-foreground text-background hover:bg-foreground/90",
    state === "error" && "border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
  );
  const variant = state === "disconnected" ? "default" : action.iconOnly ? "quiet" : "outline";
  const size = action.iconOnly ? "icon-sm" : "sm";
  if (action.href) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkJ5RZWWAWcjs.Button, { asChild: true, variant, size, className, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "a",
      {
        href: action.href,
        target: _nullishCoalesce(action.target, () => ( (action.external ? "_blank" : void 0))),
        rel: external ? "noreferrer" : void 0,
        "aria-label": action.iconOnly ? ariaLabel : void 0,
        title: action.iconOnly ? ariaLabel : void 0,
        "aria-disabled": action.disabled || void 0,
        onClick: (event) => {
          if (action.disabled) {
            event.preventDefault();
            return;
          }
          _optionalChain([action, 'access', _ => _.onClick, 'optionalCall', _2 => _2()]);
        },
        children: content
      }
    ) });
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkJ5RZWWAWcjs.Button,
    {
      type: "button",
      variant,
      size,
      className,
      "aria-label": action.iconOnly ? ariaLabel : void 0,
      title: action.iconOnly ? ariaLabel : void 0,
      disabled: action.disabled,
      onClick: action.onClick,
      children: content
    }
  );
}
function ConnectionStatusBar({
  state,
  name,
  description,
  facts,
  action,
  actions,
  progress,
  progressLabel = "Sync progress",
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  className
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = _react.useState.call(void 0, defaultOpen);
  const controlled = open !== void 0;
  const isOpen = controlled ? open : uncontrolledOpen;
  const presentation = statePresentation[state];
  const StateIcon = presentation.icon;
  const clampedProgress = progress === void 0 ? void 0 : Math.min(100, Math.max(0, progress));
  const visibleActions = _nullishCoalesce(actions, () => ( (action ? [action] : [])));
  const setOpen = (nextOpen) => {
    if (!controlled) setUncontrolledOpen(nextOpen);
    _optionalChain([onOpenChange, 'optionalCall', _3 => _3(nextOpen)]);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    CollapsiblePrimitive.Root,
    {
      open: isOpen,
      onOpenChange: setOpen,
      "data-slot": "connection-status-bar",
      "data-status": state,
      className: _chunk42BCVSWNcjs.cn.call(void 0,
        "overflow-hidden rounded-xl border border-border bg-background shadow-sm",
        className
      ),
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            "data-slot": "connection-status-row",
            className: "flex min-h-[4.75rem] flex-row items-center gap-3 px-4 py-4 sm:gap-5 sm:px-5",
            children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                "div",
                {
                  "data-slot": "connection-status-leading",
                  className: "flex min-w-0 flex-1 items-center gap-3 sm:min-h-11 sm:gap-4",
                  children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "flex h-11 w-5 shrink-0 items-center justify-center", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      StateIcon,
                      {
                        "aria-hidden": "true",
                        className: _chunk42BCVSWNcjs.cn.call(void 0,
                          "size-5",
                          state === "syncing" && "animate-spin",
                          presentation.iconClassName
                        )
                      }
                    ) }),
                    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "flex min-w-0 flex-1 items-center gap-3 sm:min-h-11 sm:gap-4", children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "flex min-w-0 shrink items-center truncate whitespace-nowrap text-sm font-semibold leading-none text-foreground", children: name }),
                      description || _optionalChain([facts, 'optionalAccess', _4 => _4.length]) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "aria-hidden": "true", className: "h-5 w-px shrink-0 bg-border" }) : null,
                      description || _optionalChain([facts, 'optionalAccess', _5 => _5.length]) ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                        "div",
                        {
                          "data-slot": "connection-status-summary",
                          className: "flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-hidden",
                          children: [
                            description ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "min-w-0 truncate whitespace-nowrap text-sm leading-none text-muted-foreground", children: description }) : null,
                            _optionalChain([facts, 'optionalAccess', _6 => _6.map, 'call', _7 => _7((fact, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                              _chunkGK6J55F4cjs.Badge,
                              {
                                "data-status-fact": "true",
                                variant: _nullishCoalesce(fact.variant, () => ( "default")),
                                size: "micro",
                                padding: "roomy",
                                weight: "semibold",
                                shrink: true,
                                transform: "uppercase",
                                className: "whitespace-nowrap tabular-nums",
                                children: fact.label
                              },
                              index
                            ))])
                          ]
                        }
                      ) : null
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "flex shrink-0 items-center justify-end gap-2 sm:gap-3", children: [
                state === "syncing" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  "div",
                  {
                    role: "progressbar",
                    "aria-label": progressLabel,
                    "aria-valuemin": clampedProgress === void 0 ? void 0 : 0,
                    "aria-valuemax": clampedProgress === void 0 ? void 0 : 100,
                    "aria-valuenow": clampedProgress,
                    className: "h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:w-28",
                    children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      "div",
                      {
                        className: _chunk42BCVSWNcjs.cn.call(void 0,
                          "h-full rounded-full bg-blue-600/70 transition-[width] dark:bg-blue-400/70",
                          clampedProgress === void 0 && "w-3/5 animate-pulse"
                        ),
                        style: clampedProgress === void 0 ? void 0 : { width: `${clampedProgress}%` }
                      }
                    )
                  }
                ) : null,
                visibleActions.map((visibleAction, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  StatusAction,
                  {
                    action: visibleAction,
                    state
                  },
                  _nullishCoalesce(visibleAction.ariaLabel, () => ( (typeof visibleAction.label === "string" ? visibleAction.label : index)))
                )),
                children ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CollapsiblePrimitive.Trigger, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  _chunkJ5RZWWAWcjs.Button,
                  {
                    type: "button",
                    variant: "quiet",
                    size: "icon-sm",
                    "aria-label": isOpen ? "Hide connection details" : "Show connection details",
                    "aria-expanded": isOpen,
                    children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      _lucidereact.ChevronDown,
                      {
                        "aria-hidden": "true",
                        className: _chunk42BCVSWNcjs.cn.call(void 0, "transition-transform", isOpen && "rotate-180")
                      }
                    )
                  }
                ) }) : null
              ] })
            ]
          }
        ),
        children ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CollapsiblePrimitive.Content, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "connection-status-details", className: "border-t border-border px-5 py-4", children }) }) : null
      ]
    }
  );
}

// src/recruit/candidate-destination-status.tsx

function CandidateDestinationStatus({
  state,
  name,
  description,
  facts,
  actions,
  progress,
  progressLabel,
  details,
  open,
  defaultOpen,
  onOpenChange,
  className
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    ConnectionStatusBar,
    {
      state,
      name,
      description,
      facts,
      actions,
      progress,
      progressLabel,
      open,
      defaultOpen,
      onOpenChange,
      className,
      children: details
    }
  );
}



exports.CandidateDestinationStatus = CandidateDestinationStatus;
