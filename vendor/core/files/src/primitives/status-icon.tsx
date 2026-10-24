"use client";

import { CheckCircle2, Clock, Loader2, XCircle, type LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

export type StatusIconStatus = "completed" | "failed" | "cancelled" | "pending" | "running";

interface StatusIconConfig {
  Icon: LucideIcon;
  className: string;
}

const STATUS_CONFIG: Record<StatusIconStatus, StatusIconConfig> = {
  completed: { Icon: CheckCircle2, className: "text-green-600 dark:text-green-400" },
  failed: { Icon: XCircle, className: "text-red-600 dark:text-red-400" },
  cancelled: { Icon: XCircle, className: "text-muted-foreground" },
  pending: { Icon: Clock, className: "text-muted-foreground" },
  running: { Icon: Loader2, className: "text-primary animate-spin" },
};

export interface StatusIconProps {
  /**
   * Status of the operation. Falls back to the `running` glyph when the
   * value is unknown, since unknown ≈ in-flight is the safer default for
   * activity feeds.
   */
  status: string;
  /** Override the icon mapping if a domain needs a different visual. */
  iconMap?: Partial<Record<StatusIconStatus, LucideIcon>>;
  className?: string;
}

export function StatusIcon({ status, iconMap, className }: StatusIconProps) {
  const key: StatusIconStatus =
    status === "completed" || status === "failed" || status === "cancelled" || status === "pending"
      ? status
      : "running";
  const config = STATUS_CONFIG[key];
  const Icon = iconMap?.[key] ?? config.Icon;
  return (
    <Icon
      className={cn("h-4 w-4 shrink-0 mt-0.5", config.className, className)}
      aria-hidden
    />
  );
}
