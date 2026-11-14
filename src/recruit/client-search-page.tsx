"use client";

import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import type { MarkdownComponents } from "@epicbagel/saas-kit/primitives/markdown";
import { PageHeader } from "@epicbagel/saas-kit/primitives/page-header";
import { PageShell } from "@epicbagel/saas-kit/primitives/page-shell";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useState, type HTMLAttributes, type ReactNode } from "react";

import type { CandidateClientDecisionLabels } from "./candidate-client-decision";
import type { CandidateDecisionChoice } from "./candidate-decision-buttons";
import {
  ClientSearchConversation,
  type ClientSearchChatProps,
  type ClientSearchConversationItem,
  type ClientSearchDeliveryItem,
} from "./client-search-conversation";
import {
  ClientSearchBriefPanel,
  ClientSearchCallButton,
  ClientSearchCallPrompt,
  ClientSearchDelivery,
  ClientSearchLive,
  ClientSearchNextActions,
  ClientSearchProgressPanel,
  ClientSearchQuestion,
  clientSearchLabels,
  type ClientSearchAction,
  type ClientSearchCall,
  type ClientSearchLabels,
  type ClientSearchPerson,
} from "./client-search-sections";
import { JobBriefCard } from "./job-brief-card";
import { jobBriefView, type JobBriefContent, type JobBriefViewOptions } from "./job-brief-view";
import type { JobSearchProgressLabels, JobSearchStep } from "./job-search-progress";
import { SourcingTrace, type SourcingTraceLabels, type SourcingTraceStep } from "./sourcing-trace";

/** A sourcing run that delivered nobody, as the page lists it under the deliveries. */
export interface ClientSearchRun {
  /** Tells the run from the others. */
  id: string;
  /** Its steps, in order. */
  steps: readonly SourcingTraceStep[];
}

export interface ClientSearchPageProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
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
  onDecide?: (
    person: ClientSearchPerson,
    decision: CandidateDecisionChoice,
    reason: string,
  ) => Promise<void>;
  /** Lets an answer on a person be saved with no reason. A reason is required without it. */
  reasonOptional?: boolean;
  /** One-tap reasons for each answer on a person, already worded. */
  reasonSuggestions?: { yes?: readonly string[]; no?: readonly string[] };
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

const NO_STEPS: readonly JobSearchStep[] = [];
const NO_THREAD: readonly ClientSearchConversationItem[] = [];
const NO_ACTIONS: readonly ClientSearchAction[] = [];
const NO_DELIVERIES: readonly ClientSearchDeliveryItem[] = [];
const NO_RUNS: readonly ClientSearchRun[] = [];

// The header sits in the kit's page shell: the column the sections sit in,
// and the one the kit's conversation sets its turns in, so the title lines up
// with both. The shell ends on a page's bottom margin, though, and this page
// goes on under its header.
const HEADER_SHELL = "mb-0";

function present(value: ReactNode): boolean {
  return value != null && value !== false && value !== "";
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return value != null && typeof (value as PromiseLike<unknown>).then === "function";
}

/**
 * Whether any request the page has handed its host is still on its way, so
 * an answer and a request to the same search never cross.
 */
