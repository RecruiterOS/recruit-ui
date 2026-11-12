import * as react from 'react';
import { MarkdownComponents } from '@epicbagel/saas-kit/primitives/markdown';

/** A step's status as the sourcing process reports it. */
type SourcingStepStatus = "pending" | "running" | "done" | "error" | "skipped";
/** A step as it is shown: as reported, or `stopped` once its run isn't under way. */
type SourcingStepShownStatus = SourcingStepStatus | "stopped";
/** One step of a sourcing run, written for the person the search is run for. */
interface SourcingTraceStep {
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
interface SourcingTraceLabels {
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
declare const sourcingTraceLabels: Readonly<SourcingTraceLabels>;
/** How a step shows: as reported while its run is live, and stopped if the run left it pending or running. */
declare function sourcingStepShownStatus(status: SourcingStepStatus, live: boolean): SourcingStepShownStatus;
/**
 * The one line a folded run shows: how far it got ("5 steps", "3 of 5 steps
 * done"), with the steps that failed or were skipped, and "stopped" when it
 * left steps pending or running. `failed` turns the line red.
 */
declare function sourcingTraceSummary(steps: ReadonlyArray<Pick<SourcingTraceStep, "status">>): {
    description: string;
    failed: boolean;
};
interface SourcingTraceProps {
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
declare function SourcingTrace({ steps, agentName, live, labels, markdownComponents }: SourcingTraceProps): react.JSX.Element | null;

export { type SourcingStepShownStatus, type SourcingStepStatus, SourcingTrace, type SourcingTraceLabels, type SourcingTraceProps, type SourcingTraceStep, sourcingStepShownStatus, sourcingTraceLabels, sourcingTraceSummary };
