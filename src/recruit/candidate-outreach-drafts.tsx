"use client";

import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CopyButton } from "@epicbagel/saas-kit/primitives/copy-button";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Check, Loader2, Send, X } from "lucide-react";
import { useId, type ElementType, type HTMLAttributes, type Key, type ReactNode } from "react";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";
import { usePendingAction } from "./pending-action";

/**
 * Where a drafted message stands: written and waiting (`draft`), cleared to
 * send (`approved`), `sent`, or set aside (`dismissed`).
 */
export type CandidateOutreachDraftStatus = "draft" | "approved" | "sent" | "dismissed";

/** The channel a draft was written for, such as email or a message app. */
export interface CandidateOutreachDraftChannel {
  /** The channel's name, beside its icon and in each action's accessible name. */
  label: string;
  /** A glyph for the channel, as a component such as a lucide icon. */
  icon?: ElementType;
}

/** One drafted message to a person. */
export interface CandidateOutreachDraftItem {
  /** Unique within the list; the row's React key. */
  id: Key;
  channel: CandidateOutreachDraftChannel;
  status: CandidateOutreachDraftStatus;
  /** Shown above the message, for channels that have one. */
  subject?: string | null;
  /** The message. Line breaks are kept. */
  body: string;
}

/** A row action, as `CandidateOutreachDraftListLabels.actionName` receives it. */
export type CandidateOutreachDraftAction = "copy" | "approve" | "dismiss" | "markSent";

/** The actions that change where a draft stands; Copy is always offered. */
export type CandidateOutreachDraftStatusAction = Exclude<CandidateOutreachDraftAction, "copy">;

const NO_ACTIONS: readonly CandidateOutreachDraftStatusAction[] = [];
const DRAFT_ACTIONS: readonly CandidateOutreachDraftStatusAction[] = ["approve", "dismiss"];
const APPROVED_ACTIONS: readonly CandidateOutreachDraftStatusAction[] = ["markSent"];

/**
 * The actions a draft offers by default, for an approve-then-send workflow:
 * Approve and Dismiss while it is a `draft`, Mark sent once it is `approved`,
 * and none once it is `sent` or `dismissed`. Pass your own
 * `availableActions` for a workflow without an approval step.
 */
export function defaultOutreachDraftActions(
  draft: Pick<CandidateOutreachDraftItem, "status">,
): readonly CandidateOutreachDraftStatusAction[] {
  if (draft.status === "draft") return DRAFT_ACTIONS;
  if (draft.status === "approved") return APPROVED_ACTIONS;
  return NO_ACTIONS;
}

export interface CandidateOutreachDraftListLabels {
  /** Each status's badge. Defaults to the status itself. */
  status: Record<CandidateOutreachDraftStatus, ReactNode>;
  /** The approve button's tooltip. */
  approve: string;
  /** The dismiss button's tooltip. */
  dismiss: string;
  /** The mark-sent button's tooltip. */
  markSent: string;
  /** Each action button's accessible name, for the channel of the draft it acts on. */
  actionName: (action: CandidateOutreachDraftAction, channel: string) => string;
}

const ACTION_NAME: Record<CandidateOutreachDraftAction, (channel: string) => string> = {
  copy: (channel) => `Copy ${channel} draft`,
  approve: (channel) => `Approve ${channel} draft`,
  dismiss: (channel) => `Dismiss ${channel} draft`,
  markSent: (channel) => `Mark ${channel} draft sent`,
};

const LABELS: CandidateOutreachDraftListLabels = {
  status: { draft: "draft", approved: "approved", sent: "sent", dismissed: "dismissed" },
  approve: "Approve",
  dismiss: "Dismiss",
  markSent: "Mark sent",
  actionName: (action, channel) => ACTION_NAME[action](channel),
};

/** What Copy puts on the clipboard by default: the subject line, if any, then the message. */
export function outreachDraftCopyText(draft: Pick<CandidateOutreachDraftItem, "subject" | "body">): string {
  return draft.subject ? `Subject: ${draft.subject}\n\n${draft.body}` : draft.body;
}

