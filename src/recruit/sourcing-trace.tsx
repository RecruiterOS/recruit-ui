"use client";

import { Collapsible } from "@epicbagel/saas-kit/primitives/collapsible";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { LazyMarkdown } from "@epicbagel/saas-kit/primitives/lazy-markdown";
import type { MarkdownComponents } from "@epicbagel/saas-kit/primitives/markdown";
import { Circle, CircleCheck, CircleDot, CircleMinus, CircleStop, CircleX, type LucideIcon } from "lucide-react";
import { useState } from "react";

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
  ChainOfThoughtStatic,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
} from "./chain-of-thought";

/** A step's status as the sourcing process reports it. */
export type SourcingStepStatus = "pending" | "running" | "done" | "error" | "skipped";

/** A step as it is shown: as reported, or `stopped` once its run isn't under way. */
export type SourcingStepShownStatus = SourcingStepStatus | "stopped";

/** One step of a sourcing run, written for the person the search is run for. */
export interface SourcingTraceStep {
  /** Stable for the life of the step, so a poll that inserts or reorders steps keeps what the reader opened. */
  key: string;
  title: string;
  status: SourcingStepStatus;
  /** A short second line under the title. */
  description?: string | null;
  /** Markdown, folded under the step. */
  detail?: string | null;
}

/** Host-owned wording: what each status glyph says to a screen reader, and how a run is named. */
export interface SourcingTraceLabels {
  pending: string;
  running: string;
  done: string;
  error: string;
  skipped: string;
  stopped: string;
  /** The name of the run under way, such as "How Scout is sourcing". */
  live: (agentName: string) => string;
  /** The name of a run that isn't under way, such as "How Scout searched". */
  settled: (agentName: string) => string;
}

export const sourcingTraceLabels: Readonly<SourcingTraceLabels> = {
  pending: "Up next",
  running: "In progress",
  done: "Done",
  error: "Failed",
  skipped: "Skipped",
  stopped: "Stopped",
  live: (agentName) => `How ${agentName} is sourcing`,
  settled: (agentName) => `How ${agentName} searched`,
};

const unfinished = (status: SourcingStepStatus) => status === "pending" || status === "running";

/** How a step shows: as reported while its run is live, and stopped if the run left it pending or running. */
export function sourcingStepShownStatus(status: SourcingStepStatus, live: boolean): SourcingStepShownStatus {
  return !live && unfinished(status) ? "stopped" : status;
}

/**
 * The one line a folded run shows: how far it got ("5 steps", "3 of 5 steps
 * done"), with the steps that failed or were skipped, and "stopped" when it
 * left steps pending or running. `failed` turns the line red.
 */
export function sourcingTraceSummary(steps: ReadonlyArray<Pick<SourcingTraceStep, "status">>) {
  const total = steps.length;
  let done = 0;
  let failed = 0;
  let skipped = 0;
  let stopped = 0;
  for (const step of steps) {
    if (step.status === "done") done += 1;
    else if (step.status === "error") failed += 1;
    else if (step.status === "skipped") skipped += 1;
    else stopped += 1;
  }
  const count = `${total} ${total === 1 ? "step" : "steps"}`;
  const parts = [done === total ? count : `${done} of ${count} done`];
  if (failed > 0) parts.push(`${failed} failed`);
  if (skipped > 0) parts.push(`${skipped} skipped`);
  if (stopped > 0) parts.push("stopped");
  return { description: parts.join(" · "), failed: failed > 0 };
}

/**
 * Each status's glyph, one family of circles. No sentiment colour: the line
 * turns an error red, and a running step's title shimmers (still, for a
 * reader who asks for less motion), so nothing here spins.
 */
const STEP_ICONS: Record<SourcingStepShownStatus, LucideIcon> = {
  pending: Circle,
  running: CircleDot,
  done: CircleCheck,
  error: CircleX,
  skipped: CircleMinus,
  stopped: CircleStop,
};

