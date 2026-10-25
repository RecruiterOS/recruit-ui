"use client";

import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CallCard, type CallParticipant, type CallSegment } from "@epicbagel/saas-kit/primitives/call-card";
import { DeleteConfirmationDialog } from "@epicbagel/saas-kit/primitives/delete-confirmation-dialog";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { BriefcaseBusiness, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";

import type { CallInsights } from "./call-data";

// The call helpers and types live in a module without a client boundary, so
// a server can normalize call data too; they are re-exported here, beside the
// card that reads them.
export {
  normalizeCallParticipants,
  normalizeCallSegments,
  type CallInsights,
  type CallInsightsStatus,
  type CallParticipant,
  type CallPerson,
  type CallSegment,
  type CallTranscript,
  type SearchCallPeople,
} from "./call-data";

/** Host-owned wording for the card's fixed parts. */
export interface CandidateCallCardLabels {
  /** The heading when the call has no title. */
  untitled: string;
  /** The transcript toggle while it is closed. */
  showTranscript: string;
  unlink: ReactNode;
  unlinkTitle: string;
  /** What unlinking does, in the confirmation. */
  unlinkDescription: string;
  /** Names the call in the confirmation when it has no title. */
  unlinkItem: string;
  unlinkConfirm: string;
  /** Starts the first check of the call against open roles. */
  check: ReactNode;
  /** Runs the check again once insights exist. */
  recheck: ReactNode;
  /** Either check button while a check runs. */
  checking: ReactNode;
  noRolesTitle: string;
  noRolesDescription: string;
}

const DEFAULT_LABELS: CandidateCallCardLabels = {
  untitled: "Untitled call",
  showTranscript: "Show transcript",
  unlink: "Unlink",
  unlinkTitle: "Unlink this call?",
  unlinkDescription: "The call will be removed from this person. Its transcript is kept.",
  unlinkItem: "this call",
  unlinkConfirm: "Unlink call",
  check: "Check against open jobs",
  recheck: "Recheck against open jobs",
  checking: "Checking…",
  noRolesTitle: "No suggested roles yet",
  noRolesDescription: "No other live role fits this person from this call.",
};

export interface CandidateCallCardProps {
  /** The call's title. Without one, the card says `labels.untitled`. */
  title?: string | null;
  /** Where the call came from, already worded. */
  source?: ReactNode;
  /** When it happened, already formatted. */
  timestamp?: ReactNode;
  /** Who was on it. `normalizeCallParticipants` prepares raw lists. */
  participants?: readonly CallParticipant[];
  /** Speaker-labelled turns. `normalizeCallSegments` prepares raw lists. */
  segments?: readonly CallSegment[] | null;
  /** The flat transcript, shown when there are no segments. */
  transcript?: ReactNode;
  /** How sure the host is that the call belongs to this person, shown as a badge. */
  confidence?: ReactNode;
  /**
   * Called once the recruiter confirms the unlink. The button shows a spinner
   * until it settles; the host removes the card, or reports why it couldn't.
   */
  onUnlink: () => Promise<void>;
  /** The host's check of the call against its open roles. */
  insights: CallInsights;
  /**
   * The roles the check suggested, usually a CandidateRoleMatchSummary. Once
   * insights are ready and this is empty, the card says no role fits.
   */
  roleMatches?: ReactNode;
  labels?: Partial<CandidateCallCardLabels>;
  /** Class for the card. Its root is the kit's CallCard, which takes no other attributes. */
  className?: string;
}

const isShown = (node: ReactNode) => node != null && node !== false && node !== "";

/**
 * One call linked to a person: the kit's CallCard with a confidence badge,
 * an unlink action behind a confirmation, and the check of the call against
 * open roles. Before insights exist the card offers the check and shows its
 * last error; once they do, it shows the host's role matches, or an empty
 * state when none fit, and offers a recheck.
 */
export function CandidateCallCard({
  title,
  source,
  timestamp,
  participants,
  segments,
  transcript,
  confidence,
  onUnlink,
  insights,
  roleMatches,
  labels,
  className,
}: CandidateCallCardProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [confirmUnlink, setConfirmUnlink] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const ready = insights.status === "ready";

  return (
    <>
      <CallCard
        className={className}
        title={title || text.untitled}
        source={source}
        timestamp={timestamp}
        participants={participants as CallParticipant[] | undefined}
        segments={(segments ?? undefined) as CallSegment[] | undefined}
        transcript={transcript}
        transcriptLabel={text.showTranscript}
        headerAside={isShown(confidence)
          ? <Badge variant="secondary" size="micro" titleCase="capitalize">{confidence}</Badge>
          : undefined}
        actions={(
          <Stack gap="sm" width="full">
            <Button variant="ghost" size="sm" disabled={unlinking} onClick={() => setConfirmUnlink(true)}>
              {unlinking ? <Icon icon={Loader2} size="sm" spin /> : text.unlink}
            </Button>
            {ready ? (
              <Stack gap="sm">
                {isShown(roleMatches) ? roleMatches : (
                  <EmptyState
                    variant="empty"
                    size="inline"
                    icon={BriefcaseBusiness}
                    title={text.noRolesTitle}
                    description={text.noRolesDescription}
                  />
                )}
                <Button variant="ghost" size="sm" onClick={() => insights.onGenerate(true)} disabled={insights.generating}>
                  {insights.generating ? text.checking : text.recheck}
                </Button>
              </Stack>
            ) : (
              <Stack gap="xs">
                {insights.error && <Text size="xs" tone="destructive">{insights.error}</Text>}
                <Button variant="outline" size="sm" onClick={() => insights.onGenerate(false)} disabled={insights.generating}>
                  {insights.generating ? text.checking : text.check}
                </Button>
              </Stack>
            )}
          </Stack>
        )}
      />
      <DeleteConfirmationDialog
        open={confirmUnlink}
        onOpenChange={setConfirmUnlink}
        title={text.unlinkTitle}
        description={text.unlinkDescription}
        itemName={title || text.unlinkItem}
        confirmText={text.unlinkConfirm}
        onConfirm={() => {
          setConfirmUnlink(false);
          setUnlinking(true);
          void onUnlink().finally(() => setUnlinking(false));
        }}
      />
    </>
  );
}
