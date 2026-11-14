"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Separator } from "@epicbagel/saas-kit/primitives/separator";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useState, type ReactNode } from "react";

import {
  formatCalendarDate,
  type CalendarDateValue,
} from "../core/calendar-date";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";

export interface CareerHistoryItem {
  title: ReactNode;
  company?: ReactNode;
  /** Host-formatted date text takes precedence over raw dates. */
  dateRange?: ReactNode;
  startDate?: CalendarDateValue;
  endDate?: CalendarDateValue;
  current?: boolean;
  description?: ReactNode;
  /** Stable host grouping key when `company` is not a string. */
  companyGroup?: string;
}

export interface CareerDateRangeProps {
  start?: CalendarDateValue;
  end?: CalendarDateValue;
  current?: boolean;
  presentLabel?: ReactNode;
  locale?: string;
}

/** Absolute calendar dates for a career history; never relative to today. */
export function CareerDateRange({
  start,
  end,
  current = false,
  presentLabel = "Present",
  locale = "en",
}: CareerDateRangeProps) {
  const startLabel = formatCalendarDate(start, locale);
  const endLabel = current ? presentLabel : formatCalendarDate(end, locale);
  if (!startLabel && !endLabel) return null;

  return (
    <>
      {startLabel}
      {startLabel && endLabel ? <span aria-hidden> – </span> : null}
      {endLabel}
    </>
  );
}

interface CareerCompanyGroup {
  key: string | null;
  items: CareerHistoryItem[];
}

function companyGroupKey(item: CareerHistoryItem): string | null {
  if (item.companyGroup?.trim()) return item.companyGroup.trim().toLocaleLowerCase();
  return typeof item.company === "string"
    ? item.company.trim().toLocaleLowerCase() || null
    : null;
}

function groupConsecutiveEmployments(
  items: readonly CareerHistoryItem[],
): CareerCompanyGroup[] {
  return items.reduce<CareerCompanyGroup[]>((groups, item) => {
    const key = companyGroupKey(item);
    const previous = groups.at(-1);

    if (key && previous?.key === key) {
      previous.items.push(item);
    } else {
      groups.push({ key, items: [item] });
    }
    return groups;
  }, []);
}

