"use client";

import { DefinitionItem, DefinitionList } from "@/components/recruit-ui/core/primitives/definition-list";
import { FlexItem } from "@/components/recruit-ui/core/primitives/flex-item";
import { Grid } from "@/components/recruit-ui/core/primitives/grid";
import { Heading } from "@/components/recruit-ui/core/primitives/heading";
import { InteractiveCard } from "@/components/recruit-ui/core/primitives/interactive-card";
import { PanelSection } from "@/components/recruit-ui/core/primitives/panel-section";
import { Spacer } from "@/components/recruit-ui/core/primitives/spacer";
import { Stack } from "@/components/recruit-ui/core/primitives/stack";
import { Text } from "@/components/recruit-ui/core/primitives/text";
import { useId, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";

import { shouldActivateCandidateCard } from "./candidate-card-activation";
import { CandidateCoverHeader } from "./candidate-cover-header";

export interface CandidateReviewFact {
  label: ReactNode;
  value: ReactNode;
}

export interface CandidateReviewCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "title"> {
  name: ReactNode;
  avatar?: ReactNode;
  cover?: ReactNode;
  headline?: ReactNode;
  headerActions?: ReactNode;
  beforeFacts?: ReactNode;
  facts?: readonly CandidateReviewFact[];
  insight?: CandidateReviewFact;
  /** Rendered verbatim so a caller-owned action section is never double padded. */
  actions?: ReactNode;
  selected?: boolean;
  subdued?: boolean;
  onSelect?: () => void;
  selectLabel?: string;
}

/** A slot-driven human-review card with no knowledge of records or decisions. */
export function CandidateReviewCard({
  name,
  avatar,
  cover,
  headline,
  headerActions,
  beforeFacts,
  facts = [],
  insight,
  actions,
  selected = false,
  subdued = false,
  onSelect,
  selectLabel = "Open candidate review",
  "aria-expanded": ariaExpanded,
  className,
  ...props
}: CandidateReviewCardProps) {
  const generatedId = useId();
  const nameId = `${generatedId}-name`;
  const actionId = `${generatedId}-action`;

  return (
    <InteractiveCard
      as="article"
      data-slot="candidate-review-card"
      selected={selected}
      borderWidth="thin"
      clip
      display="block"
      opacity={subdued ? "subdued" : "full"}
      className={className}
      {...props}
    >
      {onSelect ? (
        <button
          type="button"
          data-slot="candidate-review-card-trigger"
          aria-label={selectLabel === "Open candidate review" ? undefined : selectLabel}
          aria-labelledby={selectLabel === "Open candidate review" ? `${actionId} ${nameId}` : undefined}
          aria-current={selected || undefined}
          aria-expanded={ariaExpanded}
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-0 bg-transparent p-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={onSelect}
        >
          {selectLabel === "Open candidate review" ? (
            <span id={actionId} className="sr-only">{selectLabel}</span>
          ) : null}
        </button>
      ) : null}
      <div
        data-slot="candidate-review-card-content"
        className="h-full"
        onClick={
          onSelect
            ? (event: MouseEvent<HTMLDivElement>) => {
                if (shouldActivateCandidateCard(event)) onSelect();
              }
            : undefined
        }
      >
        <Stack gap="none" height="full">
          <FlexItem grow minHeight="zero">
            <CandidateCoverHeader cover={cover} padding="lg">
              <Grid
                columns={null}
                gap="md"
                className="grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
              >
                <Stack direction="horizontal" gap="md" align="start" minWidth="zero">
                  {avatar}
                  <FlexItem grow minWidth="zero">
                    <Heading id={nameId} level={3}>{name}</Heading>
                    {headline != null ? (
                      <Text variant="caption" size="sm" marginTop="xs">
                        {headline}
                      </Text>
                    ) : null}
                  </FlexItem>
                </Stack>
                {headerActions != null ? (
                  <div
                    data-slot="candidate-review-card-header-actions"
                    className="justify-self-start sm:justify-self-auto"
                  >
                    {headerActions}
                  </div>
                ) : null}
              </Grid>
            </CandidateCoverHeader>

            {beforeFacts}

            {facts.length > 0 ? (
              <DefinitionList inset="lg" className="border-y">
                {facts.map((fact, index) => (
                  <DefinitionItem key={index} label={fact.label}>
                    {fact.value}
                  </DefinitionItem>
                ))}
              </DefinitionList>
            ) : null}

            {insight != null ? (
              <>
                <Spacer size="xs" />
                <PanelSection border="bottom" surface="muted" padding="default">
                  <Text variant="eyebrow" marginBottom="sm">
                    {insight.label}
                  </Text>
                  <Text variant="muted" size="sm">
                    {insight.value}
                  </Text>
                </PanelSection>
              </>
            ) : null}
          </FlexItem>
          {actions}
          <Spacer size="md" />
        </Stack>
      </div>
    </InteractiveCard>
  );
}
