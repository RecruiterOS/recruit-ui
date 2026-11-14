// src/recruit/candidate-decision-reason-sheet.tsx
import { useDictation } from "@epicbagel/saas-kit/hooks/use-dictation";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Chat } from "@epicbagel/saas-kit/primitives/chat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@epicbagel/saas-kit/primitives/dialog";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { ArrowRight, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  cancel: "Cancel",
  speak: "Tap to speak",
  typeInstead: "or type instead",
  reasons: "or pick a reason",
  placeholder: "Type a reason\u2026",
  saving: "Saving\u2026",
  failed: "That didn't save. Try again."
};
function isPromiseLike(value) {
  return value != null && typeof value.then === "function";
}
function shown(node) {
  return node != null && node !== false && node !== "";
}
function defaultTitle(decision) {
  if (decision === "yes") return "Why yes?";
  if (decision === "no") return "Why no?";
  return "Why?";
}
function defaultSubtitle(candidateName, hasReasons) {
  const whose = candidateName ? ` for ${candidateName}` : "";
  return hasReasons ? `Give your reason${whose}, or pick one.` : `Give your reason${whose}.`;
}
function defaultVoiceTitle(decision, candidateName, title) {
  if (decision && candidateName) return `Why ${decision} on ${candidateName}?`;
  return typeof title === "string" ? title : defaultTitle(decision);
}
function defaultSkipLabel(decision) {
  if (decision === "yes") return "Skip \u2014 just mark Yes";
  if (decision === "no") return "Skip \u2014 just mark No";
  return "Skip";
}
function useDictationSupport() {
  const { supported } = useDictation();
  const [known, setKnown] = useState(false);
  useEffect(() => setKnown(true), []);
  return known ? supported : null;
}
function CandidateDecisionReasonSheet({
  open,
  onClose,
  decision,
  candidateName,
  title,
  subtitle,
  reasons = [],
  ...body
}) {
  const opener = useRef(null);
  if (!open) return null;
  const chips = [...new Set(reasons.map((reason) => reason.trim()).filter(Boolean))];
  const heading = shown(title) ? title : defaultTitle(decision);
  const description = subtitle === void 0 ? defaultSubtitle(candidateName, chips.length > 0) : subtitle;
  const described = shown(description);
  return /* @__PURE__ */ jsx(Dialog, { open: true, onOpenChange: (next) => {
    if (!next) onClose();
  }, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      size: "wide",
      height: "viewport-lg",
      layout: "column",
      padding: "none",
      overflow: "hidden",
      hideClose: true,
      ...described ? {} : { "aria-describedby": void 0 },
      onOpenAutoFocus: () => {
        opener.current = document.activeElement;
      },
      onCloseAutoFocus: (event) => {
        const from = opener.current;
        if (!(from instanceof HTMLElement) || !from.isConnected) return;
        event.preventDefault();
        from.focus();
      },
      onClick: (event) => event.stopPropagation(),
      onKeyDown: (event) => event.stopPropagation(),
      children: [
        /* @__PURE__ */ jsx(DialogTitle, { visuallyHidden: true, asChild: true, children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: heading }) }),
        described ? /* @__PURE__ */ jsx(DialogDescription, { visuallyHidden: true, asChild: true, children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: description }) }) : null,
        /* @__PURE__ */ jsx(
          ReasonSheetBody,
          {
            ...body,
            onClose,
            decision,
            candidateName,
            heading,
            description: described ? description : void 0,
            chips
          }
        )
      ]
    }
  ) });
}
function ReasonSheetBody({
  onClose,
  decision,
  candidateName,
  heading,
  description,
  voiceTitle,
  chips,
  onConfirm,
  reasonRequired = false,
  skipLabel,
  footer,
  actions,
  voice = true,
  voiceLang,
  labels
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const dictation = useDictationSupport();
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const inFlight = useRef(false);
  const confirm = async (reason) => {
    if (inFlight.current) return;
    setFailed(false);
    try {
      const result = onConfirm(reason);
      if (isPromiseLike(result)) {
        inFlight.current = true;
        setSaving(true);
        await result;
      }
    } catch (cause) {
      setFailed(true);
      throw cause;
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };
  const hasBottomRow = shown(actions) || !reasonRequired;
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      "data-slot": "candidate-decision-reason-sheet",
      "data-decision": decision,
      direction: "vertical",
      gap: "none",
      grow: true,
      minHeight: "zero",
      children: [
        /* @__PURE__ */ jsx(
          Stack,
          {
            direction: "horizontal",
            gap: "none",
            align: "center",
            justify: "end",
            paddingX: "md",
            paddingTop: "safe",
            paddingBottom: "sm",
            children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon-md", title: text.cancel, onClick: onClose, children: /* @__PURE__ */ jsx(Icon, { icon: X, size: "lg" }) })
          }
        ),
        /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "none", justify: "center", grow: true, overflow: "y-auto", paddingX: "md", children: /* @__PURE__ */ jsx(Stack, { gap: "none", centered: true, width: "full", maxWidth: "xl", children: dictation === null ? null : /* @__PURE__ */ jsx(
          Chat,
          {
            messages: [],
            onSend: (reason) => confirm(reason.trim() || void 0),
            onSendError: () => void 0,
            pending: saving,
            emptyPendingContent: (
              // The composer is gone while this shows, so it is said aloud.
              /* @__PURE__ */ jsx(Stack, { role: "status", gap: "none", width: "full", children: /* @__PURE__ */ jsx(
                EmptyState,
                {
                  variant: "empty",
                  size: "md",
                  icon: Loader2,
                  iconMotion: "spin",
                  surface: "plain",
                  title: text.saving,
                  description: ""
                }
              ) })
            ),
            error: failed ? text.failed : null,
            defaultMode: voice && dictation ? "voice" : "text",
            voice,
            voiceLang,
            voiceTitle: voiceTitle ?? defaultVoiceTitle(decision, candidateName, heading),
            voiceHeroLabel: text.speak,
            voiceHeroSwitchLabel: text.typeInstead,
            emptyTitle: heading,
            emptySubtitle: description,
            examplePrompts: chips,
            examplePromptsLabel: text.reasons,
            placeholder: text.placeholder
          }
        ) }) }),
        shown(footer) || hasBottomRow ? /* @__PURE__ */ jsxs(
          Stack,
          {
            "data-slot": "candidate-decision-reason-sheet-footer",
            direction: "vertical",
            gap: "sm",
            align: "center",
            border: "top",
            paddingX: "lg",
            paddingY: "md",
            children: [
              footer,
              hasBottomRow ? /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "center", wrap: true, children: [
                actions,
                reasonRequired ? null : /* @__PURE__ */ jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "lg",
                    disabled: saving,
                    onClick: () => void confirm().catch(() => void 0),
                    children: [
                      shown(skipLabel) ? skipLabel : defaultSkipLabel(decision),
                      /* @__PURE__ */ jsx(Icon, { icon: ArrowRight, size: "md", marginStart: "sm" })
                    ]
                  }
                )
              ] }) : null
            ]
          }
        ) : null
      ]
    }
  );
}

export {
  CandidateDecisionReasonSheet
};
