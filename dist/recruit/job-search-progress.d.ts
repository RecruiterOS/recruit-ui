import * as react from 'react';
import { Key, ReactNode, HTMLAttributes } from 'react';

/** Where a step of a search stands. */
type JobSearchStepState = "done" | "current" | "upcoming";
/** One step of a search, as the person waiting on it reads it. */
interface JobSearchStep {
    id: Key;
    /** The step's name, such as "Shortlist". */
    title: ReactNode;
    state: JobSearchStepState;
    /** What happens in this step, or what happened. */
    description?: ReactNode;
    /** At the row's end, such as a date or how long the step takes. */
    meta?: ReactNode;
    /**
     * Under the description, such as a link to book a call. Usually given
     * only on the current step: it is what the reader does next.
     */
    action?: ReactNode;
}
/** Host-owned wording for each state, read out beside the step's name. */
interface JobSearchProgressLabels {
    done: string;
    current: string;
    upcoming: string;
}
interface JobSearchProgressProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    /** The steps, in the order they happen. */
    steps: readonly JobSearchStep[];
    labels?: Partial<JobSearchProgressLabels>;
}
/**
 * Where a search stands, for the person it is run for: its steps in order,
 * each done, in progress or still to come, with the current step's next
 * action under it. A client's view of a search, or a recruiter's summary of
 * one.
 *
 * The host decides the steps, their wording and which is current: the
 * component holds no workflow. A step's state is a glyph and a visually
 * hidden word (`labels`), never colour alone, and the current step carries
 * `aria-current="step"`. Upcoming steps are muted. The root is marked
 * `data-slot="job-search-progress"`; each step is a kit timeline row inside
 * a list item marked `data-slot="job-search-step"` with its state in
 * `data-state`.
 */
declare function JobSearchProgress({ steps, labels, ...props }: JobSearchProgressProps): react.JSX.Element;

export { JobSearchProgress, type JobSearchProgressLabels, type JobSearchProgressProps, type JobSearchStep, type JobSearchStepState };
