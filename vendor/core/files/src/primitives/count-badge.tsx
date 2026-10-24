"use client";

import { cn } from "../lib/utils";
import { Badge, type BadgeProps } from "./badge";

export interface CountBadgeProps
  extends Omit<BadgeProps, "as" | "children" | "size" | "shrink"> {
  /** Theme colour. Defaults to destructive; use secondary for neutral totals. */
  variant?: BadgeProps["variant"];
  /** Number or compact count label, for example `12`, `9+`, or `…`. */
  value: number | string;
}

/**
 * Compact numeric status badge with stable geometry.
 *
 * A single character is a true 20px circle. Longer values grow horizontally
 * while retaining a 20px height, centred text, and tabular numerals.
 */
function CountBadge({
  value,
  variant = "destructive",
  className,
  ...props
}: CountBadgeProps) {
  const isSingleCharacter = String(value).trim().length === 1;

  return (
    <Badge
      as="span"
      data-count-badge=""
      variant={variant}
      size="counter"
      shrink
      className={cn(
        "self-center py-0 text-center leading-none tracking-normal tabular-nums",
        isSingleCharacter ? "w-5 px-0" : "px-1.5",
        className,
      )}
      {...props}
    >
      {value}
    </Badge>
  );
}

export { CountBadge };
