"use client";

import { Grid } from "@epicbagel/saas-kit/primitives/grid";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";

export interface CandidateReviewActionRowProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
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
 * the row is never padded twice. Under a card's facts or insight, which end
 * on a rule of their own, the card hides the keyline, so there is one rule
 * between the content and the controls. The root is marked
 * `data-slot="candidate-review-action-row"`, and the inline controls
 * `data-slot="candidate-review-action-row-controls"`.
 */
export function CandidateReviewActionRow({
  children,
  isolateClicks = false,
  layout = "inline",
  gap = "sm",
  ...props
}: CandidateReviewActionRowProps) {
  const onClick = isolateClicks
    ? (event: MouseEvent<HTMLElement>) => event.stopPropagation()
    : undefined;

  return (
    <PanelSection
      data-slot="candidate-review-action-row"
      padding="none"
      paddingX="lg"
      paddingTop="md"
      paddingBottom="xs"
      {...props}
    >
      {layout === "split" ? (
        <Grid
          columns={2}
          responsive={false}
          gap="compact"
          layout="responsive-actions"
          onClick={onClick}
        >
          {children}
        </Grid>
      ) : (
        <Stack
          data-slot="candidate-review-action-row-controls"
          direction="horizontal"
          gap={gap}
          align="center"
          wrap
          border="top"
          paddingTop="md"
          onClick={onClick}
        >
          {children}
        </Stack>
      )}
    </PanelSection>
  );
}
