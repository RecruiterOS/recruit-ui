// src/recruit/candidate-call-card.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CallCard } from "@epicbagel/saas-kit/primitives/call-card";
import { DeleteConfirmationDialog } from "@epicbagel/saas-kit/primitives/delete-confirmation-dialog";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { BriefcaseBusiness, Loader2 } from "lucide-react";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  untitled: "Untitled call",
  showTranscript: "Show transcript",
  unlink: "Unlink",
  unlinkTitle: "Unlink this call?",
  unlinkDescription: "The call will be removed from this person. Its transcript is kept.",
  unlinkItem: "this call",
  unlinkConfirm: "Unlink call",
  check: "Check against open jobs",
  recheck: "Recheck against open jobs",
  checking: "Checking\u2026",
  noRolesTitle: "No suggested roles yet",
  noRolesDescription: "No other live role fits this person from this call."
};
var isShown = (node) => node != null && node !== false && node !== "";
function CandidateCallCard({
  title,
  source,
  timestamp,
  participants,
  segments,
  transcript,
  confidence,
  onUnlink,
  insights,
  roleMatches,
  labels,
  className
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [confirmUnlink, setConfirmUnlink] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const ready = insights.status === "ready";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      CallCard,
      {
        className,
        title: title || text.untitled,
        source,
        timestamp,
        participants,
        segments: segments ?? void 0,
        transcript,
        transcriptLabel: text.showTranscript,
        headerAside: isShown(confidence) ? /* @__PURE__ */ jsx(Badge, { variant: "secondary", size: "micro", titleCase: "capitalize", children: confidence }) : void 0,
        actions: /* @__PURE__ */ jsxs(Stack, { gap: "sm", width: "full", children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", disabled: unlinking, onClick: () => setConfirmUnlink(true), children: unlinking ? /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: "sm", spin: true }) : text.unlink }),
          ready ? /* @__PURE__ */ jsxs(Stack, { gap: "sm", children: [
            isShown(roleMatches) ? roleMatches : /* @__PURE__ */ jsx(
              EmptyState,
              {
                variant: "empty",
                size: "inline",
                icon: BriefcaseBusiness,
                title: text.noRolesTitle,
                description: text.noRolesDescription
              }
            ),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => insights.onGenerate(true), disabled: insights.generating, children: insights.generating ? text.checking : text.recheck })
          ] }) : /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
            insights.error && /* @__PURE__ */ jsx(Text, { size: "xs", tone: "destructive", children: insights.error }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => insights.onGenerate(false), disabled: insights.generating, children: insights.generating ? text.checking : text.check })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteConfirmationDialog,
      {
        open: confirmUnlink,
        onOpenChange: setConfirmUnlink,
        title: text.unlinkTitle,
        description: text.unlinkDescription,
        itemName: title || text.unlinkItem,
        confirmText: text.unlinkConfirm,
        onConfirm: () => {
          setConfirmUnlink(false);
          setUnlinking(true);
          void onUnlink().finally(() => setUnlinking(false));
        }
      }
    )
  ] });
}

export {
  CandidateCallCard
};
