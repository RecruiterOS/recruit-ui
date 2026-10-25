"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-stage-actions.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');





var _dropdownmenu = require('@epicbagel/saas-kit/primitives/dropdown-menu');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _splitactionbutton = require('@epicbagel/saas-kit/primitives/split-action-button');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  moveTo: (label) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    "Move to ",
    label
  ] }),
  moveMenu: "Move to\u2026",
  moveTrigger: "Move to",
  present: "Present to client",
  reject: "Reject",
  rejectTitle: "Reject \u2014 move to rejected",
  decline: "Declined",
  declineTitle: "Candidate declined / not looking \u2014 move to declined"
};
function stopThen(callback) {
  return (event) => {
    event.stopPropagation();
    callback();
  };
}
function CandidateStageActions({
  advance,
  moveOptions = [],
  onMove,
  contact,
  onPresent,
  onRequestReject,
  onRequestDecline,
  labels
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const hasMenu = moveOptions.length > 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    advance ? hasMenu ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _splitactionbutton.SplitActionButton,
      {
        label: advance.label,
        size: "sm",
        variant: advance.outline ? "outline" : "default",
        onAction: advance.onAdvance,
        items: moveOptions.map((option) => ({ value: option.value, label: text.moveTo(option.label) })),
        onSelect: (value) => _optionalChain([onMove, 'optionalCall', _ => _(value)]),
        chevronAriaLabel: text.moveMenu
      }
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", variant: advance.outline ? "outline" : "default", onClick: stopThen(advance.onAdvance), children: advance.label }) : hasMenu ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _dropdownmenu.DropdownMenu, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dropdownmenu.DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { size: "sm", variant: "outline", title: text.moveMenu, onClick: (event) => event.stopPropagation(), children: [
        text.moveTrigger,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.ChevronDown, size: "md" })
      ] }) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        _dropdownmenu.DropdownMenuContent,
        {
          align: "start",
          "data-slot": "candidate-stage-menu",
          onClick: (event) => event.stopPropagation(),
          children: moveOptions.map((option) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _dropdownmenu.DropdownMenuItem,
            {
              onClick: (event) => {
                event.stopPropagation();
                _optionalChain([onMove, 'optionalCall', _2 => _2(option.value)]);
              },
              children: text.moveTo(option.label)
            },
            option.value
          ))
        }
      )
    ] }) : null,
    contact,
    onPresent && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", variant: "outline", onClick: stopThen(onPresent), children: text.present }),
    onRequestReject && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", variant: "ghost-destructive", title: text.rejectTitle, onClick: stopThen(onRequestReject), children: text.reject }),
    onRequestDecline && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", variant: "quiet", title: text.declineTitle, onClick: stopThen(onRequestDecline), children: text.decline })
  ] });
}



exports.CandidateStageActions = CandidateStageActions;
