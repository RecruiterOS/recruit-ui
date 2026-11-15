import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface CandidateCoverImageProps extends HTMLAttributes<HTMLDivElement> {
    /** Caller-owned media. The host owns source resolution and alt text. */
    children?: ReactNode;
    /** `compact` keeps the 4:1 ratio until the frame reaches 96px high. */
    size?: CandidateCoverImageSize;
    softenUntilHover?: boolean;
}
/** The shared cover's height: its full ratio, or capped for a condensed card. */
type CandidateCoverImageSize = "default" | "compact";
/** A stable 4:1 media frame that performs no fetching or URL resolution. */
declare function CandidateCoverImage({ children, size, softenUntilHover, className, ...props }: CandidateCoverImageProps): react.JSX.Element | null;
/**
 * What deals a stock cover its design, the same one every time: something
 * that stays put for the person, an id before a name. `null` deals the first
 * design, which is right for someone who mustn't be told from anyone else.
 */
type CandidateCoverSeed = string | number | null;
/** What stands in for a cover the host left out. */
type CandidateCoverFallback = "stock" | "none";
/**
 * The seed a card or a profile deals its stock cover by: the host's
 * `coverSeed`, or without one the person's name where it is plain text. A
 * name that is an element is read as no seed, never guessed at.
 */
declare function candidateCoverSeed(seed: CandidateCoverSeed | undefined, name: ReactNode): CandidateCoverSeed;
interface CandidateCoverHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Host-owned media for the 4:1 frame. `null` draws no cover, whatever
     * `coverFallback` says.
     */
    cover?: ReactNode;
    /**
     * What stands in when `cover` is left out. `stock` draws the kit's
     * `CoverBanner` in the frame: a banner in the theme's own colours, so
     * someone with no cover is the same height as their neighbours. `none`,
     * the default here, draws no frame; the cards and profiles that always
     * show a cover pass `stock`. A stock cover isn't printed: it sits in a
     * `data-slot="candidate-cover-stock"` wrapper that paper leaves out.
     */
    coverFallback?: CandidateCoverFallback;
    /** Deals the stock cover its design. Left out, everyone gets the first. */
    coverSeed?: CandidateCoverSeed;
    /** The cover's size; the default keeps its full 4:1 ratio. */
    coverSize?: CandidateCoverImageSize;
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
declare function CandidateCoverHeader({ cover, coverFallback, coverSeed, coverSize, children, padding, softenCoverUntilHover, className, ...props }: CandidateCoverHeaderProps): react.JSX.Element;

export { type CandidateCoverFallback, CandidateCoverHeader, type CandidateCoverHeaderPadding, type CandidateCoverHeaderProps, CandidateCoverImage, type CandidateCoverImageProps, type CandidateCoverImageSize, type CandidateCoverSeed, candidateCoverSeed };
