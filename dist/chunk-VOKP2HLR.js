// src/recruit/candidate-stage-select.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@epicbagel/saas-kit/primitives/select";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateStageSelect({
  value,
  options,
  onChange,
  itemSize,
  disabled,
  textSize,
  ...trigger
}) {
  return /* @__PURE__ */ jsxs(Select, { value, onValueChange: (next) => onChange(next), disabled, children: [
    /* @__PURE__ */ jsx(SelectTrigger, { textSize, ...trigger, "data-slot": "candidate-stage-select", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
    /* @__PURE__ */ jsx(SelectContent, { children: options.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, size: itemSize ?? textSize, children: option.label }, option.value)) })
  ] });
}

export {
  CandidateStageSelect
};
