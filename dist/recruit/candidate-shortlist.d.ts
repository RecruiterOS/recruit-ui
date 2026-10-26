import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.js';

interface CandidateShortlistProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** The shortlist's name. It is the section's heading (an h2) and names the section. */
    title: ReactNode;
    /** A short label above the title, such as which delivery this is. */
    eyebrow?: ReactNode;
    /** A muted line under the title: why these people, or what to do with them. */
    description?: ReactNode;
    /** Beside the heading, at its end, such as a status badge. */
    status?: ReactNode;
    /**
     * How many people the shortlist holds. Zero shows the empty state in place
     * of `children` and `footer`. Left out, the shortlist is empty when
     * `children` holds nothing to render. It isn't displayed: put a count in
     * `title` to show one.
     */
    count?: number;
    /** The people, usually the host's candidate cards. */
    children?: ReactNode;
    /**
     * Under the people, such as where the shortlist is delivered
     * (`CandidateDestinationStatus`). Not shown while the shortlist is empty.
     */
    footer?: ReactNode;
    /** The blank slate's wording. Defaults to "No candidates shortlisted yet". */
    empty?: CandidateEmptyCopy;
}
/**
 * A shortlist of people as one section: an optional eyebrow, the title and an
 * optional description, with an optional status at the heading's end; then
 * the host's candidate cards, one under another, and an optional footer; or
 * the kit's empty state when it holds nobody. The section has no surface of
 * its own, so it sits flush in a message, pane or card the host provides. The
 * root is a `section` named by its title and marked
 * `data-slot="candidate-shortlist"`.
 */
declare function CandidateShortlist({ title, eyebrow, description, status, count, children, footer, empty, ...props }: CandidateShortlistProps): react.JSX.Element;

export { CandidateShortlist, type CandidateShortlistProps };
