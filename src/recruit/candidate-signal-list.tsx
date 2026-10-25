"use client";

import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Card } from "@epicbagel/saas-kit/primitives/card";
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Radar } from "lucide-react";
import type { HTMLAttributes, Key, ReactNode } from "react";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";

/** One labelled line under a signal, such as why it matters. */
export interface CandidateSignalDetail {
  label: ReactNode;
  value: ReactNode;
}

/** A change worth acting on, already worded by the host. */
export interface CandidateSignalItem {
  id: Key;
  /** What kind of change it is, shown as a small uppercase badge. */
  kind: ReactNode;
  /** A second, outlined badge when the signal is not open, such as "snoozed". */
  status?: ReactNode;
  /** When it was detected, already formatted. */
  detectedAt: ReactNode;
  /** What changed, in one line. */
  summary: ReactNode;
  /** Labelled lines under the summary. Empty ones are the host's to leave out. */
  details?: readonly CandidateSignalDetail[];
  /** Controls at the top right, such as a CandidateSignalMenu. */
  actions?: ReactNode;
}

export interface CandidateSignalListProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  /** The section heading. The count follows it once loaded. */
  title: ReactNode;
  items: readonly CandidateSignalItem[];
  /** Skeleton cards in place of the list. */
  loading?: boolean;
  /** Shown in place of the list when it could not be loaded. */
  error?: ReactNode;
  /** The blank slate's wording. Defaults to "No signals yet". */
  empty?: CandidateEmptyCopy;
}

/**
 * The signals about one person, newest first, as a counted section of muted
 * cards: a kind badge, when it was detected, what changed, and the host's
 * labelled detail lines. Loading shows skeleton cards; no signals renders
 * the kit's empty state. The root is the kit PanelSection, marked
 * `data-slot="candidate-signal-list"`.
 */
export function CandidateSignalList({
  title,
  items,
  loading = false,
  error,
  empty = { title: "No signals yet" },
  ...props
}: CandidateSignalListProps) {
  const hasError = error != null && error !== false && error !== "";

  return (
    <PanelSection data-slot="candidate-signal-list" {...props}>
      <SectionHeader label={title} count={loading ? undefined : items.length} />
      {loading ? (
        <Stack gap="sm" marginTop="md">
          <Skeleton preset="card-sm" radius="xl" />
          <Skeleton preset="card-sm" radius="xl" />
        </Stack>
      ) : hasError ? (
        <Text size="sm" tone="destructive" marginTop="md">{error}</Text>
      ) : items.length === 0 ? (
        <EmptyState
          variant="empty"
          size="inline"
          icon={Radar}
          title={empty.title}
          description={empty.description}
        />
      ) : (
        <Stack gap="md" marginTop="md">
          {items.map((item) => (
            <Card key={item.id} padding="row" surface="muted">
              <Stack gap="md">
                <Stack direction="horizontal" gap="sm" align="start" justify="between">
                  <Stack gap="xs">
                    <Stack direction="horizontal" gap="xs" align="center">
                      <Badge size="micro" transform="uppercase" font="sans" weight="semibold">
                        {item.kind}
                      </Badge>
                      {item.status != null && item.status !== false && (
                        <Badge size="micro" variant="outline" transform="uppercase" font="sans">
                          {item.status}
                        </Badge>
                      )}
                    </Stack>
                    {item.detectedAt}
                  </Stack>
                  {item.actions}
                </Stack>
                <Text size="sm" weight="medium">{item.summary}</Text>
                {item.details && item.details.length > 0 && (
                  <DefinitionList variant="divided">
                    {item.details.map((detail, index) => (
                      <DefinitionItem key={index} label={detail.label}>
                        <Text size="sm">{detail.value}</Text>
                      </DefinitionItem>
                    ))}
                  </DefinitionList>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </PanelSection>
  );
}
