"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk3YGB3RHVcjs = require('./chunk-3YGB3RHV.cjs');

// src/recruit/current-company-popover.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _popover = require('@epicbagel/saas-kit/primitives/popover');
var _text = require('@epicbagel/saas-kit/primitives/text');





var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function CurrentCompanyPopover({
  company,
  triggerTitle,
  renderContent,
  closeDelayMs = 180,
  size = "sm",
  tone = "muted",
  ...props
}) {
  const [open, setOpen] = _react.useState.call(void 0, false);
  const closeTimer = _react.useRef.call(void 0, null);
  const cancelClose = _react.useCallback.call(void 0, () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);
  const scheduleClose = _react.useCallback.call(void 0, () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), closeDelayMs);
  }, [cancelClose, closeDelayMs]);
  _react.useEffect.call(void 0, () => () => cancelClose(), [cancelClose]);
  const openOnMouse = (event) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    setOpen(true);
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunk3YGB3RHVcjs.CurrentCompanyLabel,
    {
      size,
      tone,
      ...props,
      company: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _popover.Popover, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _popover.PopoverTrigger, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _button.Button,
          {
            type: "button",
            variant: "link",
            size: "bare",
            title: triggerTitle,
            onPointerEnter: openOnMouse,
            onPointerLeave: scheduleClose,
            onClick: (event) => event.stopPropagation(),
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", size, tone, truncate: true, children: company })
          }
        ) }),
        open && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _popover.PopoverContent,
          {
            width: "lg",
            "data-slot": "current-company-popover",
            onPointerEnter: cancelClose,
            onPointerLeave: scheduleClose,
            onClick: (event) => event.stopPropagation(),
            children: renderContent()
          }
        )
      ] })
    }
  );
}



exports.CurrentCompanyPopover = CurrentCompanyPopover;
