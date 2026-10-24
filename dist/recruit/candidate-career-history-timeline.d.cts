import * as react from 'react';
import { ReactNode } from 'react';
import { CalendarDateValue } from '../core/calendar-date.cjs';

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
interface CandidateCareerHistoryTimelineProps {
    items: readonly CareerHistoryItem[];
    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    earlierLabel?: ReactNode;
    presentLabel?: ReactNode;
    detailedCompanyGroups?: number;
    locale?: string;
    className?: string;
}
declare function CandidateCareerHistoryTimeline({ items, loading, emptyTitle, emptyDescription, earlierLabel, presentLabel, detailedCompanyGroups, locale, className, }: CandidateCareerHistoryTimelineProps): react.JSX.Element;

export { CandidateCareerHistoryTimeline, type CandidateCareerHistoryTimelineProps, CareerDateRange, type CareerDateRangeProps, type CareerHistoryItem };
