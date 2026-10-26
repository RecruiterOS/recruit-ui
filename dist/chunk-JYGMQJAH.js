import {
  usePendingAction
} from "./chunk-SBRXJRL4.js";

// src/recruit/candidate-outreach-drafts.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CopyButton } from "@epicbagel/saas-kit/primitives/copy-button";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Check, Loader2, Send, X } from "lucide-react";
import { useId } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var NO_ACTIONS = [];
var DRAFT_ACTIONS = ["approve", "dismiss"];
var APPROVED_ACTIONS = ["markSent"];
function defaultOutreachDraftActions(draft) {
  if (draft.status === "draft") return DRAFT_ACTIONS;
  if (draft.status === "approved") return APPROVED_ACTIONS;
  return NO_ACTIONS;
}
var ACTION_NAME = {
  copy: (channel) => `Copy ${channel} draft`,
  approve: (channel) => `Approve ${channel} draft`,
  dismiss: (channel) => `Dismiss ${channel} draft`,
  markSent: (channel) => `Mark ${channel} draft sent`
};
var LABELS = {
  status: { draft: "draft", approved: "approved", sent: "sent", dismissed: "dismissed" },
  approve: "Approve",
  dismiss: "Dismiss",
  markSent: "Mark sent",
  actionName: (action, channel) => ACTION_NAME[action](channel)
};
function outreachDraftCopyText(draft) {
  return draft.subject ? `Subject: ${draft.subject}

${draft.body}` : draft.body;
}
function CandidateOutreachDraftCard({
  draft,
  onApprove,
  onDismiss,
  onMarkSent,
  availableActions,
  copyText = outreachDraftCopyText,
  labels,
  ...props
}) {
  const copy = { ...LABELS, ...labels };
  const channel = draft.channel.label;
  const offered = availableActions(draft);
  const [approving, approve] = usePendingAction(onApprove && (() => onApprove(draft)));
  const [dismissing, dismiss] = usePendingAction(onDismiss && (() => onDismiss(draft)));
  const [sending, markSent] = usePendingAction(onMarkSent && (() => onMarkSent(draft)));
  const busy = approving || dismissing || sending;
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      "data-slot": "candidate-outreach-draft",
      direction: "vertical",
      gap: "sm",
      surface: "card",
      radius: "md",
      padding: "compact",
      ...props,
      children: [
        /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "between", children: [
          /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", minWidth: "zero", children: [
            draft.channel.icon ? /* @__PURE__ */ jsx(Icon, { icon: draft.channel.icon, size: "md", tone: "muted" }) : null,
            /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", size: "sm", weight: "medium", children: channel }),
            /* @__PURE__ */ jsx(Badge, { variant: draft.status === "draft" ? "secondary" : "outline", size: "micro", children: copy.status[draft.status] })
          ] }),
          /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", shrink: false, children: [
            /* @__PURE__ */ jsx(CopyButton, { text: copyText(draft), "aria-label": copy.actionName("copy", channel) }),
            offered.includes("approve") && onApprove ? /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                title: copy.approve,
                "aria-label": copy.actionName("approve", channel),
                disabled: busy,
                onClick: approve,
                children: /* @__PURE__ */ jsx(Icon, { icon: approving ? Loader2 : Check, size: "sm", spin: approving })
              }
            ) : null,
            offered.includes("dismiss") && onDismiss ? /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                title: copy.dismiss,
                "aria-label": copy.actionName("dismiss", channel),
                disabled: busy,
                onClick: dismiss,
                children: /* @__PURE__ */ jsx(Icon, { icon: dismissing ? Loader2 : X, size: "sm", spin: dismissing })
              }
            ) : null,
            offered.includes("markSent") && onMarkSent ? /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                title: copy.markSent,
                "aria-label": copy.actionName("markSent", channel),
                disabled: busy,
                onClick: markSent,
                children: /* @__PURE__ */ jsx(Icon, { icon: sending ? Loader2 : Send, size: "sm", spin: sending })
              }
            ) : null
          ] })
        ] }),
        draft.subject ? /* @__PURE__ */ jsx(Text, { size: "xs", weight: "medium", children: draft.subject }) : null,
        /* @__PURE__ */ jsx(Text, { size: "sm", whitespace: "pre-wrap", tone: "soft", children: draft.body })
      ]
    }
  );
}
function CandidateOutreachDraftList({
  drafts,
  loading = false,
  title = "Outreach drafts",
  empty = { title: "No outreach drafts yet" },
  onApprove,
  onDismiss,
  onMarkSent,
  availableActions = defaultOutreachDraftActions,
  copyText,
  border = "bottom",
  labels,
  ...props
}) {
  const titleId = useId();
  const count = drafts.length;
  return /* @__PURE__ */ jsxs(
    PanelSection,
    {
      "data-slot": "candidate-outreach-draft-list",
      "aria-labelledby": titleId,
      border,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SectionHeader, { id: titleId, label: title, count: !loading && count > 0 ? count : void 0 }),
        loading && count === 0 ? /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "sm", children: /* @__PURE__ */ jsx(Skeleton, { preset: "row" }) }) : count === 0 ? /* @__PURE__ */ jsx(
          EmptyState,
          {
            variant: "empty",
            size: "inline",
            icon: Send,
            title: empty.title,
            description: empty.description ?? ""
          }
        ) : /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "sm", children: drafts.map((draft) => /* @__PURE__ */ jsx(
          CandidateOutreachDraftCard,
          {
            draft,
            onApprove,
            onDismiss,
            onMarkSent,
            availableActions,
            copyText,
            labels
          },
          draft.id
        )) })
      ]
    }
  );
}

export {
  defaultOutreachDraftActions,
  outreachDraftCopyText,
  CandidateOutreachDraftList
};
