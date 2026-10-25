"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-profile-dialog.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _icon = require('@epicbagel/saas-kit/primitives/icon');










var _responsivedialog = require('@epicbagel/saas-kit/primitives/responsive-dialog');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function CandidateProfileDialog({
  accessibleTitle,
  accessibleDescription,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  header,
  children,
  footer,
  footerLayout = "auto",
  showClose = true,
  closeLabel = "Close candidate profile",
  contentClassName,
  bodyClassName
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _responsivedialog.ResponsiveDialog,
    {
      open,
      defaultOpen,
      onOpenChange,
      children: [
        trigger ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTrigger, { asChild: true, children: trigger }) : null,
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          _responsivedialog.ResponsiveDialogContent,
          {
            "data-slot": "candidate-profile-dialog",
            presentation: "preview",
            className: contentClassName,
            children: [
              showClose ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogClose, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _button.Button,
                {
                  type: "button",
                  variant: "quiet",
                  size: "icon",
                  "aria-label": closeLabel,
                  "data-slot": "candidate-profile-dialog-close",
                  className: "absolute right-2 top-2 z-10",
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.X, size: "lg" })
                }
              ) }) : null,
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialogHeader, { visibility: "screen-reader", children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTitle, { children: accessibleTitle }),
                accessibleDescription != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogDescription, { children: accessibleDescription }) : null
              ] }),
              header,
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogBody, { className: bodyClassName, children }),
              footer != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogFooter, { layout: footerLayout, children: footer }) : null
            ]
          }
        )
      ]
    }
  );
}



exports.CandidateProfileDialog = CandidateProfileDialog;
