"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Stack } from "./stack";

export interface DecisionActionOption<TValue extends string = string> {
  value: TValue;
  label: ReactNode;
}

export interface DecisionActionsProps<TValue extends string = string> {
  options: readonly DecisionActionOption<TValue>[];
  value?: TValue;
  onChange: (value: TValue) => void;
  disabled?: boolean;
  ariaLabel?: string;
  trailing?: ReactNode;
  /**
   * `inline` keeps a compact cluster. `fill` gives every decision equal space
   * inside a persistent action bar without increasing the label typography.
   */
  layout?: "inline" | "fill";
}

/**
 * Roomy, reusable controls for choosing a review disposition.
 *
 * These keep the compact label typography and visual scale while increasing
 * only the inset between the label and its border. Keeping that distinction
 * here prevents products from conflating a padding request with rescaling the
 * entire control.
 */
export function DecisionActions<TValue extends string>({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel = "Decision",
  trailing,
  layout = "inline",
}: DecisionActionsProps<TValue>) {
  const fill = layout === "fill";

  return (
    <Stack
      direction="horizontal"
      gap="sm"
      align="center"
      wrap={!fill}
      grow={fill}
      width={fill ? "full" : "auto"}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Button
            key={option.value}
            type="button"
            size="compact"
            grow={fill}
            className={cn(
              "h-auto",
              fill ? "min-h-11 px-5 py-2.5" : "px-4 py-2",
              selected && "border border-transparent",
            )}
            variant={selected ? "default" : "outline"}
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
      {trailing}
    </Stack>
  );
}
