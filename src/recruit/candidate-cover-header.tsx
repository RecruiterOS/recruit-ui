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
  padding?: "compact" | "card-header" | "lg";
  softenCoverUntilHover?: boolean;
}

/** One cover-and-identity hierarchy shared by candidate cards and profiles. */
export function CandidateCoverHeader({
  cover,
  children,
  padding = "card-header",
  softenCoverUntilHover = false,
  className,
  ...props
}: CandidateCoverHeaderProps) {
  return (
    <div
      data-slot="candidate-cover-header"
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <CandidateCoverImage softenUntilHover={softenCoverUntilHover}>
        {cover}
      </CandidateCoverImage>
      <PanelSection
        as="div"
        padding={padding === "compact" ? "compact" : "default"}
        className={cn(padding === "card-header" && "pb-3 pt-5")}
      >
        {children}
      </PanelSection>
    </div>
  );
}
