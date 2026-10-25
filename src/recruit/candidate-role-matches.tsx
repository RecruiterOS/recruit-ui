"use client";

import { Anchor } from "@epicbagel/saas-kit/primitives/anchor";
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { ConfirmBar } from "@epicbagel/saas-kit/primitives/confirm-bar";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useState, type HTMLAttributes, type ReactNode } from "react";

/** A role id: whatever key the host uses for its roles. */
export type CandidateRoleMatchId = string | number;

/** A role suggested for a candidate, in the compact summary. */
export interface CandidateRoleMatchSummaryItem<TId extends CandidateRoleMatchId = CandidateRoleMatchId> {
  id: TId;
  title: ReactNode;
  /** Usually a CandidateGradeBadge. */
  grade?: ReactNode;
}

export interface CandidateRoleMatchSummaryProps<TItem extends CandidateRoleMatchSummaryItem = CandidateRoleMatchSummaryItem>
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  matches: readonly TItem[];
  /** Called with a role's id when its row is activated. */
  onOpen: (id: TItem["id"]) => void;
}

/**
 * A compact cue that a candidate may fit other roles: one full-width row per
 * role with its title, grade and a chevron, each opening wherever the host
 * shows the full rationale. Renders nothing when there are no matches, so it
 * can sit in a call or list overview unconditionally. The root is marked
 * `data-slot="candidate-role-match-summary"`.
 */
export function CandidateRoleMatchSummary<TItem extends CandidateRoleMatchSummaryItem>({
  matches,
  onOpen,
  ...props
}: CandidateRoleMatchSummaryProps<TItem>) {
  if (!matches.length) return null;
  return (
    <Stack gap="xs" width="full" data-slot="candidate-role-match-summary" {...props}>
      {matches.map((match) => (
        <Button
          key={match.id}
          variant="ghost"
          size="sm"
          width="full"
          align="start"
          onClick={() => onOpen(match.id)}
        >
          <Stack direction="horizontal" gap="sm" align="center" justify="between" width="full">
            <Text size="sm" weight="medium" truncate>{match.title}</Text>
            <Stack direction="horizontal" gap="sm" align="center" shrink={false}>
              {match.grade}
              <Icon icon={ChevronRight} size="sm" tone="muted" />
            </Stack>
          </Stack>
        </Button>
      ))}
    </Stack>
  );
}

/** A role suggested for a candidate, with why, in the full list. */
export interface CandidateRoleMatchListItem<TId extends CandidateRoleMatchId = CandidateRoleMatchId>
  extends CandidateRoleMatchSummaryItem<TId> {
  /** Where the role title links to. */
  href?: string;
  /** One line of why the candidate fits, already worded. */
  reason: ReactNode;
  /** Already on the role: shows the added badge instead of the add action. */
  added?: boolean;
  /** The added badge's text for this role, such as "Added · screening". */
  addedLabel?: ReactNode;
}

/** Host-owned wording for the list's actions. */
export interface CandidateRoleMatchListLabels {
  /** The add button and the confirm button. */
  add: ReactNode;
  /** The badge on a role the candidate was added to here. */
  added: ReactNode;
  cancel: ReactNode;
}

const DEFAULT_LIST_LABELS: CandidateRoleMatchListLabels = {
  add: "Add to role",
  added: "Added",
  cancel: "Cancel",
};

/** Host-owned wording for the confirmation an add asks for first. */
export interface CandidateRoleMatchConfirm<TItem> {
  title: (match: TItem) => ReactNode;
  description?: (match: TItem) => ReactNode;
}

export interface CandidateRoleMatchListProps<TItem extends CandidateRoleMatchListItem = CandidateRoleMatchListItem>
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The eyebrow over the list, such as "Possible roles for Mei". */
  heading: ReactNode;
  matches: readonly TItem[];
  /**
   * Opens a role in place. When set, a click on the title calls it instead of
   * following `href`, for a surface that already shows the person.
   */
  onOpen?: (id: TItem["id"]) => void;
  /**
   * Enables the add action. Resolve once the candidate is on the role (the row
   * then shows the added badge); reject when it failed, having told the person
   * why, and the role stays addable.
   */
  onAddToRole?: (id: TItem["id"]) => Promise<void>;
  confirm: CandidateRoleMatchConfirm<TItem>;
  labels?: Partial<CandidateRoleMatchListLabels>;
}

/**
 * Roles a candidate may fit, each with a linked title, a grade, one line of
 * why, and an add action that asks for confirmation in the kit's bottom
 * ConfirmBar before calling `onAddToRole`. A role added here keeps its
 * added badge for as long as the list is mounted. Renders nothing when
 * there are no matches. The root is marked `data-slot="candidate-role-match-list"`.
 */
export function CandidateRoleMatchList<TItem extends CandidateRoleMatchListItem>({
  heading,
  matches,
  onOpen,
  onAddToRole,
  confirm,
  labels,
  ...props
}: CandidateRoleMatchListProps<TItem>) {
  const text = { ...DEFAULT_LIST_LABELS, ...labels };
  const [added, setAdded] = useState<TItem["id"][]>([]);
  const [confirmMatch, setConfirmMatch] = useState<TItem | null>(null);
  if (!matches.length) return null;

  const add = async (match: TItem) => {
    if (!onAddToRole) return;
    try {
      await onAddToRole(match.id);
      setAdded((current) => [...current, match.id]);
    } catch {
      // The host has already reported the failure; the role stays addable.
    }
  };

  return (
    <Stack gap="md" padding="md" border="top" data-slot="candidate-role-match-list" {...props}>
      <Text variant="eyebrow">{heading}</Text>
      {matches.map((match) => {
        const isAdded = !!match.added || added.includes(match.id);
        return (
          <Stack key={match.id} gap="sm" align="start" paddingBottom="md" border="bottom">
            <Stack direction="horizontal" gap="sm" justify="between" align="start" width="full">
              <Stack grow minWidth="zero">
                <Anchor
                  size="sm"
                  weight="medium"
                  href={match.href}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (onOpen) {
                      event.preventDefault();
                      onOpen(match.id);
                    }
                  }}
                >
                  {match.title}
                </Anchor>
              </Stack>
              {match.grade}
            </Stack>
            <Text size="sm" tone="muted">{match.reason}</Text>
            {isAdded ? (
              <Badge variant="success" size="compact">{match.addedLabel ?? text.added}</Badge>
            ) : onAddToRole && (
              <Button
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  setConfirmMatch(match);
                }}
              >
                {text.add} <Icon icon={ArrowRight} size="sm" />
              </Button>
            )}
          </Stack>
        );
      })}
      <ConfirmBar
        open={confirmMatch !== null}
        title={confirmMatch ? confirm.title(confirmMatch) : null}
        description={confirmMatch ? confirm.description?.(confirmMatch) : undefined}
        confirmLabel={text.add}
        cancelLabel={text.cancel}
        onCancel={() => setConfirmMatch(null)}
        onConfirm={() => {
          if (!confirmMatch) return;
          const match = confirmMatch;
          setConfirmMatch(null);
          void add(match);
        }}
      />
    </Stack>
  );
}
