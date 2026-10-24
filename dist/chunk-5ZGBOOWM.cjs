"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/interactive-card.tsx


var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function interactiveCardClass({
  selected,
  surface = "card",
  borderWidth = "default"
} = {}) {
  return _chunk42BCVSWNcjs.cn.call(void 0,
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
var InteractiveCard = _react.forwardRef.call(void 0,
  function InteractiveCard2({ as, selected, flat, clip, padding = "none", radius = "xl", joined = "none", border = "default", borderWidth = "default", display = "inline", textSize = "inherit", opacity = "full", surface = "card", indicator = "bar", className, onClick, onKeyDown, ...props }, ref) {
    const Component = _nullishCoalesce(as, () => ( "button"));
    const needsButtonSemantics = Component !== "button" && Component !== "a" && !!onClick;
    const handleKeyDown = (event) => {
      _optionalChain([onKeyDown, 'optionalCall', _ => _(event)]);
      if (event.defaultPrevented || !needsButtonSemantics) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        _optionalChain([onClick, 'optionalCall', _2 => _2(event)]);
      }
    };
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      Component,
      {
        ref,
        ...Component === "button" ? { type: "button" } : {},
        ...needsButtonSemantics ? { role: "button", tabIndex: 0 } : {},
        ...selected !== void 0 ? { "aria-current": selected || void 0 } : {},
        className: _chunk42BCVSWNcjs.cn.call(void 0,
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




exports.InteractiveCard = InteractiveCard; exports.shouldActivateCandidateCard = shouldActivateCandidateCard;
