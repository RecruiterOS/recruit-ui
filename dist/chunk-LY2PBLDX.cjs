"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/recruit/candidate-channel-actions.tsx
var _anchor = require('@epicbagel/saas-kit/primitives/anchor');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _jsxruntime = require('react/jsx-runtime');
var isWebLink = (href) => /^https?:\/\//i.test(href);
function CandidateChannelActions({
  channels,
  presentation = "icons",
  size = "default",
  label = "Contact",
  ...props
}) {
  if (channels.length === 0) return null;
  const bar = presentation === "bar";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _stack.Stack,
    {
      "data-slot": "candidate-channel-actions",
      "data-presentation": presentation,
      role: "group",
      "aria-label": label,
      direction: "horizontal",
      gap: bar ? "sm" : "xs",
      align: "center",
      justify: bar ? "center" : "start",
      width: bar ? "full" : "auto",
      ...props,
      children: channels.map((channel, index) => {
        const key = `${index}:${channel.kind}`;
        const external = _nullishCoalesce(channel.external, () => ( isWebLink(channel.href)));
        const link = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          _anchor.Anchor,
          {
            href: channel.href,
            "data-channel": channel.kind,
            title: channel.label,
            "aria-label": bar ? void 0 : channel.label,
            ...external ? { target: "_blank", rel: "noopener noreferrer" } : {},
            onClick: (event) => event.stopPropagation(),
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: channel.icon, size: "md" }),
              bar ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", truncate: true, minWidth: "zero", children: channel.label }) : null
            ]
          }
        );
        return bar ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { asChild: true, variant: "outline", size: "sm", grow: true, minWidth: "zero", children: link }, key) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _button.Button,
          {
            asChild: true,
            variant: "outline",
            shape: "circle",
            size: size === "compact" ? "icon-compact" : "icon-sm",
            shrink: true,
            children: link
          },
          key
        );
      })
    }
  );
}



exports.CandidateChannelActions = CandidateChannelActions;