/** A row callback. A returned promise disables the row's buttons until it settles. */
export type CandidateOutreachDraftCallback<TDraft> = (draft: TDraft) => unknown;

interface CandidateOutreachDraftCardProps<TDraft extends CandidateOutreachDraftItem = CandidateOutreachDraftItem>
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  draft: TDraft;
  onApprove?: CandidateOutreachDraftCallback<TDraft>;
  onDismiss?: CandidateOutreachDraftCallback<TDraft>;
  onMarkSent?: CandidateOutreachDraftCallback<TDraft>;
  /** Which of Approve, Dismiss and Mark sent the draft offers. */
  availableActions: (draft: TDraft) => readonly CandidateOutreachDraftStatusAction[];
  /** What Copy puts on the clipboard. Defaults to `outreachDraftCopyText`. */
  copyText?: (draft: TDraft) => string;
  labels?: Partial<CandidateOutreachDraftListLabels>;
}

/**
 * One drafted message: the channel and its status badge, Copy, the actions
 * the host allows it, then the subject and the message.
 *
 * The root is marked `data-slot="candidate-outreach-draft"`.
 */
function CandidateOutreachDraftCard<TDraft extends CandidateOutreachDraftItem = CandidateOutreachDraftItem>({
  draft,
  onApprove,
  onDismiss,
  onMarkSent,
  availableActions,
  copyText = outreachDraftCopyText,
  labels,
  ...props
}: CandidateOutreachDraftCardProps<TDraft>) {
  const copy = { ...LABELS, ...labels };
  const channel = draft.channel.label;
  const offered = availableActions(draft);
  const [approving, approve] = usePendingAction(onApprove && (() => onApprove(draft)));
  const [dismissing, dismiss] = usePendingAction(onDismiss && (() => onDismiss(draft)));
  const [sending, markSent] = usePendingAction(onMarkSent && (() => onMarkSent(draft)));
  const busy = approving || dismissing || sending;

  return (
    <Stack
      data-slot="candidate-outreach-draft"
      direction="vertical"
      gap="sm"
      surface="card"
      radius="md"
      padding="compact"
      {...props}
    >
      <Stack direction="horizontal" gap="sm" align="center" justify="between">
        <Stack direction="horizontal" gap="sm" align="center" minWidth="zero">
          {draft.channel.icon ? <Icon icon={draft.channel.icon} size="md" tone="muted" /> : null}
          <Text variant="inherit" as="span" size="sm" weight="medium">{channel}</Text>
          <Badge variant={draft.status === "draft" ? "secondary" : "outline"} size="micro">
            {copy.status[draft.status]}
          </Badge>
        </Stack>
        <Stack direction="horizontal" gap="xs" shrink={false}>
          <CopyButton text={copyText(draft)} aria-label={copy.actionName("copy", channel)} />
          {offered.includes("approve") && onApprove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title={copy.approve}
              aria-label={copy.actionName("approve", channel)}
              disabled={busy}
              onClick={approve}
            >
              <Icon icon={approving ? Loader2 : Check} size="sm" spin={approving} />
            </Button>
          ) : null}
          {offered.includes("dismiss") && onDismiss ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title={copy.dismiss}
              aria-label={copy.actionName("dismiss", channel)}
              disabled={busy}
              onClick={dismiss}
            >
              <Icon icon={dismissing ? Loader2 : X} size="sm" spin={dismissing} />
            </Button>
          ) : null}
          {offered.includes("markSent") && onMarkSent ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title={copy.markSent}
              aria-label={copy.actionName("markSent", channel)}
              disabled={busy}
              onClick={markSent}
            >
              <Icon icon={sending ? Loader2 : Send} size="sm" spin={sending} />
            </Button>
          ) : null}
        </Stack>
      </Stack>
      {draft.subject ? <Text size="xs" weight="medium">{draft.subject}</Text> : null}
      <Text size="sm" whitespace="pre-wrap" tone="soft">{draft.body}</Text>
    </Stack>
  );
}

