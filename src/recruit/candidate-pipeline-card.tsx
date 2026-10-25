"use client";

import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";

import { shouldActivateCandidateCard } from "./candidate-card-activation";
import { CandidateCoverHeader } from "./candidate-cover-header";

export interface CandidatePipelineCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "onSelect" | "title" | "children"> {
  /** The candidate's name, on one truncated line. */
  name: ReactNode;
  /** The line under the name, usually the current title. */
  headline?: ReactNode;
  /** The current-company line, rendered as given (it brings its own text). */
  company?: ReactNode;
  /** Media for the 4:1 cover frame. Omit it and no frame is drawn. */
  cover?: ReactNode;
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
      <CandidateCoverHeader cover={cover} padding="compact">
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
