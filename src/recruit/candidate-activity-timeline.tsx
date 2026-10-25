"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon, type IconProps } from "@epicbagel/saas-kit/primitives/icon";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Timeline, TimelineRow, type TimelineProps } from "@epicbagel/saas-kit/primitives/timeline";
import { History } from "lucide-react";
import {
  forwardRef,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type Key,
  type MouseEvent,
  type ReactNode,
} from "react";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";

interface CandidateActivityItemBase {
  /** Identifies the item within its group. */
  id: Key;
  /** The glyph for what kind of activity it is, as a component such as a lucide icon. */
  icon?: ElementType;
  /** The glyph's colour, such as `info` for a meeting or `success` for a reply. Defaults to `muted`. */
  iconTone?: IconProps["tone"];
  /** What happened, such as an email's subject. Clamped to two lines. */
  title: ReactNode;
  /** One line of context under the title, such as the channel and who it was with. */
  subtitle?: ReactNode;
  /** When it happened, already formatted. */
  timestamp?: ReactNode;
}

/** A row that holds longer content, such as a transcript or an email body, behind a toggle. */
export interface CandidateActivityDetailItem extends CandidateActivityItemBase {
  /** The longer content, kept as written: line breaks are preserved. */
  body?: ReactNode;
  /** The toggle's text while the body is hidden, such as how long it is. */
  bodyLabel?: ReactNode;
  href?: never;
  onSelect?: never;
}

/** A row that opens something: a link with `href`, otherwise a button. */
export interface CandidateActivityLinkItem extends CandidateActivityItemBase {
  /** Makes the row a link. */
  href?: string;
  /**
   * Called when the row is activated. With `href`, it runs before the link
   * is followed, so a client-side router can prevent the default and
   * navigate itself.
   */
  onSelect?: (event: MouseEvent<HTMLElement>) => void;
  body?: never;
  bodyLabel?: never;
}

/**
 * One thing that happened with a person. A row either holds a `body` behind a
 * toggle or opens something (`href` or `onSelect`), never both, so a control
 * never sits inside another.
 */
export type CandidateActivityItem = CandidateActivityDetailItem | CandidateActivityLinkItem;

/** The items in one period, such as "Today" or "This month", newest first. */
export interface CandidateActivityGroup {
  id: Key;
  /** The period's heading, already worded. */
  label: ReactNode;
  /** Shown beside the heading in the kit's count badge, such as how many items the period holds. */
  count?: number;
  items: readonly CandidateActivityItem[];
}

/** Host-owned wording for the timeline's fixed parts. */
export interface CandidateActivityTimelineLabels {
  /** The body toggle while the body is hidden, when the item has no `bodyLabel`. */
  showBody: ReactNode;
  /** The body toggle while the body is shown. */
  hideBody: ReactNode;
}

const DEFAULT_LABELS: CandidateActivityTimelineLabels = {
  showBody: "Show full text",
  hideBody: "Hide full text",
};

export interface CandidateActivityTimelineProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The periods, in order, usually newest first. Empty groups are left out. */
  groups: readonly CandidateActivityGroup[];
  /** Skeleton rows in place of the timeline. */
  loading?: boolean;
  /** The blank slate's wording. Defaults to "No activity yet". */
  empty?: CandidateEmptyCopy;
  /** The kit Timeline's spacing between rows in a period. Defaults to `tight`. */
  spacing?: TimelineProps["spacing"];
  labels?: Partial<CandidateActivityTimelineLabels>;
}

function present(value: ReactNode): boolean {
  return value != null && value !== false && value !== "";
}

