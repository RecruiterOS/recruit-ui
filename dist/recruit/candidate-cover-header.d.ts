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
    padding?: "compact" | "card-header" | "lg";
    softenCoverUntilHover?: boolean;
}
/** One cover-and-identity hierarchy shared by candidate cards and profiles. */
declare function CandidateCoverHeader({ cover, children, padding, softenCoverUntilHover, className, ...props }: CandidateCoverHeaderProps): react.JSX.Element;

export { CandidateCoverHeader, type CandidateCoverHeaderProps, CandidateCoverImage, type CandidateCoverImageProps };