function descriptionParts(description: string): string[] {
  const parts = description
    .split(/\r?\n|\s+[•●]\s+/)
    .map((part) => part.replace(/^[-–—•●]\s*/, "").trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [description.trim()];
}

function CareerDescription({ description }: { description: ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  // The muted tone, as a bulleted description below has: the fainter
  // `subtle` falls under the contrast body text needs.
  if (typeof description !== "string") {
    return (
      <Text as="div" variant="caption" size="xs" tone="muted">
        {description}
      </Text>
    );
  }

  const trimmed = description.trim();
  if (!trimmed) return null;
  const parts = descriptionParts(trimmed);
  const hasMore = parts.length > 3 || (parts.length === 1 && trimmed.length > 180);
  const visibleParts = expanded ? parts : parts.slice(0, 3);

  return (
    <Stack gap="xs">
      {parts.length > 1 ? (
        <List
          marker="disc"
          spacing="tight"
          textSize="xs"
          tone="muted"
          className="leading-relaxed"
        >
          {visibleParts.map((part, index) => (
            <ListItem key={index}>{part}</ListItem>
          ))}
        </List>
      ) : (
        <Text
          variant="caption"
          size="xs"
          tone="muted"
          lineClamp={!expanded && hasMore ? 3 : undefined}
        >
          {trimmed}
        </Text>
      )}
      {hasMore ? (
        <Button
          type="button"
          variant="link-muted"
          size="bare"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      ) : null}
    </Stack>
  );
}

function CareerRole({
  item,
  detailed,
  locale,
  presentLabel,
  titleLevel,
}: {
  item: CareerHistoryItem;
  detailed: boolean;
  locale: string;
  presentLabel: ReactNode;
  titleLevel: CareerHistoryTitleLevel;
}) {
  const date = item.dateRange ?? (
    <CareerDateRange
      start={item.startDate}
      end={item.endDate}
      current={item.current}
      locale={locale}
      presentLabel={presentLabel}
    />
  );
  const hasDate = item.dateRange != null || item.startDate != null || item.endDate != null || item.current;

  return (
    <Stack gap="xs" minWidth="zero">
      {/* The level-5 look at every level: only the tag changes. */}
      <Heading level={5} as={`h${titleLevel}` as const}>
        {item.title}
      </Heading>
      {item.company != null || hasDate ? (
        <Text variant="caption" size="xs">
          {item.company}
          {item.company != null && hasDate ? <span aria-hidden> · </span> : null}
          {hasDate ? date : null}
        </Text>
      ) : null}
      {detailed && item.description != null ? (
        <CareerDescription description={item.description} />
      ) : null}
    </Stack>
  );
}

/** The heading level of a role's title in a career history. */
export type CareerHistoryTitleLevel = 3 | 4 | 5 | 6;

export interface CandidateCareerHistoryTimelineProps {
  items: readonly CareerHistoryItem[];
  loading?: boolean;
  /** The blank slate's wording. Defaults to "No career history yet". */
  empty?: CandidateEmptyCopy;
  /** @deprecated Use `empty.title`. */
  emptyTitle?: string;
  /** @deprecated Use `empty.description`. */
  emptyDescription?: string;
  earlierLabel?: ReactNode;
  presentLabel?: ReactNode;
  detailedCompanyGroups?: number;
  locale?: string;
  /**
   * The heading level of each role's title: 5 (the default), or 3, 4 or 6
   * to sit one under whatever heads the history, so a page's outline skips
   * no level. Only the tag changes: a title looks the same at every level.
   * When it is given, the "Earlier" label is said at the same level.
   */
  titleLevel?: CareerHistoryTitleLevel;
  className?: string;
}

export function CandidateCareerHistoryTimeline({
  items,
  loading = false,
  empty,
  emptyTitle,
  emptyDescription,
  earlierLabel = "Earlier",
  presentLabel = "Present",
  detailedCompanyGroups = 2,
  locale = "en",
  titleLevel: askedLevel,
  className,
}: CandidateCareerHistoryTimelineProps) {
  const titleLevel = askedLevel ?? 5;
  if (loading && items.length === 0) {
    return (
      <Stack data-slot="candidate-career-history-loading" gap="compact" className={className}>
        <Skeleton preset="row-compact" />
        <Skeleton preset="row-compact" />
      </Stack>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        variant="empty"
        size="inline"
        title={empty?.title ?? emptyTitle ?? "No career history yet"}
        description={empty ? empty.description : emptyDescription ?? "Career history is not available."}
        className={className}
      />
    );
  }

  const groups = groupConsecutiveEmployments(items);
  const detailedItems = groups
    .slice(0, detailedCompanyGroups)
    .flatMap((group) => group.items);
  const earlierItems = groups
    .slice(detailedCompanyGroups)
    .flatMap((group) => group.items);

  return (
    <Stack data-slot="candidate-career-history" gap="lg" className={className}>
      <Stack gap="lg">
        {detailedItems.map((item, index) => (
          <CareerRole
            key={index}
            item={item}
            detailed
            locale={locale}
            presentLabel={presentLabel}
            titleLevel={titleLevel}
          />
        ))}
      </Stack>
      {earlierItems.length > 0 ? (
        <Stack gap="md">
          <Separator />
          {/* The kit's header is an h3. Where a level was asked for, it is
              said at the roles' own, so it never outranks what heads them. */}
          <SectionHeader label={earlierLabel} spacing="none" aria-level={askedLevel} />
          <List spacing="normal">
            {earlierItems.map((item, index) => (
              <ListItem key={index}>
                <CareerRole
                  item={item}
                  detailed={false}
                  locale={locale}
                  presentLabel={presentLabel}
                  titleLevel={titleLevel}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      ) : null}
    </Stack>
  );
}
