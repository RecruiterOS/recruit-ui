"use client";

import { ScrollArea } from "@epicbagel/saas-kit/primitives/scroll-area";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import type { HTMLAttributes, ReactNode } from "react";

import {
  CandidateCareerHistoryTimeline,
  type CandidateCareerHistoryTimelineProps,
} from "./candidate-career-history-timeline";
import type { CandidateEmptyCopy } from "./candidate-empty-copy";

export interface CandidateCareerHistoryPanelProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  /** The section heading, "Career history" by default. The count of roles follows it once loaded. */
  title?: ReactNode;
  items: CandidateCareerHistoryTimelineProps["items"];
  /** Skeleton rows while there are no items yet. */
  loading?: boolean;
  /** The blank slate's wording. Defaults to "No career history yet". */
  empty?: CandidateEmptyCopy;
  /** Passed to the timeline: how many employer groups keep their descriptions. */
  detailedCompanyGroups?: number;
  locale?: string;
}

/**
 * A counted career history that scrolls within the viewport, for a popover
 * or a narrow side panel: a section header over a CandidateCareerHistoryTimeline
 * in a scroll area capped at the viewport's height. The root is marked
 * `data-slot="candidate-career-history-panel"`, and the scroll area
 * `data-slot="career-history-scroll"`.
 */
export function CandidateCareerHistoryPanel({
  title = "Career history",
  items,
  loading = false,
  empty,
  detailedCompanyGroups,
  locale,
  ...props
}: CandidateCareerHistoryPanelProps) {
  return (
    <Stack direction="vertical" gap="md" data-slot="candidate-career-history-panel" {...props}>
      <SectionHeader label={title} count={loading ? undefined : items.length} />
      <ScrollArea data-slot="career-history-scroll" maxHeight="viewport" paddingEnd="sm">
        <CandidateCareerHistoryTimeline
          items={items}
          loading={loading}
          empty={empty}
          detailedCompanyGroups={detailedCompanyGroups}
          locale={locale}
        />
      </ScrollArea>
    </Stack>
  );
}
