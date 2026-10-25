import { AgentComment } from "@epicbagel/saas-kit/primitives/agent-comment";
import { Callout } from "@epicbagel/saas-kit/primitives/callout";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { HTMLAttributes, ReactNode } from "react";

/** An assistant reacting to the note. */
export interface CandidatePendingNoteAgent {
  /** The assistant's display name. */
  name: string;
  /** Shows the assistant still working, in place of a message. */
  thinking?: boolean;
  /** What the assistant made of the note. */
  message?: ReactNode;
}

export interface CandidatePendingNoteProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The note as it was just written or dictated. */
  text: ReactNode;
  /** When it was left, already worded, such as "just now". */
  timeLabel: ReactNode;
  agent?: CandidatePendingNoteAgent;
}

/**
 * A note the person has just left on a candidate, shown on the card before
 * the host's records catch up, with an optional assistant comment under it.
 *
 * The note is quoted in a warning-toned callout so it reads as fresh. The
 * host owns saving the note and the assistant's reply. The root is marked
 * `data-slot="candidate-pending-note"`.
 */
export function CandidatePendingNote({
  text,
  timeLabel,
  agent,
  ...props
}: CandidatePendingNoteProps) {
  return (
    <Stack
      data-slot="candidate-pending-note"
      direction="vertical"
      gap="xs"
      padding="card-footer"
      {...props}
    >
      <Callout tone="warning" padding="compact">
        <Text size="sm" italic tone="warning">
          &ldquo;{text}&rdquo;
          <Text variant="inherit" as="span" size="xs" italic={false} marginStart="sm">— {timeLabel}</Text>
        </Text>
      </Callout>
      {agent?.thinking ? (
        <AgentComment agent={agent.name} thinking>{""}</AgentComment>
      ) : agent?.message != null && agent.message !== false && agent.message !== "" ? (
        <AgentComment agent={agent.name}>{agent.message}</AgentComment>
      ) : null}
    </Stack>
  );
}
