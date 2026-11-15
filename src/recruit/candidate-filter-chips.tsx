"use client";

import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Toggle } from "@epicbagel/saas-kit/primitives/toggle";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { PRESSED_CHIP_STATES } from "./choice-chips";
import { COARSE_POINTER_TOUCH_TARGET } from "./touch-targets";

// A chip keeps its label's width and the row scrolls: `shrink-0` says so.
// Without it the row relied on a flex item's automatic minimum, which the
// touch target's own minimum width replaces, so on a touchscreen a crowded
// row squeezed every chip to a 44px circle with its label spilling out.
const CHIP_CLASSES = `shrink-0 ${PRESSED_CHIP_STATES} ${COARSE_POINTER_TOUCH_TARGET}`;

/** One chip: a value the list can be narrowed to. */
export interface CandidateFilterChipOption<TValue extends string = string> {
  value: TValue;
  label: ReactNode;
  /** An icon component (not an element) drawn before the label. */
  icon?: ElementType;
}

export interface CandidateFilterChipsProps<TValue extends string = string>
  extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "children"> {
  /** The chosen option, or null for the unfiltered chip. */
  value: TValue | null;
  /** Called with an option's value, or null from the unfiltered chip. */
  onChange: (value: TValue | null) => void;
  /** The first chip, which clears the filter, such as "Everyone". */
  allLabel: ReactNode;
  options: readonly CandidateFilterChipOption<TValue>[];
  /** Content before the chips, such as a badge naming where the list came from. */
  context?: ReactNode;
  /** Content pushed to the end of the row, such as a related control. */
  action?: ReactNode;
}

/**
 * A single row of pressed-state chips that narrows a list of people to one
 * kind, such as everyone with a recent job move. The row scrolls sideways
 * rather than wrapping, and sits on a bottom border so it reads as part of
 * the toolbar above the list. Each chip is a toggle button with
 * `aria-pressed`; the pressed one has a primary border and tint and a
 * full-strength label, the others a muted label. Every chip keeps a 44px
 * touch target on a coarse pointer (a touchscreen); a mouse keeps the 28px
 * chip. The host owns the options, their
 * wording and what each one filters. The root is marked
 * `data-slot="candidate-filter-chips"`.
 */
export function CandidateFilterChips<TValue extends string = string>({
  value,
  onChange,
  allLabel,
  options,
  context,
  action,
  ...props
}: CandidateFilterChipsProps<TValue>) {
  return (
    <Stack gap="none" border="bottom" data-slot="candidate-filter-chips" {...props}>
      <Stack direction="horizontal" gap="xs" align="center" paddingY="sm" overflow="x-auto">
        {context}
        <Toggle
          pressed={!value}
          onPressedChange={() => onChange(null)}
          variant="outline"
          size="chip"
          className={CHIP_CLASSES}
        >
          {allLabel}
        </Toggle>
        {options.map((option) => (
          <Toggle
            key={option.value}
            pressed={value === option.value}
            onPressedChange={() => onChange(option.value)}
            variant="outline"
            size="chip"
            className={CHIP_CLASSES}
          >
            {option.icon && <Icon icon={option.icon} size="xs" />}
            {option.label}
          </Toggle>
        ))}
        {action && <Stack marginStart="auto" shrink={false}>{action}</Stack>}
      </Stack>
    </Stack>
  );
}
