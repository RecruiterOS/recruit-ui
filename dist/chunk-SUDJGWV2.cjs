"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-profile-link-button.tsx
var _anchor = require('@epicbagel/saas-kit/primitives/anchor');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _jsxruntime = require('react/jsx-runtime');
function CandidateProfileLinkButton({
  href,
  title,
  icon,
  size = "default",
  presentation = "icon",
  buttonLabel = "Open profile",
  iconTone = "info",
  onClick,
  ...props
}) {
  if (presentation === "button") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { asChild: true, variant: "outline", size: "sm", shrink: true, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _anchor.Anchor, { href, target: "_blank", rel: "noreferrer", title, onClick, ...props, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon, size: "md", tone: iconTone }),
      " ",
      buttonLabel
    ] }) });
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { asChild: true, variant: "ghost", size: size === "lg" ? "icon-md" : "icon-sm", shrink: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _anchor.Anchor,
    {
      href,
      target: "_blank",
      rel: "noreferrer",
      onClick: (event) => {
        event.stopPropagation();
        _optionalChain([onClick, 'optionalCall', _ => _(event)]);
      },
      title,
      ...props,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon, size: size === "lg" ? "lg" : "md", tone: iconTone })
    }
  ) });
}



exports.CandidateProfileLinkButton = CandidateProfileLinkButton;
