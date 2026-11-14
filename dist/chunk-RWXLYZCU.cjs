"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkWN5HWFODcjs = require('./chunk-WN5HWFOD.cjs');










var _chunkWWOM3WQFcjs = require('./chunk-WWOM3WQF.cjs');


var _chunkTAFMPPOTcjs = require('./chunk-TAFMPPOT.cjs');


var _chunk2RYSDYP5cjs = require('./chunk-2RYSDYP5.cjs');


var _chunkCP5HCQPWcjs = require('./chunk-CP5HCQPW.cjs');

// src/recruit/client-search-page.tsx
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _pageheader = require('@epicbagel/saas-kit/primitives/page-header');
var _pageshell = require('@epicbagel/saas-kit/primitives/page-shell');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
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
  const [count, setCount] = _react.useState.call(void 0, 0);
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
  const text = { ..._chunkWWOM3WQFcjs.clientSearchLabels, ...labels };
  const [busy, track] = useInFlight();
  const [promptState, setPromptState] = _react.useState.call(void 0, false);
  const promptOpen = _nullishCoalesce(callPromptOpen, () => ( promptState));
  const setPromptOpen = (open) => {
    if (callPromptOpen === void 0) setPromptState(open);
    _optionalChain([onCallPromptOpenChange, 'optionalCall', _ => _(open)]);
  };
  const bookable = !readOnly && call != null && (call.href != null || call.onSelect != null) ? call : null;
  const current = steps.find((step) => step.state === "current");
  const now = current ? text.now(current.title) : null;
  const description = present(subtitle) && present(now) ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
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
        action: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkWWOM3WQFcjs.ClientSearchCallButton, { call: bookable, variant: "outline", size: "sm", children: text.callInstead })
      };
    }
    return step;
  });
  const answer = _nullishCoalesce(onAnswer, () => ( (onReply ? (words) => onReply(words, []) : void 0)));
  const ask = onAction || actionsNeedCall ? (action) => {
    if (actionsNeedCall) {
      setPromptOpen(true);
      return void 0;
    }
    return track(_optionalChain([onAction, 'optionalCall', _2 => _2(action)]));
  } : void 0;
  const showsCall = bookable !== null && !draft;
  const hasHeaderActions = Boolean(brief) || showsCall || steps.length > 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
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
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _pageshell.PageShell, { as: "div", width: "narrow", spacing: "compact", className: HEADER_SHELL, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _pageheader.PageHeader,
          {
            spacing: "compact",
            actionsLayout: "responsive",
            eyebrow,
            title,
            description,
            children: hasHeaderActions ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
              brief ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkWWOM3WQFcjs.ClientSearchBriefPanel, { brief, briefOptions, labels }) : null,
              showsCall && bookable ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkWWOM3WQFcjs.ClientSearchCallButton, { call: bookable, variant: "outline", size: "sm", children: text.call }) : null,
              steps.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkWWOM3WQFcjs.ClientSearchProgressPanel, { steps: progressSteps, labels, progressLabels }) : null
            ] }) : null
          }
        ) }),
        draft ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkWN5HWFODcjs.ClientSearchConversation,
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
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _flexitem.FlexItem,
            {
              grow: true,
              minHeight: "zero",
              overflow: "y-auto",
              role: "region",
              "aria-label": text.sections,
              tabIndex: 0,
              children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _pageshell.PageShell, { as: "div", width: "narrow", children: [
                question ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  _chunkWWOM3WQFcjs.ClientSearchQuestion,
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
                ) : awaitingReply ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { tone: "muted", role: "status", children: text.reading }) : null,
                searching || liveSteps && liveSteps.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  _chunkWWOM3WQFcjs.ClientSearchLive,
                  {
                    agentName,
                    steps: liveSteps,
                    more: deliveries.length > 0,
                    markdownComponents,
                    labels,
                    traceLabels
                  }
                ) : null,
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  _chunkWWOM3WQFcjs.ClientSearchNextActions,
                  {
                    actions,
                    onAction: ask,
                    disabled: busy,
                    readOnly,
                    labels
                  }
                ),
                [...deliveries].reverse().map((delivery) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  _chunkWWOM3WQFcjs.ClientSearchDelivery,
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
                otherRuns.map((run) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  _chunkTAFMPPOTcjs.SourcingTrace,
                  {
                    steps: run.steps,
                    agentName,
                    labels: traceLabels,
                    markdownComponents
                  },
                  run.id
                )),
                brief ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk2RYSDYP5cjs.JobBriefCard, { ..._chunkCP5HCQPWcjs.jobBriefView.call(void 0, brief, briefOptions), presentation: "preview" }) : null
              ] })
            }
          )
        ),
        draft || readOnly ? null : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkWWOM3WQFcjs.ClientSearchCallPrompt,
          {
            open: promptOpen,
            onOpenChange: setPromptOpen,
            call: _nullishCoalesce(bookable, () => ( void 0)),
            labels
          }
        )
      ]
    }
  );
}



exports.ClientSearchPage = ClientSearchPage;
