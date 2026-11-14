import * as react from 'react';
import { ReactNode, MouseEvent, HTMLAttributes } from 'react';
import { MarkdownComponents } from '@epicbagel/saas-kit/primitives/markdown';
import { CandidateClientDecisionLabels } from './candidate-client-decision.js';
import { CandidateDecisionChoice } from './candidate-decision-buttons.js';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.js';
import { CandidateReviewFact } from './candidate-review-card.js';
import { JobBriefContent, JobBriefViewOptions } from './job-brief-view.js';
import { JobSearchStep, JobSearchProgressLabels } from './job-search-progress.js';
import { SourcingTraceStep, SourcingTraceLabels } from './sourcing-trace.js';

/**
 * The fixed words of a client's search page, and of each section of it. A
 * section reads only the ones it shows; pass `labels` to change any.
 */
interface ClientSearchLabels {
    /** The current step, after the header's subtitle, given the step's title: "Now: Shortlist to review". */
    now: (step: ReactNode) => ReactNode;
    /** The button that opens the brief. */
    brief: ReactNode;
    /** The brief panel's title. */
    briefTitle: ReactNode;
    /** The button that opens the progress. */
    progress: ReactNode;
    /** The progress panel's title. */
    progressTitle: ReactNode;
    /** The accessible name of the part of an open search that scrolls: its sections, under the header. */
    sections: string;
    /** The control that books a call. */
    call: ReactNode;
    /** The same control as the current step's next action, while the brief is still being agreed. */
    callInstead: ReactNode;
    /** The question's heading, given who asks. */
    questionTitle: (agentName: string) => ReactNode;
    /** The suggested answers' accessible name. */
    answers: string;
    /**
     * Said while a reply to the reader is being written: where the question
     * would be on an open search, and as the conversation's running line.
     */
    reading: string;
    /** The live search's heading, given who searches. */
    searchingTitle: (agentName: string) => ReactNode;
    /** Under it, on a search that has delivered nobody yet. */
    searchingFirst: ReactNode;
    /** Under it, once there are people to review. */
    searchingMore: ReactNode;
    /** The heading over what the reader can ask for next. */
    nextTitle: ReactNode;
    /** Under a delivery's title, when the delivery has no description of its own. */
    deliveryDescription: ReactNode;
    /** A delivery with nobody in it. */
    deliveryEmpty: CandidateEmptyCopy;
    /** Over a person's evidence. */
    evidence: ReactNode;
    /** The call prompt's title. */
    callPromptTitle: ReactNode;
    /** The call prompt's words, over its control. */
    callPromptDescription: ReactNode;
    /** The conversation's composer, while it is empty. */
    replyPlaceholder: string;
    /** The conversation's running line while the reader's reply is on its way. */
    sending: string;
    /** Under the composer when more files are picked than one reply takes, given how many it takes. */
    tooManyFiles: (max: number) => string;
    /** A conversation with nothing in it, where nobody can write. */
    conversationEmpty: CandidateEmptyCopy;
    /**
     * An answer, a request or a reply that failed, given what the host's
     * promise rejected with, so a host can say why where it knows (a file was
     * too large) and something general where it doesn't.
     */
    failed: (cause: unknown) => string;
}
/** The default wording of a client's search page. Pass `labels` to change any of it. */
declare const clientSearchLabels: Readonly<ClientSearchLabels>;
/** A section's heading level: 2 under the page's own h1, or 3 or 4 where it sits deeper in the outline. */
type ClientSearchTitleLevel = 2 | 3 | 4;
interface ClientSearchQuestionProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
    /** The question, as Markdown. */
    question: string;
    /** Who asks it, for the heading ("Scout has a question"). */
    agentName: string;
    /** Answers the reader can give in one tap, already worded. */
    answers?: readonly string[];
    /**
     * Called with the answer the reader picked. While a promise it returns is
     * pending the answers are held; if it rejects, they come back with
     * `labels.failed` under them. Without it the answers show as text.
     */
    onAnswer?: (answer: string) => unknown;
    /** Holds the answers, such as while another request from the same page is on its way. */
    disabled?: boolean;
    /** Shows the question and the answers offered as text, with nothing to press. */
    readOnly?: boolean;
    /** The heading's level: 2 (the default), or 3 or 4 to fit the page's outline. */
    titleLevel?: ClientSearchTitleLevel;
    /** Per-element overrides for the question's Markdown. */
    markdownComponents?: MarkdownComponents;
    labels?: Partial<ClientSearchLabels>;
}
/**
 * A question whoever runs a search has put to the person it is run for, with
 * the answers suggested for it: one tap sends one.
 *
 * The host owns the question, the answers and what an answer does: the
 * component holds no conversation. A promise from `onAnswer` holds the
 * answers until it settles and, if it rejects, brings them back with an
 * error line (`labels.failed`, which is given what it rejected with).
 * `readOnly` lists the answers as text.
 *
 * The root is a `section` named by its heading and marked
 * `data-slot="client-search-question"`, `aria-busy` while an answer is on its
 * way. The kit Card inside keeps its own.
 */
