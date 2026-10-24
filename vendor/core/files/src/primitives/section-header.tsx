"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { CountBadge } from "./count-badge";

const sectionHeaderVariants = cva("flex items-center gap-1", {
  variants: {
    variant: {
      muted:
        "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
      plain: "text-sm font-medium text-foreground",
    },
    spacing: {
      tight: "mb-2",
      loose: "mb-3",
      none: "",
    },
  },
  defaultVariants: {
    variant: "muted",
    spacing: "tight",
  },
});

export interface SectionHeaderProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, "children">,
    VariantProps<typeof sectionHeaderVariants> {
  /** Pre-rendered icon node. Sized to match the header text. */
  icon?: ReactNode;
  /** Main label. */
  label: ReactNode;
  /** Optional count rendered after the label in a neutral count badge. */
  count?: number;
  /** Optional trailing slot for actions / chips. Pushed to the far right. */
  action?: ReactNode;
}

export const SectionHeader = forwardRef<HTMLHeadingElement, SectionHeaderProps>(
  function SectionHeader(
    { icon, label, count, action, variant, spacing, className, ...rest },
    ref
  ) {
    return (
      <h3
        ref={ref}
        className={cn(sectionHeaderVariants({ variant, spacing }), className)}
        {...rest}
      >
        {icon}
        <span>{label}</span>
        {typeof count === "number" && (
          <CountBadge value={count} variant="secondary" />
        )}
        {action && <span className="ml-auto">{action}</span>}
      </h3>
    );
  }
);
