// src/recruit/candidate-decision-reason-dialog.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@epicbagel/saas-kit/primitives/dialog";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Label } from "@epicbagel/saas-kit/primitives/label";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Textarea } from "@epicbagel/saas-kit/primitives/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  suggestions: "Tap a signal to use it as the reason",
  reason: "Why?",
  cancel: "Cancel"
};
var SUGGESTION_SEPARATOR = " \xB7 ";
function CandidateDecisionReasonDialog(props) {
  return props.id ? /* @__PURE__ */ jsx(ReasonDialog, { ...props, id: props.id }) : /* @__PURE__ */ jsx(ReasonDialogWithGeneratedId, { ...props });
}
function ReasonDialogWithGeneratedId(props) {
  const id = useId();
  return /* @__PURE__ */ jsx(ReasonDialog, { ...props, id });
}
function ReasonDialog({
  open,
  title,
  suggestions = [],
  placeholder,
  confirmLabel,
  confirmTone = "default",
  onSubmit,
  onClose,
  labels,
  id
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (!open) return;
    setReason("");
    setSubmitting(false);
  }, [open]);
  const submit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(reason.trim());
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: (next) => !next && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { size: "sm", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { size: "base", children: title }) }),
    /* @__PURE__ */ jsxs(Stack, { direction: "vertical", gap: "sm", children: [
      suggestions.length > 0 && /* @__PURE__ */ jsxs(Stack, { gap: "none", children: [
        /* @__PURE__ */ jsx(Text, { as: "div", variant: "eyebrow", marginBottom: "sm", children: text.suggestions }),
        /* @__PURE__ */ jsx(Stack, { direction: "horizontal", gap: "xs", wrap: true, children: suggestions.map((suggestion, index) => /* @__PURE__ */ jsx(
          Badge,
          {
            variant: "outline",
            size: "micro",
            weight: "normal",
            interactive: true,
            onClick: () => setReason((current) => current ? `${current}${SUGGESTION_SEPARATOR}${suggestion}` : suggestion),
            children: suggestion
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: id, appearance: "eyebrow", children: text.reason }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id,
            value: reason,
            onChange: (event) => setReason(event.target.value),
            rows: 3,
            placeholder,
            autoFocus: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: onClose, disabled: submitting, children: text.cancel }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: submit,
          disabled: submitting || reason.trim().length === 0,
          variant: confirmTone,
          children: [
            submitting ? /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: "md", spin: true }) : null,
            confirmLabel
          ]
        }
      )
    ] })
  ] }) });
}

export {
  CandidateDecisionReasonDialog
};
