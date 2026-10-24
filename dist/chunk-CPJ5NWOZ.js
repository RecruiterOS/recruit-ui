import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/interactive-card.tsx
import {
  forwardRef
} from "react";
import { jsx } from "react/jsx-runtime";
function interactiveCardClass({
  selected,
  surface = "card",
  borderWidth = "default"
} = {}) {
  return cn(
    "group relative w-full rounded-xl text-left",
    borderWidth === "thin" ? "border" : "border-2",
    surface === "subtle" ? "bg-muted/20" : "bg-card",
    "transition-colors duration-150",
    "hover:border-foreground/40",
    "focus-visible:outline-hidden focus-visible:border-foreground/40",
    "focus-visible:ring-2 focus-visible:ring-ring",
    selected ? "border-primary" : "border-border"
  );
}
var InteractiveCard = forwardRef(
  function InteractiveCard2({ as, selected, flat, clip, padding = "none", radius = "xl", joined = "none", border = "default", borderWidth = "default", display = "inline", textSize = "inherit", opacity = "full", surface = "card", indicator = "bar", className, onClick, onKeyDown, ...props }, ref) {
    const Component = as ?? "button";
    const needsButtonSemantics = Component !== "button" && Component !== "a" && !!onClick;
    const handleKeyDown = (event) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !needsButtonSemantics) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick?.(event);
      }
    };
    return /* @__PURE__ */ jsx(
      Component,
      {
        ref,
        ...Component === "button" ? { type: "button" } : {},
        ...needsButtonSemantics ? { role: "button", tabIndex: 0 } : {},
        ...selected !== void 0 ? { "aria-current": selected || void 0 } : {},
        className: cn(
          interactiveCardClass({ selected, flat, indicator, surface, borderWidth }),
          clip && "overflow-hidden",
          padding === "compact" && "p-3",
          padding === "row" && "px-3 py-2",
          padding === "comfortable" && "px-5 py-4",
          padding === "roomy" && "p-5 md:p-6",
          radius === "lg" && "rounded-lg",
          radius === "none" && "rounded-none",
          joined === "top" && "rounded-b-none rounded-t-xl",
          border === "none" && "border-0",
          display === "block" && "block",
          textSize === "sm" && "text-sm",
          opacity === "subdued" && "opacity-60",
          className
        ),
        onClick,
        onKeyDown: handleKeyDown,
        ...props
      }
    );
  }
);

// src/recruit/candidate-card-activation.ts
var INTERACTIVE_DESCENDANT = "button, a, input, select, textarea, [role='button'], [role='link']";
function shouldActivateCandidateCard(event) {
  if (!(event.target instanceof Element)) return true;
  const nestedControl = event.target.closest(INTERACTIVE_DESCENDANT);
  return nestedControl == null || nestedControl === event.currentTarget;
}

export {
  InteractiveCard,
  shouldActivateCandidateCard
};
