"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Star } from "lucide-react";
import type { ButtonHTMLAttributes, MouseEvent } from "react";

/** Host-owned wording for the two states of the toggle. */
export interface CandidateFavouriteButtonLabels {
  /** Shown while the candidate is not a favourite. */
  add: string;
  /** Shown while the candidate is a favourite. */
  remove: string;
}

const DEFAULT_LABELS: CandidateFavouriteButtonLabels = {
  add: "Add to favourites",
  remove: "Remove from favourites",
};

export interface CandidateFavouriteButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type" | "onToggle"> {
  favourited: boolean;
  /** Called with no arguments; the host flips and persists the marker. */
  onToggle: () => void;
  labels?: Partial<CandidateFavouriteButtonLabels>;
  /**
   * The star's colour while the candidate is not a favourite: `muted`
   * (default) on a card, or `inherit` to take the surrounding text colour,
   * as the other icon actions in a detail header do.
   */
  idleTone?: "muted" | "inherit";
}

/**
 * A borderless star toggle for marking a candidate as a favourite.
 *
 * The click never reaches a surrounding card, so it works inside a clickable
 * candidate card. The root is the kit Button and keeps the kit's own
 * `data-slot="button"`, which theme stylesheets select on.
 */
export function CandidateFavouriteButton({
  favourited,
  onToggle,
  labels,
  idleTone = "muted",
  onClick,
  ...props
}: CandidateFavouriteButtonProps) {
  const label = favourited
    ? labels?.remove ?? DEFAULT_LABELS.remove
    : labels?.add ?? DEFAULT_LABELS.add;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      shrink
      aria-pressed={favourited}
      title={label}
      {...props}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onClick?.(event);
        if (!event.defaultPrevented) onToggle();
      }}
    >
      <Icon icon={Star} size="md" tone={favourited ? "warning" : idleTone} filled={favourited} />
    </Button>
  );
}
