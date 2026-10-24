"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/definition-list.tsx
var _react = require('react');
var _classvarianceauthority = require('class-variance-authority');
var _jsxruntime = require('react/jsx-runtime');
var definitionListVariants = _classvarianceauthority.cva.call(void 0, "", {
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
var DefinitionList = _react.forwardRef.call(void 0,
  function DefinitionList2({ variant, inset = "none", className, ...rest }, ref) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "dl",
      {
        ref,
        className: _chunk42BCVSWNcjs.cn.call(void 0, definitionListVariants({ variant }), inset === "lg" && "px-5", className),
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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      className: _chunk42BCVSWNcjs.cn.call(void 0,
        "flex items-baseline justify-between gap-2 py-2.5 text-sm",
        className
      ),
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dt", { className: "text-muted-foreground", children: label }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "dd",
          {
            className: _chunk42BCVSWNcjs.cn.call(void 0,
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




exports.DefinitionList = DefinitionList; exports.DefinitionItem = DefinitionItem;
