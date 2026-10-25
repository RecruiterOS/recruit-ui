"use client";

import { Anchor } from "@epicbagel/saas-kit/primitives/anchor";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import type { AnchorHTMLAttributes, ElementType, MouseEvent, ReactNode } from "react";

export interface CandidateProfileLinkButtonProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "title" | "target"> {
  /** Where the profile lives. The host resolves it, including any search fallback. */
  href: string;
  /** Tooltip and accessible name, worded by the host. */
  title: string;
  /** The glyph for the profile's network or source, as a component reference. */
  icon: ElementType;
  /** Icon-only size. */
  size?: "default" | "lg";
  /** An icon-only ghost button, or an outline button with a visible label. */
  presentation?: "icon" | "button";
  /** Visible label for `presentation="button"`. */
  buttonLabel?: ReactNode;
  /** Icon colour: `disabled` mutes it, for example when the host has no exact profile. */
  iconTone?: "info" | "disabled";
}

/**
 * Opens a candidate's external profile in a new tab.
 *
 * The icon form stops the click from reaching a surrounding candidate card.
 * Recruit UI ships no network glyph or URL scheme: the host passes both. The
 * root is the kit Button rendered as a link, and keeps the kit's own
 * `data-slot="button"`, which theme stylesheets select on.
 */
export function CandidateProfileLinkButton({
  href,
  title,
  icon,
  size = "default",
  presentation = "icon",
  buttonLabel = "Open profile",
  iconTone = "info",
  onClick,
  ...props
}: CandidateProfileLinkButtonProps) {
  if (presentation === "button") {
    return (
      <Button asChild variant="outline" size="sm" shrink>
        <Anchor href={href} target="_blank" rel="noreferrer" title={title} onClick={onClick} {...props}>
          <Icon icon={icon} size="md" tone={iconTone} /> {buttonLabel}
        </Anchor>
      </Button>
    );
  }

  return (
    <Button asChild variant="ghost" size={size === "lg" ? "icon-md" : "icon-sm"} shrink>
      <Anchor
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          event.stopPropagation();
          onClick?.(event);
        }}
        title={title}
        {...props}
      >
        <Icon icon={icon} size={size === "lg" ? "lg" : "md"} tone={iconTone} />
      </Anchor>
    </Button>
  );
}
