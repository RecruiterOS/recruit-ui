import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { CandidateCareerHistoryTimelineProps } from './candidate-career-history-timeline.js';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.js';
import '../core/calendar-date.js';

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
    /**
     * `viewport` (the default) caps the timeline at the viewport's height in a
     * scroll area of its own, for a popover or a narrow side panel. `none` lets
     * it run at full height, for a container that already scrolls, such as a
     * profile dialog's body, so the history never scrolls inside the body.
     */
    scroll?: "viewport" | "none";
}
/**
 * A counted career history: a section header over a
 * CandidateCareerHistoryTimeline. By default the timeline scrolls within the
 * viewport, for a popover or a narrow side panel; with `scroll="none"` it runs
 * at full height in a container that already scrolls. The root is marked
 * `data-slot="candidate-career-history-panel"`, and the scroll area, when
 * there is one, `data-slot="career-history-scroll"`.
 */
declare function CandidateCareerHistoryPanel({ title, items, loading, empty, detailedCompanyGroups, locale, scroll, ...props }: CandidateCareerHistoryPanelProps): react.JSX.Element;

export { CandidateCareerHistoryPanel, type CandidateCareerHistoryPanelProps };
