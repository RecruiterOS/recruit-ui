"use client";

import { Anchor } from "@epicbagel/saas-kit/primitives/anchor";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Eye } from "lucide-react";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

export interface CandidateSharedProfileButtonProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "title" | "target"> {
  /** The page the recipient sees. The host resolves it; this never creates a share. */
  href: string;
  /** Tooltip and accessible name, such as "Preview Rafael Quintero's shared profile". */
  label: string;
  size?: "default" | "compact";
}

/**
 * An icon link that previews the profile page a candidate was shared on, in a
 * new tab. The click never reaches a surrounding candidate card. The root is
 * the kit Button rendered as a link, and keeps the kit's own
 * `data-slot="button"`, which theme stylesheets select on.
 */
export function CandidateSharedProfileButton({
  href,
  label,
  size = "default",
  onClick,
  ...props
}: CandidateSharedProfileButtonProps) {
  return (
    <Button asChild variant="ghost" size={size === "compact" ? "icon-xs" : "icon-sm"} shrink>
      <Anchor
        href={href}
        target="_blank"
        rel="noreferrer"
        title={label}
        aria-label={label}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          event.stopPropagation();
          onClick?.(event);
        }}
        {...props}
      >
        <Icon icon={Eye} size={size === "compact" ? "sm" : "md"} />
      </Anchor>
    </Button>
  );
}
