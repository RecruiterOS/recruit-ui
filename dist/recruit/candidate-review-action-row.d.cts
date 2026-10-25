import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface CandidateReviewActionRowProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    /** The row's controls, in order. */
    children: ReactNode;
    /**
     * Stops every click inside the row, including one on the gap between two
     * controls, from reaching a surrounding clickable card. Controls that stop
     * their own clicks don't need it.
     */
    isolateClicks?: boolean;
    /**
     * `inline` (default): the controls on one line under a keyline, wrapping
     * when the line runs out of room. `split`: a pair of controls with no
     * keyline, for a two-way call such as remove or include. They share a
     * narrow row in equal halves and sit right-aligned at their natural width
     * from the `sm` breakpoint up; give each `width="responsive"`.
     */
    layout?: "inline" | "split";
    /** Space between inline controls. `xs` packs a row of quiet buttons. */
    gap?: "xs" | "sm";
}
/**
 * The action row at the foot of a review card: a keyline, then the controls
 * on one line that wraps when it runs out of room, or a pair of controls
 * with `layout="split"`.
 *
 * Pass it as `CandidateReviewCard`'s `actions`, which renders it verbatim, so
 * the row is never padded twice. The root is marked
 * `data-slot="candidate-review-action-row"`.
 */
declare function CandidateReviewActionRow({ children, isolateClicks, layout, gap, ...props }: CandidateReviewActionRowProps): react.JSX.Element;

export { CandidateReviewActionRow, type CandidateReviewActionRowProps };
