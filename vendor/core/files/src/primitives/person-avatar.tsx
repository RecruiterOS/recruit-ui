"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "../lib/utils";

/**
 * "Ada Lovelace" → "AL", "acme" → "AC". Two characters, first and last word.
 *
 * Exported so every surface that shows a person derives initials the same
 * way, including for empty names and single words.
 */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0];
  if (!first) return "?";
  const last = words[words.length - 1];
  if (words.length === 1 || !last) return first.slice(0, 2).toUpperCase();
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}

export interface PersonAvatarProps {
  name: string;
  /** Real photo, when one exists. */
  photoUrl?: string | null;
  /**
   * Pixel size. Omit it to size with `className` instead — an inline style
   * would beat a utility class, so this is only applied when given.
   */
  size?: number;
  className?: string;
  /** Class for the initials fallback — e.g. a smaller type scale. */
  fallbackClassName?: string;
  fallbackSize?: "default" | "xl";
}

/**
 * A person's avatar: their photo if we have one, their initials if we don't.
 *
 * Deliberately no synthetic-avatar service and no generated colour tile: a
 * coloured tile masks a missing photo by pretending to be one, while plain
 * initials make a missing photo obvious.
 */
export function PersonAvatar({
  name,
  photoUrl,
  size,
  className,
  fallbackClassName,
  fallbackSize = "default",
}: PersonAvatarProps) {
  return (
    <Avatar
      className={cn("shrink-0 overflow-hidden rounded-full bg-muted", className)}
      style={size != null ? { width: size, height: size } : undefined}
    >
      {photoUrl ? (
        <AvatarImage
          src={photoUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : null}
      <AvatarFallback
        className={cn("h-full w-full font-medium", fallbackSize === "default" ? "text-xs" : "text-xl", fallbackClassName)}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
