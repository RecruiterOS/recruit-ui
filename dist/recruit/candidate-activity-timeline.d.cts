import * as react from 'react';
import { Key, ElementType, ReactNode, MouseEvent, HTMLAttributes } from 'react';
import { IconProps } from '@epicbagel/saas-kit/primitives/icon';
import { TimelineProps } from '@epicbagel/saas-kit/primitives/timeline';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';

interface CandidateActivityItemBase {
    /** Identifies the item within its group. */
    id: Key;
    /** The glyph for what kind of activity it is, as a component such as a lucide icon. */
    icon?: ElementType;
    /** The glyph's colour, such as `info` for a meeting or `success` for a reply. Defaults to `muted`. */
    iconTone?: IconProps["tone"];
    /** What happened, such as an email's subject. Clamped to two lines. */
    title: ReactNode;
    /** One line of context under the title, such as the channel and who it was with. */
    subtitle?: ReactNode;
    /** When it happened, already formatted. */
    timestamp?: ReactNode;
}
/** A row that holds longer content, such as a transcript or an email body, behind a toggle. */
interface CandidateActivityDetailItem extends CandidateActivityItemBase {
    /** The longer content, kept as written: line breaks are preserved. */
    body?: ReactNode;
    /** The toggle's text while the body is hidden, such as how long it is. */
    bodyLabel?: ReactNode;
    href?: never;
    onSelect?: never;
}
/** A row that opens something: a link with `href`, otherwise a button. */
interface CandidateActivityLinkItem extends CandidateActivityItemBase {
    /** Makes the row a link. */
    href?: string;
    /**
     * Called when the row is activated. With `href`, it runs before the link
     * is followed, so a client-side router can prevent the default and
     * navigate itself.
     */
    onSelect?: (event: MouseEvent<HTMLElement>) => void;
    body?: never;
    bodyLabel?: never;
}
/**
 * One thing that happened with a person. A row either holds a `body` behind a
 * toggle or opens something (`href` or `onSelect`), never both, so a control
 * never sits inside another.
 */
type CandidateActivityItem = CandidateActivityDetailItem | CandidateActivityLinkItem;
/** The items in one period, such as "Today" or "This month", newest first. */
interface CandidateActivityGroup {
    id: Key;
    /** The period's heading, already worded. */
    label: ReactNode;
    /** Shown beside the heading in the kit's count badge, such as how many items the period holds. */
    count?: number;
    items: readonly CandidateActivityItem[];
}
/** Host-owned wording for the timeline's fixed parts. */
interface CandidateActivityTimelineLabels {
    /** The body toggle while the body is hidden, when the item has no `bodyLabel`. */
    showBody: ReactNode;
    /** The body toggle while the body is shown. */
    hideBody: ReactNode;
}
interface CandidateActivityTimelineProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    /** The periods, in order, usually newest first. Empty groups are left out. */
    groups: readonly CandidateActivityGroup[];
    /** Skeleton rows in place of the timeline. */
    loading?: boolean;
    /** The blank slate's wording. Defaults to "No activity yet". */
    empty?: CandidateEmptyCopy;
    /** The kit Timeline's spacing between rows in a period. Defaults to `tight`. */
    spacing?: TimelineProps["spacing"];
    labels?: Partial<CandidateActivityTimelineLabels>;
}
/**
 * A person's history, grouped by period: each period under its own heading,
 * each item a kit TimelineRow with a glyph, a title, a line of context and a
 * timestamp. A row can hold a longer body (a transcript, an email) behind a
 * toggle, or open something. A skeleton shows while it loads, and the kit's
 * empty state when nothing has happened.
 *
 * The host owns which records count as activity, how they are grouped and
 * worded, and what a row opens. The root is marked
 * `data-slot="candidate-activity-timeline"`; each period is a `section`
 * marked `data-slot="candidate-activity-period"`. Given an `aria-label` or
 * `aria-labelledby`, the root is a `region` (a host `role` wins), since a
 * label on a plain element is ignored by assistive technology.
 */
declare function CandidateActivityTimeline({ groups, loading, empty, spacing, labels, role, ...rest }: CandidateActivityTimelineProps): react.JSX.Element;

export { type CandidateActivityDetailItem, type CandidateActivityGroup, type CandidateActivityItem, type CandidateActivityLinkItem, CandidateActivityTimeline, type CandidateActivityTimelineLabels, type CandidateActivityTimelineProps };
