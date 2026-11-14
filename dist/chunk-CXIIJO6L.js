import {
  ClientSearchDelivery,
  clientSearchLabels
} from "./chunk-7XINCBV3.js";
import {
  JobBriefCard
} from "./chunk-RH6U2JAM.js";
import {
  jobBriefView
} from "./chunk-5F2DPU3C.js";

// src/recruit/client-search-conversation.tsx
import {
  Chat,
  ChatThread
} from "@epicbagel/saas-kit/primitives/chat";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { MessagesSquare } from "lucide-react";
import { useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
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
  const text = { ...clientSearchLabels, ...labels };
  const [staged, setStaged] = useState([]);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState(null);
  const [notice, setNotice] = useState(null);
  const fileIds = useRef(0);
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
        attachments: (turn.files ?? []).map((name, index) => ({ id: `${turn.id}-${index}`, name })),
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
        content: /* @__PURE__ */ jsx(
          JobBriefCard,
          {
            ...jobBriefView(version.brief, { ...briefOptions, current }),
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
      content: /* @__PURE__ */ jsx(
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
        }
      )
    };
  });
  if (!reply) {
    return /* @__PURE__ */ jsx(
      Stack,
      {
        "data-slot": "client-search-conversation",
        "data-read-only": true,
        gap: "none",
        grow: true,
        height: "full",
        minHeight: "zero",
        ...props,
        children: messages.length === 0 && !awaitingReply ? /* @__PURE__ */ jsx(
          EmptyState,
          {
            variant: "empty",
            size: "md",
            icon: MessagesSquare,
            title: text.conversationEmpty.title,
            description: text.conversationEmpty.description ?? ""
          }
        ) : (
          // The thread fills what the page leaves it and scrolls there.
          /* @__PURE__ */ jsx(FlexItem, { grow: true, minHeight: "zero", children: /* @__PURE__ */ jsx(
            ChatThread,
            {
              messages,
              pending: awaitingReply,
              pendingLabel: text.reading,
              appearance: "workspace",
              maxHeight: "none",
              markdownComponents: chat?.markdownComponents ?? markdownComponents,
              onOpenAttachment: chat?.onOpenAttachment,
              attachmentAction: chat?.attachmentAction,
              messageActions: chat?.messageActions,
              scrollButtonLabel: chat?.scrollButtonLabel,
              uploadingLabel: chat?.uploadingLabel,
              footer: chat?.threadFooter
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
  return /* @__PURE__ */ jsx(Stack, { "data-slot": "client-search-conversation", gap: "none", grow: true, height: "full", minHeight: "zero", ...props, children: /* @__PURE__ */ jsx(
    Chat,
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

export {
  ClientSearchConversation
};
