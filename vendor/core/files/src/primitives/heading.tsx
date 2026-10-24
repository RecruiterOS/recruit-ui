"use client";

import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

/**
 * Heading — semantic + visual page hierarchy primitive.
 *
 * One canonical scale for every page. Consumers render
 * <Heading level={N}> instead of typing
 * `<h1 className="text-3xl font-semibold tracking-tight">` ad hoc.
 *
 * `level` controls BOTH the rendered tag (h1..h6) and the visual
 * style. The styles are deliberately fixed — divergence in
 * "what does a section title look like" is what we're fixing.
 * Override with the `as` prop if you need the visual style on a
 * different tag (e.g. a card title that's a `<div>` semantically).
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  appearance?: "default" | "compact" | "compact-strong" | "eyebrow" | "section";
  spacing?: "none" | "section" | "after-xs" | "after" | "after-lg";
  truncate?: boolean;
  /** Override the rendered tag while keeping the level's visual style. */
  as?: ElementType;
}

const levelStyles: Record<HeadingLevel, string> = {
  // Page title (e.g. "Candidates", "Settings"). One per page.
  1: "text-2xl md:text-3xl font-semibold tracking-tight leading-tight",
  // Section title within a page.
  2: "text-xl md:text-2xl font-semibold tracking-tight leading-tight",
  // Card title.
  3: "text-lg font-semibold leading-snug",
  // Subsection / minor heading.
  4: "text-base font-semibold leading-snug",
  // Inline emphasis heading.
  5: "text-sm font-semibold leading-snug",
  // Eyebrow-style heading (uppercase, tracked). For all-caps labels
  // above a heading, prefer the dedicated <Eyebrow> primitive.
  6: "text-xs font-semibold uppercase tracking-[0.12em] leading-snug",
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ level = 1, appearance = "default", spacing = "none", truncate = false, as, className, ...props }, ref) {
    const Tag = (as ?? (`h${level}` as ElementType));
    return (
      <Tag
        ref={ref}
        className={cn(
          appearance === "default" && levelStyles[level],
          appearance === "compact" && "text-sm font-medium leading-snug",
          appearance === "compact-strong" && "text-sm font-semibold leading-snug",
          appearance === "eyebrow" && "text-xs font-semibold uppercase tracking-[0.12em] leading-snug text-muted-foreground",
          appearance === "section" && "text-lg font-semibold leading-snug",
          spacing === "section" && "mt-8 mb-2",
          spacing === "after-xs" && "mb-1",
          spacing === "after" && "mb-2",
          spacing === "after-lg" && "mb-8",
          truncate && "truncate",
          className,
        )}
        {...props}
      />
    );
  },
);
