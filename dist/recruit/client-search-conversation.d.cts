import * as react from 'react';
import { HTMLAttributes } from 'react';
import { ChatProps } from '@epicbagel/saas-kit/primitives/chat';
import { MarkdownComponents } from '@epicbagel/saas-kit/primitives/markdown';
import { CandidateClientDecisionLabels } from './candidate-client-decision.cjs';
import { CandidateDecisionChoice } from './candidate-decision-buttons.cjs';
import { ClientSearchDeliveryProps, ClientSearchPerson, ClientSearchLabels } from './client-search-sections.cjs';
import { ClientSearchThreadTime, ClientSearchThreadItem } from './client-search-thread.cjs';
export { ClientSearchThreadBriefVersion, ClientSearchThreadDelivery, ClientSearchThreadInput, ClientSearchThreadTurn, clientSearchThread } from './client-search-thread.cjs';
import { JobBriefContent, JobBriefViewOptions } from './job-brief-view.cjs';
import { SourcingTraceLabels } from './sourcing-trace.cjs';
import '../candidate-empty-copy-CZmg2ZoX.cjs';
import './candidate-review-card.cjs';
import './job-search-progress.cjs';

/** One turn of a search's conversation, as it is shown. */
interface ClientSearchTurn {
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
interface ClientSearchBriefVersion {
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
interface ClientSearchDeliveryItem extends Pick<ClientSearchDeliveryProps, "title" | "description" | "people" | "runSteps"> {
    /** Tells the delivery from the others. */
    id: string;
    /** When the people were delivered, which places it in the conversation. */
    deliveredAt: ClientSearchThreadTime;
}
/** One thing in the conversation: `clientSearchThread`'s item, over what the conversation shows. */
type ClientSearchConversationItem = ClientSearchThreadItem<ClientSearchTurn, ClientSearchBriefVersion, ClientSearchDeliveryItem>;
/**
 * The kit Chat's own props a host may still set on the conversation: its
 * voice and file settings, its Markdown overrides, how a message's file
 * opens, and whatever else the installed kit's Chat takes. What the
 * conversation sets itself (the turns, the sending, the staged files, the
 * suggested replies, the layout) is left out.
 */
type ClientSearchChatProps = Partial<Omit<ChatProps, "messages" | "onSend" | "onSendError" | "pending" | "pendingLabel" | "error" | "attachments" | "onFilesSelected" | "onRemoveAttachment" | "replySuggestions" | "placeholder" | "activePlaceholder" | "layout" | "className">>;
interface ClientSearchConversationProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
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
    onDecide?: (person: ClientSearchPerson, decision: CandidateDecisionChoice, reason: string) => Promise<void>;
    /** Lets an answer on a person be saved with no reason. */
    reasonOptional?: boolean;
    /** One-tap reasons for each answer on a person, already worded. */
    reasonSuggestions?: {
        yes?: readonly string[];
        no?: readonly string[];
    };
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
declare function ClientSearchConversation({ thread, agentName, awaitingReply, suggestedReplies, onReply, maxFiles, readOnly, onDecide, reasonOptional, reasonSuggestions, briefOptions, markdownComponents, chat, labels, decisionLabels, traceLabels, ...props }: ClientSearchConversationProps): react.JSX.Element;

export { type ClientSearchBriefVersion, type ClientSearchChatProps, ClientSearchConversation, type ClientSearchConversationItem, type ClientSearchConversationProps, type ClientSearchDeliveryItem, ClientSearchThreadItem, ClientSearchThreadTime, type ClientSearchTurn };
