import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { CandidateCareerHistoryTimelineProps } from './candidate-career-history-timeline.cjs';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';
import '../core/calendar-date.cjs';

interface CandidateCareerHistoryPanelProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** The section heading, "Career history" by default. The count of roles follows it once loaded. */
    title?: ReactNode;
    items: CandidateCareerHistoryTimelineProps["items"];
    /** Skeleton rows while there are no items yet. */
    loading?: boolean;
    /** The blank slate's wording. Defaults to "No career history yet". */
    empty?: CandidateEmptyCopy;
    /** Passed to the timeline: how many employer groups keep their descriptions. */
    detailedCompanyGroups?: number;
    locale?: string;
}
/**
 * A counted career history that scrolls within the viewport, for a popover
 * or a narrow side panel: a section header over a CandidateCareerHistoryTimeline
 * in a scroll area capped at the viewport's height. The root is marked
 * `data-slot="candidate-career-history-panel"`, and the scroll area
 * `data-slot="career-history-scroll"`.
 */
declare function CandidateCareerHistoryPanel({ title, items, loading, empty, detailedCompanyGroups, locale, ...props }: CandidateCareerHistoryPanelProps): react.JSX.Element;

export { CandidateCareerHistoryPanel, type CandidateCareerHistoryPanelProps };