declare function ClientSearchQuestion({ question, agentName, answers, onAnswer, disabled, readOnly, titleLevel, markdownComponents, labels, ...props }: ClientSearchQuestionProps): react.JSX.Element;
interface ClientSearchLiveProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
    /** Who is searching, for the heading and the run's name ("Scout is searching"). */
    agentName: string;
    /**
     * The steps of the run under way, as it reports them. Left out or empty,
     * the section says only that the search is on.
     */
    steps?: readonly SourcingTraceStep[];
    /**
     * The search has already delivered people: the line under the heading says
     * it is looking for more (`labels.searchingMore`), not that the first are
     * on their way (`labels.searchingFirst`).
     */
    more?: boolean;
    /** The line under the heading, in place of either default. */
    description?: ReactNode;
    /** The heading's level: 2 (the default), or 3 or 4 to fit the page's outline. */
    titleLevel?: ClientSearchTitleLevel;
    /** Per-element overrides for the steps' Markdown detail. */
    markdownComponents?: MarkdownComponents;
    labels?: Partial<ClientSearchLabels>;
    /** The run's own wording, as `SourcingTrace` takes it. */
    traceLabels?: Partial<SourcingTraceLabels>;
}
/**
 * A search that is finding people now, for the person it is run for: who is
 * searching, a line on what to expect, and the run under way step by step
 * (`SourcingTrace`, live), each step's reasoning folded under it.
 *
 * The host decides whether a search is on and words its steps: the component
 * fetches nothing and holds no timer, so the host passes new `steps` as the
 * run reports them.
 *
 * The root is a `section` named by its heading and marked
 * `data-slot="client-search-live"`. The kit Card inside keeps its own.
 */
declare function ClientSearchLive({ agentName, steps, more, description, titleLevel, markdownComponents, labels, traceLabels, ...props }: ClientSearchLiveProps): react.JSX.Element;
/** Something the reader can ask for next. */
interface ClientSearchAction {
    /** Tells the action from the others, and tells the host which was asked for. */
    id: string;
    /** What asking for it says, already worded: "Find more people like Mei Tanaka". */
    label: string;
}
interface ClientSearchNextActionsProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
    /** What the reader can ask for, in order. With none, nothing is drawn. */
    actions: readonly ClientSearchAction[];
    /**
     * Called with the action the reader asked for. While a promise it returns
     * is pending the actions are held; if it rejects, they come back with
     * `labels.failed` under them. Without it the actions show as text.
     */
    onAction?: (action: ClientSearchAction) => unknown;
    /** Holds the actions, such as while another request from the same page is on its way. */
    disabled?: boolean;
    /** Lists what can be asked for as text, with nothing to press. */
    readOnly?: boolean;
    /** The heading's level: 2 (the default), or 3 or 4 to fit the page's outline. */
    titleLevel?: ClientSearchTitleLevel;
    labels?: Partial<ClientSearchLabels>;
}
/**
 * What the person a search is run for can ask for next, beyond a Yes or a No
 * on each person: one tap asks for one, such as more people like someone
 * they said Yes to.
 *
 * The host decides what is on offer and what asking does. A promise from
 * `onAction` holds the actions until it settles and, if it rejects, brings
 * them back with an error line (`labels.failed`). `readOnly` lists them as
 * text. With no actions it draws nothing.
 *
 * The root is a `section` named by its heading and marked
 * `data-slot="client-search-next-actions"`, `aria-busy` while a request is on
 * its way. The kit Card inside keeps its own.
 */
