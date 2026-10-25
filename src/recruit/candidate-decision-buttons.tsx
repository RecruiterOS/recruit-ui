"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";

/** The two calls a reviewer can make on a candidate. */
export type CandidateDecisionChoice = "yes" | "no";

/** Host-owned wording for the two buttons. */
export interface CandidateDecisionButtonsLabels {
  yes: ReactNode;
  no: ReactNode;
}

const DEFAULT_LABELS: CandidateDecisionButtonsLabels = {
  yes: "Yes",
  no: "No",
};

export interface CandidateDecisionButtonsProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /**
   * Called with the button a person pressed. Nothing is recorded yet: the
   * host usually opens its own sheet or dialog to ask why, then saves.
   */
  onChoose: (decision: CandidateDecisionChoice) => void;
  size?: "sm" | "default";
  /** Share the available width between the two buttons, as in an action bar. */
  stretch?: boolean;
  labels?: Partial<CandidateDecisionButtonsLabels>;
  /**
   * Rendered inside the group after the buttons, usually the host's reason
   * sheet. Events that bubble out of its portal then stop here with the
   * buttons' own, instead of reaching a clickable card.
   */
  children?: ReactNode;
}

/**
 * Yes and No as equal, neutral outline buttons with thumbs icons. Neither is
 * styled as the default answer.
 *
 * Unlike `CandidateDecisionBar`, which shows a recorded value as a pressed
 * option, these buttons hold no value: a press starts the host's decision
 * flow. Every click inside the group stops propagating, so the buttons work
 * inside a clickable candidate card. The root is marked
 * `data-slot="candidate-decision-buttons"`.
 */
export function CandidateDecisionButtons({
  onChoose,
  size = "sm",
  stretch = false,
  labels,
  children,
  onClick,
  ...props
}: CandidateDecisionButtonsProps) {
  const text = { ...DEFAULT_LABELS, ...labels };

  return (
    <Stack
      data-slot="candidate-decision-buttons"
      direction="horizontal"
      gap="sm"
      grow={stretch}
      {...props}
      onClick={(event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onClick?.(event);
      }}
    >
      <Button grow={stretch} size={size} variant="outline" onClick={() => onChoose("yes")}>
        <Icon icon={ThumbsUp} size="sm" /> {text.yes}
      </Button>
      <Button grow={stretch} size={size} variant="outline" onClick={() => onChoose("no")}>
        <Icon icon={ThumbsDown} size="sm" /> {text.no}
      </Button>
      {children}
    </Stack>
  );
}
