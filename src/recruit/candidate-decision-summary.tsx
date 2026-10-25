import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Card } from "@epicbagel/saas-kit/primitives/card";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { StatusIconTile } from "@epicbagel/saas-kit/primitives/status-icon-tile";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Flag } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import type { CandidateGradeTone } from "./candidate-grade";

/** A recorded decision on the person for one role. */
export interface CandidateDecisionSummaryDecision {
  /** Whose decision it is, such as "Your decision". */
  heading: ReactNode;
  /** The verdict, such as "Yes". */
  verdict: ReactNode;
  /** Colours the flag tile and the verdict. */
  tone: "positive" | "negative";
  /** Where the decision left the person, such as their stage. */
  stage: ReactNode;
  /** Why, kept as written. */
  reason?: ReactNode;
}

/** An automated assessment of the person for the same role. */
export interface CandidateDecisionSummaryAssessment {
  /** The grade in the tile, such as "A". */
  letter: ReactNode;
  /** The tile's badge tone. */
  tone: CandidateGradeTone;
  /** The tile's tooltip. */
  title?: string;
  /** The row's eyebrow, such as "AI assessment". */
  heading: ReactNode;
  /** What the grade means, and anything still pending. */
  label: ReactNode;
}

export interface CandidateDecisionSummaryProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  decision?: CandidateDecisionSummaryDecision;
  assessment?: CandidateDecisionSummaryAssessment;
}

/**
 * The headline of a person's detail for the role in focus: the recorded
 * decision with a flag tile, and the assessment grade in a tile, in one card
 * on a muted band. Either row may be left out; with neither it renders
 * nothing. Unlike CandidateAssessment, which lays out a full write-up, this
 * is a two-line summary.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-decision-summary"`.
 */
export function CandidateDecisionSummary({
  decision,
  assessment,
  ...props
}: CandidateDecisionSummaryProps) {
  if (!decision && !assessment) return null;
  const positive = decision?.tone === "positive";
  const reason = decision?.reason;

  return (
    <PanelSection data-slot="candidate-decision-summary" border="bottom" surface="muted" {...props}>
      <Card overflow="hidden">
        {decision && (
          <Stack direction="horizontal" gap="sm" align="start" padding="compact">
            <StatusIconTile icon={Flag} tone={positive ? "success" : "destructive"} />
            <FlexItem minWidth="zero">
              <Text variant="eyebrow" weight="semibold">{decision.heading}</Text>
              <Stack direction="horizontal" gap="xs" marginTop="xs" align="baseline" textSize="sm">
                <Text variant="inherit" as="span" weight="semibold" tone={positive ? "success" : "destructive"}>
                  {decision.verdict}
                </Text>
                <Text variant="inherit" as="span" tone="muted">· {decision.stage}</Text>
              </Stack>
              {reason != null && reason !== false && reason !== "" && (
                <Text size="sm" tone="muted" marginTop="tight" whitespace="pre-wrap">{reason}</Text>
              )}
            </FlexItem>
          </Stack>
        )}

        {assessment && (
          <Stack
            direction="horizontal"
            gap="compact"
            align="start"
            paddingX="md"
            paddingY="section"
            border={decision ? "top" : "none"}
          >
            <Badge
              variant={assessment.tone}
              size="tile"
              shape="rounded"
              weight="bold"
              shrink
              marginTop="tight"
              title={assessment.title}
            >
              {assessment.letter}
            </Badge>
            <FlexItem minWidth="zero">
              <Text variant="eyebrow" weight="semibold">{assessment.heading}</Text>
              <Text size="sm" tone="muted" marginTop="tight">{assessment.label}</Text>
            </FlexItem>
          </Stack>
        )}
      </Card>
    </PanelSection>
  );
}
