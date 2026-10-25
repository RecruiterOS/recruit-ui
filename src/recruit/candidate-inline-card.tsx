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
  /**
   * `comfortable` (the default) gives the card room for an assessment;
   * `compact` is a single dense row (smaller padding, the name and lines
   * centred on the avatar, every line truncated) for fixed-height list rows
   * and board columns: give the card a height and its content centres in it.
   */
  density?: CandidateInlineCardDensity;
}

/** How much room a CandidateInlineCard takes. */
export type CandidateInlineCardDensity = "comfortable" | "compact";

/**
 * A compact candidate trigger suitable for lists, messages, and previews.
 *
 * The root is the kit InteractiveCard as an `article`, marked
 * `data-slot="candidate-inline-card"` and `data-density`.
 */
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
  density = "comfortable",
  "aria-expanded": ariaExpanded,
  className,
  ...props
}: CandidateInlineCardProps) {
  const generatedId = useId();
  const nameId = `${generatedId}-name`;
  const actionId = `${generatedId}-action`;
  const compact = density === "compact";

  return (
    <InteractiveCard
      as="article"
      data-slot="candidate-inline-card"
      data-density={density}
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
        // Compact fills a fixed-height row and centres on it, as a virtualised list needs.
        className={compact ? "h-full px-3 py-2" : "px-5 py-4"}
        onClick={
          onSelect
            ? (event: MouseEvent<HTMLDivElement>) => {
                if (shouldActivateCandidateCard(event)) onSelect();
              }
            : undefined
        }
      >
        <Stack
          direction="horizontal"
          gap={compact ? "sm" : "compact"}
          align={compact ? "center" : "start"}
          height={compact ? "full" : "auto"}
        >
          {avatar}
          <FlexItem grow minWidth="zero">
            <Stack direction="horizontal" gap="sm" align="center" wrap={!compact}>
              <Heading id={nameId} level={5} appearance={compact ? "compact" : "default"} truncate>{name}</Heading>
              {status}
            </Stack>
            {headline != null ? (
              // A compact row is a fixed height: the caption's relaxed leading would push the lines apart.
              <Text
                variant="caption"
                size={compact ? "xs" : "sm"}
                leading={compact ? "snug" : "normal"}
                truncate
                marginTop={compact ? "none" : "tight"}
              >
                {headline}
              </Text>
            ) : null}
            {meta != null ? (
              <Text
                variant="caption"
                size="xs"
                leading={compact ? "snug" : "normal"}
                truncate={compact}
                marginTop={compact ? "none" : "xs"}
              >
                {meta}
              </Text>
            ) : null}
            {assessment != null ? (
              <Stack gap="none" marginTop={compact ? "sm" : "md"}>{assessment}</Stack>
            ) : null}
          </FlexItem>
          {actions}
        </Stack>
      </div>
    </InteractiveCard>
  );
}
