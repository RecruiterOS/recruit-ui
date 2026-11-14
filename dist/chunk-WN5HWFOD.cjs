"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }


var _chunkWWOM3WQFcjs = require('./chunk-WWOM3WQF.cjs');


var _chunk2RYSDYP5cjs = require('./chunk-2RYSDYP5.cjs');


var _chunkCP5HCQPWcjs = require('./chunk-CP5HCQPW.cjs');

// src/recruit/client-search-conversation.tsx



var _chat = require('@epicbagel/saas-kit/primitives/chat');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_MAX_FILES = 5;
function ClientSearchConversation({
  thread,
  agentName,
  awaitingReply = false,
  suggestedReplies,
  onReply,
  maxFiles = DEFAULT_MAX_FILES,
  readOnly = false,
  onDecide,
  reasonOptional,
  reasonSuggestions,
  briefOptions,
  markdownComponents,
  chat,
  labels,
  decisionLabels,
  traceLabels,
  ...props
}) {
  const text = { ..._chunkWWOM3WQFcjs.clientSearchLabels, ...labels };
  const [staged, setStaged] = _react.useState.call(void 0, []);
  const [sending, setSending] = _react.useState.call(void 0, false);
  const [failure, setFailure] = _react.useState.call(void 0, null);
  const [notice, setNotice] = _react.useState.call(void 0, null);
  const fileIds = _react.useRef.call(void 0, 0);
  const reply = readOnly ? void 0 : onReply;
  const fileLimit = Math.max(0, Math.floor(maxFiles));
  const messages = thread.map((item) => {
    if (item.kind === "turn") {
      const { turn } = item;
      return {
        id: turn.id,
        role: turn.from === "client" ? "user" : "assistant",
        createdAt: turn.createdAt,
        text: turn.body,
        attachments: (_nullishCoalesce(turn.files, () => ( []))).map((name, index) => ({ id: `${turn.id}-${index}`, name })),
        author: turn.from === "agency" ? { id: "agency", name: agentName } : void 0
      };
    }
    if (item.kind === "brief") {
      const { version, current } = item;
      return {
        id: `brief-${version.revision}`,
        role: "assistant",
        width: "full",
        createdAt: version.createdAt,
        // A card is not a reply: it takes none of a reply's actions.
        actions: false,
        content: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunk2RYSDYP5cjs.JobBriefCard,
          {
            ..._chunkCP5HCQPWcjs.jobBriefView.call(void 0, version.brief, { ...briefOptions, current }),
            presentation: "preview",
            version: { number: version.revision, current }
          }
        )
      };
    }
    const { delivery } = item;
    return {
      id: `delivery-${delivery.id}`,
      role: "assistant",
      width: "full",
      createdAt: delivery.deliveredAt,
      actions: false,
      content: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
        }
      )
    };
  });
  if (!reply) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _stack.Stack,
      {
        "data-slot": "client-search-conversation",
        "data-read-only": true,
        gap: "none",
        grow: true,
        height: "full",
        minHeight: "zero",
        ...props,
        children: messages.length === 0 && !awaitingReply ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _emptystate.EmptyState,
          {
            variant: "empty",
            size: "md",
            icon: _lucidereact.MessagesSquare,
            title: text.conversationEmpty.title,
            description: _nullishCoalesce(text.conversationEmpty.description, () => ( ""))
          }
        ) : (
          // The thread fills what the page leaves it and scrolls there.
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { grow: true, minHeight: "zero", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chat.ChatThread,
            {
              messages,
              pending: awaitingReply,
              pendingLabel: text.reading,
              appearance: "workspace",
              maxHeight: "none",
              markdownComponents: _nullishCoalesce(_optionalChain([chat, 'optionalAccess', _ => _.markdownComponents]), () => ( markdownComponents)),
              onOpenAttachment: _optionalChain([chat, 'optionalAccess', _2 => _2.onOpenAttachment]),
              attachmentAction: _optionalChain([chat, 'optionalAccess', _3 => _3.attachmentAction]),
              messageActions: _optionalChain([chat, 'optionalAccess', _4 => _4.messageActions]),
              scrollButtonLabel: _optionalChain([chat, 'optionalAccess', _5 => _5.scrollButtonLabel]),
              uploadingLabel: _optionalChain([chat, 'optionalAccess', _6 => _6.uploadingLabel]),
              footer: _optionalChain([chat, 'optionalAccess', _7 => _7.threadFooter])
            }
          ) })
        )
      }
    );
  }
  const send = async (words, attachments = []) => {
    const sent = staged.filter((entry) => attachments.some((attachment) => attachment.id === entry.id));
    setFailure(null);
    setNotice(null);
    setSending(true);
    try {
      await reply(words, sent.map((entry) => entry.file));
      setStaged((now) => now.filter((entry) => !sent.includes(entry)));
    } catch (cause) {
      setFailure({ cause });
      throw cause;
    } finally {
      setSending(false);
    }
  };
  const stage = (files) => {
    const added = files.map((file) => ({ id: `file-${++fileIds.current}`, file }));
    setStaged((now) => [...now, ...added].slice(0, fileLimit));
    setNotice(staged.length + files.length > fileLimit ? text.tooManyFiles(fileLimit) : null);
    setFailure(null);
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { "data-slot": "client-search-conversation", gap: "none", grow: true, height: "full", minHeight: "zero", ...props, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chat.Chat,
    {
      mobileCompactComposer: true,
      markdownComponents,
      ...chat,
      layout: "workspace",
      messages,
      onSend: send,
      onSendError: () => void 0,
      pending: awaitingReply || sending,
      pendingLabel: sending ? text.sending : text.reading,
      error: failure ? text.failed(failure.cause) : notice,
      placeholder: text.replyPlaceholder,
      activePlaceholder: text.replyPlaceholder,
      replySuggestions: suggestedReplies,
      attachments: staged.map(({ id, file }) => ({
        id,
        name: file.name,
        size: file.size,
        mediaType: file.type || void 0
      })),
      onFilesSelected: fileLimit > 0 ? stage : void 0,
      onRemoveAttachment: (attachment) => {
        setStaged((now) => now.filter((entry) => entry.id !== attachment.id));
        setNotice(null);
      }
    }
  ) });
}



exports.ClientSearchConversation = ClientSearchConversation;
