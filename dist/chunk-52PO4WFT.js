// src/recruit/candidate-outreach-composer.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Textarea } from "@epicbagel/saas-kit/primitives/textarea";
import { Check, Copy, Loader2, MessageSquare, RefreshCw, Settings2 } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function present(value) {
  return value != null && value !== false && value !== "";
}
var LABELS = {
  title: "Outreach",
  guidanceHeading: (channel) => `${channel} tone`,
  reset: "Reset default",
  cancel: "Cancel",
  save: "Save",
  custom: "custom",
  draft: (channel) => `Draft ${channel} message`,
  drafting: "Drafting...",
  subject: "Subject: ",
  tone: "Tone: ",
  redo: "Redo",
  copy: "Copy",
  copied: "Copied"
};
function CandidateOutreachComposer({
  channels,
  channel,
  onChannelChange,
  guidance,
  draft,
  drafting = false,
  error,
  copied = false,
  onDraft,
  onCopy,
  onEditDraft,
  labels,
  border = "bottom",
  ...props
}) {
  const wording = { ...LABELS, ...labels };
  const channelLabel = channels.find((option) => option.value === channel)?.label ?? channel;
  return /* @__PURE__ */ jsxs(PanelSection, { "data-slot": "candidate-outreach-composer", border, ...props, children: [
    /* @__PURE__ */ jsx(
      SectionHeader,
      {
        label: wording.title,
        action: /* @__PURE__ */ jsx(Stack, { direction: "horizontal", gap: "xs", align: "center", children: channels.map((option) => /* @__PURE__ */ jsx(
          Button,
          {
            variant: channel === option.value ? "default" : "outline",
            size: "compact",
            onClick: () => onChannelChange(option.value),
            children: option.label
          },
          option.value
        )) })
      }
    ),
    guidance.editing ? /* @__PURE__ */ jsxs(Stack, { direction: "vertical", gap: "xs", marginBottom: "md", radius: "md", border: "dashed", padding: "sm", children: [
      /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "none", align: "center", justify: "between", children: [
        /* @__PURE__ */ jsx(Text, { variant: "micro", as: "span", weight: "medium", tone: "muted", transform: "uppercase", children: wording.guidanceHeading(channelLabel) }),
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "link-muted", size: "bare", onClick: () => guidance.onReset(), children: wording.reset })
      ] }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          value: guidance.value,
          onChange: (event) => guidance.onChange(event.target.value),
          rows: 2,
          textSize: "xs",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", justify: "end", children: [
        /* @__PURE__ */ jsx(Button, { size: "micro", variant: "ghost", onClick: () => guidance.onCancel(), children: wording.cancel }),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "micro",
            onClick: () => guidance.onSave(),
            disabled: !!guidance.saving || guidance.canSave === false,
            children: guidance.saving ? /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: "xs", spin: true }) : wording.save
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs(Button, { type: "button", variant: "quiet", size: "tone", onClick: () => guidance.onEdit(), children: [
      /* @__PURE__ */ jsx(Icon, { icon: Settings2, size: "xs", tone: "muted" }),
      /* @__PURE__ */ jsx(Text, { variant: "micro", as: "span", tone: "muted", truncate: true, grow: true, align: "start", children: guidance.text }),
      guidance.custom && /* @__PURE__ */ jsx(Badge, { as: "span", variant: "info", size: "tiny", weight: "normal", shrink: true, children: wording.custom })
    ] }),
    !draft ? /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", width: "full", onClick: () => onDraft(), disabled: drafting, children: [
      /* @__PURE__ */ jsx(Icon, { icon: drafting ? Loader2 : MessageSquare, size: "sm", spin: drafting }),
      drafting ? wording.drafting : wording.draft(channelLabel)
    ] }) : /* @__PURE__ */ jsxs(Stack, { direction: "vertical", gap: "sm", children: [
      draft.subject != null && draft.subject !== false && /* @__PURE__ */ jsxs(Text, { as: "div", variant: "inherit", size: "xs", children: [
        /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", tone: "muted", children: wording.subject }),
        /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", weight: "medium", children: draft.subject })
      ] }),
      /* @__PURE__ */ jsx(Textarea, { value: draft.message, onChange: (event) => onEditDraft(event.target.value), rows: 6, textSize: "xs" }),
      /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "none", align: "center", justify: "between", children: [
        /* @__PURE__ */ jsx(Text, { variant: "micro", as: "span", tone: "muted", children: present(draft.tone) ? /* @__PURE__ */ jsxs(Fragment, { children: [
          wording.tone,
          draft.tone
        ] }) : null }),
        /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", children: [
          /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "compact", onClick: () => onDraft(), disabled: drafting, children: [
            /* @__PURE__ */ jsx(Icon, { icon: drafting ? Loader2 : RefreshCw, size: "xs", spin: drafting, marginEnd: "md" }),
            wording.redo
          ] }),
          /* @__PURE__ */ jsxs(Button, { variant: "default", size: "compact", onClick: () => onCopy(), children: [
            /* @__PURE__ */ jsx(Icon, { icon: copied ? Check : Copy, size: "xs", marginEnd: "md" }),
            copied ? wording.copied : wording.copy
          ] })
        ] })
      ] })
    ] }),
    present(error) && /* @__PURE__ */ jsx(Text, { size: "xs", tone: "destructive", marginTop: "xs", children: error })
  ] });
}

export {
  CandidateOutreachComposer
};
