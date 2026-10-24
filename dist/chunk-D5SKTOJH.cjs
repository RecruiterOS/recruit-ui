"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkYMPXXC7Bcjs = require('./chunk-YMPXXC7B.cjs');


var _chunkJ5RZWWAWcjs = require('./chunk-J5RZWWAW.cjs');


var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/decision-actions.tsx
var _jsxruntime = require('react/jsx-runtime');
function DecisionActions({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel = "Decision",
  trailing,
  layout = "inline"
}) {
  const fill = layout === "fill";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _chunkYMPXXC7Bcjs.Stack,
    {
      direction: "horizontal",
      gap: "sm",
      align: "center",
      wrap: !fill,
      grow: fill,
      width: fill ? "full" : "auto",
      role: "group",
      "aria-label": ariaLabel,
      children: [
        options.map((option) => {
          const selected = option.value === value;
          return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkJ5RZWWAWcjs.Button,
            {
              type: "button",
              size: "compact",
              grow: fill,
              className: _chunk42BCVSWNcjs.cn.call(void 0,
                "h-auto",
                fill ? "min-h-11 px-5 py-2.5" : "px-4 py-2",
                selected && "border border-transparent"
              ),
              variant: selected ? "default" : "outline",
              disabled,
              "aria-pressed": selected,
              onClick: () => onChange(option.value),
              children: option.label
            },
            option.value
          );
        }),
        trailing
      ]
    }
  );
}

// src/recruit/candidate-decision-bar.tsx

function CandidateDecisionBar({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel = "Candidate decision",
  trailing,
  layout = "fill"
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    DecisionActions,
    {
      options,
      value,
      onChange,
      disabled,
      ariaLabel,
      trailing,
      layout
    }
  );
}



exports.CandidateDecisionBar = CandidateDecisionBar;
