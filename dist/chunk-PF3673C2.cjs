"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkGK6J55F4cjs = require('./chunk-GK6J55F4.cjs');


var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/section-header.tsx
var _react = require('react');
var _classvarianceauthority = require('class-variance-authority');

// vendor/core/files/src/primitives/count-badge.tsx
var _jsxruntime = require('react/jsx-runtime');
function CountBadge({
  value,
  variant = "destructive",
  className,
  ...props
}) {
  const isSingleCharacter = String(value).trim().length === 1;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkGK6J55F4cjs.Badge,
    {
      as: "span",
      "data-count-badge": "",
      variant,
      size: "counter",
      shrink: true,
      className: _chunk42BCVSWNcjs.cn.call(void 0,
        "self-center py-0 text-center leading-none tracking-normal tabular-nums",
        isSingleCharacter ? "w-5 px-0" : "px-1.5",
        className
      ),
      ...props,
      children: value
    }
  );
}

// vendor/core/files/src/primitives/section-header.tsx

var sectionHeaderVariants = _classvarianceauthority.cva.call(void 0, "flex items-center gap-1", {
  variants: {
    variant: {
      muted: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
      plain: "text-sm font-medium text-foreground"
    },
    spacing: {
      tight: "mb-2",
      loose: "mb-3",
      none: ""
    }
  },
  defaultVariants: {
    variant: "muted",
    spacing: "tight"
  }
});
var SectionHeader = _react.forwardRef.call(void 0,
  function SectionHeader2({ icon, label, count, action, variant, spacing, className, ...rest }, ref) {
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      "h3",
      {
        ref,
        className: _chunk42BCVSWNcjs.cn.call(void 0, sectionHeaderVariants({ variant, spacing }), className),
        ...rest,
        children: [
          icon,
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: label }),
          typeof count === "number" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CountBadge, { value: count, variant: "secondary" }),
          action && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "ml-auto", children: action })
        ]
      }
    );
  }
);



exports.SectionHeader = SectionHeader;