export interface CandidateOutreachDraftListProps<TDraft extends CandidateOutreachDraftItem = CandidateOutreachDraftItem>
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  /** The drafts, newest first or in whatever order you choose. */
  drafts: readonly TDraft[];
  /** A skeleton row while there are no drafts to show yet, and no count. */
  loading?: boolean;
  /** The section heading. Defaults to "Outreach drafts". */
  title?: ReactNode;
  /** The blank slate's wording. Defaults to "No outreach drafts yet". */
  empty?: CandidateEmptyCopy;
  /**
   * Adds Approve to each draft that offers it (by default, one that is still
   * a `draft`). A returned promise disables the row until it settles, as it
   * does for each callback.
   */
  onApprove?: CandidateOutreachDraftCallback<TDraft>;
  /** Adds Dismiss to each draft that offers it (by default, one that is still a `draft`). */
  onDismiss?: CandidateOutreachDraftCallback<TDraft>;
  /** Adds Mark sent to each draft that offers it (by default, an `approved` one). */
  onMarkSent?: CandidateOutreachDraftCallback<TDraft>;
  /**
   * Which of Approve, Dismiss and Mark sent each draft offers, as your
   * workflow decides; a button shows only when its callback is given too.
   * Defaults to `defaultOutreachDraftActions`, an approve-then-send workflow.
   */
  availableActions?: (draft: TDraft) => readonly CandidateOutreachDraftStatusAction[];
  /** What Copy puts on the clipboard. Defaults to `outreachDraftCopyText`. */
  copyText?: (draft: TDraft) => string;
  /** The kit PanelSection's divider. Defaults to `bottom`. */
  border?: "none" | "top" | "bottom";
  labels?: Partial<CandidateOutreachDraftListLabels>;
}

/**
 * The messages drafted to a person, one card per draft: the channel, where
 * the draft stands, and Copy, with the status actions your workflow allows
 * (by default Approve and Dismiss while it is a draft, and Mark sent once it
 * is approved). You write the drafts, decide which actions each offers, save
 * each status change and send the messages; the list lays them out under a
 * counted heading, with a skeleton while they load and the kit's empty state
 * when there are none.
 *
 * The root is the kit PanelSection, a section named by its title and marked
 * `data-slot="candidate-outreach-draft-list"`.
 */
export function CandidateOutreachDraftList<TDraft extends CandidateOutreachDraftItem = CandidateOutreachDraftItem>({
  drafts,
  loading = false,
  title = "Outreach drafts",
  empty = { title: "No outreach drafts yet" },
  onApprove,
  onDismiss,
  onMarkSent,
  availableActions = defaultOutreachDraftActions,
  copyText,
  border = "bottom",
  labels,
  ...props
}: CandidateOutreachDraftListProps<TDraft>) {
  const titleId = useId();
  const count = drafts.length;

  return (
    <PanelSection
      data-slot="candidate-outreach-draft-list"
      aria-labelledby={titleId}
      border={border}
      {...props}
    >
      <SectionHeader id={titleId} label={title} count={!loading && count > 0 ? count : undefined} />
      {loading && count === 0 ? (
        <Stack direction="vertical" gap="sm">
          <Skeleton preset="row" />
        </Stack>
      ) : count === 0 ? (
        <EmptyState
          variant="empty"
          size="inline"
          icon={Send}
          title={empty.title}
          // Without host wording, no description: the kit's generic one
          // ("Get started by creating...") doesn't fit a list of drafts.
          description={empty.description ?? ""}
        />
      ) : (
        <Stack direction="vertical" gap="sm">
          {drafts.map((draft) => (
            <CandidateOutreachDraftCard
              key={draft.id}
              draft={draft}
              onApprove={onApprove}
              onDismiss={onDismiss}
              onMarkSent={onMarkSent}
              availableActions={availableActions}
              copyText={copyText}
              labels={labels}
            />
          ))}
        </Stack>
      )}
    </PanelSection>
  );
}
