import {
  CandidateReviewActionRow
} from "./chunk-Z63PQB6T.js";
import {
  CandidateDecisionButtons
} from "./chunk-YAL7V43Q.js";
import {
  CandidateDecisionReasonDialog
} from "./chunk-JNUWDHFV.js";

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
  failed: "That didn't save. Try again.",
  readOnlyYes: "Said Yes",
  readOnlyNo: "Said No",
  unanswered: "No answer yet"
};
function CandidateClientDecision({
  candidateName,
  decision = null,
  reason,
  onDecide,
  suggestions,
  reasonOptional = false,
  readOnly = false,
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
      reasonOptional,
      onSubmit: submit,
      onClose: () => {
        setAsking(null);
        setFailed(false);
      },
      labels: labels?.reason === void 0 ? void 0 : { reason: labels.reason }
    }
  );
  const recorded = decision !== null && (readOnly || !changing && !failed);
  const said = decision === "yes" ? readOnly ? text.readOnlyYes : text.saidYes : readOnly ? text.readOnlyNo : text.saidNo;
  return /* @__PURE__ */ jsx(
    CandidateReviewActionRow,
    {
      "data-slot": "candidate-client-decision",
      "data-decision": decision ?? "none",
      "data-read-only": readOnly || void 0,
      isolateClicks: true,
      children: recorded ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
          /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", children: [
            /* @__PURE__ */ jsx(Icon, { icon: decision === "yes" ? ThumbsUp : ThumbsDown, size: "sm" }),
            /* @__PURE__ */ jsx(Text, { as: "span", size: "sm", weight: "semibold", children: said })
          ] }),
          reason != null && reason !== "" ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", marginTop: "xs", children: reason }) : null
        ] }),
        readOnly ? null : /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setChanging(true), children: text.change })
      ] }) : readOnly ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", children: text.unanswered }) : /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
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
