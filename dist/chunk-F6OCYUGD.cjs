"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-detail-layout.tsx
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _countbadge = require('@epicbagel/saas-kit/primitives/count-badge');





var _dropdownmenu = require('@epicbagel/saas-kit/primitives/dropdown-menu');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _tabs = require('@epicbagel/saas-kit/primitives/tabs');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function present(value) {
  return value != null && value !== false && value !== "";
}
function CandidateDetailLayout({
  header,
  alert,
  tabs,
  children,
  footer,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      "data-slot": "candidate-detail-layout",
      direction: "vertical",
      gap: "none",
      height: "full",
      overflow: "hidden",
      ...props,
      children: [
        header,
        alert,
        tabs,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { grow: true, overflow: "y-auto", children }),
        footer
      ]
    }
  );
}
function CandidateDetailHeader({
  avatar,
  name,
  verified,
  verifiedAt,
  headline,
  provenance,
  actions,
  onClose,
  closeLabel = "Close",
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      "data-slot": "candidate-detail-header",
      direction: "horizontal",
      gap: "md",
      align: "start",
      padding: "lg",
      border: "bottom",
      ...props,
      children: [
        avatar,
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", wrap: true, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { level: 3, truncate: true, children: name }),
            verified && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
              _badge.Badge,
              {
                as: "span",
                variant: "success",
                size: "micro-compact",
                gap: "xs",
                weight: "semibold",
                title: verified.title,
                children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.ShieldCheck, size: "xs" }),
                  verified.label
                ]
              }
            ),
            verified && present(verifiedAt) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", size: "xs", tone: "subtle", children: verifiedAt })
          ] }),
          present(headline) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "div", size: "sm", tone: "muted", truncate: true, marginTop: "tight", children: headline }),
          present(provenance) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "subtle", truncate: true, marginTop: "xs", children: provenance })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", shrink: false, children: [
          actions,
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { variant: "ghost", size: "icon-sm", "aria-label": closeLabel, onClick: () => onClose(), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.X, size: "md" }) })
        ] })
      ]
    }
  );
}
function CandidateActionMenu({
  items,
  onSelect,
  busy = false,
  disabled,
  label = "More actions",
  variant = "ghost",
  triggerIconSize = "md",
  itemIconSize = "md",
  isolateClicks = false
}) {
  const isolate = isolateClicks ? (event) => event.stopPropagation() : void 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _dropdownmenu.DropdownMenu, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dropdownmenu.DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { variant, size: "icon-sm", disabled, title: label, onClick: isolate, children: busy ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: triggerIconSize, spin: true }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.MoreHorizontal, size: triggerIconSize }) }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dropdownmenu.DropdownMenuContent, { align: "end", "data-slot": "candidate-action-menu", onClick: isolate, children: items.map((item) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _dropdownmenu.DropdownMenuItem,
      {
        onClick: () => {
          _optionalChain([item, 'access', _ => _.onSelect, 'optionalCall', _2 => _2()]);
          _optionalChain([onSelect, 'optionalCall', _3 => _3(item.id)]);
        },
        disabled: item.disabled,
        children: [
          item.icon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: item.icon, size: itemIconSize, tone: item.tone }),
          item.label
        ]
      },
      item.id
    )) })
  ] });
}
function CandidateDetailTabs({
  tabs,
  value,
  onChange,
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _tabs.Tabs,
    {
      "data-slot": "candidate-detail-tabs",
      value,
      onValueChange: (next) => onChange(next),
      ...props,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _tabs.TabsList, { width: "full", scrollable: true, marginBottom: "none", children: tabs.map((item) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _tabs.TabsTrigger, { value: item.value, children: [
        item.label,
        item.count != null && item.count > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _countbadge.CountBadge, { value: item.count })
      ] }, item.value)) })
    }
  );
}






exports.CandidateDetailLayout = CandidateDetailLayout; exports.CandidateDetailHeader = CandidateDetailHeader; exports.CandidateActionMenu = CandidateActionMenu; exports.CandidateDetailTabs = CandidateDetailTabs;
