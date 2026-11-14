import {
  SourcingTrace
} from "./chunk-JVTDFZNJ.js";
import {
  JobBriefCard
} from "./chunk-RH6U2JAM.js";
import {
  jobBriefView
} from "./chunk-5F2DPU3C.js";
import {
  JobSearchProgress
} from "./chunk-TPB2PWPX.js";
import {
  CandidateShortlist
} from "./chunk-J6AD2LEO.js";
import {
  CandidateReviewCard
} from "./chunk-5CTC3QPI.js";
import {
  COARSE_POINTER_TOUCH_TARGET
} from "./chunk-YKEE5RQG.js";
import {
  CandidateClientDecision
} from "./chunk-NKSQDNLW.js";

// src/recruit/client-search-sections.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Card } from "@epicbagel/saas-kit/primitives/card";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { LazyMarkdown } from "@epicbagel/saas-kit/primitives/lazy-markdown";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger
} from "@epicbagel/saas-kit/primitives/responsive-dialog";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Suggestion, Suggestions } from "@epicbagel/saas-kit/primitives/suggestion";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useId, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var clientSearchLabels = Object.freeze({
  now: (step) => /* @__PURE__ */ jsxs(Fragment, { children: [
    "Now: ",
    step
  ] }),
  brief: "Brief",
  briefTitle: "Your brief",
  progress: "Progress",
  progressTitle: "Where your search stands",
  sections: "Search details",
  call: "Book a call",
  callInstead: "Or talk it through on a call",
  questionTitle: (agentName) => `${agentName} has a question`,
  answers: "Suggested answers",
  reading: "Reading what you sent\u2026",
  searchingTitle: (agentName) => `${agentName} is searching`,
  searchingFirst: "We are looking for people who fit your brief. They appear here as we find them.",
  searchingMore: "We are looking for more people. Review the ones below while we do.",
  nextTitle: "What next",
  deliveryDescription: "Each card says why we picked them. Tell us Yes or No, and why: the next card gets sharper.",
  deliveryEmpty: Object.freeze({ title: "No candidates shortlisted yet" }),
  evidence: "Why we picked them",
  callPromptTitle: "Book a call to keep the search going",
  callPromptDescription: "Your first shortlist is yours to review. To have us go and find more people, talk to us first and we will set the search up with you.",
  replyPlaceholder: "Answer, give feedback, or add detail",
  sending: "Sending\u2026",
  tooManyFiles: (max) => `You can send up to ${max} ${max === 1 ? "file" : "files"} at a time.`,
  conversationEmpty: Object.freeze({ title: "No messages yet" }),
  failed: () => "That didn't send. Please try again."
});
var NO_WORDS = [];
function present(value) {
  return value != null && value !== false && value !== "";
}
function isPromiseLike(value) {
  return value != null && typeof value.then === "function";
}
function useRequest(action) {
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState(null);
  const run = (...args) => {
    if (!action || pending) return;
    setFailure(null);
    let result;
    try {
      result = action(...args);
    } catch (cause) {
      setFailure({ cause });
      return;
    }
    if (!isPromiseLike(result)) return;
    setPending(true);
    Promise.resolve(result).then(
      () => setPending(false),
      (cause) => {
        setPending(false);
        setFailure({ cause });
      }
    );
  };
  return { pending, failure, run };
}
function SearchBlock({
  slot,
  title,
  titleId,
  titleLevel,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(Stack, { as: "section", "data-slot": slot, "aria-labelledby": titleId, gap: "none", ...props, children: /* @__PURE__ */ jsx(Card, { padding: "lg", children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
    /* @__PURE__ */ jsx(Heading, { id: titleId, level: 2, as: `h${titleLevel}`, children: title }),
    children
  ] }) }) });
}
function SearchChoices({
  choices,
  name,
  labelledBy,
  readOnly,
  disabled,
  onChoose
}) {
  if (choices.length === 0) return null;
  if (readOnly) {
    return /* @__PURE__ */ jsx(List, { "aria-label": name, "aria-labelledby": labelledBy, spacing: "tight", children: choices.map((choice) => /* @__PURE__ */ jsx(ListItem, { layout: "bullet", children: choice.label }, choice.key)) });
  }
  return /* @__PURE__ */ jsx(Suggestions, { layout: "wrap", role: "group", "aria-label": name, "aria-labelledby": labelledBy, children: choices.map((choice) => /* @__PURE__ */ jsx(
    Suggestion,
    {
      suggestion: choice.label,
      disabled,
      onClick: () => onChoose(choice),
      className: COARSE_POINTER_TOUCH_TARGET
    },
    choice.key
  )) });
}
function FailureLine({ children }) {
  return /* @__PURE__ */ jsx(Text, { size: "sm", tone: "destructive", role: "alert", children });
}
function ClientSearchQuestion({
  question,
  agentName,
  answers = NO_WORDS,
  onAnswer,
  disabled = false,
  readOnly = false,
  titleLevel = 2,
  markdownComponents,
  labels,
  ...props
}) {
  const text = { ...clientSearchLabels, ...labels };
  const titleId = useId();
  const { pending, failure, run } = useRequest(onAnswer);
  return /* @__PURE__ */ jsxs(
    SearchBlock,
    {
      slot: "client-search-question",
      title: text.questionTitle(agentName),
      titleId,
      titleLevel,
      "aria-busy": pending || void 0,
      ...props,
      children: [
        /* @__PURE__ */ jsx(LazyMarkdown, { size: "sm", components: markdownComponents, children: question }),
        /* @__PURE__ */ jsx(
          SearchChoices,
          {
            choices: [...new Set(answers)].map((answer) => ({ key: answer, label: answer })),
            name: text.answers,
            readOnly: readOnly || !onAnswer,
            disabled: disabled || pending,
            onChoose: (choice) => run(choice.label)
          }
        ),
        failure ? /* @__PURE__ */ jsx(FailureLine, { children: text.failed(failure.cause) }) : null
      ]
    }
  );
}
function ClientSearchLive({
  agentName,
  steps,
  more = false,
  description,
  titleLevel = 2,
  markdownComponents,
  labels,
  traceLabels,
  ...props
}) {
  const text = { ...clientSearchLabels, ...labels };
  const titleId = useId();
  const words = present(description) ? description : more ? text.searchingMore : text.searchingFirst;
  return /* @__PURE__ */ jsxs(
    SearchBlock,
    {
      slot: "client-search-live",
      title: text.searchingTitle(agentName),
      titleId,
      titleLevel,
      ...props,
      children: [
        present(words) ? /* @__PURE__ */ jsx(Text, { tone: "muted", children: words }) : null,
        steps && steps.length > 0 ? /* @__PURE__ */ jsx(
          SourcingTrace,
          {
            steps,
            agentName,
            live: true,
            labels: traceLabels,
            markdownComponents
          }
        ) : null
      ]
    }
  );
}
function ClientSearchNextActions({
  actions,
  onAction,
  disabled = false,
  readOnly = false,
  titleLevel = 2,
  labels,
  ...props
}) {
  const text = { ...clientSearchLabels, ...labels };
  const titleId = useId();
  const { pending, failure, run } = useRequest(onAction);
  if (actions.length === 0) return null;
  return /* @__PURE__ */ jsxs(
    SearchBlock,
    {
      slot: "client-search-next-actions",
      title: text.nextTitle,
      titleId,
      titleLevel,
      "aria-busy": pending || void 0,
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          SearchChoices,
          {
            choices: actions.map((action) => ({ key: action.id, label: action.label })),
            labelledBy: titleId,
            readOnly: readOnly || !onAction,
            disabled: disabled || pending,
            onChoose: (choice) => {
              const action = actions.find((candidate) => candidate.id === choice.key);
              if (action) run(action);
            }
          }
        ),
        failure ? /* @__PURE__ */ jsx(FailureLine, { children: text.failed(failure.cause) }) : null
      ]
    }
  );
}
function ClientSearchDelivery({
  title,
  description,
  people,
  runSteps,
  agentName,
  onDecide,
  reasonOptional = false,
  reasonSuggestions,
  readOnly = false,
  markdownComponents,
  labels,
  decisionLabels,
  traceLabels,
  ...props
}) {
  const text = { ...clientSearchLabels, ...labels };
  return /* @__PURE__ */ jsxs(Stack, { "data-slot": "client-search-delivery", gap: "md", ...props, children: [
    /* @__PURE__ */ jsx(
      CandidateShortlist,
      {
        title,
        description: present(description) ? description : text.deliveryDescription,
        count: people.length,
        empty: text.deliveryEmpty,
        children: people.map((person) => /* @__PURE__ */ jsx(
          CandidateReviewCard,
          {
            name: person.name,
            avatar: person.avatar,
            cover: person.cover,
            headline: person.headline,
            headerActions: person.headerActions,
            facts: person.facts,
            insight: person.evidence && person.evidence.length > 0 ? {
              label: text.evidence,
              // The card sets them in one paragraph, a line each.
              value: person.evidence.map((line, index) => /* @__PURE__ */ jsx(Text, { as: "span", variant: "inherit", display: "block", children: line }, index))
            } : void 0,
            actions: /* @__PURE__ */ jsx(
              CandidateClientDecision,
              {
                candidateName: person.name,
                decision: person.decision,
                reason: person.reason,
                readOnly: readOnly || !onDecide,
                reasonOptional,
                suggestions: reasonSuggestions,
                labels: decisionLabels,
                onDecide: async (decision, reason) => {
                  await onDecide?.(person, decision, reason);
                }
              }
            )
          },
          person.id
        ))
      }
    ),
    runSteps && runSteps.length > 0 ? /* @__PURE__ */ jsx(
      SourcingTrace,
      {
        steps: runSteps,
        agentName,
        labels: traceLabels,
        markdownComponents
      }
    ) : null
  ] });
}
function ClientSearchCallButton({
  call,
  children,
  variant = "default",
  size = "default"
}) {
  if (call.href != null) {
    return /* @__PURE__ */ jsx(Button, { asChild: true, variant, size, children: /* @__PURE__ */ jsx(
      "a",
      {
        href: call.href,
        target: call.external ? "_blank" : void 0,
        rel: call.external ? "noreferrer noopener" : void 0,
        onClick: call.onSelect,
        children
      }
    ) });
  }
  return /* @__PURE__ */ jsx(Button, { type: "button", variant, size, onClick: call.onSelect, children });
}
function ClientSearchCallPrompt({ open, onOpenChange, call, labels }) {
  const text = { ...clientSearchLabels, ...labels };
  const descriptionId = useId();
  const described = present(text.callPromptDescription);
  return /* @__PURE__ */ jsx(ResponsiveDialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(ResponsiveDialogContent, { "aria-describedby": described ? descriptionId : void 0, children: [
    /* @__PURE__ */ jsx(ResponsiveDialogHeader, { children: /* @__PURE__ */ jsx(ResponsiveDialogTitle, { children: text.callPromptTitle }) }),
    /* @__PURE__ */ jsx(ResponsiveDialogBody, { children: /* @__PURE__ */ jsxs(Stack, { "data-slot": "client-search-call-prompt", gap: "md", children: [
      described ? /* @__PURE__ */ jsx(Text, { id: descriptionId, children: text.callPromptDescription }) : null,
      call ? /* @__PURE__ */ jsx(ClientSearchCallButton, { call, children: text.call }) : null
    ] }) })
  ] }) });
}
function ClientSearchBriefPanel({ brief, briefOptions, labels }) {
  const text = { ...clientSearchLabels, ...labels };
  return /* @__PURE__ */ jsxs(ResponsiveDialog, { children: [
    /* @__PURE__ */ jsx(ResponsiveDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", children: text.brief }) }),
    /* @__PURE__ */ jsxs(ResponsiveDialogContent, { "aria-describedby": void 0, children: [
      /* @__PURE__ */ jsx(ResponsiveDialogHeader, { children: /* @__PURE__ */ jsx(ResponsiveDialogTitle, { children: text.briefTitle }) }),
      /* @__PURE__ */ jsx(ResponsiveDialogBody, { "data-slot": "client-search-brief-panel", children: /* @__PURE__ */ jsx(JobBriefCard, { ...jobBriefView(brief, briefOptions), presentation: "preview", titleLevel: 3, defaultOpen: true }) })
    ] })
  ] });
}
function ClientSearchProgressPanel({ steps, labels, progressLabels }) {
  const text = { ...clientSearchLabels, ...labels };
  return /* @__PURE__ */ jsxs(ResponsiveDialog, { children: [
    /* @__PURE__ */ jsx(ResponsiveDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", children: text.progress }) }),
    /* @__PURE__ */ jsxs(ResponsiveDialogContent, { "aria-describedby": void 0, children: [
      /* @__PURE__ */ jsx(ResponsiveDialogHeader, { children: /* @__PURE__ */ jsx(ResponsiveDialogTitle, { children: text.progressTitle }) }),
      /* @__PURE__ */ jsx(ResponsiveDialogBody, { "data-slot": "client-search-progress-panel", children: /* @__PURE__ */ jsx(JobSearchProgress, { steps, labels: progressLabels }) })
    ] })
  ] });
}

export {
  clientSearchLabels,
  ClientSearchQuestion,
  ClientSearchLive,
  ClientSearchNextActions,
  ClientSearchDelivery,
  ClientSearchCallButton,
  ClientSearchCallPrompt,
  ClientSearchBriefPanel,
  ClientSearchProgressPanel
};