declare function ClientSearchNextActions({ actions, onAction, disabled, readOnly, titleLevel, labels, ...props }: ClientSearchNextActionsProps): react.JSX.Element | null;
/**
 * One person in a delivery, as their card shows them. Every field is a
 * display value the host has chosen to show the reader: there is none for a
 * record, and none for notes. The words under a recorded answer are `reason`
 * and nothing else.
 */
interface ClientSearchPerson {
    /** Tells the person from the others on the page. */
    id: string;
    /** Their name: the card's heading, and how the Yes or No dialog names them. */
    name: string;
    /** Their face, usually the kit's PersonAvatar. 44px reads best. */
    avatar?: ReactNode;
    /** A banner over the card, as `CandidateReviewCard` takes it. */
    cover?: ReactNode;
    /** The line under the name, such as their title and company. */
    headline?: ReactNode;
    /** At the header's end, such as a link to their public profile. */
    headerActions?: ReactNode;
    /** Labelled facts, such as where they are and how well they fit. */
    facts?: readonly CandidateReviewFact[];
    /** Why they were picked, a line each, under `labels.evidence`. */
    evidence?: readonly ReactNode[];
    /** The reader's answer, once they have given one. */
    decision?: CandidateDecisionChoice | null;
    /** The reader's own reason for it, in their words. */
    reason?: string | null;
}
interface ClientSearchDeliveryProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
    /** The delivery's name: its heading. */
    title: ReactNode;
    /** What was said about it, under the title. Defaults to `labels.deliveryDescription`. */
    description?: ReactNode;
    /** The people in it, in its order. */
    people: readonly ClientSearchPerson[];
    /** How the run that found them searched: its steps, folded to one line under the people. */
    runSteps?: readonly SourcingTraceStep[];
    /** Who searched, for the run's name ("How Scout searched"). */
    agentName: string;
    /**
     * Saves the reader's Yes or No on a person, with their reason, as
     * `CandidateClientDecision` asks for it: the dialog stays open until the
     * promise settles, and a rejected one brings the buttons back with an error
     * line. Without it the cards only show the answers given.
     */
    onDecide?: (person: ClientSearchPerson, decision: CandidateDecisionChoice, reason: string) => Promise<void>;
    /** Lets an answer be saved with no reason. A reason is required without it. */
    reasonOptional?: boolean;
    /** One-tap reasons for each answer, already worded. */
    reasonSuggestions?: {
        yes?: readonly string[];
        no?: readonly string[];
    };
    /** Shows each answer and takes none: no Yes, No or Change. */
    readOnly?: boolean;
    /** Per-element overrides for the run's Markdown detail. */
    markdownComponents?: MarkdownComponents;
    labels?: Partial<ClientSearchLabels>;
    /** The Yes or No row's wording, as `CandidateClientDecision` takes it. */
    decisionLabels?: Partial<CandidateClientDecisionLabels>;
    /** The run's wording, as `SourcingTrace` takes it. */
    traceLabels?: Partial<SourcingTraceLabels>;
}
/**
 * One delivery of people to the person a search is run for: its name and
 * what was said about it, a card for each person (`CandidateReviewCard`)
 * with their Yes or No under it (`CandidateClientDecision`), then how the
 * run that found them searched, folded to one line (`SourcingTrace`).
 *
 * The host passes what each card shows (`ClientSearchPerson`) and saves each
 * answer: nothing is fetched or recorded here, and a card shows no more than
 * the host passed. A delivery with nobody in it shows the kit's empty state.
 * `readOnly` shows each answer in words and takes none.
 *
 * The root is marked `data-slot="client-search-delivery"`; the shortlist,
 * the cards, the decision rows and the trace inside keep their own.
 */
