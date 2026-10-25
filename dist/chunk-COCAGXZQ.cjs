"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-favourite-button.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  add: "Add to favourites",
  remove: "Remove from favourites"
};
function CandidateFavouriteButton({
  favourited,
  onToggle,
  labels,
  idleTone = "muted",
  onClick,
  ...props
}) {
  const label = favourited ? _nullishCoalesce(_optionalChain([labels, 'optionalAccess', _ => _.remove]), () => ( DEFAULT_LABELS.remove)) : _nullishCoalesce(_optionalChain([labels, 'optionalAccess', _2 => _2.add]), () => ( DEFAULT_LABELS.add));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _button.Button,
    {
      type: "button",
      variant: "ghost",
      size: "icon-sm",
      shrink: true,
      "aria-pressed": favourited,
      title: label,
      ...props,
      onClick: (event) => {
        event.stopPropagation();
        _optionalChain([onClick, 'optionalCall', _3 => _3(event)]);
        if (!event.defaultPrevented) onToggle();
      },
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Star, size: "md", tone: favourited ? "warning" : idleTone, filled: favourited })
    }
  );
}



exports.CandidateFavouriteButton = CandidateFavouriteButton;
