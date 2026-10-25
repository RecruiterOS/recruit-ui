import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { HTMLAttributes, ReactNode } from "react";

/** One titled passage of evidence. */
export interface CandidateJobEvidenceEntry {
  /** The heading, such as "Why sourced for Staff Engineer". */
  title: ReactNode;
  /** The passage, kept as written: line breaks are preserved. */
  text: ReactNode;
}

/** A person's judgement of the candidate for the role. */
export interface CandidateJobEvidenceFeedback extends CandidateJobEvidenceEntry {
  /** Who gave it and when, already worded, under the passage. */
  byline?: ReactNode;
}

export interface CandidateJobEvidenceProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Why the person was put forward for the role. */
  sourced?: CandidateJobEvidenceEntry;
  /** A recruiter's feedback on the person for the role. */
  feedback?: CandidateJobEvidenceFeedback;
  /** The kit PanelSection's padding. */
  padding?: "none" | "compact" | "default";
  /** The kit PanelSection's divider. */
  border?: "none" | "top" | "bottom";
}

/**
 * The evidence attached to a person for one role, kept with that role: why
 * they were sourced for it, and a recruiter's feedback with its byline.
 * Render one per role so neither passage is mistaken for another role's.
 * With neither passage it renders nothing.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-job-evidence"`.
 */
export function CandidateJobEvidence({
  sourced,
  feedback,
  padding = "compact",
  border = "none",
  ...props
}: CandidateJobEvidenceProps) {
  if (!sourced && !feedback) return null;
  const byline = feedback?.byline;

  return (
    <PanelSection data-slot="candidate-job-evidence" padding={padding} border={border} {...props}>
      <Stack gap="sm">
        {sourced && (
          <Stack gap="xs">
            <Text size="sm" weight="semibold">{sourced.title}</Text>
            <Text size="sm" whitespace="pre-wrap">{sourced.text}</Text>
          </Stack>
        )}
        {feedback && (
          <Stack gap="xs">
            <Text size="sm" weight="semibold">{feedback.title}</Text>
            <Text size="sm" whitespace="pre-wrap">{feedback.text}</Text>
            {byline != null && byline !== false && byline !== "" && (
              <Text size="xs" tone="muted">{byline}</Text>
            )}
          </Stack>
        )}
      </Stack>
    </PanelSection>
  );
}
