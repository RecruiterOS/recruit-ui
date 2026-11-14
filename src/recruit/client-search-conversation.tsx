"use client";

import {
  Chat,
  ChatThread,
  type ChatAttachment,
  type ChatMessage,
  type ChatProps,
} from "@epicbagel/saas-kit/primitives/chat";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import type { MarkdownComponents } from "@epicbagel/saas-kit/primitives/markdown";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { MessagesSquare } from "lucide-react";
import { useRef, useState, type HTMLAttributes } from "react";

import type { CandidateClientDecisionLabels } from "./candidate-client-decision";
import type { CandidateDecisionChoice } from "./candidate-decision-buttons";
import {
  ClientSearchDelivery,
  clientSearchLabels,
  type ClientSearchDeliveryProps,
  type ClientSearchLabels,
  type ClientSearchPerson,
} from "./client-search-sections";
import type { ClientSearchThreadItem, ClientSearchThreadTime } from "./client-search-thread";
import { JobBriefCard } from "./job-brief-card";
import { jobBriefView, type JobBriefContent, type JobBriefViewOptions } from "./job-brief-view";
import type { SourcingTraceLabels } from "./sourcing-trace";

// The thread builder lives in a module without a client boundary, so a server
// can put a search in order too; it is re-exported here, beside the
// conversation that draws what it returns.
export * from "./client-search-thread";

/** One turn of a search's conversation, as it is shown. */
export interface ClientSearchTurn {
  /** Stable for the life of the turn. */
  id: string;
  /** Who said it: the person the search is run for, or whoever runs it. */
  from: "client" | "agency";
  /** What was said, as Markdown. */
  body: string;
  /** When it was said. Turns are grouped under relative-time markers. */
  createdAt: ClientSearchThreadTime;
  /** The names of the files sent with it. */
  files?: readonly string[];
}

/** One version of a search's brief, as the conversation shows it under the turn that wrote it. */
export interface ClientSearchBriefVersion {
  /** The version's number, counted from 1. */
  revision: number;
  /** The brief as that version had it. */
  brief: JobBriefContent;
  /** The `id` of the turn that wrote it, or none when no turn did. */
  replyTurnId?: string | null;
  createdAt: ClientSearchThreadTime;
}

/**
 * One delivery of people, as a search's page lists it: what
 * `ClientSearchDelivery` shows, a key, and when it landed.
 */
export interface ClientSearchDeliveryItem
  extends Pick<ClientSearchDeliveryProps, "title" | "description" | "people" | "runSteps"> {
  /** Tells the delivery from the others. */
  id: string;
  /** When the people were delivered, which places it in the conversation. */
  deliveredAt: ClientSearchThreadTime;
}

/** One thing in the conversation: `clientSearchThread`'s item, over what the conversation shows. */
export type ClientSearchConversationItem = ClientSearchThreadItem<
  ClientSearchTurn,
  ClientSearchBriefVersion,
  ClientSearchDeliveryItem
>;

/**
 * The kit Chat's own props a host may still set on the conversation: its
 * voice and file settings, its Markdown overrides, how a message's file
 * opens, and whatever else the installed kit's Chat takes. What the
 * conversation sets itself (the turns, the sending, the staged files, the
 * suggested replies, the layout) is left out.
 */
export type ClientSearchChatProps = Partial<
  Omit<
    ChatProps,
    | "messages"
    | "onSend"
    | "onSendError"
    | "pending"
    | "pendingLabel"
    | "error"
    | "attachments"
    | "onFilesSelected"
    | "onRemoveAttachment"
    | "replySuggestions"
    | "placeholder"
    | "activePlaceholder"
    | "layout"
    | "className"
  >
>;

