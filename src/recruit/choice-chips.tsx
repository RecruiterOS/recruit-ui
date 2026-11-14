"use client";

import { cn } from "@epicbagel/saas-kit/lib/utils";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Toggle } from "@epicbagel/saas-kit/primitives/toggle";
import type { HTMLAttributes, ReactNode } from "react";

import { COARSE_POINTER_TOUCH_TARGET } from "./touch-targets";

/**
 * The kit Toggle's pressed state is a light accent fill with the same label
 * colour as an unpressed chip, about 1.2:1 against it. These are the kit
 * ChipTabs' outline states instead: an unpressed chip has a muted label, and
 * the pressed one a primary border and tint with a full-strength label.
 */
export const PRESSED_CHIP_STATES =
  "text-muted-foreground hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:font-medium data-[state=on]:text-foreground";

// A chip takes its words' height rather than cut a long name off, and keeps
// a 44px touch target on a touchscreen.
const CHIP_CLASSES = `h-auto min-h-9 py-1.5 text-left ${PRESSED_CHIP_STATES} ${COARSE_POINTER_TOUCH_TARGET}`;

/** One chip of a `ChoiceChips` row. */
export interface ChoiceChip {
  /** Tells the chip from the others, and tells the caller which was picked. */
  id: string;
  /** The chip's words, which also name it to a screen reader. */
  label: ReactNode;
  /** Drawn before the label and hidden from a screen reader, such as a face the label already names. */
  leading?: ReactNode;
  /** Drawn after the label, such as a badge. */
  trailing?: ReactNode;
}

export interface ChoiceChipsProps extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "children"> {
  chips: readonly ChoiceChip[];
  /** The pressed chip. */
  value: string;
  /** Called with a chip that isn't the pressed one. */
  onChange: (id: string) => void;
  /** Takes every chip out of use, for a row that can't be pressed at all. */
  disabled?: boolean;
  /**
   * Holds every chip for a moment, such as while a press is being acted
   * on. A held chip ignores a press and says it is disabled, and keeps the
   * keyboard's focus, which a browser takes from a control that is disabled
   * outright while it has it.
   */
  held?: boolean;
}

// A held chip looks as a disabled one does, and still takes focus.
const HELD_CHIP = "aria-disabled:pointer-events-none aria-disabled:opacity-50";

/**
 * A row of chips with one pressed: each is a toggle button with
 * `aria-pressed`, so a screen reader says which is chosen, in a `group` the
 * caller names with `aria-label` or `aria-labelledby`. The row wraps.
 *
 * Shared by the components that offer a short choice of this kind; it isn't
 * part of the public API.
 */
export function ChoiceChips({
  chips,
  value,
  onChange,
  disabled = false,
  held = false,
  ...props
}: ChoiceChipsProps) {
  return (
    <Stack role="group" direction="horizontal" gap="sm" wrap {...props}>
      {chips.map((chip) => (
        <Toggle
          key={chip.id}
          pressed={chip.id === value}
          // Pressing the chosen chip again leaves it chosen.
          onPressedChange={() => {
            if (!held && chip.id !== value) onChange(chip.id);
          }}
          disabled={disabled}
          aria-disabled={held || undefined}
          variant="outline"
          size="sm"
          className={cn(CHIP_CLASSES, HELD_CHIP)}
        >
          {chip.leading != null && chip.leading !== false ? (
            <Text as="span" variant="inherit" display="inline-flex" shrink={false} aria-hidden="true">
              {chip.leading}
            </Text>
          ) : null}
          {chip.label}
          {chip.trailing}
        </Toggle>
      ))}
    </Stack>
  );
}
