"use client";

import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Check } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { CandidateSummaryBullets, type CandidateSummaryBullet } from "./candidate-pipeline-list";

export interface CandidateAssessmentFact {
  label: ReactNode;
  value: ReactNode;
}

export interface CandidateAssessmentLabels {
  summary: ReactNode;
  evidence: ReactNode;
  caveats: ReactNode;
  signals: ReactNode;
}

export interface CandidateAssessmentProps
  extends HTMLAttributes<HTMLElement> {
  grade?: ReactNode;
  facts?: readonly CandidateAssessmentFact[];
  summary?: ReactNode;
  /** The evidence section's content, as a slot. Takes precedence over `evidenceItems`. */
  evidence?: ReactNode;
  /**
   * The evidence as points, drawn as a list with a check mark on each. An
   * empty list draws no section.
   */
  evidenceItems?: readonly ReactNode[];
  /** The caveats section's content, as a slot. Takes precedence over `caveatItems`. */
  caveats?: ReactNode;
  /** The caveats as points, drawn as a bulleted list. An empty list draws no section. */
  caveatItems?: readonly ReactNode[];
  /** The signals section's content, as a slot. Takes precedence over `signalItems`. */
  signals?: ReactNode;
  /**
   * The signals as lines, each with the host's sentiment, drawn through
   * CandidateSummaryBullets. An empty list draws no section.
   */
  signalItems?: readonly CandidateSummaryBullet[];
  labels?: Partial<CandidateAssessmentLabels>;
  /**
   * The kit PanelSection's padding. `default` pads the assessment like a
   * card's section. `none` sits it flush in a container the host already
   * pads, such as a profile dialog's body, so it lines up with whatever
   * follows it there.
   */
  padding?: "none" | "compact" | "default";
}

const DEFAULT_LABELS: CandidateAssessmentLabels = {
  summary: "Assessment",
  evidence: "Evidence",
  caveats: "Caveats",
  signals: "Signals",
};

function AssessmentSection({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <Stack gap="sm">
      <SectionHeader label={label} spacing="none" />
      <Text as="div" variant="muted" size="sm">
        {children}
      </Text>
    </Stack>
  );
}

function EvidenceList({ items }: { items: readonly ReactNode[] }) {
  return (
    <List data-slot="candidate-assessment-evidence" spacing="tight" marker="none" textSize="sm">
      {items.map((item, index) => (
        <ListItem key={index} layout="row" gap="sm" align="start">
          <Icon icon={Check} tone="success" align="start" />
          <Text as="span" variant="inherit" size="sm">{item}</Text>
        </ListItem>
      ))}
    </List>
  );
}

function CaveatList({ items }: { items: readonly ReactNode[] }) {
  return (
    <List data-slot="candidate-assessment-caveats" spacing="tight" marker="disc" textSize="sm" tone="muted">
      {items.map((item, index) => (
        <ListItem key={index}>{item}</ListItem>
      ))}
    </List>
  );
}

/** The host's slot when it gave one, else its items drawn as a list, else nothing. */
function sectionContent<T>(
  slot: ReactNode,
  items: readonly T[] | undefined,
  draw: (items: readonly T[]) => ReactNode,
): ReactNode {
  if (slot != null) return slot;
  return items && items.length > 0 ? draw(items) : null;
}

/**
 * Presentation-only assessment. Hosts own scoring, thresholds, and policy.
 *
 * Evidence, caveats and signals each take a slot or items. Items are drawn in
 * the package's own lists: evidence with a check mark on each point, caveats
 * as bullets, and signals through CandidateSummaryBullets with the host's
 * sentiment on each line. A section with neither is left out. The root is the
 * kit PanelSection, marked `data-slot="candidate-assessment"`; the evidence
 * and caveat lists are marked `candidate-assessment-evidence` and
 * `candidate-assessment-caveats`.
 */
export function CandidateAssessment({
  grade,
  facts = [],
  summary,
  evidence,
  evidenceItems,
  caveats,
  caveatItems,
  signals,
  signalItems,
  labels,
  padding = "default",
  ...props
}: CandidateAssessmentProps) {
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };
  const evidenceContent = sectionContent(evidence, evidenceItems, (items) => <EvidenceList items={items} />);
  const caveatContent = sectionContent(caveats, caveatItems, (items) => <CaveatList items={items} />);
  const signalContent = sectionContent(signals, signalItems, (items) => <CandidateSummaryBullets bullets={items} presentation="body" />);

  return (
    <PanelSection data-slot="candidate-assessment" padding={padding} {...props}>
      <Stack gap="lg">
        {grade}
        {facts.length > 0 ? (
          <DefinitionList>
            {facts.map((fact, index) => (
              <DefinitionItem key={index} label={fact.label}>
                {fact.value}
              </DefinitionItem>
            ))}
          </DefinitionList>
        ) : null}
        {summary != null ? (
          <AssessmentSection label={resolvedLabels.summary}>
            {summary}
          </AssessmentSection>
        ) : null}
        {evidenceContent != null ? (
          <AssessmentSection label={resolvedLabels.evidence}>
            {evidenceContent}
          </AssessmentSection>
        ) : null}
        {caveatContent != null ? (
          <AssessmentSection label={resolvedLabels.caveats}>
            {caveatContent}
          </AssessmentSection>
        ) : null}
        {signalContent != null ? (
          <AssessmentSection label={resolvedLabels.signals}>
            {signalContent}
          </AssessmentSection>
        ) : null}
      </Stack>
    </PanelSection>
  );
}
