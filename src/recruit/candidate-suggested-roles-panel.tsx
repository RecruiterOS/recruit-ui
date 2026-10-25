import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { BriefcaseBusiness } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";

export interface CandidateSuggestedRolesPanelProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** How many roles are suggested. Zero shows the empty state instead of `children`. */
  count: number;
  /** The section heading. */
  title?: ReactNode;
  /** A muted line under the heading explaining where the suggestions come from. */
  description?: ReactNode;
  /** The blank slate's wording. Defaults to "No suggested roles yet". */
  empty?: CandidateEmptyCopy;
  /** The suggestions, usually a CandidateRoleMatchList. */
  children?: ReactNode;
}

/**
 * A counted section for the roles suggested for one person: the heading and
 * count, a line on where the suggestions come from, then the host's list, or
 * the kit's empty state when there are none. The root is the kit
 * PanelSection, marked `data-slot="candidate-suggested-roles-panel"`.
 */
export function CandidateSuggestedRolesPanel({
  count,
  title = "Suggested roles",
  description,
  empty = { title: "No suggested roles yet" },
  children,
  ...props
}: CandidateSuggestedRolesPanelProps) {
  return (
    <PanelSection data-slot="candidate-suggested-roles-panel" {...props}>
      <SectionHeader label={title} count={count} />
      {description != null && description !== false && (
        <Text size="sm" tone="muted" marginBottom="md">{description}</Text>
      )}
      {count > 0 ? children : (
        <EmptyState
          variant="empty"
          size="inline"
          icon={BriefcaseBusiness}
          title={empty.title}
          description={empty.description}
        />
      )}
    </PanelSection>
  );
}