/** The timeline's line state: running shimmers, an error is red, and a step still to come, skipped or stopped is dimmed. */
const LINE_STATUS: Record<SourcingStepShownStatus, "pending" | "running" | "error" | undefined> = {
  pending: "pending",
  running: "running",
  done: undefined,
  error: "error",
  skipped: "pending",
  stopped: "pending",
};

/**
 * A step, and under it its detail when it has some, folded behind the line.
 * Until the reader opens or closes it, the detail is open while the step
 * runs, so it folds again as the step finishes.
 */
function SourcingStepItem({
  step,
  live,
  labels,
  markdownComponents,
  isLast,
}: {
  step: SourcingTraceStep;
  live: boolean;
  labels: SourcingTraceLabels;
  markdownComponents?: MarkdownComponents;
  isLast?: boolean;
}) {
  const [opened, setOpened] = useState<boolean | null>(null);
  const status = sourcingStepShownStatus(step.status, live);
  const line = {
    status: LINE_STATUS[status],
    "data-step-status": status,
    description: step.description,
    // The glyph is the only sign of the status, so a screen reader names it.
    leftIcon: <Icon icon={STEP_ICONS[status]} role="img" aria-hidden={false} aria-label={labels[status]} />,
  };
  return (
    <ChainOfThoughtStep isLast={isLast} open={opened ?? status === "running"} onOpenChange={setOpened}>
      {step.detail ? (
        <>
          <ChainOfThoughtTrigger {...line} swapIconOnHover={false}>{step.title}</ChainOfThoughtTrigger>
          <ChainOfThoughtContent>
            <ChainOfThoughtItem>
              <LazyMarkdown size="sm" tone="muted" components={markdownComponents}>{step.detail}</LazyMarkdown>
            </ChainOfThoughtItem>
          </ChainOfThoughtContent>
        </>
      ) : <ChainOfThoughtStatic {...line}>{step.title}</ChainOfThoughtStatic>}
    </ChainOfThoughtStep>
  );
}

export interface SourcingTraceProps {
  /** The run's steps, in order. With none, nothing is drawn. */
  steps: readonly SourcingTraceStep[];
  /** Who did the work, for the run's name ("How Scout searched"). */
  agentName: string;
  /**
   * The run under way: every step shows, as reported. Any other run
   * (finished, gone quiet or overtaken) folds into one line that opens to its
   * steps, a step it left pending or running shown stopped.
   */
  live?: boolean;
  labels?: Partial<SourcingTraceLabels>;
  /** Per-element overrides for the steps' Markdown detail, such as a host's heading face. */
  markdownComponents?: MarkdownComponents;
}

/**
 * How a sourcing run went, for the person the search is run for: a line per
 * step, in order, each with its status (ticked once done, red on an error,
 * the running one shimmering with its detail open) and its short
 * description, the Markdown detail folded under it.
 *
 * The host decides which run is live and words the steps: the component
 * holds no workflow and fetches nothing. A status is a glyph named for a
 * screen reader (`labels`), never colour alone.
 */
export function SourcingTrace({ steps, agentName, live = false, labels, markdownComponents }: SourcingTraceProps) {
  if (steps.length === 0) return null;
  const text = { ...sourcingTraceLabels, ...labels };
  const items = steps.map((step) => (
    <SourcingStepItem key={step.key} step={step} live={live} labels={text} markdownComponents={markdownComponents} />
  ));
  if (live) {
    return <ChainOfThought role="group" aria-label={text.live(agentName)}>{items}</ChainOfThought>;
  }
  const summary = sourcingTraceSummary(steps);
  const title = text.settled(agentName);
  return (
    <Collapsible role="group" aria-label={title}>
      <ChainOfThoughtTrigger status={summary.failed ? "error" : undefined} description={summary.description}>
        {title}
      </ChainOfThoughtTrigger>
      <ChainOfThoughtContent timeline={false}>
        <ChainOfThought>{items}</ChainOfThought>
      </ChainOfThoughtContent>
    </Collapsible>
  );
}
