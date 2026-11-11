"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState, type ReactNode } from "react";

import {
  CandidateDecisionButtons,
  type CandidateDecisionChoice,
} from "./candidate-decision-buttons";
import { CandidateDecisionReasonDialog } from "./candidate-decision-reason-dialog";
import { CandidateReviewActionRow } from "./candidate-review-action-row";

/** Host-owned wording for a client's decision on a candidate. */
export interface CandidateClientDecisionLabels {
  yes: ReactNode;
  no: ReactNode;
  /** The recorded answer, such as "You said Yes". */
  saidYes: ReactNode;
  saidNo: ReactNode;
  /** Reopens the question once an answer is recorded. */
  change: ReactNode;
  /** The dialog's title for each answer, given the candidate's name. */
  yesTitle: (name: string) => ReactNode;
  noTitle: (name: string) => ReactNode;
  yesPlaceholder: string;
  noPlaceholder: string;
  confirmYes: ReactNode;
  confirmNo: ReactNode;
  /** The dialog's reason label. */
  reason: ReactNode;
  /** Shown under the buttons when saving fails. */
  failed: ReactNode;
}

const DEFAULT_LABELS: CandidateClientDecisionLabels = {
  yes: "Yes",
  no: "No",
  saidYes: "You said Yes",
  saidNo: "You said No",
  change: "Change",
  yesTitle: (name) => `Yes to ${name}`,
  noTitle: (name) => `No to ${name}`,
  yesPlaceholder: "What stands out?",
  noPlaceholder: "What's missing?",
  confirmYes: "Save Yes",
  confirmNo: "Save No",
  reason: "Why?",
  failed: "That didn't save. Try again.",
};

export interface CandidateClientDecisionProps {
  /** The candidate's name as the dialog should say it. */
  candidateName: string;
  /** The answer already recorded, if any. */
  decision?: CandidateDecisionChoice | null;
  /** The reason recorded with it, shown under the answer. */
  reason?: ReactNode;
  /**
   * Saves the answer and its reason. The dialog stays open, its buttons
   * disabled, until the promise settles, then closes. When the promise
   * rejects, the buttons come back with an error line under them.
   */
  onDecide: (decision: CandidateDecisionChoice, reason: string) => Promise<void>;
  /** One-tap reasons for each answer, already worded. */
  suggestions?: { yes?: readonly string[]; no?: readonly string[] };
  labels?: Partial<CandidateClientDecisionLabels>;
}

/**
 * A client's Yes or No on a candidate, with why: the action row of a card on
 * a shortlist the client reviews.
 *
 * With no answer yet it shows Yes and No as equal buttons; pressing one asks
 * for the reason (`CandidateDecisionReasonDialog`) and only then calls
 * `onDecide`. Once an answer is recorded (`decision`) it shows that answer
 * in words with its reason and a Change control that asks again. The host
 * owns the record: the component saves nothing and marks nothing recorded
 * before `decision` says so.
 *
 * Pass it as `CandidateReviewCard`'s `actions`: its root is a
 * `CandidateReviewActionRow`, marked `data-slot="candidate-client-decision"`
 * with the recorded answer in `data-decision`.
 */
export function CandidateClientDecision({
  candidateName,
  decision = null,
  reason,
  onDecide,
  suggestions,
  labels,
}: CandidateClientDecisionProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [asking, setAsking] = useState<CandidateDecisionChoice | null>(null);
  const [changing, setChanging] = useState(false);
  const [failed, setFailed] = useState(false);

  const submit = async (why: string) => {
    if (!asking) return;
    setFailed(false);
    try {
      await onDecide(asking, why);
      setAsking(null);
      setChanging(false);
    } catch {
      setAsking(null);
      setFailed(true);
    }
  };

  const dialog = (
    <CandidateDecisionReasonDialog
      open={asking !== null}
      title={asking === "no" ? text.noTitle(candidateName) : text.yesTitle(candidateName)}
      suggestions={asking === "no" ? suggestions?.no : suggestions?.yes}
      placeholder={asking === "no" ? text.noPlaceholder : text.yesPlaceholder}
      confirmLabel={asking === "no" ? text.confirmNo : text.confirmYes}
      onSubmit={submit}
      onClose={() => {
        setAsking(null);
        setFailed(false);
      }}
      labels={{ reason: text.reason }}
    />
  );

  // A failed save shows the buttons again, with the error under them.
  const recorded = decision !== null && !changing && !failed;

  return (
    <CandidateReviewActionRow
      data-slot="candidate-client-decision"
      data-decision={decision ?? "none"}
      isolateClicks
    >
      {recorded ? (
        <>
          <FlexItem grow minWidth="zero">
            <Stack direction="horizontal" gap="sm" align="center">
              <Icon icon={decision === "yes" ? ThumbsUp : ThumbsDown} size="sm" />
              <Text as="span" size="sm" weight="semibold">
                {decision === "yes" ? text.saidYes : text.saidNo}
              </Text>
            </Stack>
            {reason != null && reason !== "" ? (
              <Text size="sm" tone="muted" marginTop="xs">
                {reason}
              </Text>
            ) : null}
          </FlexItem>
          <Button type="button" variant="ghost" size="sm" onClick={() => setChanging(true)}>
            {text.change}
          </Button>
        </>
      ) : (
        <FlexItem grow minWidth="zero">
          <CandidateDecisionButtons
            stretch
            labels={{ yes: text.yes, no: text.no }}
            onChoose={(choice) => {
              setFailed(false);
              setAsking(choice);
            }}
          >
            {dialog}
          </CandidateDecisionButtons>
          {failed ? (
            <Text size="sm" tone="destructive" marginTop="xs" role="alert">
              {text.failed}
            </Text>
          ) : null}
        </FlexItem>
      )}
    </CandidateReviewActionRow>
  );
}
