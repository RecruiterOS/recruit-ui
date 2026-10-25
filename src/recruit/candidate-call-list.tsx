import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Phone } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";

export interface CandidateCallListProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  /** How many calls are linked. Zero shows the empty state instead of `children`. */
  count: number;
  /** A skeleton card in place of the list, and no count yet. */
  loading?: boolean;
  /** The section heading. */
  title?: ReactNode;
  /** The blank slate's wording. Defaults to "No calls yet". */
  empty?: CandidateEmptyCopy;
  /** The calls, usually CandidateCallCards. */
  children?: ReactNode;
}

/**
 * The calls linked to one person, as a counted section: a skeleton card
 * while they load, the host's call cards once they have, or the kit's empty
 * state when there are none. The root is the kit PanelSection, marked
 * `data-slot="candidate-call-list"`.
 */
export function CandidateCallList({
  count,
  loading = false,
  title = "Calls",
  empty = { title: "No calls yet" },
  children,
  ...props
}: CandidateCallListProps) {
  return (
    <PanelSection data-slot="candidate-call-list" {...props}>
      <SectionHeader label={title} count={loading ? undefined : count} />
      {loading ? (
        <Stack direction="vertical" gap="sm" marginTop="md">
          <Skeleton preset="card-sm" radius="xl" />
        </Stack>
      ) : count === 0 ? (
        <EmptyState
          variant="empty"
          size="inline"
          icon={Phone}
          title={empty.title}
          description={empty.description}
        />
      ) : (
        <Stack direction="vertical" gap="sm" marginTop="md">
          {children}
        </Stack>
      )}
    </PanelSection>
  );
}
