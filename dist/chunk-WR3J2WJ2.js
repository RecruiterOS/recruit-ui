// src/recruit/candidate-profile-dialog.tsx
import { useIsMobile } from "@epicbagel/saas-kit/hooks/use-mobile";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger
} from "@epicbagel/saas-kit/primitives/responsive-dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@epicbagel/saas-kit/primitives/sheet";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { X } from "lucide-react";
import { forwardRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_CLOSE_LABEL = "Close candidate profile";
var CloseButton = forwardRef(function CloseButton2(props, ref) {
  return /* @__PURE__ */ jsx(
    Button,
    {
      ref,
      type: "button",
      variant: "quiet",
      size: "icon",
      "data-slot": "candidate-profile-dialog-close",
      className: "absolute right-2 top-2 z-10",
      ...props,
      children: /* @__PURE__ */ jsx(Icon, { icon: X, size: "lg" })
    }
  );
});
function CandidateProfileDialog({
  presentation = "dialog",
  ...props
}) {
  return presentation === "sheet" ? /* @__PURE__ */ jsx(CandidateProfileSheet, { ...props }) : /* @__PURE__ */ jsx(CandidateProfileCentredDialog, { ...props });
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
  return /* @__PURE__ */ jsxs(
    ResponsiveDialog,
    {
      open,
      defaultOpen,
      onOpenChange,
      children: [
        trigger ? /* @__PURE__ */ jsx(ResponsiveDialogTrigger, { asChild: true, children: trigger }) : null,
        /* @__PURE__ */ jsxs(
          ResponsiveDialogContent,
          {
            "data-slot": "candidate-profile-dialog",
            "data-presentation": "dialog",
            presentation: "preview",
            className: contentClassName,
            children: [
              showClose ? /* @__PURE__ */ jsx(ResponsiveDialogClose, { asChild: true, children: /* @__PURE__ */ jsx(CloseButton, { "aria-label": closeLabel }) }) : null,
              /* @__PURE__ */ jsxs(ResponsiveDialogHeader, { visibility: "screen-reader", children: [
                /* @__PURE__ */ jsx(ResponsiveDialogTitle, { children: accessibleTitle }),
                accessibleDescription != null ? /* @__PURE__ */ jsx(ResponsiveDialogDescription, { children: accessibleDescription }) : null
              ] }),
              header,
              /* @__PURE__ */ jsx(ResponsiveDialogBody, { className: bodyClassName, children }),
              footer != null ? /* @__PURE__ */ jsx(ResponsiveDialogFooter, { layout: footerLayout, children: footer }) : null
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
  const isMobile = useIsMobile();
  const side = isMobile ? "bottom" : "right";
  const surfaceClassName = [
    "gap-0",
    // As tall as the dialog's drawer on a phone; as wide as the dialog on desktop.
    isMobile ? "max-h-[92dvh] rounded-t-xl" : "w-full sm:max-w-2xl",
    contentClassName
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs(Sheet, { open, defaultOpen, onOpenChange, children: [
    trigger ? /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: trigger }) : null,
    /* @__PURE__ */ jsxs(
      SheetContent,
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
          showClose ? /* @__PURE__ */ jsx(SheetClose, { asChild: true, children: /* @__PURE__ */ jsx(CloseButton, { "aria-label": closeLabel }) }) : null,
          /* @__PURE__ */ jsxs(SheetHeader, { className: "sr-only", children: [
            /* @__PURE__ */ jsx(SheetTitle, { children: accessibleTitle }),
            accessibleDescription != null ? /* @__PURE__ */ jsx(SheetDescription, { children: accessibleDescription }) : null
          ] }),
          header,
          /* @__PURE__ */ jsx(ResponsiveDialogBody, { className: bodyClassName, children }),
          footer != null ? /* @__PURE__ */ jsx(
            Stack,
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

export {
  CandidateProfileDialog
};
