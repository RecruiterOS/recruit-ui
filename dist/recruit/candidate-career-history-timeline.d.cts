import * as react from 'react';
import { ReactNode } from 'react';
import { CalendarDateValue } from '../core/calendar-date.cjs';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';

interface CareerHistoryItem {
    title: ReactNode;
    company?: ReactNode;
    /** Host-formatted date text takes precedence over raw dates. */
    dateRange?: ReactNode;
    startDate?: CalendarDateValue;
    endDate?: CalendarDateValue;
    current?: boolean;
    description?: ReactNode;
    /** Stable host grouping key when `company` is not a string. */
    companyGroup?: string;
}
interface CareerDateRangeProps {
    start?: CalendarDateValue;
    end?: CalendarDateValue;
    current?: boolean;
    presentLabel?: ReactNode;
    locale?: string;
}
/** Absolute calendar dates for a career history; never relative to today. */
declare function CareerDateRange({ start, end, current, presentLabel, locale, }: CareerDateRangeProps): react.JSX.Element | null;
/** The heading level of a role's title in a career history. */
type CareerHistoryTitleLevel = 3 | 4 | 5 | 6;
interface CandidateCareerHistoryTimelineProps {
    items: readonly CareerHistoryItem[];
    loading?: boolean;
    /** The blank slate's wording. Defaults to "No career history yet". */
    empty?: CandidateEmptyCopy;
    /** @deprecated Use `empty.title`. */
    emptyTitle?: string;
    /** @deprecated Use `empty.description`. */
    emptyDescription?: string;
    earlierLabel?: ReactNode;
    presentLabel?: ReactNode;
    detailedCompanyGroups?: number;
    locale?: string;
    /**
     * The heading level of each role's title: 5 (the default), or 3, 4 or 6
     * to sit one under whatever heads the history, so a page's outline skips
     * no level. Only the tag changes: a title looks the same at every level.
     * When it is given, the "Earlier" label is said at the same level.
     */
    titleLevel?: CareerHistoryTitleLevel;
    className?: string;
}
declare function CandidateCareerHistoryTimeline({ items, loading, empty, emptyTitle, emptyDescription, earlierLabel, presentLabel, detailedCompanyGroups, locale, titleLevel: askedLevel, className, }: CandidateCareerHistoryTimelineProps): react.JSX.Element;

export { CandidateCareerHistoryTimeline, type CandidateCareerHistoryTimelineProps, CareerDateRange, type CareerDateRangeProps, type CareerHistoryItem, type CareerHistoryTitleLevel };
