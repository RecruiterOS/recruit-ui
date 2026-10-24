"use client";

import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** Equal column count. Pass null when supplying a bespoke template via className. */
  columns?: 1 | 2 | 3 | 4 | null;
  gap?: "sm" | "compact" | "md" | "lg";
  responsive?: boolean;
  layout?: "grid" | "responsive-actions";
  maxWidth?: "none" | "xl";
  centered?: boolean;
  template?: "equal" | "compact-leading-three" | "responsive-form-row-six" | "master-detail" | "gallery";
  as?: ElementType;
}

const fixedColumns = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const;

const responsiveColumns = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

const gaps = { sm: "gap-2", compact: "gap-3", md: "gap-4", lg: "gap-6" } as const;

/** Canonical equal-column grid with optional responsive collapse. */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  { columns = 2, gap = "md", responsive = true, layout = "grid", maxWidth = "none", centered = false, template = "equal", as, className, ...props },
  ref,
) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      ref={ref}
      className={cn(
        layout === "grid" ? "grid" : "grid sm:flex sm:justify-end",
        layout === "grid" && template === "equal" && columns !== null && (responsive ? responsiveColumns[columns] : fixedColumns[columns]),
        layout === "responsive-actions" && columns !== null && fixedColumns[columns],
        template === "compact-leading-three" && "grid-cols-[5rem_1fr_1fr]",
        template === "responsive-form-row-six" && "grid-cols-1 items-center sm:grid-cols-[1fr_1.4fr_1fr_1fr_1fr_auto]",
        template === "master-detail" && "grid-cols-1 lg:grid-cols-[360px_1fr]",
        template === "gallery" && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        gaps[gap],
        maxWidth === "xl" && "max-w-2xl",
        centered && "mx-auto",
        className,
      )}
      {...props}
    />
  );
});
