"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-profile-dialog.tsx
var _usemobile = require('@epicbagel/saas-kit/hooks/use-mobile');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _icon = require('@epicbagel/saas-kit/primitives/icon');










var _responsivedialog = require('@epicbagel/saas-kit/primitives/responsive-dialog');








var _sheet = require('@epicbagel/saas-kit/primitives/sheet');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_CLOSE_LABEL = "Close candidate profile";
var CloseButton = _react.forwardRef.call(void 0, function CloseButton2(props, ref) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _button.Button,
    {
      ref,
      type: "button",
      variant: "quiet",
      size: "icon",
      "data-slot": "candidate-profile-dialog-close",
      className: "absolute right-2 top-2 z-10",
      ...props,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.X, size: "lg" })
    }
  );
});
function CandidateProfileDialog({
  presentation = "dialog",
  ...props
}) {
  return presentation === "sheet" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CandidateProfileSheet, { ...props }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CandidateProfileCentredDialog, { ...props });
}
function CandidateProfileCentredDialog({
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
  closeLabel = DEFAULT_CLOSE_LABEL,
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
            "data-presentation": "dialog",
            presentation: "preview",
            className: contentClassName,
            children: [
              showClose ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogClose, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CloseButton, { "aria-label": closeLabel }) }) : null,
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
function CandidateProfileSheet({
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
  closeLabel = DEFAULT_CLOSE_LABEL,
  contentClassName,
  bodyClassName
}) {
  const isMobile = _usemobile.useIsMobile.call(void 0, );
  const side = isMobile ? "bottom" : "right";
  const surfaceClassName = [
    "gap-0",
    // As tall as the dialog's drawer on a phone; as wide as the dialog on desktop.
    isMobile ? "max-h-[92dvh] rounded-t-xl" : "w-full sm:max-w-2xl",
    contentClassName
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _sheet.Sheet, { open, defaultOpen, onOpenChange, children: [
    trigger ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sheet.SheetTrigger, { asChild: true, children: trigger }) : null,
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _sheet.SheetContent,
      {
        "data-slot": "candidate-profile-dialog",
        "data-presentation": "sheet",
        "data-side": side,
        side,
        padding: "none",
        hideClose: true,
        ...accessibleDescription == null ? { "aria-describedby": void 0 } : {},
        className: surfaceClassName,
        children: [
          showClose ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sheet.SheetClose, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CloseButton, { "aria-label": closeLabel }) }) : null,
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _sheet.SheetHeader, { className: "sr-only", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sheet.SheetTitle, { children: accessibleTitle }),
            accessibleDescription != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sheet.SheetDescription, { children: accessibleDescription }) : null
          ] }),
          header,
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogBody, { className: bodyClassName, children }),
          footer != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _stack.Stack,
            {
              "data-slot": "candidate-profile-dialog-footer",
              direction: "horizontal",
              gap: "sm",
              align: "center",
              justify: "end",
              shrink: false,
              border: "top",
              surface: "background",
              padding: "action-row",
              className: footerLayout === "fill" ? "[&>*]:min-w-0 [&>*]:flex-1" : void 0,
              children: footer
            }
          ) : null
        ]
      }
    )
  ] });
}



exports.CandidateProfileDialog = CandidateProfileDialog;
