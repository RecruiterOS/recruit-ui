"use client";

import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
} from "@epicbagel/saas-kit/primitives/trace";
import { ArrowRight, ArrowUpDown, Minus, Plus, RefreshCw, type LucideIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

import {
  jobBriefChangeLabels,
  jobBriefChangeText,
  type JobBriefChange,
  type JobBriefChangeKind,
  type JobBriefChangeLabels,
} from "./job-brief-view";

// The change wording lives in a module without a client boundary, so a
// server can word a change too; it is re-exported here, beside the list
// that shows it.
export {
  jobBriefChangeLabels,
  jobBriefChangeText,
  type JobBriefChange,
  type JobBriefChangeKind,
  type JobBriefChangeLabels,
  type JobBriefChangeValue,
} from "./job-brief-view";

export interface JobBriefChangesProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /**
   * What the version changed, in the order it was made, as display values:
   * map your own record of each change onto `JobBriefChange`.
   */
  changes: readonly JobBriefChange[];
  /** The version these changes made, which names the group ("What changed in v3"). */
  version?: number;
  /** How many changes show before the rest fold under "N more changes". Defaults to 3. */
  previewCount?: number;
  /** Any of the wording in `jobBriefChangeLabels`: the lines, the toggle and the group's name. */
  labels?: Partial<JobBriefChangeLabels>;
}

/**
 * The icon each kind of change leads with. No sentiment colour: the brief
 * already colours its lists, and a removal isn't bad news. The line's own
 * words ("Added …", "Removed …") say what the icon shows.
 */
const CHANGE_ICONS: Record<JobBriefChangeKind, LucideIcon> = {
  added: Plus,
  removed: Minus,
  cleared: Minus,
  reworded: ArrowRight,
  set: ArrowRight,
  moved: ArrowUpDown,
  replaced: RefreshCw,
};

const DEFAULT_PREVIEW_COUNT = 3;

function ChangeLine({ change, labels }: { change: JobBriefChange; labels: JobBriefChangeLabels }) {
  return (
    <TraceLine data-change-kind={change.kind}>
      <TraceIcon>
        {/* A kind this release doesn't know reads as a change of value. */}
        <Icon icon={CHANGE_ICONS[change.kind] ?? ArrowRight} />
      </TraceIcon>
      <Text as="span" variant="inherit" minWidth="zero">{jobBriefChangeText(change, labels)}</Text>
    </TraceLine>
  );
}

/**
 * What a version of a brief changed, for under its JobBriefCard: one quiet
 * line per change, in the kit's trace lines, each leading with an icon for
 * its kind (added, removed or cleared, set or reworded, moved, replaced) and
 * worded by `jobBriefChangeText`. The first `previewCount` show; the rest
 * fold under a "N more changes" toggle that opens them in place. A version
 * with no changes to list (the first, which is the whole brief) draws
 * nothing.
 *
 * The root is a group named for the version ("What changed in v3"), so a
 * screen reader tells versions apart, and marked
 * `data-slot="job-brief-changes"`; each line carries its `data-change-kind`.
 * The kit's trace parts inside keep their own `data-slot`.
 */
export function JobBriefChanges({
  changes,
  version,
  previewCount = DEFAULT_PREVIEW_COUNT,
  labels,
  ...props
}: JobBriefChangesProps) {
  if (changes.length === 0) return null;
  const words: JobBriefChangeLabels = { ...jobBriefChangeLabels, ...labels };
  const count = Number.isFinite(previewCount) ? Math.max(0, Math.floor(previewCount)) : DEFAULT_PREVIEW_COUNT;
  const lines = changes.map((change, index) => ({ key: change.id ?? String(index), change }));
  const shown = lines.slice(0, count);
  const folded = lines.slice(count);

  return (
    <Stack data-slot="job-brief-changes" role="group" aria-label={words.groupName(version)} gap="none" {...props}>
      <Trace>
        {shown.map(({ key, change }) => (
          <ChangeLine key={key} change={change} labels={words} />
        ))}
        {folded.length > 0 ? (
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine>{words.more(folded.length)}</TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <Trace>
                {folded.map(({ key, change }) => (
                  <ChangeLine key={key} change={change} labels={words} />
                ))}
              </Trace>
            </TraceCollapsibleContent>
          </TraceCollapsible>
        ) : null}
      </Trace>
    </Stack>
  );
}
