"use client";

import {
  ConnectionStatusBar,
  type ConnectionStatusBarAction,
  type ConnectionStatusBarFact,
  type ConnectionStatusBarState,
} from "@epicbagel/saas-kit/primitives/connection-status-bar";
import type { ReactNode } from "react";

type CandidateDestinationActionBase = Omit<
  ConnectionStatusBarAction,
  "ariaLabel" | "iconOnly"
>;

/** Icon-only actions must always supply the accessible name hidden visually. */
export type CandidateDestinationAction =
  | (CandidateDestinationActionBase & {
      iconOnly: true;
      ariaLabel: string;
    })
  | (CandidateDestinationActionBase & {
      iconOnly?: false;
      ariaLabel?: string;
    });
export type CandidateDestinationFact = ConnectionStatusBarFact;
export type CandidateDestinationState = ConnectionStatusBarState;

export interface CandidateDestinationStatusProps {
  state: CandidateDestinationState;
  name: ReactNode;
  description?: ReactNode;
  facts?: readonly CandidateDestinationFact[];
  actions?: readonly CandidateDestinationAction[];
  progress?: number;
  progressLabel?: string;
  details?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** Caller-mapped destination state using the canonical core status surface. */
export function CandidateDestinationStatus({
  state,
  name,
  description,
  facts,
  actions,
  progress,
  progressLabel,
  details,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: CandidateDestinationStatusProps) {
  return (
    <ConnectionStatusBar
      state={state}
      name={name}
      description={description}
      facts={facts}
      actions={actions}
      progress={progress}
      progressLabel={progressLabel}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className={className}
    >
      {details}
    </ConnectionStatusBar>
  );
}
