"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/recruit/candidate-stage-select.tsx






var _select = require('@epicbagel/saas-kit/primitives/select');
var _jsxruntime = require('react/jsx-runtime');
function CandidateStageSelect({
  value,
  options,
  onChange,
  itemSize,
  disabled,
  textSize,
  ...trigger
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _select.Select, { value, onValueChange: (next) => onChange(next), disabled, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectTrigger, { textSize, ...trigger, "data-slot": "candidate-stage-select", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectValue, {}) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectContent, { children: options.map((option) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectItem, { value: option.value, size: _nullishCoalesce(itemSize, () => ( textSize)), children: option.label }, option.value)) })
  ] });
}



exports.CandidateStageSelect = CandidateStageSelect;
