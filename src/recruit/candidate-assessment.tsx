import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { HTMLAttributes, ReactNode } from "react";

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
  evidence?: ReactNode;
  caveats?: ReactNode;
  signals?: ReactNode;
  labels?: Partial<CandidateAssessmentLabels>;
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

/** Presentation-only assessment. Hosts own scoring, thresholds, and policy. */
export function CandidateAssessment({
  grade,
  facts = [],
  summary,
  evidence,
  caveats,
  signals,
  labels,
  ...props
}: CandidateAssessmentProps) {
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };

  return (
    <PanelSection data-slot="candidate-assessment" {...props}>
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
        {evidence != null ? (
          <AssessmentSection label={resolvedLabels.evidence}>
            {evidence}
          </AssessmentSection>
        ) : null}
        {caveats != null ? (
          <AssessmentSection label={resolvedLabels.caveats}>
            {caveats}
          </AssessmentSection>
        ) : null}
        {signals != null ? (
          <AssessmentSection label={resolvedLabels.signals}>
            {signals}
          </AssessmentSection>
        ) : null}
      </Stack>
    </PanelSection>
  );
}
