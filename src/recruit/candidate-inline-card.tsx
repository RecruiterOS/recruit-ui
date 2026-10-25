"use client";

import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useId, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";

import { shouldActivateCandidateCard } from "./candidate-card-activation";

export interface CandidateInlineCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "title"> {
  name: ReactNode;
  avatar?: ReactNode;
  headline?: ReactNode;
  meta?: ReactNode;
  assessment?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  selected?: boolean;
  subdued?: boolean;
  onSelect?: () => void;
  selectLabel?: string;
}

/** A compact candidate trigger suitable for lists, messages, and previews. */
export function CandidateInlineCard({
  name,
  avatar,
  headline,
  meta,
  assessment,
  status,
  actions,
  selected = false,
  subdued = false,
  onSelect,
  selectLabel = "Open candidate profile",
  "aria-expanded": ariaExpanded,
  className,
  ...props
}: CandidateInlineCardProps) {
  const generatedId = useId();
  const nameId = `${generatedId}-name`;
  const actionId = `${generatedId}-action`;

  return (
    <InteractiveCard
      as="article"
      data-slot="candidate-inline-card"
      selected={selected}
      borderWidth="thin"
      padding="none"
      opacity={subdued ? "subdued" : "full"}
      className={className}
      {...props}
    >
      {onSelect ? (
        <button
          type="button"
          data-slot="candidate-inline-card-trigger"
          aria-label={selectLabel === "Open candidate profile" ? undefined : selectLabel}
          aria-labelledby={selectLabel === "Open candidate profile" ? `${actionId} ${nameId}` : undefined}
          aria-current={selected || undefined}
          aria-expanded={ariaExpanded}
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-0 bg-transparent p-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={onSelect}
        >
          {selectLabel === "Open candidate profile" ? (
            <span id={actionId} className="sr-only">{selectLabel}</span>
          ) : null}
        </button>
      ) : null}
      <div
        data-slot="candidate-inline-card-content"
        className="px-5 py-4"
        onClick={
          onSelect
            ? (event: MouseEvent<HTMLDivElement>) => {
                if (shouldActivateCandidateCard(event)) onSelect();
              }
            : undefined
        }
      >
        <Stack direction="horizontal" gap="compact" align="start">
          {avatar}
          <FlexItem grow minWidth="zero">
            <Stack direction="horizontal" gap="sm" align="center" wrap>
              <Heading id={nameId} level={5} truncate>{name}</Heading>
              {status}
            </Stack>
            {headline != null ? (
              <Text variant="caption" size="sm" truncate marginTop="tight">
                {headline}
              </Text>
            ) : null}
            {meta != null ? (
              <Text variant="caption" size="xs" marginTop="xs">
                {meta}
              </Text>
            ) : null}
            {assessment != null ? (
              <Stack gap="none" marginTop="md">{assessment}</Stack>
            ) : null}
          </FlexItem>
          {actions}
        </Stack>
      </div>
    </InteractiveCard>
  );
}
