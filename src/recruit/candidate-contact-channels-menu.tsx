"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CountBadge } from "@epicbagel/saas-kit/primitives/count-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@epicbagel/saas-kit/primitives/dropdown-menu";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

/** One way of reaching a candidate, such as email or phone. */
export interface CandidateContactChannelOption {
  id: string;
  label: ReactNode;
}

/** Host-owned wording for the trigger and the remove items. */
export interface CandidateContactChannelsMenuLabels {
  trigger: ReactNode;
  /** The trigger's text when `compact`. */
  compactTrigger: ReactNode;
  /** Tooltip on the trigger. */
  triggerTitle: string;
  /** The item that clears a channel recorded by mistake. */
  remove: (option: CandidateContactChannelOption) => ReactNode;
}

const DEFAULT_LABELS: CandidateContactChannelsMenuLabels = {
  trigger: "Contacted via",
  compactTrigger: "Via",
  triggerTitle: "Record how this candidate was contacted",
  remove: (option) => <>Remove {option.label}</>,
};

export interface CandidateContactChannelsMenuProps {
  /** The channels, in menu order. */
  options: readonly CandidateContactChannelOption[];
  /**
   * The channels already used, by option id, each with what to show beside it
   * (usually how recently). An id that is absent, null, undefined or false
   * has not been used.
   */
  touched: Readonly<Record<string, ReactNode>>;
  /** Called when a channel is picked; picking a used channel again refreshes it. */
  onTouch: (id: string) => void;
  /** Called from the remove items. */
  onRemove: (id: string) => void;
  /** A shorter trigger for tight action rows. */
  compact?: boolean;
  labels?: Partial<CandidateContactChannelsMenuLabels>;
}

function isTouched(value: ReactNode): boolean {
  return value != null && value !== false;
}

/**
 * Records how a candidate was contacted. Each pick records or refreshes a
 * channel and the menu stays open, so ticking two is one visit; used channels
 * show the host's recency text and can be removed.
 *
 * Every click stops propagating, because the menu often sits inside a
 * clickable candidate card and React events bubble through portals along the
 * component tree. The host owns the channels, timestamps, recency wording and
 * anything a first contact should change.
 */
export function CandidateContactChannelsMenu({
  options,
  touched,
  onTouch,
  onRemove,
  compact = false,
  labels,
}: CandidateContactChannelsMenuProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const used = options.filter((option) => isTouched(touched[option.id]));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          title={text.triggerTitle}
          onClick={(event) => event.stopPropagation()}
        >
          {compact ? text.compactTrigger : text.trigger}
          {used.length > 0 && <CountBadge value={used.length} variant="secondary" />}
          <Icon icon={ChevronDown} size="md" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        data-slot="candidate-contact-channels-menu"
        onClick={(event) => event.stopPropagation()}
      >
        {options.map((option) => {
          const recency = touched[option.id];
          const isUsed = isTouched(recency);
          return (
            <DropdownMenuItem
              key={option.id}
              // Stay open so ticking two channels is one menu visit.
              onSelect={(event) => event.preventDefault()}
              onClick={(event) => {
                event.stopPropagation();
                onTouch(option.id);
              }}
            >
              <Icon icon={Check} size="md" tone="success" visibility={isUsed ? "visible" : "hidden"} />
              {option.label}
              {isUsed && recency !== true && (
                <Text variant="inherit" as="span" grow align="end" paddingX="md" size="xs" tone="muted">
                  {recency}
                </Text>
              )}
            </DropdownMenuItem>
          );
        })}
        {used.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {used.map((option) => (
              <DropdownMenuItem
                key={`rm-${option.id}`}
                tone="muted"
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove(option.id);
                }}
              >
                {text.remove(option)}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
