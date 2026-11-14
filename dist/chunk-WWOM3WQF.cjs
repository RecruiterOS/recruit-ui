"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkTAFMPPOTcjs = require('./chunk-TAFMPPOT.cjs');


var _chunk2RYSDYP5cjs = require('./chunk-2RYSDYP5.cjs');


var _chunkCP5HCQPWcjs = require('./chunk-CP5HCQPW.cjs');


var _chunkWSPL3WKEcjs = require('./chunk-WSPL3WKE.cjs');


var _chunkI53Z6SAJcjs = require('./chunk-I53Z6SAJ.cjs');


var _chunkL53DUWAFcjs = require('./chunk-L53DUWAF.cjs');


var _chunkD5BXTRVNcjs = require('./chunk-D5BXTRVN.cjs');


var _chunkRINO22KEcjs = require('./chunk-RINO22KE.cjs');

// src/recruit/client-search-sections.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _card = require('@epicbagel/saas-kit/primitives/card');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _lazymarkdown = require('@epicbagel/saas-kit/primitives/lazy-markdown');
var _list = require('@epicbagel/saas-kit/primitives/list');







var _responsivedialog = require('@epicbagel/saas-kit/primitives/responsive-dialog');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _suggestion = require('@epicbagel/saas-kit/primitives/suggestion');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var clientSearchLabels = Object.freeze({
  now: (step) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
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
  const [pending, setPending] = _react.useState.call(void 0, false);
  const [failure, setFailure] = _react.useState.call(void 0, null);
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { as: "section", "data-slot": slot, "aria-labelledby": titleId, gap: "none", ...props, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _card.Card, { padding: "lg", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { id: titleId, level: 2, as: `h${titleLevel}`, children: title }),
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
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.List, { "aria-label": name, "aria-labelledby": labelledBy, spacing: "tight", children: choices.map((choice) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.ListItem, { layout: "bullet", children: choice.label }, choice.key)) });
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _suggestion.Suggestions, { layout: "wrap", role: "group", "aria-label": name, "aria-labelledby": labelledBy, children: choices.map((choice) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _suggestion.Suggestion,
    {
      suggestion: choice.label,
      disabled,
      onClick: () => onChoose(choice),
      className: _chunkD5BXTRVNcjs.COARSE_POINTER_TOUCH_TARGET
    },
    choice.key
  )) });
}
function FailureLine({ children }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "destructive", role: "alert", children });
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
  const titleId = _react.useId.call(void 0, );
  const { pending, failure, run } = useRequest(onAnswer);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    SearchBlock,
    {
      slot: "client-search-question",
      title: text.questionTitle(agentName),
      titleId,
      titleLevel,
      "aria-busy": pending || void 0,
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _lazymarkdown.LazyMarkdown, { size: "sm", components: markdownComponents, children: question }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          SearchChoices,
          {
            choices: [...new Set(answers)].map((answer) => ({ key: answer, label: answer })),
            name: text.answers,
            readOnly: readOnly || !onAnswer,
            disabled: disabled || pending,
            onChoose: (choice) => run(choice.label)
          }
        ),
        failure ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FailureLine, { children: text.failed(failure.cause) }) : null
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
  const titleId = _react.useId.call(void 0, );
  const words = present(description) ? description : more ? text.searchingMore : text.searchingFirst;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    SearchBlock,
    {
      slot: "client-search-live",
      title: text.searchingTitle(agentName),
      titleId,
      titleLevel,
      ...props,
      children: [
        present(words) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { tone: "muted", children: words }) : null,
        steps && steps.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkTAFMPPOTcjs.SourcingTrace,
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
  const titleId = _react.useId.call(void 0, );
  const { pending, failure, run } = useRequest(onAction);
  if (actions.length === 0) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    SearchBlock,
    {
      slot: "client-search-next-actions",
      title: text.nextTitle,
      titleId,
      titleLevel,
      "aria-busy": pending || void 0,
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
        failure ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FailureLine, { children: text.failed(failure.cause) }) : null
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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "client-search-delivery", gap: "md", ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunkI53Z6SAJcjs.CandidateShortlist,
      {
        title,
        description: present(description) ? description : text.deliveryDescription,
        count: people.length,
        empty: text.deliveryEmpty,
        children: people.map((person) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkL53DUWAFcjs.CandidateReviewCard,
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
              value: person.evidence.map((line, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", variant: "inherit", display: "block", children: line }, index))
            } : void 0,
            actions: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _chunkRINO22KEcjs.CandidateClientDecision,
              {
                candidateName: person.name,
                decision: person.decision,
                reason: person.reason,
                readOnly: readOnly || !onDecide,
                reasonOptional,
                suggestions: reasonSuggestions,
                labels: decisionLabels,
                onDecide: async (decision, reason) => {
                  await _optionalChain([onDecide, 'optionalCall', _ => _(person, decision, reason)]);
                }
              }
            )
          },
          person.id
        ))
      }
    ),
    runSteps && runSteps.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunkTAFMPPOTcjs.SourcingTrace,
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
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { asChild: true, variant, size, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant, size, onClick: call.onSelect, children });
}
function ClientSearchCallPrompt({ open, onOpenChange, call, labels }) {
  const text = { ...clientSearchLabels, ...labels };
  const descriptionId = _react.useId.call(void 0, );
  const described = present(text.callPromptDescription);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialog, { open, onOpenChange, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialogContent, { "aria-describedby": described ? descriptionId : void 0, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogHeader, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTitle, { children: text.callPromptTitle }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogBody, { children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "client-search-call-prompt", gap: "md", children: [
      described ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { id: descriptionId, children: text.callPromptDescription }) : null,
      call ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ClientSearchCallButton, { call, children: text.call }) : null
    ] }) })
  ] }) });
}
function ClientSearchBriefPanel({ brief, briefOptions, labels }) {
  const text = { ...clientSearchLabels, ...labels };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialog, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTrigger, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "outline", size: "sm", children: text.brief }) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialogContent, { "aria-describedby": void 0, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogHeader, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTitle, { children: text.briefTitle }) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogBody, { "data-slot": "client-search-brief-panel", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk2RYSDYP5cjs.JobBriefCard, { ..._chunkCP5HCQPWcjs.jobBriefView.call(void 0, brief, briefOptions), presentation: "preview", titleLevel: 3, defaultOpen: true }) })
    ] })
  ] });
}
function ClientSearchProgressPanel({ steps, labels, progressLabels }) {
  const text = { ...clientSearchLabels, ...labels };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialog, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTrigger, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "outline", size: "sm", children: text.progress }) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialogContent, { "aria-describedby": void 0, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogHeader, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTitle, { children: text.progressTitle }) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogBody, { "data-slot": "client-search-progress-panel", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkWSPL3WKEcjs.JobSearchProgress, { steps, labels: progressLabels }) })
    ] })
  ] });
}











exports.clientSearchLabels = clientSearchLabels; exports.ClientSearchQuestion = ClientSearchQuestion; exports.ClientSearchLive = ClientSearchLive; exports.ClientSearchNextActions = ClientSearchNextActions; exports.ClientSearchDelivery = ClientSearchDelivery; exports.ClientSearchCallButton = ClientSearchCallButton; exports.ClientSearchCallPrompt = ClientSearchCallPrompt; exports.ClientSearchBriefPanel = ClientSearchBriefPanel; exports.ClientSearchProgressPanel = ClientSearchProgressPanel;
