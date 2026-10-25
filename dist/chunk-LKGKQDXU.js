// src/recruit/candidate-notes.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Card } from "@epicbagel/saas-kit/primitives/card";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Textarea } from "@epicbagel/saas-kit/primitives/textarea";
import { Loader2, MessageSquare, Mic, Sparkles, StickyNote, Trash2 } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function present(value) {
  return value != null && value !== false && value !== "";
}
function CandidateNoteList({
  count,
  loading = false,
  title = "Notes",
  empty = { title: "No notes yet" },
  composer,
  children,
  border = "bottom",
  ...props
}) {
  return /* @__PURE__ */ jsxs(PanelSection, { "data-slot": "candidate-note-list", border, ...props, children: [
    /* @__PURE__ */ jsx(SectionHeader, { label: title, count: loading ? void 0 : count }),
    loading ? /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "sm", marginTop: "md", children: /* @__PURE__ */ jsx(Skeleton, { preset: "row", radius: "xl" }) }) : count > 0 ? /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "sm", marginTop: "md", children }) : /* @__PURE__ */ jsx(
      EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: StickyNote,
        title: empty.title,
        description: empty.description
      }
    ),
    composer
  ] });
}
var NOTE_CARD_LABELS = {
  voice: "\xB7 voice",
  delete: "Delete note"
};
var NOTE_ICON = { voice: Mic, agent: Sparkles, note: MessageSquare };
function CandidateNoteCard({
  author,
  kind = "note",
  pinned,
  scope,
  date,
  text,
  onDelete,
  revealDelete = "hover",
  labels,
  ...props
}) {
  const voiceLabel = labels?.voice !== void 0 ? labels.voice : NOTE_CARD_LABELS.voice;
  const deleteLabel = labels?.delete ?? NOTE_CARD_LABELS.delete;
  return /* @__PURE__ */ jsxs(Card, { interaction: "group", surface: pinned ? "card" : "muted", padding: "row", ...props, children: [
    /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "none", align: "center", justify: "between", marginBottom: "md", children: [
      /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", textSize: "xs", tone: "muted", wrap: true, children: [
        /* @__PURE__ */ jsxs(Text, { variant: "inherit", as: "span", display: "inline-flex", weight: "medium", tone: "soft", children: [
          /* @__PURE__ */ jsx(Icon, { icon: NOTE_ICON[kind], size: "xs" }),
          author
        ] }),
        pinned && /* @__PURE__ */ jsx(Badge, { as: "span", variant: "info", size: "micro", weight: "semibold", title: pinned.title, children: pinned.label }),
        kind === "voice" && present(voiceLabel) && /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", tone: "subtle", children: voiceLabel }),
        scope && /* @__PURE__ */ jsx(
          Badge,
          {
            as: "span",
            variant: scope.highlighted ? "info" : "default",
            size: "micro",
            weight: "semibold",
            title: scope.title,
            children: scope.label
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", align: "center", children: [
        date,
        onDelete && /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            size: "icon-sm",
            reveal: revealDelete === "always" ? "always" : "parent-hover-responsive",
            variant: "ghost-destructive",
            onClick: () => onDelete(),
            title: deleteLabel,
            children: /* @__PURE__ */ jsx(Icon, { icon: Trash2, size: "sm" })
          }
        )
      ] })
    ] }),
    present(text) && /* @__PURE__ */ jsx(Text, { size: "sm", whitespace: "pre-wrap", children: text })
  ] });
}
var COMPOSER_LABELS = {
  voice: "Tap to speak",
  type: "or type instead",
  placeholder: "Type your note\u2026",
  cancel: "Cancel",
  submit: "Add note"
};
function CandidateNoteComposer({
  onVoice,
  onSubmit,
  suggestions = [],
  labels,
  ...props
}) {
  const copy = { ...COMPOSER_LABELS, ...labels };
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async (note) => {
    const trimmed = note.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await onSubmit(trimmed);
      setText("");
      setTyping(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };
  if (typing) {
    return /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-note-composer", direction: "vertical", gap: "sm", marginTop: "md", ...props, children: [
      /* @__PURE__ */ jsx(
        Textarea,
        {
          resize: "none",
          placeholder: copy.placeholder,
          value: text,
          onChange: (event) => setText(event.target.value),
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", children: [
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
          setTyping(false);
          setText("");
        }, children: copy.cancel }),
        /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => void submit(text), disabled: !text.trim() || saving, children: saving ? /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: "sm", spin: true }) : copy.submit })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-note-composer", direction: "vertical", gap: "sm", marginTop: "md", ...props, children: [
    /* @__PURE__ */ jsxs(Stack, { direction: "vertical", gap: "sm", align: "center", paddingY: "md", children: [
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "voice", "aria-label": copy.voice, onClick: () => onVoice?.(), children: /* @__PURE__ */ jsx(Icon, { icon: Mic, size: 28, tone: "muted" }) }),
      /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", size: "sm", weight: "medium", children: copy.voice }),
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "quiet", size: "bare", onClick: () => setTyping(true), children: copy.type })
    ] }),
    suggestions.length > 0 && /* @__PURE__ */ jsx(Stack, { direction: "horizontal", gap: "xs", justify: "center", wrap: true, children: suggestions.map((suggestion) => /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        variant: "outline-muted",
        size: "suggestion",
        onClick: () => void submit(suggestion),
        children: suggestion
      },
      suggestion
    )) })
  ] });
}

export {
  CandidateNoteList,
  CandidateNoteCard,
  CandidateNoteComposer
};
