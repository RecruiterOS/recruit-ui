"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-contact-channels-menu.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _countbadge = require('@epicbagel/saas-kit/primitives/count-badge');






var _dropdownmenu = require('@epicbagel/saas-kit/primitives/dropdown-menu');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  trigger: "Contacted via",
  compactTrigger: "Via",
  triggerTitle: "Record how this candidate was contacted",
  remove: (option) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    "Remove ",
    option.label
  ] })
};
function isTouched(value) {
  return value != null && value !== false;
}
function CandidateContactChannelsMenu({
  options,
  touched,
  onTouch,
  onRemove,
  compact = false,
  labels
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const used = options.filter((option) => isTouched(touched[option.id]));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _dropdownmenu.DropdownMenu, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dropdownmenu.DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _button.Button,
      {
        size: "sm",
        variant: "outline",
        title: text.triggerTitle,
        onClick: (event) => event.stopPropagation(),
        children: [
          compact ? text.compactTrigger : text.trigger,
          used.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _countbadge.CountBadge, { value: used.length, variant: "secondary" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.ChevronDown, size: "md" })
        ]
      }
    ) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _dropdownmenu.DropdownMenuContent,
      {
        align: "start",
        "data-slot": "candidate-contact-channels-menu",
        onClick: (event) => event.stopPropagation(),
        children: [
          options.map((option) => {
            const recency = touched[option.id];
            const isUsed = isTouched(recency);
            return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
              _dropdownmenu.DropdownMenuItem,
              {
                onSelect: (event) => event.preventDefault(),
                onClick: (event) => {
                  event.stopPropagation();
                  onTouch(option.id);
                },
                children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Check, size: "md", tone: "success", visibility: isUsed ? "visible" : "hidden" }),
                  option.label,
                  isUsed && recency !== true && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", grow: true, align: "end", paddingX: "md", size: "xs", tone: "muted", children: recency })
                ]
              },
              option.id
            );
          }),
          used.length > 0 && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dropdownmenu.DropdownMenuSeparator, {}),
            used.map((option) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _dropdownmenu.DropdownMenuItem,
              {
                tone: "muted",
                onClick: (event) => {
                  event.stopPropagation();
                  onRemove(option.id);
                },
                children: text.remove(option)
              },
              `rm-${option.id}`
            ))
          ] })
        ]
      }
    )
  ] });
}



exports.CandidateContactChannelsMenu = CandidateContactChannelsMenu;
