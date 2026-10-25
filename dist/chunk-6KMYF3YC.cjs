"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-selectable-avatar.tsx
var _selectionoverlay = require('@epicbagel/saas-kit/primitives/selection-overlay');
var _toggle = require('@epicbagel/saas-kit/primitives/toggle');
var _jsxruntime = require('react/jsx-runtime');
function CandidateSelectableAvatar({
  selected,
  onToggle,
  label,
  title,
  children,
  onClick,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _toggle.Toggle,
    {
      pressed: selected,
      "aria-label": label,
      title: _nullishCoalesce(title, () => ( (selected ? "Deselect" : "Select"))),
      onPressedChange: () => onToggle(),
      onClick: (event) => {
        event.stopPropagation();
        _optionalChain([onClick, 'optionalCall', _ => _(event)]);
      },
      size: "avatar",
      "data-slot": "candidate-selectable-avatar",
      ...props,
      children: [
        children,
        selected && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _selectionoverlay.SelectionOverlay, {})
      ]
    }
  );
}



exports.CandidateSelectableAvatar = CandidateSelectableAvatar;
