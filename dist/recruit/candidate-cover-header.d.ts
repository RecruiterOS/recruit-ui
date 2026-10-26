import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface CandidateCoverImageProps extends HTMLAttributes<HTMLDivElement> {
    /** Caller-owned media. The host owns source resolution and alt text. */
    children?: ReactNode;
    softenUntilHover?: boolean;
}
/** A stable 4:1 media frame that performs no fetching or URL resolution. */
declare function CandidateCoverImage({ children, softenUntilHover, className, ...props }: CandidateCoverImageProps): react.JSX.Element | null;
interface CandidateCoverHeaderProps extends HTMLAttributes<HTMLDivElement> {
    cover?: ReactNode;
    children: ReactNode;
    /**
     * Space around the identity. `none` sits it flush in a container the host
     * pads; with no cover the header then doesn't clip, so a focus ring at its
     * edge stays whole. `dialog` pads it like the kit's dialog header (16px), so
     * as a CandidateProfileDialog's `header` it starts at the body's left edge.
     */
    padding?: CandidateCoverHeaderPadding;
    softenCoverUntilHover?: boolean;
}
/** The space a CandidateCoverHeader leaves around the identity. */
type CandidateCoverHeaderPadding = "compact" | "card-header" | "lg" | "dialog" | "none";
/** One cover-and-identity hierarchy shared by candidate cards and profiles. */
declare function CandidateCoverHeader({ cover, children, padding, softenCoverUntilHover, className, ...props }: CandidateCoverHeaderProps): react.JSX.Element;

export { CandidateCoverHeader, type CandidateCoverHeaderPadding, type CandidateCoverHeaderProps, CandidateCoverImage, type CandidateCoverImageProps };
