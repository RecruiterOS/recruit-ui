import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { HTMLAttributes, ReactNode } from "react";

export interface JobClientBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The organisation the job is for, as the host names it. */
  name: ReactNode;
  /**
   * Tooltip. Defaults to the name when the name is plain text; pass your own
   * wording, such as "Client: …".
   */
  title?: string;
}

/**
 * The organisation a job is for: a quiet secondary badge with the name on one
 * line. It names an organisation, not a contact person. The root is the kit
 * Badge and keeps the kit's own `data-slot="badge"`, which theme stylesheets
 * select on.
 */
export function JobClientBadge({ name, title, ...props }: JobClientBadgeProps) {
  return (
    <Badge
      as="span"
      variant="secondary"
      title={title ?? (typeof name === "string" ? name : undefined)}
      {...props}
    >
      <Text as="span" variant="inherit" truncate minWidth="zero">
        {name}
      </Text>
    </Badge>
  );
}
