"use client";

import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { ResourceCard, ResourceCardFooter } from "@epicbagel/saas-kit/primitives/resource-card";
import { Spacer } from "@epicbagel/saas-kit/primitives/spacer";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { HTMLAttributes, ReactNode } from "react";

/** One labelled fact on a job card, such as a location or a count. */
export interface JobSummaryFact {
  /** Stable key for the row. */
  id: string;
  label: ReactNode;
  value: ReactNode;
}

export interface JobSummaryCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  /** The job title, rendered as the card's level-3 heading. */
  title: ReactNode;
  /** A muted line under the title. */
  subtitle?: ReactNode;
  /** Media before the title, such as the client's logo. */
  logo?: ReactNode;
  /** A badge at the end of the header, such as `JobClientBadge` or a status. */
  badge?: ReactNode;
  /** The rows of the fact list, in order. */
  facts: readonly JobSummaryFact[];
  /** Called when the header or facts are activated. */
  onSelect?: () => void;
  /** Actions in a footer row outside the clickable area. */
  footer?: ReactNode;
  footerAlign?: "start" | "end" | "between";
}

function shown(node: ReactNode): boolean {
  return node != null && node !== false && node !== "";
}

/**
 * A job at a glance: identity, a divided fact list, and optional actions.
 *
 * The header and facts are one button that opens the job. The footer sits
 * outside it, so its actions never also open the job. Every value enters
 * through a slot: the host decides which facts to show and how to word them.
 * The root is the kit ResourceCard, marked `data-slot="job-summary-card"`.
 */
export function JobSummaryCard({
  title,
  subtitle,
  logo,
  badge,
  facts,
  onSelect,
  footer,
  footerAlign = "start",
  ...props
}: JobSummaryCardProps) {
  const hasFooter = shown(footer);

  return (
    <ResourceCard data-slot="job-summary-card" {...props}>
      <InteractiveCard
        type="button"
        display="block"
        border="none"
        joined={hasFooter ? "top" : "none"}
        onClick={onSelect}
      >
        <PanelSection padding="none" paddingX="md" paddingTop="lg" paddingBottom="lg">
          <Stack direction="horizontal" gap="sm" justify="between" align="center" wrap>
            <FlexItem grow minWidth="zero" basis="sm">
              <Stack direction="horizontal" gap="sm" align="center" minWidth="zero">
                {logo}
                <FlexItem grow minWidth="zero">
                  <Heading level={3} as="h3">{title}</Heading>
                  {shown(subtitle) ? (
                    <Text size="sm" tone="muted" marginTop="xs">{subtitle}</Text>
                  ) : null}
                </FlexItem>
              </Stack>
            </FlexItem>
            {shown(badge) ? <Stack as="span" minWidth="zero">{badge}</Stack> : null}
          </Stack>
        </PanelSection>
        <DefinitionList variant="divided" inset="lg">
          {facts.map((fact) => (
            <DefinitionItem key={fact.id} label={fact.label}>{fact.value}</DefinitionItem>
          ))}
        </DefinitionList>
        {hasFooter ? null : <Spacer size="lg" />}
      </InteractiveCard>
      {hasFooter ? (
        <ResourceCardFooter align={footerAlign} wrap>{footer}</ResourceCardFooter>
      ) : null}
    </ResourceCard>
  );
}
