"use client";

// src/recruit/call-reconcile-dialogs.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Input } from "@epicbagel/saas-kit/primitives/input";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle
} from "@epicbagel/saas-kit/primitives/responsive-dialog";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function CallReconcileDialogs({ labels: text, participants, create, preview }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ResponsiveDialog, { open: create.open, onOpenChange: create.onOpenChange, children: /* @__PURE__ */ jsxs(ResponsiveDialogContent, { children: [
      /* @__PURE__ */ jsx(ResponsiveDialogHeader, { children: /* @__PURE__ */ jsx(ResponsiveDialogTitle, { children: text.createTitle }) }),
      /* @__PURE__ */ jsx(ResponsiveDialogBody, { children: /* @__PURE__ */ jsxs(Stack, { gap: "sm", children: [
        participants.length > 0 && /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
          /* @__PURE__ */ jsx(Text, { variant: "small", tone: "muted", children: text.useParticipant }),
          /* @__PURE__ */ jsx(Stack, { direction: "horizontal", gap: "sm", wrap: true, children: participants.map((participant, index) => /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => {
                create.onNameChange(participant.name ?? "");
                create.onEmailChange(participant.email ?? "");
              },
              children: participant.name || participant.email
            },
            `${participant.email ?? participant.name}-${index}`
          )) })
        ] }),
        /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
          /* @__PURE__ */ jsx(Text, { variant: "small", tone: "muted", children: text.name }),
          /* @__PURE__ */ jsx(Input, { value: create.name, onChange: (event) => create.onNameChange(event.target.value), placeholder: text.namePlaceholder })
        ] }),
        /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
          /* @__PURE__ */ jsx(Text, { variant: "small", tone: "muted", children: text.email }),
          /* @__PURE__ */ jsx(Input, { type: "email", value: create.email, onChange: (event) => create.onEmailChange(event.target.value), placeholder: text.emailPlaceholder })
        ] }),
        /* @__PURE__ */ jsx(Button, { size: "sm", disabled: !create.name.trim(), onClick: () => create.onSubmit(), children: text.createSubmit })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(ResponsiveDialog, { open: preview.open, onOpenChange: (open) => !open && preview.onClose(), children: /* @__PURE__ */ jsxs(ResponsiveDialogContent, { presentation: "preview", children: [
      /* @__PURE__ */ jsx(ResponsiveDialogHeader, { visibility: "screen-reader", children: /* @__PURE__ */ jsx(ResponsiveDialogTitle, { children: text.previewTitle }) }),
      preview.open && /* @__PURE__ */ jsxs(Stack, { gap: "none", minHeight: "zero", grow: true, children: [
        /* @__PURE__ */ jsx(FlexItem, { grow: true, minHeight: "zero", overflow: "hidden", children: preview.content }),
        /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "end", border: "top", surface: "background", padding: "action-row", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: preview.onClose, children: text.cancel }),
          /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => preview.onAttach(), children: text.attach })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  CallReconcileDialogs
};
