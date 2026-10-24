import {
  Badge
} from "./chunk-L4AM6M3M.js";
import {
  Button
} from "./chunk-A7XOSQ7J.js";
import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/connection-status-bar.tsx
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Plug,
  RefreshCw
} from "lucide-react";
import {
  useState
} from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var statePresentation = {
  disconnected: { icon: Plug, iconClassName: "text-muted-foreground" },
  syncing: { icon: RefreshCw, iconClassName: "text-blue-600 dark:text-blue-400" },
  connected: { icon: CheckCircle2, iconClassName: "text-emerald-600 dark:text-emerald-400" },
  error: { icon: AlertCircle, iconClassName: "text-destructive" }
};
function StatusAction({
  action,
  state
}) {
  const external = action.external || action.target === "_blank";
  const ariaLabel = action.ariaLabel ?? (typeof action.label === "string" ? action.label : void 0);
  const showSyncIcon = !external && (state === "connected" || state === "syncing");
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    showSyncIcon ? /* @__PURE__ */ jsx(
      RefreshCw,
      {
        "aria-hidden": "true",
        className: state === "syncing" ? "animate-spin" : void 0
      }
    ) : null,
    action.iconOnly ? null : action.label,
    external ? /* @__PURE__ */ jsx(ExternalLink, { "aria-hidden": "true" }) : null
  ] });
  const className = cn(
    state === "disconnected" && "bg-foreground text-background hover:bg-foreground/90",
    state === "error" && "border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
  );
  const variant = state === "disconnected" ? "default" : action.iconOnly ? "quiet" : "outline";
  const size = action.iconOnly ? "icon-sm" : "sm";
  if (action.href) {
    return /* @__PURE__ */ jsx(Button, { asChild: true, variant, size, className, children: /* @__PURE__ */ jsx(
      "a",
      {
        href: action.href,
        target: action.target ?? (action.external ? "_blank" : void 0),
        rel: external ? "noreferrer" : void 0,
        "aria-label": action.iconOnly ? ariaLabel : void 0,
        title: action.iconOnly ? ariaLabel : void 0,
        "aria-disabled": action.disabled || void 0,
        onClick: (event) => {
          if (action.disabled) {
            event.preventDefault();
            return;
          }
          action.onClick?.();
        },
        children: content
      }
    ) });
  }
  return /* @__PURE__ */ jsx(
    Button,
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
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const controlled = open !== void 0;
  const isOpen = controlled ? open : uncontrolledOpen;
  const presentation = statePresentation[state];
  const StateIcon = presentation.icon;
  const clampedProgress = progress === void 0 ? void 0 : Math.min(100, Math.max(0, progress));
  const visibleActions = actions ?? (action ? [action] : []);
  const setOpen = (nextOpen) => {
    if (!controlled) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  return /* @__PURE__ */ jsxs(
    CollapsiblePrimitive.Root,
    {
      open: isOpen,
      onOpenChange: setOpen,
      "data-slot": "connection-status-bar",
      "data-status": state,
      className: cn(
        "overflow-hidden rounded-xl border border-border bg-background shadow-sm",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-slot": "connection-status-row",
            className: "flex min-h-[4.75rem] flex-row items-center gap-3 px-4 py-4 sm:gap-5 sm:px-5",
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-slot": "connection-status-leading",
                  className: "flex min-w-0 flex-1 items-center gap-3 sm:min-h-11 sm:gap-4",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "flex h-11 w-5 shrink-0 items-center justify-center", children: /* @__PURE__ */ jsx(
                      StateIcon,
                      {
                        "aria-hidden": "true",
                        className: cn(
                          "size-5",
                          state === "syncing" && "animate-spin",
                          presentation.iconClassName
                        )
                      }
                    ) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-3 sm:min-h-11 sm:gap-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "flex min-w-0 shrink items-center truncate whitespace-nowrap text-sm font-semibold leading-none text-foreground", children: name }),
                      description || facts?.length ? /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "h-5 w-px shrink-0 bg-border" }) : null,
                      description || facts?.length ? /* @__PURE__ */ jsxs(
                        "div",
                        {
                          "data-slot": "connection-status-summary",
                          className: "flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-hidden",
                          children: [
                            description ? /* @__PURE__ */ jsx("div", { className: "min-w-0 truncate whitespace-nowrap text-sm leading-none text-muted-foreground", children: description }) : null,
                            facts?.map((fact, index) => /* @__PURE__ */ jsx(
                              Badge,
                              {
                                "data-status-fact": "true",
                                variant: fact.variant ?? "default",
                                size: "micro",
                                padding: "roomy",
                                weight: "semibold",
                                shrink: true,
                                transform: "uppercase",
                                className: "whitespace-nowrap tabular-nums",
                                children: fact.label
                              },
                              index
                            ))
                          ]
                        }
                      ) : null
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center justify-end gap-2 sm:gap-3", children: [
                state === "syncing" ? /* @__PURE__ */ jsx(
                  "div",
                  {
                    role: "progressbar",
                    "aria-label": progressLabel,
                    "aria-valuemin": clampedProgress === void 0 ? void 0 : 0,
                    "aria-valuemax": clampedProgress === void 0 ? void 0 : 100,
                    "aria-valuenow": clampedProgress,
                    className: "h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:w-28",
                    children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: cn(
                          "h-full rounded-full bg-blue-600/70 transition-[width] dark:bg-blue-400/70",
                          clampedProgress === void 0 && "w-3/5 animate-pulse"
                        ),
                        style: clampedProgress === void 0 ? void 0 : { width: `${clampedProgress}%` }
                      }
                    )
                  }
                ) : null,
                visibleActions.map((visibleAction, index) => /* @__PURE__ */ jsx(
                  StatusAction,
                  {
                    action: visibleAction,
                    state
                  },
                  visibleAction.ariaLabel ?? (typeof visibleAction.label === "string" ? visibleAction.label : index)
                )),
                children ? /* @__PURE__ */ jsx(CollapsiblePrimitive.Trigger, { asChild: true, children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "quiet",
                    size: "icon-sm",
                    "aria-label": isOpen ? "Hide connection details" : "Show connection details",
                    "aria-expanded": isOpen,
                    children: /* @__PURE__ */ jsx(
                      ChevronDown,
                      {
                        "aria-hidden": "true",
                        className: cn("transition-transform", isOpen && "rotate-180")
                      }
                    )
                  }
                ) }) : null
              ] })
            ]
          }
        ),
        children ? /* @__PURE__ */ jsx(CollapsiblePrimitive.Content, { children: /* @__PURE__ */ jsx("div", { "data-slot": "connection-status-details", className: "border-t border-border px-5 py-4", children }) }) : null
      ]
    }
  );
}

// src/recruit/candidate-destination-status.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx2(
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

export {
  CandidateDestinationStatus
};
