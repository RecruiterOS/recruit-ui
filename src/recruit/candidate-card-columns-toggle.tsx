"use client";

import { useLayoutPreference } from "@epicbagel/saas-kit/hooks/use-layout-preference";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { ResponsiveView } from "@epicbagel/saas-kit/primitives/responsive-view";
import { ToggleGroup, ToggleGroupItem } from "@epicbagel/saas-kit/primitives/toggle-group";
import { Columns2, Rows3 } from "lucide-react";

export type CandidateCardColumns = 1 | 2;

export interface CandidateCardColumnsState {
  columns: CandidateCardColumns;
  setColumns: (columns: CandidateCardColumns) => void;
}

/**
 * The cards-per-row choice for one list, kept by the kit's layout preference
 * under `viewId` for the rest of the browser session. Lists that share a
 * `viewId` share the choice, so keep an id stable once people rely on it.
 * One column until someone picks.
 */
export function useCandidateCardColumns(viewId: string): CandidateCardColumnsState {
  const { layout, setLayout } = useLayoutPreference(viewId);
  const columns: CandidateCardColumns = layout === "comfortable" ? 1 : 2;
  return {
    columns,
    setColumns: (next) => setLayout(next === 1 ? "comfortable" : "compact"),
  };
}

/** Host-owned wording for the toggle and its two options. */
export interface CandidateCardColumnsToggleLabels {
  group: string;
  one: string;
  two: string;
}

const DEFAULT_LABELS: CandidateCardColumnsToggleLabels = {
  group: "Cards per row",
  one: "One card per row",
  two: "Two cards per row",
};

export interface CandidateCardColumnsToggleProps {
  columns: CandidateCardColumns;
  onChange: (columns: CandidateCardColumns) => void;
  /** Larger controls, to sit beside a roomy toolbar. */
  roomy?: boolean;
  labels?: Partial<CandidateCardColumnsToggleLabels>;
  className?: string;
}

/**
 * One or two candidate cards per row. Desktop only: on a phone the cards are
 * always one column, so the control renders nothing there.
 */
export function CandidateCardColumnsToggle({
  columns,
  onChange,
  roomy = false,
  labels,
  className,
}: CandidateCardColumnsToggleProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const value = columns === 1 ? "one" : "two";

  return (
    <ResponsiveView
      mobile={null}
      desktop={(
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={(next) => {
            if (next === "one") onChange(1);
            if (next === "two") onChange(2);
          }}
          variant="outline"
          size={roomy ? "icon-lg" : "icon"}
          aria-label={text.group}
          data-slot="candidate-card-columns-toggle"
          className={className}
        >
          <ToggleGroupItem value="one" aria-label={text.one} title={text.one}>
            <Icon icon={Rows3} size="sm" />
          </ToggleGroupItem>
          <ToggleGroupItem value="two" aria-label={text.two} title={text.two}>
            <Icon icon={Columns2} size="sm" />
          </ToggleGroupItem>
        </ToggleGroup>
      )}
    />
  );
}
