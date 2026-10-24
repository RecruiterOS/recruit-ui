import {
  Badge
} from "./chunk-L4AM6M3M.js";
import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/section-header.tsx
import { forwardRef } from "react";
import { cva } from "class-variance-authority";

// vendor/core/files/src/primitives/count-badge.tsx
import { jsx } from "react/jsx-runtime";
function CountBadge({
  value,
  variant = "destructive",
  className,
  ...props
}) {
  const isSingleCharacter = String(value).trim().length === 1;
  return /* @__PURE__ */ jsx(
    Badge,
    {
      as: "span",
      "data-count-badge": "",
      variant,
      size: "counter",
      shrink: true,
      className: cn(
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
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var sectionHeaderVariants = cva("flex items-center gap-1", {
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
var SectionHeader = forwardRef(
  function SectionHeader2({ icon, label, count, action, variant, spacing, className, ...rest }, ref) {
    return /* @__PURE__ */ jsxs(
      "h3",
      {
        ref,
        className: cn(sectionHeaderVariants({ variant, spacing }), className),
        ...rest,
        children: [
          icon,
          /* @__PURE__ */ jsx2("span", { children: label }),
          typeof count === "number" && /* @__PURE__ */ jsx2(CountBadge, { value: count, variant: "secondary" }),
          action && /* @__PURE__ */ jsx2("span", { className: "ml-auto", children: action })
        ]
      }
    );
  }
);

export {
  SectionHeader
};
