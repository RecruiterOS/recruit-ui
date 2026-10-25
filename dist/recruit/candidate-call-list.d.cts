import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';

interface CandidateCallListProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** How many calls are linked. Zero shows the empty state instead of `children`. */
    count: number;
    /** A skeleton card in place of the list, and no count yet. */
    loading?: boolean;
    /** The section heading. */
    title?: ReactNode;
    /** The blank slate's wording. Defaults to "No calls yet". */
    empty?: CandidateEmptyCopy;
    /** The calls, usually CandidateCallCards. */
    children?: ReactNode;
}
/**
 * The calls linked to one person, as a counted section: a skeleton card
 * while they load, the host's call cards once they have, or the kit's empty
 * state when there are none. The root is the kit PanelSection, marked
 * `data-slot="candidate-call-list"`.
 */
declare function CandidateCallList({ count, loading, title, empty, children, ...props }: CandidateCallListProps): react.JSX.Element;

export { CandidateCallList, type CandidateCallListProps };
