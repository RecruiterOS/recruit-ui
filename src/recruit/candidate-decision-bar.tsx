"use client";

import {
  DecisionActions,
  type DecisionActionOption,
} from "@epicbagel/saas-kit/primitives/decision-actions";
import type { ReactNode } from "react";

export type CandidateDecisionOption<TValue extends string = string> =
  DecisionActionOption<TValue>;

export interface CandidateDecisionBarProps<TValue extends string = string> {
  options: readonly CandidateDecisionOption<TValue>[];
  value?: TValue;
  onChange: (value: TValue) => void;
  disabled?: boolean;
  ariaLabel?: string;
  trailing?: ReactNode;
  layout?: "inline" | "fill";
}

/** Decision controls only, so the containing card or dialog owns its surface. */
export function CandidateDecisionBar<TValue extends string>({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel = "Candidate decision",
  trailing,
  layout = "fill",
}: CandidateDecisionBarProps<TValue>) {
  return (
    <DecisionActions
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      ariaLabel={ariaLabel}
      trailing={trailing}
      layout={layout}
    />
  );
}