function ActivityBody({
  body,
  label,
  labels,
}: {
  body: ReactNode;
  label?: ReactNode;
  labels: CandidateActivityTimelineLabels;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  return (
    <Stack gap="xs" marginTop="xs" align="start">
      <Button
        type="button"
        variant="link-muted"
        size="bare"
        align="start"
        aria-expanded={open}
        aria-controls={open ? bodyId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <Text variant="inherit" as="span" size="xs">
          {open ? labels.hideBody : present(label) ? label : labels.showBody}
        </Text>
      </Button>
      {open ? (
        <Stack id={bodyId} gap="none" surface="muted" radius="md" padding="sm" width="full">
          <Text as="div" size="xs" tone="muted" whitespace="pre-wrap">
            {body}
          </Text>
        </Stack>
      ) : null}
    </Stack>
  );
}

/** The element of a row that opens something without a URL. */
const RowButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function RowButton(props, ref) {
    return <button ref={ref} type="button" {...props} />;
  },
);

function ActivityRow({
  item,
  labels,
}: {
  item: CandidateActivityItem;
  labels: CandidateActivityTimelineLabels;
}) {
  const icon = item.icon ? (
    <Icon icon={item.icon} size="sm" tone={item.iconTone ?? "muted"} align="start" />
  ) : undefined;
  // The kit row truncates its title to one line; let it wrap to two instead,
  // keeping the row's own type.
  const title = <span className="line-clamp-2 whitespace-normal">{item.title}</span>;
  const shared = { icon, title, subtitle: item.subtitle, timestamp: item.timestamp };

  if (item.href != null || item.onSelect != null) {
    const select = item.onSelect;
    const onClick = select ? (event: MouseEvent) => select(event as MouseEvent<HTMLElement>) : undefined;
    return item.href != null ? (
      <TimelineRow {...shared} as="a" href={item.href} interactive onClick={onClick} />
    ) : (
      // A button centres its text; the row reads from the start like the others.
      <TimelineRow {...shared} as={RowButton} interactive onClick={onClick} className="w-full text-left" />
    );
  }

  return (
    <TimelineRow {...shared}>
      {present(item.body) ? (
        <ActivityBody body={item.body} label={item.bodyLabel} labels={labels} />
      ) : null}
    </TimelineRow>
  );
}

/**
 * A person's history, grouped by period: each period under its own heading,
 * each item a kit TimelineRow with a glyph, a title, a line of context and a
 * timestamp. A row can hold a longer body (a transcript, an email) behind a
 * toggle, or open something. A skeleton shows while it loads, and the kit's
 * empty state when nothing has happened.
 *
 * The host owns which records count as activity, how they are grouped and
 * worded, and what a row opens. The root is marked
 * `data-slot="candidate-activity-timeline"`; each period is a `section`
 * marked `data-slot="candidate-activity-period"`. Given an `aria-label` or
 * `aria-labelledby`, the root is a `region` (a host `role` wins), since a
 * label on a plain element is ignored by assistive technology.
 */
export function CandidateActivityTimeline({
  groups,
  loading = false,
  empty = { title: "No activity yet" },
  spacing = "tight",
  labels,
  role,
  ...rest
}: CandidateActivityTimelineProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const labelled = rest["aria-label"] != null || rest["aria-labelledby"] != null;
  const props = { ...rest, role: role ?? (labelled ? "region" : undefined) };
  const shown = groups.filter((group) => group.items.length > 0);

  if (loading && shown.length === 0) {
    return (
      <Stack data-slot="candidate-activity-timeline" aria-busy gap="xs" {...props}>
        <Skeleton preset="row-compact" />
        <Skeleton preset="row-compact" />
        <Skeleton preset="row-compact" />
      </Stack>
    );
  }

  if (shown.length === 0) {
    return (
      <Stack data-slot="candidate-activity-timeline" gap="none" {...props}>
        <EmptyState
          variant="empty"
          size="inline"
          icon={History}
          title={empty.title}
          // Without host wording, no description: the kit's generic one ("Get
          // started by creating...") doesn't fit a history.
          description={empty.description ?? ""}
        />
      </Stack>
    );
  }

  return (
    <Stack data-slot="candidate-activity-timeline" gap="lg" {...props}>
      {shown.map((group) => (
        <Stack key={group.id} as="section" data-slot="candidate-activity-period" gap="none">
          <SectionHeader label={group.label} count={group.count} />
          <Timeline spacing={spacing}>
            {group.items.map((item) => (
              <ActivityRow key={item.id} item={item} labels={text} />
            ))}
          </Timeline>
        </Stack>
      ))}
    </Stack>
  );
}
