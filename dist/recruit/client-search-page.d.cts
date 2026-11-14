import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { MarkdownComponents } from '@epicbagel/saas-kit/primitives/markdown';
import { CandidateClientDecisionLabels } from './candidate-client-decision.cjs';
import { CandidateDecisionChoice } from './candidate-decision-buttons.cjs';
import { ClientSearchConversationItem, ClientSearchChatProps, ClientSearchDeliveryItem } from './client-search-conversation.cjs';
import { ClientSearchAction, ClientSearchPerson, ClientSearchCall, ClientSearchLabels } from './client-search-sections.cjs';
import { JobBriefContent, JobBriefViewOptions } from './job-brief-view.cjs';
import { JobSearchStep, JobSearchProgressLabels } from './job-search-progress.cjs';
import { SourcingTraceStep, SourcingTraceLabels } from './sourcing-trace.cjs';
import '@epicbagel/saas-kit/primitives/chat';
import './client-search-thread.cjs';
import '../candidate-empty-copy-CZmg2ZoX.cjs';
import './candidate-review-card.cjs';

/** A sourcing run that delivered nobody, as the page lists it under the deliveries. */
interface ClientSearchRun {
    /** Tells the run from the others. */
    id: string;
    /** Its steps, in order. */
    steps: readonly SourcingTraceStep[];
}
interface ClientSearchPageProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** The search's name: the page's h1. */
    title: ReactNode;
    /** Above the title, such as a link back to the reader's other searches. */
    eyebrow?: ReactNode;
    /**
     * Under the title, such as where the role is. The current step follows it
     * (`labels.now`: "Now: Shortlist to review").
     */
    subtitle?: ReactNode;
    /** Who runs the search, as the page names them: "Scout has a question", "How Scout searched". */
    agentName: string;
    /**
     * Where the search stands: its steps in order, as `JobSearchProgress`
     * takes them, behind the header's Progress button. With none, no button.
     */
    steps?: readonly JobSearchStep[];
    /**
     * The brief as it stands, or none until there is one: behind the header's
     * Brief button, and under an open search's deliveries.
     */
    brief?: JobBriefContent | null;
    /** How the brief is read, as `jobBriefView` takes it: its title, wording and audience. */
    briefOptions?: JobBriefViewOptions;
    /**
     * The search is still a draft: the page is the conversation that gets the
     * brief ready (`thread`, `suggestedReplies`, `onReply`). Without it the
     * search is open, and the page is its sections with no reply box.
     */
    draft?: boolean;
    /** A draft's conversation in order, as `clientSearchThread` returns it. */
    thread?: readonly ClientSearchConversationItem[];
    /**
     * A reply to the reader is being written. A draft's conversation ends on a
     * running line and holds its composer; an open search says so
     * (`labels.reading`) where the question would be.
     */
    awaitingReply?: boolean;
    /**
     * Replies offered next, already worded: over a draft's composer, and as
     * the answers to an open search's `question`.
     */
    suggestedReplies?: readonly string[];
    /**
     * Sends the reader's reply in a draft's conversation, with the files they
     * attached, as `ClientSearchConversation` takes it: a promise holds the
     * composer, and a rejected one puts the words back with an error line.
     */
    onReply?: (words: string, files: File[]) => unknown;
    /** How many files one reply takes: 5 by default, and 0 leaves files out. */
    maxFiles?: number;
    /** The kit Chat's own props for the draft's conversation, passed straight through. */
    chat?: ClientSearchChatProps;
    /** A question put to the reader on an open search, as Markdown, answered with `suggestedReplies`. */
    question?: string | null;
    /**
     * Called with the answer the reader picked, as `ClientSearchQuestion`
     * takes it. Defaults to `onReply` with that answer and no files.
     */
    onAnswer?: (answer: string) => unknown;
    /** An open search is finding people now. */
    searching?: boolean;
    /** The steps of the run under way, as it reports them. */
    liveSteps?: readonly SourcingTraceStep[];
    /** What the reader can ask for next on an open search. */
    actions?: readonly ClientSearchAction[];
    /** Called with the action the reader asked for, as `ClientSearchNextActions` takes it. */
    onAction?: (action: ClientSearchAction) => unknown;
    /**
     * Asking for more needs a call first: the actions are offered, and picking
     * one opens the call prompt without calling `onAction`.
     */
    actionsNeedCall?: boolean;
    /**
     * Whether the call prompt is open, for a host that opens it itself, such as
     * when its server turns a request down. Left out, the page opens it for
     * `actionsNeedCall` and closes it.
     */
    callPromptOpen?: boolean;
    /** Called when the call prompt opens or closes. */
    onCallPromptOpenChange?: (open: boolean) => void;
    /** Each delivery of people, oldest first. An open search shows them newest first. */
    deliveries?: readonly ClientSearchDeliveryItem[];
    /** Runs that delivered nobody, each folded to one line under the deliveries. */
    otherRuns?: readonly ClientSearchRun[];
    /** Saves the reader's Yes or No on a person, with their reason, as `ClientSearchDelivery` takes it. */
    onDecide?: (person: ClientSearchPerson, decision: CandidateDecisionChoice, reason: string) => Promise<void>;
    /** Lets an answer on a person be saved with no reason. A reason is required without it. */
    reasonOptional?: boolean;
    /** One-tap reasons for each answer on a person, already worded. */
    reasonSuggestions?: {
        yes?: readonly string[];
        no?: readonly string[];
    };
    /**
     * How the reader books a call: a link, a callback, or both. An open search
     * offers it in the header; a draft offers it as the current step's next
     * action (`labels.callInstead`), unless the step has one of its own.
     */
    call?: ClientSearchCall;
    /**
     * The page as its reader sees it, for someone who can't act for them, such
     * as the team that runs the search: everything shows and nothing can be
     * sent. No composer, no suggested replies, no answers or requests to press,
     * no Yes, No or Change, no call to book, and no step's `action`. What only
     * opens or folds (the brief, the progress, a run's steps) still does.
     */
    readOnly?: boolean;
    /** Per-element overrides for every Markdown text on the page. */
    markdownComponents?: MarkdownComponents;
    labels?: Partial<ClientSearchLabels>;
    /** The Yes or No row's wording, as `CandidateClientDecision` takes it. */
    decisionLabels?: Partial<CandidateClientDecisionLabels>;
    /** A run's wording, as `SourcingTrace` takes it. */
    traceLabels?: Partial<SourcingTraceLabels>;
    /** Each step's state in words, as `JobSearchProgress` takes them. */
    progressLabels?: Partial<JobSearchProgressLabels>;
}
/**
 * A search, as the person it is run for sees it: one page from the first
 * brief to the last shortlist.
 *
 * While the search is a `draft`, the page is the conversation that gets the
 * brief ready (`ClientSearchConversation`): the turns, each version of the
 * brief under the turn that wrote it, and a composer for words and files.
 *
 * Once it is open the page is managed, with no reply box, and shows in
 * order: a question put to the reader with its suggested answers
 * (`ClientSearchQuestion`), or a line saying their reply is being read; the
 * search under way with its reasoning (`ClientSearchLive`); what they can ask
 * for next (`ClientSearchNextActions`); each delivery of people, newest
 * first, with a Yes or No on each person and how that run searched
 * (`ClientSearchDelivery`); any run that delivered nobody; and the brief.
 *
 * Over both, the header: the title, where the search stands, and buttons
 * that open the brief (`ClientSearchBriefPanel`) and the progress
 * (`ClientSearchProgressPanel`), with a way to book a call.
 *
 * The page is a view: it fetches nothing, navigates nowhere and holds no
 * timer. Every value is a display value the host passes, and everything the
 * reader does goes out through a callback (`onReply`, `onAnswer`, `onAction`,
 * `onDecide`, `call`); the host passes new values when there are some. While
 * an answer or a request is on its way, both are held. `readOnly` shows the
 * same page with nothing to send.
 *
 * It fills its container's height: the header stays put and the rest
 * scrolls under it, so give it a container with a height of its own, such as
 * a column the height of the screen. An open search's sections scroll in a
 * region the keyboard can reach, named by `labels.sections`.
 *
 * The root is marked `data-slot="client-search-page"`, with the view in
 * `data-view` (`conversation` or `open`) and `data-read-only` on a read-only
 * page; each section inside keeps its own.
 */
declare function ClientSearchPage({ title, eyebrow, subtitle, agentName, steps, brief, briefOptions, draft, thread, awaitingReply, suggestedReplies, onReply, maxFiles, chat, question, onAnswer, searching, liveSteps, actions, onAction, actionsNeedCall, callPromptOpen, onCallPromptOpenChange, deliveries, otherRuns, onDecide, reasonOptional, reasonSuggestions, call, readOnly, markdownComponents, labels, decisionLabels, traceLabels, progressLabels, ...props }: ClientSearchPageProps): react.JSX.Element;

export { ClientSearchPage, type ClientSearchPageProps, type ClientSearchRun };