export interface ClientSearchConversationProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /**
   * The conversation in order, as `clientSearchThread` returns it: each turn,
   * each version of the brief under the turn that wrote it, each delivery
   * where it landed.
   */
  thread: readonly ClientSearchConversationItem[];
  /** Who runs the search: names their turns, and a delivery's run ("How Scout searched"). */
  agentName: string;
  /**
   * A reply to the reader is being written: the thread ends on a running
   * line (`labels.reading`) and the composer is held.
   */
  awaitingReply?: boolean;
  /** Replies offered next, such as answers to the latest question: one tap sends one. */
  suggestedReplies?: readonly string[];
  /**
   * Sends the reader's reply: their words, and the files they attached to it
   * (none for a suggested reply). While a promise it returns is pending the
   * composer is held under a running line (`labels.sending`). When it
   * resolves, the files it sent leave the composer. When it rejects, the
   * words go back in the composer, the files stay, and `labels.failed` shows
   * under it. Without it nothing can be written.
   */
  onReply?: (words: string, files: File[]) => unknown;
  /**
   * How many files one reply takes: 5 by default, and 0 leaves files out.
   * Picking more keeps the first and says so (`labels.tooManyFiles`).
   */
  maxFiles?: number;
  /** Shows the conversation and takes nothing: no composer, no suggested replies, no Yes or No. */
  readOnly?: boolean;
  /** Saves a Yes or No on a person in a delivery, as `ClientSearchDelivery` takes it. */
  onDecide?: (
    person: ClientSearchPerson,
    decision: CandidateDecisionChoice,
    reason: string,
  ) => Promise<void>;
  /** Lets an answer on a person be saved with no reason. */
  reasonOptional?: boolean;
  /** One-tap reasons for each answer on a person, already worded. */
  reasonSuggestions?: { yes?: readonly string[]; no?: readonly string[] };
  /** How each version of the brief is read, as `jobBriefView` takes it. */
  briefOptions?: Omit<JobBriefViewOptions, "current">;
  /** Per-element overrides for the turns' Markdown, and a run's. */
  markdownComponents?: MarkdownComponents;
  /** The kit Chat's own props, passed straight through. */
  chat?: ClientSearchChatProps;
  labels?: Partial<ClientSearchLabels>;
  /** The Yes or No row's wording, as `CandidateClientDecision` takes it. */
  decisionLabels?: Partial<CandidateClientDecisionLabels>;
  /** A run's wording, as `SourcingTrace` takes it. */
  traceLabels?: Partial<SourcingTraceLabels>;
}

/**
 * The kit's Chat names a turn's author from 1.26.0: the first of a run of
 * turns by one author carries their name. An older kit ignores the field.
 */
type AuthoredChatMessage = ChatMessage & { author?: { id: string; name: string } };

/** A file the reader has attached to the reply they are writing. */
interface StagedFile {
  id: string;
  file: File;
}

const DEFAULT_MAX_FILES = 5;

/**
 * A search's conversation, for the person it is run for: the kit's `Chat`
 * over the turns, with each version of the brief under the turn that wrote
 * it (`JobBriefCard`, badged with its version) and each delivery of people
 * where it landed (`ClientSearchDelivery`). It is how a brief is got ready:
 * the reader answers in their own words, with files, or with one tap on a
 * suggested reply.
 *
 * The host owns the conversation: it passes the thread in order
 * (`clientSearchThread`), and `onReply` hands it each reply, with the files
 * staged for it. The component keeps only what the reader is still
 * composing. Nothing is fetched and nothing polls: the host passes a new
 * `thread` when there is one, and says a reply is being written with
 * `awaitingReply`.
 *
 * It is the kit's workspace conversation, which fills its container's height
 * with the composer at the foot, so give it a container with a height of its
 * own. Dictation, where the host wants it, runs through the host's
 * `DictationProvider`, as the kit's mic does everywhere; the kit Chat's other
 * settings pass through `chat`. `readOnly` shows the thread alone.
 *
 * The root is marked `data-slot="client-search-conversation"`, with
 * `data-read-only` where nothing can be written; the kit's Chat inside keeps
 * its own.
 */
