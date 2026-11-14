import {
  ClientSearchConversation
} from "./chunk-CXIIJO6L.js";
import {
  ClientSearchBriefPanel,
  ClientSearchCallButton,
  ClientSearchCallPrompt,
  ClientSearchDelivery,
  ClientSearchLive,
  ClientSearchNextActions,
  ClientSearchProgressPanel,
  ClientSearchQuestion,
  clientSearchLabels
} from "./chunk-7XINCBV3.js";
import {
  SourcingTrace
} from "./chunk-JVTDFZNJ.js";
import {
  JobBriefCard
} from "./chunk-RH6U2JAM.js";
import {
  jobBriefView
} from "./chunk-5F2DPU3C.js";

// src/recruit/client-search-page.tsx
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { PageHeader } from "@epicbagel/saas-kit/primitives/page-header";
import { PageShell } from "@epicbagel/saas-kit/primitives/page-shell";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var NO_STEPS = [];
var NO_THREAD = [];
var NO_ACTIONS = [];
var NO_DELIVERIES = [];
var NO_RUNS = [];
var HEADER_SHELL = "mb-0";
function present(value) {
  return value != null && value !== false && value !== "";
}
function isPromiseLike(value) {
  return value != null && typeof value.then === "function";
}
function useInFlight() {
  const [count, setCount] = useState(0);
  const track = (result) => {
    if (isPromiseLike(result)) {
      setCount((now) => now + 1);
      const settle = () => setCount((now) => now - 1);
      Promise.resolve(result).then(settle, settle);
    }
    return result;
  };
  return [count > 0, track];
}
function ClientSearchPage({
  title,
  eyebrow,
  subtitle,
  agentName,
  steps = NO_STEPS,
  brief,
  briefOptions,
  draft = false,
  thread = NO_THREAD,
  awaitingReply = false,
  suggestedReplies,
  onReply,
  maxFiles,
  chat,
  question,
  onAnswer,
  searching = false,
  liveSteps,
  actions = NO_ACTIONS,
  onAction,
  actionsNeedCall = false,
  callPromptOpen,
  onCallPromptOpenChange,
  deliveries = NO_DELIVERIES,
  otherRuns = NO_RUNS,
  onDecide,
  reasonOptional,
  reasonSuggestions,
  call,
  readOnly = false,
  markdownComponents,
  labels,
  decisionLabels,
  traceLabels,
  progressLabels,
  ...props
}) {
  const text = { ...clientSearchLabels, ...labels };
  const [busy, track] = useInFlight();
  const [promptState, setPromptState] = useState(false);
  const promptOpen = callPromptOpen ?? promptState;
  const setPromptOpen = (open) => {
    if (callPromptOpen === void 0) setPromptState(open);
    onCallPromptOpenChange?.(open);
  };
  const bookable = !readOnly && call != null && (call.href != null || call.onSelect != null) ? call : null;
  const current = steps.find((step) => step.state === "current");
  const now = current ? text.now(current.title) : null;
  const description = present(subtitle) && present(now) ? /* @__PURE__ */ jsxs(Fragment, { children: [
    subtitle,
    " \xB7 ",
    now
  ] }) : present(subtitle) ? subtitle : present(now) ? now : void 0;
  const progressSteps = steps.map((step) => {
    if (readOnly) {
      const { action: _action, ...shown } = step;
      return shown;
    }
    if (draft && bookable && step.state === "current" && step.action == null && present(text.callInstead)) {
      return {
        ...step,
        action: /* @__PURE__ */ jsx(ClientSearchCallButton, { call: bookable, variant: "outline", size: "sm", children: text.callInstead })
      };
    }
    return step;
  });
  const answer = onAnswer ?? (onReply ? (words) => onReply(words, []) : void 0);
  const ask = onAction || actionsNeedCall ? (action) => {
    if (actionsNeedCall) {
      setPromptOpen(true);
      return void 0;
    }
    return track(onAction?.(action));
  } : void 0;
  const showsCall = bookable !== null && !draft;
  const hasHeaderActions = Boolean(brief) || showsCall || steps.length > 0;
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      "data-slot": "client-search-page",
      "data-view": draft ? "conversation" : "open",
      "data-read-only": readOnly || void 0,
      gap: "none",
      grow: true,
      height: "full",
      minHeight: "zero",
      ...props,
      children: [
        /* @__PURE__ */ jsx(PageShell, { as: "div", width: "narrow", spacing: "compact", className: HEADER_SHELL, children: /* @__PURE__ */ jsx(
          PageHeader,
          {
            spacing: "compact",
            actionsLayout: "responsive",
            eyebrow,
            title,
            description,
            children: hasHeaderActions ? /* @__PURE__ */ jsxs(Fragment, { children: [
              brief ? /* @__PURE__ */ jsx(ClientSearchBriefPanel, { brief, briefOptions, labels }) : null,
              showsCall && bookable ? /* @__PURE__ */ jsx(ClientSearchCallButton, { call: bookable, variant: "outline", size: "sm", children: text.call }) : null,
              steps.length > 0 ? /* @__PURE__ */ jsx(ClientSearchProgressPanel, { steps: progressSteps, labels, progressLabels }) : null
            ] }) : null
          }
        ) }),
        draft ? /* @__PURE__ */ jsx(
          ClientSearchConversation,
          {
            thread,
            agentName,
            awaitingReply,
            suggestedReplies,
            onReply,
            maxFiles,
            readOnly,
            onDecide,
            reasonOptional,
            reasonSuggestions,
            briefOptions,
            markdownComponents,
            chat,
            labels,
            decisionLabels,
            traceLabels
          }
        ) : (
          // The one part of an open search that scrolls, so the keyboard can
          // reach it to scroll, as it can the kit's own thread.
          /* @__PURE__ */ jsx(
            FlexItem,
            {
              grow: true,
              minHeight: "zero",
              overflow: "y-auto",
              role: "region",
              "aria-label": text.sections,
              tabIndex: 0,
              children: /* @__PURE__ */ jsxs(PageShell, { as: "div", width: "narrow", children: [
                question ? /* @__PURE__ */ jsx(
                  ClientSearchQuestion,
                  {
                    question,
                    agentName,
                    answers: suggestedReplies,
                    onAnswer: answer ? (words) => track(answer(words)) : void 0,
                    disabled: busy,
                    readOnly,
                    markdownComponents,
                    labels
                  }
                ) : awaitingReply ? /* @__PURE__ */ jsx(Text, { tone: "muted", role: "status", children: text.reading }) : null,
                searching || liveSteps && liveSteps.length > 0 ? /* @__PURE__ */ jsx(
                  ClientSearchLive,
                  {
                    agentName,
                    steps: liveSteps,
                    more: deliveries.length > 0,
                    markdownComponents,
                    labels,
                    traceLabels
                  }
                ) : null,
                /* @__PURE__ */ jsx(
                  ClientSearchNextActions,
                  {
                    actions,
                    onAction: ask,
                    disabled: busy,
                    readOnly,
                    labels
                  }
                ),
                [...deliveries].reverse().map((delivery) => /* @__PURE__ */ jsx(
                  ClientSearchDelivery,
                  {
                    title: delivery.title,
                    description: delivery.description,
                    people: delivery.people,
                    runSteps: delivery.runSteps,
                    agentName,
                    onDecide,
                    reasonOptional,
                    reasonSuggestions,
                    readOnly,
                    markdownComponents,
                    labels,
                    decisionLabels,
                    traceLabels
                  },
                  delivery.id
                )),
                otherRuns.map((run) => /* @__PURE__ */ jsx(
                  SourcingTrace,
                  {
                    steps: run.steps,
                    agentName,
                    labels: traceLabels,
                    markdownComponents
                  },
                  run.id
                )),
                brief ? /* @__PURE__ */ jsx(JobBriefCard, { ...jobBriefView(brief, briefOptions), presentation: "preview" }) : null
              ] })
            }
          )
        ),
        draft || readOnly ? null : /* @__PURE__ */ jsx(
          ClientSearchCallPrompt,
          {
            open: promptOpen,
            onOpenChange: setPromptOpen,
            call: bookable ?? void 0,
            labels
          }
        )
      ]
    }
  );
}

export {
  ClientSearchPage
};
