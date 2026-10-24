"use client";

import { Button } from "@/components/recruit-ui/core/primitives/button";
import { EmptyState } from "@/components/recruit-ui/core/primitives/empty-state";
import { Heading } from "@/components/recruit-ui/core/primitives/heading";
import { List, ListItem } from "@/components/recruit-ui/core/primitives/list";
import { SectionHeader } from "@/components/recruit-ui/core/primitives/section-header";
import { Separator } from "@/components/recruit-ui/core/primitives/separator";
import { Skeleton } from "@/components/recruit-ui/core/primitives/skeleton";
import { Stack } from "@/components/recruit-ui/core/primitives/stack";
import { Text } from "@/components/recruit-ui/core/primitives/text";
import { useState, type ReactNode } from "react";

import {
  formatCalendarDate,
  type CalendarDateValue,
} from "../core/calendar-date";

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

  if (typeof description !== "string") {
    return (
      <Text as="div" variant="caption" size="xs" tone="subtle">
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
          tone="subtle"
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
}: {
  item: CareerHistoryItem;
  detailed: boolean;
  locale: string;
  presentLabel: ReactNode;
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
      <Heading level={5}>{item.title}</Heading>
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

export interface CandidateCareerHistoryTimelineProps {
  items: readonly CareerHistoryItem[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  earlierLabel?: ReactNode;
  presentLabel?: ReactNode;
  detailedCompanyGroups?: number;
  locale?: string;
  className?: string;
}

export function CandidateCareerHistoryTimeline({
  items,
  loading = false,
  emptyTitle = "No career history yet",
  emptyDescription = "Career history is not available.",
  earlierLabel = "Earlier",
  presentLabel = "Present",
  detailedCompanyGroups = 2,
  locale = "en",
  className,
}: CandidateCareerHistoryTimelineProps) {
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
        title={emptyTitle}
        description={emptyDescription}
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
          />
        ))}
      </Stack>
      {earlierItems.length > 0 ? (
        <Stack gap="md">
          <Separator />
          <SectionHeader label={earlierLabel} spacing="none" />
          <List spacing="normal">
            {earlierItems.map((item, index) => (
              <ListItem key={index}>
                <CareerRole
                  item={item}
                  detailed={false}
                  locale={locale}
                  presentLabel={presentLabel}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      ) : null}
    </Stack>
  );
}