export function ClientSearchConversation({
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
}: ClientSearchConversationProps) {
  const text = { ...clientSearchLabels, ...labels };
  const [staged, setStaged] = useState<readonly StagedFile[]>([]);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<{ cause: unknown } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileIds = useRef(0);

  // Nothing to send to is the same as nothing to send.
  const reply = readOnly ? undefined : onReply;
  const fileLimit = Math.max(0, Math.floor(maxFiles));

  const messages = thread.map((item): AuthoredChatMessage => {
    if (item.kind === "turn") {
      const { turn } = item;
      return {
        id: turn.id,
        role: turn.from === "client" ? "user" : "assistant",
        createdAt: turn.createdAt,
        text: turn.body,
        attachments: (turn.files ?? []).map((name, index) => ({ id: `${turn.id}-${index}`, name })),
        author: turn.from === "agency" ? { id: "agency", name: agentName } : undefined,
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
        content: (
          <JobBriefCard
            {...jobBriefView(version.brief, { ...briefOptions, current })}
            presentation="preview"
            version={{ number: version.revision, current }}
          />
        ),
      };
    }
    const { delivery } = item;
    return {
      id: `delivery-${delivery.id}`,
      role: "assistant",
      width: "full",
      createdAt: delivery.deliveredAt,
      actions: false,
      content: (
        <ClientSearchDelivery
          title={delivery.title}
          description={delivery.description}
          people={delivery.people}
          runSteps={delivery.runSteps}
          agentName={agentName}
          onDecide={onDecide}
          reasonOptional={reasonOptional}
          reasonSuggestions={reasonSuggestions}
          readOnly={readOnly}
          markdownComponents={markdownComponents}
          labels={labels}
          decisionLabels={decisionLabels}
          traceLabels={traceLabels}
        />
      ),
    };
  });

  if (!reply) {
    return (
      <Stack
        data-slot="client-search-conversation"
        data-read-only
        gap="none"
        grow
        height="full"
        minHeight="zero"
        {...props}
      >
        {messages.length === 0 && !awaitingReply ? (
          <EmptyState
            variant="empty"
            size="md"
            icon={MessagesSquare}
            title={text.conversationEmpty.title}
            description={text.conversationEmpty.description ?? ""}
          />
        ) : (
          // The thread fills what the page leaves it and scrolls there.
          <FlexItem grow minHeight="zero">
            <ChatThread
              messages={messages}
              pending={awaitingReply}
              pendingLabel={text.reading}
              appearance="workspace"
              maxHeight="none"
              markdownComponents={chat?.markdownComponents ?? markdownComponents}
              onOpenAttachment={chat?.onOpenAttachment}
              attachmentAction={chat?.attachmentAction}
              messageActions={chat?.messageActions}
              scrollButtonLabel={chat?.scrollButtonLabel}
              uploadingLabel={chat?.uploadingLabel}
              footer={chat?.threadFooter}
            />
          </FlexItem>
        )}
      </Stack>
    );
  }

  const send = async (words: string, attachments: ReadonlyArray<ChatAttachment> = []) => {
    // A suggested reply goes alone: the kit names the files that go with a turn.
    const sent = staged.filter((entry) => attachments.some((attachment) => attachment.id === entry.id));
    setFailure(null);
    setNotice(null);
    setSending(true);
    try {
      await reply(words, sent.map((entry) => entry.file));
      setStaged((now) => now.filter((entry) => !sent.includes(entry)));
    } catch (cause) {
      setFailure({ cause });
      // The kit puts the words back in the composer when it sees this.
      throw cause;
    } finally {
      setSending(false);
    }
  };

  const stage = (files: File[]) => {
    const added = files.map((file) => ({ id: `file-${++fileIds.current}`, file }));
    // One reply takes so many: the first picked stay, and the reader is told.
    setStaged((now) => [...now, ...added].slice(0, fileLimit));
    setNotice(staged.length + files.length > fileLimit ? text.tooManyFiles(fileLimit) : null);
    setFailure(null);
  };

  return (
    <Stack data-slot="client-search-conversation" gap="none" grow height="full" minHeight="zero" {...props}>
      <Chat
        mobileCompactComposer
        markdownComponents={markdownComponents}
        {...chat}
        layout="workspace"
        messages={messages}
        onSend={send}
        // The failure shows under the composer; the host has the rejection itself.
        onSendError={() => undefined}
        pending={awaitingReply || sending}
        pendingLabel={sending ? text.sending : text.reading}
        error={failure ? text.failed(failure.cause) : notice}
        placeholder={text.replyPlaceholder}
        activePlaceholder={text.replyPlaceholder}
        replySuggestions={suggestedReplies}
        attachments={staged.map(({ id, file }) => ({
          id,
          name: file.name,
          size: file.size,
          mediaType: file.type || undefined,
        }))}
        onFilesSelected={fileLimit > 0 ? stage : undefined}
        onRemoveAttachment={(attachment) => {
          setStaged((now) => now.filter((entry) => entry.id !== attachment.id));
          setNotice(null);
        }}
      />
    </Stack>
  );
}