function useInFlight() {
  const [count, setCount] = useState(0);
  const track = (result: unknown) => {
    if (isPromiseLike(result)) {
      setCount((now) => now + 1);
      const settle = () => setCount((now) => now - 1);
      Promise.resolve(result).then(settle, settle);
    }
    return result;
  };
  return [count > 0, track] as const;
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
export function ClientSearchPage({
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
}: ClientSearchPageProps) {
  const text = { ...clientSearchLabels, ...labels };
  const [busy, track] = useInFlight();
  const [promptState, setPromptState] = useState(false);
  const promptOpen = callPromptOpen ?? promptState;
  const setPromptOpen = (open: boolean) => {
    if (callPromptOpen === undefined) setPromptState(open);
    onCallPromptOpenChange?.(open);
  };

  const bookable = !readOnly && call != null && (call.href != null || call.onSelect != null) ? call : null;
  const current = steps.find((step) => step.state === "current");
  const now = current ? text.now(current.title) : null;
  const description =
    present(subtitle) && present(now) ? (
      <>
        {subtitle} · {now}
      </>
    ) : present(subtitle) ? (
      subtitle
    ) : present(now) ? (
      now
    ) : undefined;

  const progressSteps = steps.map((step): JobSearchStep => {
    if (readOnly) {
      // A step's action is something to do, and nothing can be done here.
      const { action: _action, ...shown } = step;
      return shown;
    }
    // While the brief is still being agreed, talking it through is the other way on.
    if (draft && bookable && step.state === "current" && step.action == null && present(text.callInstead)) {
      return {
        ...step,
        action: (
          <ClientSearchCallButton call={bookable} variant="outline" size="sm">
            {text.callInstead}
          </ClientSearchCallButton>
        ),
      };
    }
    return step;
  });

  const answer = onAnswer ?? (onReply ? (words: string) => onReply(words, []) : undefined);
  const ask =
    onAction || actionsNeedCall
      ? (action: ClientSearchAction) => {
          // Asking needs a call first: the prompt opens, and the host isn't asked.
          if (actionsNeedCall) {
            setPromptOpen(true);
            return undefined;
          }
          return track(onAction?.(action));
        }
      : undefined;

  const showsCall = bookable !== null && !draft;
  const hasHeaderActions = Boolean(brief) || showsCall || steps.length > 0;

  return (
    <Stack
      data-slot="client-search-page"
      data-view={draft ? "conversation" : "open"}
      data-read-only={readOnly || undefined}
      gap="none"
      grow
      height="full"
      minHeight="zero"
      {...props}
    >
      <PageShell as="div" width="narrow" spacing="compact" className={HEADER_SHELL}>
        <PageHeader
          spacing="compact"
          actionsLayout="responsive"
          eyebrow={eyebrow}
          title={title}
          description={description}
        >
          {hasHeaderActions ? (
            <>
              {brief ? <ClientSearchBriefPanel brief={brief} briefOptions={briefOptions} labels={labels} /> : null}
              {showsCall && bookable ? (
                <ClientSearchCallButton call={bookable} variant="outline" size="sm">
                  {text.call}
                </ClientSearchCallButton>
              ) : null}
              {steps.length > 0 ? (
                <ClientSearchProgressPanel steps={progressSteps} labels={labels} progressLabels={progressLabels} />
              ) : null}
            </>
          ) : null}
        </PageHeader>
      </PageShell>

      {draft ? (
        <ClientSearchConversation
          thread={thread}
          agentName={agentName}
          awaitingReply={awaitingReply}
          suggestedReplies={suggestedReplies}
          onReply={onReply}
          maxFiles={maxFiles}
          readOnly={readOnly}
          onDecide={onDecide}
          reasonOptional={reasonOptional}
          reasonSuggestions={reasonSuggestions}
          briefOptions={briefOptions}
          markdownComponents={markdownComponents}
          chat={chat}
          labels={labels}
          decisionLabels={decisionLabels}
          traceLabels={traceLabels}
        />
      ) : (
        // The one part of an open search that scrolls, so the keyboard can
        // reach it to scroll, as it can the kit's own thread.
        <FlexItem
          grow
          minHeight="zero"
          overflow="y-auto"
          role="region"
          aria-label={text.sections}
          tabIndex={0}
        >
          <PageShell as="div" width="narrow">
            {question ? (
              <ClientSearchQuestion
                question={question}
                agentName={agentName}
                answers={suggestedReplies}
                onAnswer={answer ? (words) => track(answer(words)) : undefined}
                disabled={busy}
                readOnly={readOnly}
                markdownComponents={markdownComponents}
                labels={labels}
              />
            ) : awaitingReply ? (
              <Text tone="muted" role="status">
                {text.reading}
              </Text>
            ) : null}

            {searching || (liveSteps && liveSteps.length > 0) ? (
              <ClientSearchLive
                agentName={agentName}
                steps={liveSteps}
                more={deliveries.length > 0}
                markdownComponents={markdownComponents}
                labels={labels}
                traceLabels={traceLabels}
              />
            ) : null}

            <ClientSearchNextActions
              actions={actions}
              onAction={ask}
              disabled={busy}
              readOnly={readOnly}
              labels={labels}
            />

            {[...deliveries].reverse().map((delivery) => (
              <ClientSearchDelivery
                key={delivery.id}
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
            ))}

            {otherRuns.map((run) => (
              <SourcingTrace
                key={run.id}
                steps={run.steps}
                agentName={agentName}
                labels={traceLabels}
                markdownComponents={markdownComponents}
              />
            ))}

            {brief ? <JobBriefCard {...jobBriefView(brief, briefOptions)} presentation="preview" /> : null}
          </PageShell>
        </FlexItem>
      )}
      {draft || readOnly ? null : (
        <ClientSearchCallPrompt
          open={promptOpen}
          onOpenChange={setPromptOpen}
          call={bookable ?? undefined}
          labels={labels}
        />
      )}
    </Stack>
  );
}
