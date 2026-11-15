import {
  CandidateReviewActionRow
} from "./chunk-Z63PQB6T.js";
import {
  CandidateDecisionButtons
} from "./chunk-2LWKIODP.js";
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
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState
} from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function SheetUnavailable({ onUnavailable }) {
  useEffect(() => onUnavailable(), [onUnavailable]);
  return null;
}
var CandidateDecisionReasonSheet = lazy(
  () => import("./recruit/candidate-decision-reason-sheet.js").then(
    (module) => ({ default: module.CandidateDecisionReasonSheet }),
    () => ({ default: SheetUnavailable })
  )
);
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
  reasonPrompt = "dialog",
  reasonSheet,
  readOnly = false,
  disabled = false,
  padding = "default",
  labels
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [asking, setAsking] = useState(null);
  const [changing, setChanging] = useState(false);
  const [failure, setFailure] = useState(null);
  const failed = failure !== null;
  const [sheetUnavailable, setSheetUnavailable] = useState(false);
  const [saving, setSaving] = useState(false);
  const askingNow = useRef(asking);
  askingNow.current = asking;
  useEffect(() => {
    if (disabled) setAsking(null);
  }, [disabled]);
  const submit = async (why) => {
    if (!asking) return;
    setFailure(null);
    setSaving(true);
    try {
      await onDecide(asking, why);
      setAsking(null);
      setChanging(false);
    } catch (cause) {
      setAsking(null);
      setFailure({ cause });
    } finally {
      setSaving(false);
    }
  };
  const close = () => {
    setAsking(null);
    setFailure(null);
  };
  const sheet = typeof reasonSheet === "function" ? asking ? reasonSheet(asking) : void 0 : reasonSheet;
  const held = disabled || saving;
  const prompt = reasonPrompt === "sheet" && !sheetUnavailable ? (
    // Fetched as the row mounts, so a press opens the sheet at once.
    /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(
      CandidateDecisionReasonSheet,
      {
        open: asking !== null,
        decision: asking ?? void 0,
        candidateName,
        reasons: asking === "no" ? suggestions?.no : suggestions?.yes,
        reasonRequired: !reasonOptional,
        title: sheet?.title,
        subtitle: sheet?.subtitle,
        voiceTitle: sheet?.voiceTitle,
        skipLabel: sheet?.skipLabel,
        footer: sheet?.footer,
        actions: sheet?.actions,
        voice: sheet?.voice,
        voiceLang: sheet?.voiceLang,
        labels: sheet?.labels,
        onUnavailable: () => setSheetUnavailable(true),
        onConfirm: async (why) => {
          if (!asking) return;
          setSaving(true);
          try {
            await onDecide(asking, why ?? "");
            setAsking(null);
            setChanging(false);
          } catch (cause) {
            if (askingNow.current === null) setFailure({ cause });
            throw cause;
          } finally {
            setSaving(false);
          }
        },
        onClose: close
      }
    ) })
  ) : /* @__PURE__ */ jsx(
    CandidateDecisionReasonDialog,
    {
      open: asking !== null,
      title: asking === "no" ? text.noTitle(candidateName) : text.yesTitle(candidateName),
      suggestions: asking === "no" ? suggestions?.no : suggestions?.yes,
      placeholder: asking === "no" ? text.noPlaceholder : text.yesPlaceholder,
      confirmLabel: asking === "no" ? text.confirmNo : text.confirmYes,
      reasonOptional,
      onSubmit: submit,
      onClose: close,
      labels: labels?.reason === void 0 ? void 0 : { reason: labels.reason }
    }
  );
  const recorded = decision !== null && (readOnly || !changing && !failed);
  const said = decision === "yes" ? readOnly ? text.readOnlyYes : text.saidYes : readOnly ? text.readOnlyNo : text.saidNo;
  const content = recorded ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
      /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", children: [
        /* @__PURE__ */ jsx(Icon, { icon: decision === "yes" ? ThumbsUp : ThumbsDown, size: "sm" }),
        /* @__PURE__ */ jsx(Text, { as: "span", size: "sm", weight: "semibold", children: said })
      ] }),
      reason != null && reason !== "" ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", marginTop: "xs", children: reason }) : null
    ] }),
    readOnly ? null : /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", disabled: held, onClick: () => setChanging(true), children: text.change })
  ] }) : readOnly ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", children: text.unanswered }) : /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
    /* @__PURE__ */ jsx(
      CandidateDecisionButtons,
      {
        stretch: true,
        disabled: held,
        labels: { yes: text.yes, no: text.no },
        onChoose: (choice) => {
          setFailure(null);
          setAsking(choice);
        },
        children: prompt
      }
    ),
    failure ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "destructive", marginTop: "xs", role: "alert", children: typeof text.failed === "function" ? text.failed(failure.cause) : text.failed }) : null
  ] });
  const marks = {
    "data-slot": "candidate-client-decision",
    "data-decision": decision ?? "none",
    "data-read-only": readOnly || void 0
  };
  if (padding === "none") {
    return /* @__PURE__ */ jsx(
      Stack,
      {
        ...marks,
        direction: "horizontal",
        gap: "sm",
        align: "center",
        wrap: true,
        onClick: (event) => event.stopPropagation(),
        children: content
      }
    );
  }
  return /* @__PURE__ */ jsx(CandidateReviewActionRow, { ...marks, isolateClicks: true, children: content });
}

export {
  CandidateClientDecision
};
