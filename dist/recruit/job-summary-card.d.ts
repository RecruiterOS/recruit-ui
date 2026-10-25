import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

/** One labelled fact on a job card, such as a location or a count. */
interface JobSummaryFact {
    /** Stable key for the row. */
    id: string;
    label: ReactNode;
    value: ReactNode;
}
interface JobSummaryCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
    /** The job title, rendered as the card's level-3 heading. */
    title: ReactNode;
    /** A muted line under the title. */
    subtitle?: ReactNode;
    /** Media before the title, such as the client's logo. */
    logo?: ReactNode;
    /** A badge at the end of the header, such as `JobClientBadge` or a status. */
    badge?: ReactNode;
    /** The rows of the fact list, in order. */
    facts: readonly JobSummaryFact[];
    /** Called when the header or facts are activated. */
    onSelect?: () => void;
    /** Actions in a footer row outside the clickable area. */
    footer?: ReactNode;
    footerAlign?: "start" | "end" | "between";
}
/**
 * A job at a glance: identity, a divided fact list, and optional actions.
 *
 * The header and facts are one button that opens the job. The footer sits
 * outside it, so its actions never also open the job. Every value enters
 * through a slot: the host decides which facts to show and how to word them.
 * The root is the kit ResourceCard, marked `data-slot="job-summary-card"`.
 */
declare function JobSummaryCard({ title, subtitle, logo, badge, facts, onSelect, footer, footerAlign, ...props }: JobSummaryCardProps): react.JSX.Element;

export { JobSummaryCard, type JobSummaryCardProps, type JobSummaryFact };
