"use client";

import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { StatusIcon } from "./status-icon";

export interface TimelineProps {
  children: ReactNode;
  /** Vertical spacing between rows. Defaults to `space-y-2`. */
  spacing?: "tight" | "normal" | "loose";
  className?: string;
}

export function Timeline({ children, spacing = "normal", className }: TimelineProps) {
  const spacingClass =
    spacing === "tight" ? "space-y-1" : spacing === "loose" ? "space-y-3" : "space-y-2";
  return <div className={cn(spacingClass, className)}>{children}</div>;
}

export interface TimelineMarkerProps extends HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  placement?: "inline" | "guide";
  tone?: "neutral" | "info" | "success" | "accent" | "destructive";
}

/** Small current/past marker for timeline lists, including guide-line layouts. */
export const TimelineMarker = forwardRef<HTMLSpanElement, TimelineMarkerProps>(
  function TimelineMarker({ active = false, placement = "inline", tone = "neutral", className, ...props }, ref) {
    return (
      <span
        ref={ref}
        aria-hidden
        className={cn(
          "block h-2 w-2 shrink-0 rounded-full",
          placement === "guide" && "absolute left-[-21px] top-1.5",
          active && "ring-2 ring-emerald-500/30",
          tone === "neutral" && (active ? "bg-emerald-500" : "bg-muted-foreground/40"),
          tone === "info" && "bg-sky-500",
          tone === "success" && "bg-emerald-500",
          tone === "accent" && "bg-violet-500",
          tone === "destructive" && "bg-red-500",
          className,
        )}
        {...props}
      />
    );
  },
);

export interface TimelineRowProps {
  /**
   * Status drives the leading icon via `<StatusIcon>`. Pass `icon` to
   * override entirely.
   */
  status?: string;
  /** Override the leading visual. */
  icon?: ReactNode;
  /** Primary line (title or headline). */
  title: ReactNode;
  /** Optional secondary line (subtitle, meta, kind). */
  subtitle?: ReactNode;
  /** Right-aligned timestamp. */
  timestamp?: ReactNode;
  /** Optional error message rendered below the body in destructive tone. */
  error?: ReactNode;
  /**
   * Extra content below the body, rendered inside the text column so it
   * aligns under the title rather than beside the icon. Use for
   * expandable detail, inline actions, a nested list.
   */
  children?: ReactNode;
  /** Add hover styling and pointer cursor for clickable rows. */
  interactive?: boolean;
  /** Render as a different element — `a`, `button`, etc. Defaults to `div`. */
  as?: ElementType;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  /** Pass-through for anchor href when `as="a"`. */
  href?: string;
  surface?: "muted" | "transparent";
  radius?: "md" | "none";
}

export const TimelineRow = forwardRef<HTMLElement, TimelineRowProps>(function TimelineRow(
  {
    status,
    icon,
    title,
    subtitle,
    timestamp,
    error,
    children,
    interactive,
    as,
    className,
    surface = "muted",
    radius = "md",
    ...rest
  },
  ref
) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        "flex items-start gap-2 p-2",
        radius === "md" && "rounded-md",
        surface === "muted" && "bg-muted/50",
        interactive && "transition-colors hover:bg-accent/50 cursor-pointer",
        className
      )}
      {...rest}
    >
      {icon ?? (status != null && <StatusIcon status={status} />)}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium truncate">{title}</p>
          {timestamp != null && (
            <span className="text-xs text-muted-foreground shrink-0">{timestamp}</span>
          )}
        </div>
        {subtitle != null && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
        {error != null && (
          <p
            className="text-xs text-destructive mt-1 line-clamp-2"
            title={typeof error === "string" ? error : undefined}
          >
            {error}
          </p>
        )}
        {children}
      </div>
    </Component>
  );
});
