import { cn } from "@epicbagel/saas-kit/lib/utils";
import { AspectRatio } from "@epicbagel/saas-kit/primitives/aspect-ratio";
import { CoverBanner } from "@epicbagel/saas-kit/primitives/cover-banner";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import type { HTMLAttributes, ReactNode } from "react";

export interface CandidateCoverImageProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Caller-owned media. The host owns source resolution and alt text. */
  children?: ReactNode;
  /** `compact` keeps the 4:1 ratio until the frame reaches 96px high. */
  size?: CandidateCoverImageSize;
  softenUntilHover?: boolean;
}

/** The shared cover's height: its full ratio, or capped for a condensed card. */
export type CandidateCoverImageSize = "default" | "compact";

/** A stable 4:1 media frame that performs no fetching or URL resolution. */
export function CandidateCoverImage({
  children,
  size = "default",
  softenUntilHover = false,
  className,
  ...props
}: CandidateCoverImageProps) {
  if (children == null) return null;

  const frameProps = {
    "data-slot": "candidate-cover-image",
    className: cn(
      "w-full overflow-hidden bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:object-center",
      size === "compact" && "relative aspect-[4/1] max-h-[96px]",
      softenUntilHover &&
        "[&_img]:opacity-75 [&_img]:grayscale-[0.2] group-hover:[&_img]:opacity-100 group-hover:[&_img]:grayscale-0",
      className,
    ),
    ...props,
  };
  // Radix reserves its height on an outer padding wrapper. Native aspect-ratio
  // lets max-height cap the actual layout space, rather than just its image.
  return size === "compact" ? (
    <div {...frameProps}>{children}</div>
  ) : (
    <AspectRatio ratio={4} {...frameProps}>{children}</AspectRatio>
  );
}

/**
 * What deals a stock cover its design, the same one every time: something
 * that stays put for the person, an id before a name. `null` deals the first
 * design, which is right for someone who mustn't be told from anyone else.
 */
export type CandidateCoverSeed = string | number | null;

/** What stands in for a cover the host left out. */
export type CandidateCoverFallback = "stock" | "none";

/**
 * The seed a card or a profile deals its stock cover by: the host's
 * `coverSeed`, or without one the person's name where it is plain text. A
 * name that is an element is read as no seed, never guessed at.
 */
export function candidateCoverSeed(
  seed: CandidateCoverSeed | undefined,
  name: ReactNode,
): CandidateCoverSeed {
  if (seed !== undefined) return seed;
  return typeof name === "string" || typeof name === "number" ? name : null;
}

export interface CandidateCoverHeaderProps
  extends HTMLAttributes<HTMLDivElement> {
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
export type CandidateCoverHeaderPadding = "compact" | "card-header" | "lg" | "dialog" | "none";

/**
 * `dialog`: the kit's ResponsiveDialogHeader padding. Its inline padding is
 * the ResponsiveDialogBody's (px-4), which is what lines the two up.
 */
const DIALOG_PADDING = "p-4";

/** One cover-and-identity hierarchy shared by candidate cards and profiles. */
export function CandidateCoverHeader({
  cover,
  coverFallback = "none",
  coverSeed,
  coverSize = "default",
  children,
  padding = "card-header",
  softenCoverUntilHover = false,
  className,
  ...props
}: CandidateCoverHeaderProps) {
  // The clip keeps a cover inside the rounded frame; a flush header with no
  // cover has nothing to clip, and clipping would cut its focus rings.
  const stock = cover === undefined && coverFallback === "stock";
  const media = stock ? <CoverBanner seed={coverSeed} /> : cover;
  const clip = media != null || padding !== "none";
  const frame = (
    <CandidateCoverImage size={coverSize} softenUntilHover={softenCoverUntilHover}>
      {media}
    </CandidateCoverImage>
  );

  return (
    <div
      data-slot="candidate-cover-header"
      className={cn(clip && "overflow-hidden", className)}
      {...props}
    >
      {/* A stock cover is decoration drawn as a background, which a browser
          leaves out of print, so it would print as an empty band. It is
          hidden from outside the frame: at its full size the frame sits in a
          ratio wrapper that holds the height, and hiding the frame alone
          would leave that standing. */}
      {stock ? (
        <div data-slot="candidate-cover-stock" className="print:hidden">
          {frame}
        </div>
      ) : (
        frame
      )}
      <PanelSection
        as="div"
        padding={padding === "none" || padding === "dialog" ? "none" : padding === "compact" ? "compact" : "default"}
        className={cn(padding === "card-header" && "pb-3 pt-5", padding === "dialog" && DIALOG_PADDING)}
      >
        {children}
      </PanelSection>
    </div>
  );
}
