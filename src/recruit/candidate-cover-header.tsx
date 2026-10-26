import { cn } from "@epicbagel/saas-kit/lib/utils";
import { AspectRatio } from "@epicbagel/saas-kit/primitives/aspect-ratio";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import type { HTMLAttributes, ReactNode } from "react";

export interface CandidateCoverImageProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Caller-owned media. The host owns source resolution and alt text. */
  children?: ReactNode;
  softenUntilHover?: boolean;
}

/** A stable 4:1 media frame that performs no fetching or URL resolution. */
export function CandidateCoverImage({
  children,
  softenUntilHover = false,
  className,
  ...props
}: CandidateCoverImageProps) {
  if (children == null) return null;

  return (
    <AspectRatio
      ratio={4}
      data-slot="candidate-cover-image"
      className={cn(
        "w-full overflow-hidden bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
        softenUntilHover &&
          "[&_img]:opacity-75 [&_img]:grayscale-[0.2] group-hover:[&_img]:opacity-100 group-hover:[&_img]:grayscale-0",
        className,
      )}
      {...props}
    >
      {children}
    </AspectRatio>
  );
}

export interface CandidateCoverHeaderProps
  extends HTMLAttributes<HTMLDivElement> {
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
export type CandidateCoverHeaderPadding = "compact" | "card-header" | "lg" | "dialog" | "none";

/**
 * `dialog`: the kit's ResponsiveDialogHeader padding. Its inline padding is
 * the ResponsiveDialogBody's (px-4), which is what lines the two up.
 */
const DIALOG_PADDING = "p-4";

/** One cover-and-identity hierarchy shared by candidate cards and profiles. */
export function CandidateCoverHeader({
  cover,
  children,
  padding = "card-header",
  softenCoverUntilHover = false,
  className,
  ...props
}: CandidateCoverHeaderProps) {
  // The clip keeps a cover inside the rounded frame; a flush header with no
  // cover has nothing to clip, and clipping would cut its focus rings.
  const clip = cover != null || padding !== "none";

  return (
    <div
      data-slot="candidate-cover-header"
      className={cn(clip && "overflow-hidden", className)}
      {...props}
    >
      <CandidateCoverImage softenUntilHover={softenCoverUntilHover}>
        {cover}
      </CandidateCoverImage>
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
