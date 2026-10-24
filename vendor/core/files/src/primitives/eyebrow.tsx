"use client";

import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

/**
 * Eyebrow — small uppercase label that sits above a heading
 * or section ("GETTING STARTED", "QUICK FILTERS").
 *
 * Mono font, generous tracking, muted color. One canonical
 * treatment so every eyebrow matches.
 */
interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {
  /** Override the rendered tag. Defaults to <span>. */
  as?: ElementType;
  /** Prefix the label with a small accent dot (the brand kicker treatment). */
  dot?: boolean;
  display?: "inline" | "block";
  marginBottom?: "none" | "sm" | "md";
}

export const Eyebrow = forwardRef<HTMLSpanElement, EyebrowProps>(
  function Eyebrow({ as, className, dot, display = "inline", marginBottom = "none", children, ...props }, ref) {
    const Tag = (as ?? "span") as ElementType;
    return (
      <Tag
        ref={ref}
        className={cn(
          "font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground",
          dot && "inline-flex items-center",
          display === "block" && "block",
          marginBottom === "sm" && "mb-2",
          marginBottom === "md" && "mb-3",
          className,
        )}
        {...props}
      >
        {dot && (
          <span
            aria-hidden
            className="mr-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
          />
        )}
        {children}
      </Tag>
    );
  },
);
