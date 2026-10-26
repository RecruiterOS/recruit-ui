import { Card } from "@epicbagel/saas-kit/primitives/card";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { RichText } from "@epicbagel/saas-kit/primitives/rich-text";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { HTMLAttributes, ReactNode } from "react";

export interface CandidateShortlistNoteProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  /** Who the note is from, such as "A note from Jordan". It is the note's heading. */
  title: ReactNode;
  /**
   * The title's heading level: 2 (the default) for a note under the page's
   * own h1, or 3 or 4 where it sits deeper in the page's outline. Only the
   * tag changes: the title looks the same at every level.
   */
  titleLevel?: 2 | 3 | 4;
  /** The sender's face, usually a PersonAvatar. 44px reads best. */
  avatar?: ReactNode;
  /** A line under the title, such as the sender's role and firm. */
  meta?: ReactNode;
  /**
   * The note itself, set as rich text. Pass paragraphs, or Markdown the host
   * has already rendered (and sanitised): the note parses nothing.
   */
  message?: ReactNode;
  /** Under the message, such as an embedded video from the sender. */
  media?: ReactNode;
  /** A sign-off on the note's last line, such as "— Jordan". */
  signature?: ReactNode;
  /** Beside the sign-off, such as a link to book a call with the sender. */
  action?: ReactNode;
}

/**
 * A personal note from the person presenting a shortlist, set above it: the
 * sender's face, a title such as "A note from Jordan" and their role, then the
 * message, an optional media slot such as a video, and a last line with a
 * sign-off and an action, such as a link to book a call. Every value is a
 * slot, so the host decides what the note says and where its links go.
 *
 * The root is the kit's Card, which keeps its own `data-slot`. The title is a
 * kit Heading at `titleLevel`, an h2 unless the host says otherwise, so the
 * note never adds a second h1 to the page it sits on. A line holding neither
 * a `signature` nor an `action` isn't drawn.
 */
export function CandidateShortlistNote({
  title,
  titleLevel = 2,
  avatar,
  meta,
  message,
  media,
  signature,
  action,
  ...props
}: CandidateShortlistNoteProps) {
  const hasAvatar = avatar != null && avatar !== false;
  const hasMeta = meta != null && meta !== false && meta !== "";
  const hasSignature = signature != null && signature !== false && signature !== "";
  const hasAction = action != null && action !== false;

  return (
    <Card padding="md" {...props}>
      <Stack gap="md">
        <Stack direction="horizontal" gap="md" align="start">
          {hasAvatar ? <FlexItem shrink={false}>{avatar}</FlexItem> : null}
          <FlexItem grow minWidth="zero">
            {/* The level-2 look at every level. Restating its size drops the
                level's leading-tight (a font size resets the line height), so
                the title keeps its size's own line height, as the kit's
                ContactHeader set it. */}
            <Heading level={2} as={`h${titleLevel}`} className="text-xl md:text-2xl">
              {title}
            </Heading>
            {/* 6px above and between: half a step off the Stack scale. */}
            {hasMeta ? (
              <Stack direction="horizontal" align="center" wrap className="mt-1.5 gap-1.5">
                {meta}
              </Stack>
            ) : null}
          </FlexItem>
        </Stack>
        {message != null && message !== false && message !== "" ? <RichText>{message}</RichText> : null}
        {media}
        {hasSignature || hasAction ? (
          <Stack direction="horizontal" gap="md" align="center" wrap>
            {hasSignature ? <Text variant="caption">{signature}</Text> : null}
            {action}
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );
}
