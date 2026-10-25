"use client";

import { SelectionOverlay } from "@epicbagel/saas-kit/primitives/selection-overlay";
import { Toggle } from "@epicbagel/saas-kit/primitives/toggle";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

export interface CandidateSelectableAvatarProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "title" | "type" | "value" | "defaultValue"> {
  selected: boolean;
  /** Called with no arguments; the host adds or removes the candidate. */
  onToggle: () => void;
  /** The accessible name, such as "Select Mei Tanaka". */
  label: string;
  /** The tooltip. Defaults to "Select", or "Deselect" while selected. */
  title?: string;
  /** The avatar, usually the kit's PersonAvatar. */
  children: ReactNode;
}

/**
 * A candidate's avatar that doubles as a batch-selection checkbox: a pressed
 * toggle with the kit's check overlay while selected.
 *
 * The click never reaches a surrounding card, so selecting a candidate never
 * opens them. The root is the kit Toggle, marked
 * `data-slot="candidate-selectable-avatar"`.
 */
export function CandidateSelectableAvatar({
  selected,
  onToggle,
  label,
  title,
  children,
  onClick,
  ...props
}: CandidateSelectableAvatarProps) {
  return (
    <Toggle
      pressed={selected}
      aria-label={label}
      title={title ?? (selected ? "Deselect" : "Select")}
      onPressedChange={() => onToggle()}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      size="avatar"
      data-slot="candidate-selectable-avatar"
      {...props}
    >
      {children}
      {selected && <SelectionOverlay />}
    </Toggle>
  );
}
