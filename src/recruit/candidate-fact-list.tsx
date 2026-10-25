import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { History as HistoryIcon } from "lucide-react";
import type { HTMLAttributes, Key, ReactNode } from "react";

/** One fact about a person, such as the languages they speak. */
export interface CandidateFact {
  id: Key;
  /** What the fact is. Each word is capitalised, so a lower-case kind reads as a title. */
  label: ReactNode;
  /** The value, already formatted, for example with formatFactValue. */
  value: ReactNode;
}

export interface CandidateFactListProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  /** The section heading. The count follows it. */
  title?: ReactNode;
  facts: readonly CandidateFact[];
  /** The kit PanelSection's divider. */
  border?: "none" | "top" | "bottom";
}

/**
 * Collected facts about a person, as a counted definition list. Facts are
 * usually gathered over time and many people have none, so with no facts it
 * renders nothing rather than an empty panel.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-fact-list"`.
 */
export function CandidateFactList({
  title = "Facts",
  facts,
  border = "bottom",
  ...props
}: CandidateFactListProps) {
  if (facts.length === 0) return null;

  return (
    <PanelSection data-slot="candidate-fact-list" border={border} {...props}>
      <SectionHeader icon={<Icon icon={HistoryIcon} size="xs" />} label={title} count={facts.length} />
      <DefinitionList>
        {facts.map((fact) => (
          <DefinitionItem
            key={fact.id}
            label={<Text variant="inherit" as="span" transform="capitalize">{fact.label}</Text>}
          >
            {fact.value}
          </DefinitionItem>
        ))}
      </DefinitionList>
    </PanelSection>
  );
}

/**
 * Formats a stored fact value for display. Text, numbers and booleans read as
 * written; a list of words joins with commas; a record joins its non-empty
 * values with middle dots (dropping `color` and `sentiment`, which are styling
 * hints); a list of records becomes a tight list. An empty value reads as an
 * em dash.
 */
export function formatFactValue(value: unknown): ReactNode {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    if (typeof value[0] === "string" || typeof value[0] === "number") return value.join(", ");
    return (
      <List spacing="tight">
        {value.map((item, index) => <ListItem key={index} textSize="sm">{formatSingleObject(item)}</ListItem>)}
      </List>
    );
  }

  if (typeof value === "object") return formatSingleObject(value as Record<string, unknown>);
  return String(value);
}

function formatSingleObject(value: unknown): ReactNode {
  if (!value || typeof value !== "object") return String(value ?? "—");
  const entries = Object.entries(value as Record<string, unknown>).filter(
    ([key, item]) => item !== null && item !== undefined && item !== "" && key !== "color" && key !== "sentiment",
  );
  const [first] = entries;
  if (!first) return "—";
  if (entries.length === 1) return formatLeaf(first[1]);

  return entries.map(([key, item], index) => (
    <Text variant="inherit" as="span" key={key}>
      {index > 0 && <Text variant="inherit" as="span" tone="muted"> · </Text>}
      {formatLeaf(item)}
    </Text>
  ));
}

function formatLeaf(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.replace(/^null$/i, "").trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.filter(Boolean).map(String).join(", ");
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .filter((item) => item != null && item !== "")
      .map(formatLeaf)
      .filter(Boolean)
      .join(" · ");
  }
  return String(value);
}
