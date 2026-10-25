"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@epicbagel/saas-kit/primitives/dropdown-menu";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { SplitActionButton } from "@epicbagel/saas-kit/primitives/split-action-button";
import { ChevronDown } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";

import type { CandidateStageOption } from "./candidate-stage-select";

/** The primary move: the candidate's immediate next stage. */
export interface CandidateStageAdvance {
  label: ReactNode;
  /** A quieter outline button, for a logging step rather than a milestone. */
  outline?: boolean;
  onAdvance: () => void;
}

/** Host-owned wording for the stage actions. */
export interface CandidateStageActionsLabels {
  /** A move option's menu item, from its label. */
  moveTo: (label: ReactNode) => ReactNode;
  /** The move menu's tooltip and accessible name. */
  moveMenu: string;
  /** The move menu's button text when there is no primary move. */
  moveTrigger: ReactNode;
  present: ReactNode;
  reject: ReactNode;
  rejectTitle: string;
  decline: ReactNode;
  declineTitle: string;
}

const DEFAULT_LABELS: CandidateStageActionsLabels = {
  moveTo: (label) => <>Move to {label}</>,
  moveMenu: "Move to…",
  moveTrigger: "Move to",
  present: "Present to client",
  reject: "Reject",
  rejectTitle: "Reject — move to rejected",
  decline: "Declined",
  declineTitle: "Candidate declined / not looking — move to declined",
};

export interface CandidateStageActionsProps<TValue extends string = string> {
  /** The primary move. With `moveOptions` it becomes a split button. */
  advance?: CandidateStageAdvance;
  /** Stages to jump straight to, in pipeline order. */
  moveOptions?: readonly CandidateStageOption<TValue>[];
  onMove?: (value: TValue) => void;
  /** A contact control placed after the move, such as a contact channels menu. */
  contact?: ReactNode;
  /** Shows the present action, for sharing the candidate with a client. */
  onPresent?: () => void;
  /** Shows the reject action. The host asks why, then moves the candidate. */
  onRequestReject?: () => void;
  /** Shows the declined action, for a candidate who opted out. */
  onRequestDecline?: () => void;
  labels?: Partial<CandidateStageActionsLabels>;
}

function stopThen(callback: () => void) {
  return (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    callback();
  };
}

/**
 * The controls for working a candidate through a pipeline: advance to the
 * next stage (a split button whose menu jumps further ahead), contact,
 * present to a client, reject and declined.
 *
 * Renders the controls alone, usually inside `CandidateReviewActionRow`.
 * Every click stops propagating, because the controls sit inside clickable
 * candidate cards and React events bubble through portals along the
 * component tree. Reject and declined only request the move: the host opens
 * its own reason flow and saves.
 */
export function CandidateStageActions<TValue extends string = string>({
  advance,
  moveOptions = [],
  onMove,
  contact,
  onPresent,
  onRequestReject,
  onRequestDecline,
  labels,
}: CandidateStageActionsProps<TValue>) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const hasMenu = moveOptions.length > 0;

  return (
    <>
      {advance ? (
        hasMenu ? (
          <SplitActionButton
            label={advance.label}
            size="sm"
            variant={advance.outline ? "outline" : "default"}
            onAction={advance.onAdvance}
            items={moveOptions.map((option) => ({ value: option.value, label: text.moveTo(option.label) }))}
            onSelect={(value) => onMove?.(value as TValue)}
            chevronAriaLabel={text.moveMenu}
          />
        ) : (
          <Button size="sm" variant={advance.outline ? "outline" : "default"} onClick={stopThen(advance.onAdvance)}>
            {advance.label}
          </Button>
        )
      ) : hasMenu ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" title={text.moveMenu} onClick={(event) => event.stopPropagation()}>
              {text.moveTrigger}
              <Icon icon={ChevronDown} size="md" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            data-slot="candidate-stage-menu"
            onClick={(event) => event.stopPropagation()}
          >
            {moveOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={(event) => {
                  event.stopPropagation();
                  onMove?.(option.value);
                }}
              >
                {text.moveTo(option.label)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}

      {contact}
      {onPresent && (
        <Button size="sm" variant="outline" onClick={stopThen(onPresent)}>
          {text.present}
        </Button>
      )}
      {onRequestReject && (
        <Button size="sm" variant="ghost-destructive" title={text.rejectTitle} onClick={stopThen(onRequestReject)}>
          {text.reject}
        </Button>
      )}
      {onRequestDecline && (
        <Button size="sm" variant="quiet" title={text.declineTitle} onClick={stopThen(onRequestDecline)}>
          {text.decline}
        </Button>
      )}
    </>
  );
}