declare function ClientSearchDelivery({ title, description, people, runSteps, agentName, onDecide, reasonOptional, reasonSuggestions, readOnly, markdownComponents, labels, decisionLabels, traceLabels, ...props }: ClientSearchDeliveryProps): react.JSX.Element;
/** How the reader books a call with whoever runs the search: a link, a callback, or both. */
interface ClientSearchCall {
    /** Where a call is booked, such as a booking page or a `mailto:` address. Makes the control a link. */
    href?: string;
    /** Opens the link in a new tab. */
    external?: boolean;
    /**
     * Called when the control is used. With `href`, it runs before the link is
     * followed, so a host can prevent the default and open its own booking.
     */
    onSelect?: (event: MouseEvent<HTMLElement>) => void;
}
interface ClientSearchCallButtonProps {
    /** Where the control leads, or what it calls. */
    call: ClientSearchCall;
    /** The control's words, such as "Book a call". */
    children: ReactNode;
    /** `default` (the default) where the call is the one thing to do, `outline` beside other controls. */
    variant?: "default" | "outline";
    size?: "sm" | "default";
}
/**
 * The control that books a call: a link where the host has somewhere to send
 * the reader (`call.href`), otherwise a button that calls the host
 * (`call.onSelect`). The host owns the booking; nothing is opened here.
 *
 * Its root is the kit's Button, a link's as its anchor, and keeps the kit's
 * `data-slot`.
 */
declare function ClientSearchCallButton({ call, children, variant, size, }: ClientSearchCallButtonProps): react.JSX.Element;
interface ClientSearchCallPromptProps {
    open: boolean;
    /** Called when the reader closes the prompt. */
    onOpenChange: (open: boolean) => void;
    /** How a call is booked. Without it the prompt only says to talk first. */
    call?: ClientSearchCall;
    labels?: Partial<ClientSearchLabels>;
}
/**
 * Tells the reader that what they asked for needs a call first, and offers
 * one: for a search whose next step is the host's to open, such as more
 * sourcing once the first shortlist is reviewed. The host decides when it
 * shows (`open`) and where a call is booked.
 *
 * It is the kit's responsive dialog (a centred dialog, or a bottom sheet on a
 * phone), which keeps the kit's `data-slot` on its content; the prompt's own
 * layout inside it is marked `data-slot="client-search-call-prompt"`.
 */
declare function ClientSearchCallPrompt({ open, onOpenChange, call, labels }: ClientSearchCallPromptProps): react.JSX.Element;
interface ClientSearchBriefPanelProps {
    /** The brief as it stands. */
    brief: JobBriefContent;
    /** How the brief is read, as `jobBriefView` takes it: its title, wording and audience. */
    briefOptions?: JobBriefViewOptions;
    labels?: Partial<ClientSearchLabels>;
}
/**
 * The brief behind a button, for a page's header: the button opens the brief
 * in full (`JobBriefCard` over `jobBriefView`) in the kit's responsive dialog,
 * a centred dialog or a bottom sheet on a phone. The brief is read only.
 *
 * The button is the kit's and keeps its `data-slot`, as the dialog's content
 * does; the panel's body is marked `data-slot="client-search-brief-panel"`.
 */
declare function ClientSearchBriefPanel({ brief, briefOptions, labels }: ClientSearchBriefPanelProps): react.JSX.Element;
interface ClientSearchProgressPanelProps {
    /** The search's steps, in order, as `JobSearchProgress` takes them. */
    steps: readonly JobSearchStep[];
    labels?: Partial<ClientSearchLabels>;
    /** Each state in words, as `JobSearchProgress` takes them. */
    progressLabels?: Partial<JobSearchProgressLabels>;
}
/**
 * Where a search stands behind a button, for a page's header: the button
 * opens the steps (`JobSearchProgress`) in the kit's responsive dialog, a
 * centred dialog or a bottom sheet on a phone. The host decides the steps
 * and which is current.
 *
 * The button is the kit's and keeps its `data-slot`, as the dialog's content
 * does; the panel's body is marked `data-slot="client-search-progress-panel"`.
 */
declare function ClientSearchProgressPanel({ steps, labels, progressLabels }: ClientSearchProgressPanelProps): react.JSX.Element;

export { type ClientSearchAction, ClientSearchBriefPanel, type ClientSearchBriefPanelProps, type ClientSearchCall, ClientSearchCallButton, type ClientSearchCallButtonProps, ClientSearchCallPrompt, type ClientSearchCallPromptProps, ClientSearchDelivery, type ClientSearchDeliveryProps, type ClientSearchLabels, ClientSearchLive, type ClientSearchLiveProps, ClientSearchNextActions, type ClientSearchNextActionsProps, type ClientSearchPerson, ClientSearchProgressPanel, type ClientSearchProgressPanelProps, ClientSearchQuestion, type ClientSearchQuestionProps, type ClientSearchTitleLevel, clientSearchLabels };
