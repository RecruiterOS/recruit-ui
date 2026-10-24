import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/definition-list.tsx
import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { jsx, jsxs } from "react/jsx-runtime";
var definitionListVariants = cva("", {
  variants: {
    variant: {
      divided: "divide-y",
      plain: "space-y-1"
    }
  },
  defaultVariants: {
    variant: "divided"
  }
});
var DefinitionList = forwardRef(
  function DefinitionList2({ variant, inset = "none", className, ...rest }, ref) {
    return /* @__PURE__ */ jsx(
      "dl",
      {
        ref,
        className: cn(definitionListVariants({ variant }), inset === "lg" && "px-5", className),
        ...rest
      }
    );
  }
);
function DefinitionItem({
  label,
  children,
  valueClassName,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-baseline justify-between gap-2 py-2.5 text-sm",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("dt", { className: "text-muted-foreground", children: label }),
        /* @__PURE__ */ jsx(
          "dd",
          {
            className: cn(
              "text-right font-medium text-foreground/90 max-w-[60%] break-words",
              valueClassName
            ),
            children
          }
        )
      ]
    }
  );
}

export {
  DefinitionList,
  DefinitionItem
};
