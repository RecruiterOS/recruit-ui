import * as react from 'react';
import { ReactNode, Key, HTMLAttributes } from 'react';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';

/** One labelled line under a signal, such as why it matters. */
interface CandidateSignalDetail {
    label: ReactNode;
    value: ReactNode;
}
/** A change worth acting on, already worded by the host. */
interface CandidateSignalItem {
    id: Key;
    /** What kind of change it is, shown as a small uppercase badge. */
    kind: ReactNode;
    /** A second, outlined badge when the signal is not open, such as "snoozed". */
    status?: ReactNode;
    /** When it was detected, already formatted. */
    detectedAt: ReactNode;
    /** What changed, in one line. */
    summary: ReactNode;
    /** Labelled lines under the summary. Empty ones are the host's to leave out. */
    details?: readonly CandidateSignalDetail[];
    /** Controls at the top right, such as a CandidateSignalMenu. */
    actions?: ReactNode;
}
interface CandidateSignalListProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** The section heading. The count follows it once loaded. */
    title: ReactNode;
    items: readonly CandidateSignalItem[];
    /** Skeleton cards in place of the list. */
    loading?: boolean;
    /** Shown in place of the list when it could not be loaded. */
    error?: ReactNode;
    /** The blank slate's wording. Defaults to "No signals yet". */
    empty?: CandidateEmptyCopy;
}
/**
 * The signals about one person, newest first, as a counted section of muted
 * cards: a kind badge, when it was detected, what changed, and the host's
 * labelled detail lines. Loading shows skeleton cards; no signals renders
 * the kit's empty state. The root is the kit PanelSection, marked
 * `data-slot="candidate-signal-list"`.
 */
declare function CandidateSignalList({ title, items, loading, error, empty, ...props }: CandidateSignalListProps): react.JSX.Element;

export { type CandidateSignalDetail, type CandidateSignalItem, CandidateSignalList, type CandidateSignalListProps };
