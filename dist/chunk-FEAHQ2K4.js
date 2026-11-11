import {
  CandidateReviewActionRow
} from "./chunk-Z63PQB6T.js";
import {
  CandidateDecisionButtons
} from "./chunk-YAL7V43Q.js";
import {
  CandidateDecisionReasonDialog
} from "./chunk-3RBD3Y2K.js";

// src/recruit/candidate-client-decision.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  yes: "Yes",
  no: "No",
  saidYes: "You said Yes",
  saidNo: "You said No",
  change: "Change",
  yesTitle: (name) => `Yes to ${name}`,
  noTitle: (name) => `No to ${name}`,
  yesPlaceholder: "What stands out?",
  noPlaceholder: "What's missing?",
  confirmYes: "Save Yes",
  confirmNo: "Save No",
  reason: "Why?",
  failed: "That didn't save. Try again."
};
function CandidateClientDecision({
  candidateName,
  decision = null,
  reason,
  onDecide,
  suggestions,
  labels
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [asking, setAsking] = useState(null);
  const [changing, setChanging] = useState(false);
  const [failed, setFailed] = useState(false);
  const submit = async (why) => {
    if (!asking) return;
    setFailed(false);
    try {
      await onDecide(asking, why);
      setAsking(null);
      setChanging(false);
    } catch {
      setAsking(null);
      setFailed(true);
    }
  };
  const dialog = /* @__PURE__ */ jsx(
    CandidateDecisionReasonDialog,
    {
      open: asking !== null,
      title: asking === "no" ? text.noTitle(candidateName) : text.yesTitle(candidateName),
      suggestions: asking === "no" ? suggestions?.no : suggestions?.yes,
      placeholder: asking === "no" ? text.noPlaceholder : text.yesPlaceholder,
      confirmLabel: asking === "no" ? text.confirmNo : text.confirmYes,
      onSubmit: submit,
      onClose: () => {
        setAsking(null);
        setFailed(false);
      },
      labels: { reason: text.reason }
    }
  );
  const recorded = decision !== null && !changing && !failed;
  return /* @__PURE__ */ jsx(
    CandidateReviewActionRow,
    {
      "data-slot": "candidate-client-decision",
      "data-decision": decision ?? "none",
      isolateClicks: true,
      children: recorded ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
          /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", children: [
            /* @__PURE__ */ jsx(Icon, { icon: decision === "yes" ? ThumbsUp : ThumbsDown, size: "sm" }),
            /* @__PURE__ */ jsx(Text, { as: "span", size: "sm", weight: "semibold", children: decision === "yes" ? text.saidYes : text.saidNo })
          ] }),
          reason != null && reason !== "" ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", marginTop: "xs", children: reason }) : null
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setChanging(true), children: text.change })
      ] }) : /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
        /* @__PURE__ */ jsx(
          CandidateDecisionButtons,
          {
            stretch: true,
            labels: { yes: text.yes, no: text.no },
            onChoose: (choice) => {
              setFailed(false);
              setAsking(choice);
            },
            children: dialog
          }
        ),
        failed ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "destructive", marginTop: "xs", role: "alert", children: text.failed }) : null
      ] })
    }
  );
}

export {
  CandidateClientDecision
};
