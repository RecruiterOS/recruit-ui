"use client";

import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";

import { shouldActivateCandidateCard } from "./candidate-card-activation";
import { CandidateCoverHeader, candidateCoverSeed, type CandidateCoverSeed } from "./candidate-cover-header";

export interface CandidatePipelineCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "onSelect" | "title" | "children"> {
  /** The candidate's name, on one truncated line. */
  name: ReactNode;
  /** The line under the name, usually the current title. */
  headline?: ReactNode;
  /** The current-company line, rendered as given (it brings its own text). */
  company?: ReactNode;
  /**
   * The person's own cover, as media the host owns. Left out, the kit's
   * stock banner (`CoverBanner`) is drawn in its place, in the theme's
   * colours, so everyone's card is the same height; `null` draws no cover.
   */
  cover?: ReactNode | null;
  /**
   * Deals the stock banner its design, the same one every time: the
   * person's id, say. Left out, the name is the seed where it is plain text.
   */
  coverSeed?: CandidateCoverSeed;
  /** Small badges in a row under the identity, such as a grade or a decision. */
  badges?: ReactNode;
  /** Controls at the top right, such as a preview link. */
  actions?: ReactNode;
  /** Called when the card is activated, but not from a nested control. */
  onSelect: () => void;
}

function shown(node: ReactNode): boolean {
  return node != null && node !== false && node !== "";
}

/**
 * A dense candidate card for a pipeline board column.
 *
 * The whole card is one button that selects the candidate; a click on a
 * nested link or button in a slot never also selects it. The card renders no
 * wrapper around itself, so a board can make it draggable directly. The root
 * is the kit InteractiveCard, marked `data-slot="candidate-pipeline-card"`.
 */
export function CandidatePipelineCard({
  name,
  headline,
  company,
  cover,
  coverSeed,
  badges,
  actions,
  onSelect,
  ...props
}: CandidatePipelineCardProps) {
  return (
    <InteractiveCard
      radius="lg"
      textSize="sm"
      onClick={(event: MouseEvent<HTMLElement>) => {
        if (shouldActivateCandidateCard(event)) onSelect();
      }}
      clip
      data-slot="candidate-pipeline-card"
      {...props}
    >
      <CandidateCoverHeader
        cover={cover}
        coverFallback="stock"
        coverSeed={candidateCoverSeed(coverSeed, name)}
        padding="compact"
      >
        <Stack direction="horizontal" gap="xs" align="start">
          <FlexItem grow minWidth="zero">
            <Stack gap="none">
              <Text weight="medium" truncate>{name}</Text>
              {shown(headline) ? (
                <Text size="xs" tone="muted" truncate marginTop="tight">
                  {headline}
                </Text>
              ) : null}
              {company}
              {shown(badges) ? (
                <Stack direction="horizontal" gap="xs" align="center" marginTop="sm">
                  {badges}
                </Stack>
              ) : null}
            </Stack>
          </FlexItem>
          {actions}
        </Stack>
      </CandidateCoverHeader>
    </InteractiveCard>
  );
}
