"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import type { ButtonHTMLAttributes, ElementType, HTMLAttributes, MouseEvent, ReactNode } from "react";

export interface CandidateHeaderActionsProps extends HTMLAttributes<HTMLElement> {
  /** The controls, in order: usually icon actions and link buttons. */
  children: ReactNode;
}

/**
 * The cluster of quiet controls in a candidate card's header: favourite,
 * email, note, profile links. Pass it as `CandidateReviewCard`'s
 * `headerActions`.
 *
 * It wraps when the header is narrow and sits flush with the card's edge.
 * The root is marked `data-slot="candidate-header-actions"`.
 */
export function CandidateHeaderActions({ children, ...props }: CandidateHeaderActionsProps) {
  return (
    <Stack
      data-slot="candidate-header-actions"
      direction="horizontal"
      gap="lg"
      align="center"
      justify="end"
      wrap
      shrink={false}
      marginEnd="negative-xs"
      {...props}
    >
      {children}
    </Stack>
  );
}

export interface CandidateIconActionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "title"> {
  /** The glyph, as a component such as a lucide icon. */
  icon: ElementType;
  /** The tooltip and accessible name, such as "Email Mei Tanaka". */
  title: string;
}

/**
 * A quiet icon-only button for a candidate card's header, such as email or
 * leave a note.
 *
 * The click never reaches a surrounding card. The root is the kit Button and
 * keeps the kit's own `data-slot="button"`, which theme stylesheets select on.
 */
export function CandidateIconAction({ icon, title, onClick, ...props }: CandidateIconActionProps) {
  return (
    <Button
      size="icon-sm"
      variant="quiet"
      title={title}
      {...props}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onClick?.(event);
      }}
    >
      <Icon icon={icon} size="md" />
    </Button>
  );
}
