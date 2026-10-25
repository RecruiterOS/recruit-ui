// src/recruit/candidate-profile-dialog.tsx
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
import { X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
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
            presentation: "preview",
            className: contentClassName,
            children: [
              showClose ? /* @__PURE__ */ jsx(ResponsiveDialogClose, { asChild: true, children: /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "quiet",
                  size: "icon",
                  "aria-label": closeLabel,
                  "data-slot": "candidate-profile-dialog-close",
                  className: "absolute right-2 top-2 z-10",
                  children: /* @__PURE__ */ jsx(Icon, { icon: X, size: "lg" })
                }
              ) }) : null,
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

export {
  CandidateProfileDialog
};
