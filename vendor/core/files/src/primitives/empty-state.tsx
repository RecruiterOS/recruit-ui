"use client";

import { isValidElement, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { CheckCircle2, type LucideIcon } from "lucide-react";
import { Button } from "./button";

export interface EmptyStateProps {
  /** Visual variant for different scenarios */
  variant?: "select" | "search" | "empty" | "error" | "success";
  /**
   * Icon to display. Accepts either a Lucide component reference
   * (`Inbox`) or an already-instantiated React element (`<Inbox />`).
   *
   * **Pass an element when calling from a server component** — Component
   * references can't cross the server→client boundary, but elements can.
   */
  icon?: LucideIcon | ReactNode;
  /** Canonical motion for loading or in-progress blank slates. */
  iconMotion?: "none" | "spin" | "pulse";
  /** Main heading text */
  title?: string;
  /** Supporting description text */
  description?: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  /** Entity type for auto-generated title (e.g., "note", "file") */
  entityType?: string;
  /** Enable gentle animations */
  animated?: boolean;
  /**
   * Placement density. `inline` is for an empty subsection inside an otherwise
   * populated surface; the other sizes are centred panel/page blank slates.
   */
  size?: "inline" | "sm" | "md" | "lg";
  /** Optional rich starter content, rendered below the canonical heading. */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Show decorative background gradient */
  showGradient?: boolean;
  /**
   * Visual containment for the blank slate. `subtle` is the default so an
   * empty area reads as an intentional product surface instead of floating
   * copy; use `plain` only when an existing parent already owns the surface.
   */
  surface?: "plain" | "subtle";
  minHeight?: "none" | "viewport";
  paddingY?: "none" | "lg" | "xl";
}

export function EmptyState({
  variant = "select",
  icon: Icon,
  iconMotion = "none",
  title,
  description,
  action,
  entityType,
  animated = true,
  size = "md",
  children,
  className,
  showGradient = false,
  surface = "subtle",
  minHeight = "none",
  paddingY = "none",
}: EmptyStateProps) {
  const autoTitle = () => {
    if (title) return title;

    switch (variant) {
      case "select":
        return entityType
          ? `Select ${getArticle(entityType)} ${entityType} to view details`
          : "Select an item to view details";
      case "search":
        return "No results found";
      case "empty":
        return entityType ? `No ${entityType}s yet` : "Nothing here yet";
      case "error":
        return "Something went wrong";
      case "success":
        return "All done";
      default:
        return "Empty";
    }
  };

  const autoDescription = () => {
    if (description !== undefined) return description;

    switch (variant) {
      case "search":
        return "Try adjusting your filters or search terms";
      case "empty":
        return "Get started by creating your first item";
      case "error":
        return "Please try again or contact support if the problem persists";
      default:
        return undefined;
    }
  };

  const sizeConfig = {
    inline: {
      icon: "h-5 w-5",
      iconWrapper: "",
      title: "text-sm",
      description: "text-xs",
      spacing: "gap-1",
      padding: "py-6",
      content: "max-w-lg",
    },
    sm: {
      icon: "h-8 w-8",
      iconWrapper: "mb-3",
      title: "text-base",
      description: "text-xs",
      spacing: "space-y-2",
      padding: "py-6",
      content: "max-w-md",
    },
    md: {
      icon: "h-10 w-10",
      iconWrapper: "mb-4",
      title: "text-lg",
      description: "text-sm",
      spacing: "space-y-3",
      padding: "py-10",
      content: "max-w-md",
    },
    lg: {
      icon: "h-12 w-12",
      iconWrapper: "mb-6",
      title: "text-xl",
      description: "text-base",
      spacing: "space-y-4",
      padding: "py-12",
      content: "max-w-3xl",
    },
  };

  const config = sizeConfig[size];
  const finalTitle = autoTitle();
  const finalDescription = autoDescription();
  // The success variant defaults to a positive check icon when none is supplied.
  const displayIcon = Icon ?? (variant === "success" ? CheckCircle2 : undefined);

  return (
    <div
      data-slot="empty-state"
      data-surface={surface}
      role={variant === "error" ? "alert" : undefined}
      className={cn(
        "relative flex w-full items-center justify-center",
        surface === "subtle" && "overflow-hidden rounded-lg border border-border bg-muted/20",
        size === "inline" ? "h-auto" : "h-full",
        paddingY === "none" && config.padding,
        minHeight === "viewport" && "min-h-[40vh]",
        paddingY === "xl" && "py-12",
        paddingY === "lg" && "py-10",
        className
      )}
    >
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/5 via-transparent to-muted/5 pointer-events-none" />
      )}

      <div
        data-slot="empty-state-content"
        className={cn(
          "relative flex w-full flex-col items-center justify-center px-6 sm:px-8",
          config.content,
          animated && "animate-in fade-in-50 duration-500"
        )}
      >
        <div
          data-slot="empty-state-message"
          className={cn(
            "flex items-center justify-center",
            size === "inline" && displayIcon
              ? "flex-row gap-5 text-left"
              : cn("flex-col text-center", config.spacing),
          )}
        >
          {displayIcon && (
            <div className={cn("relative shrink-0", config.iconWrapper)}>
              {isValidElement(displayIcon) ? (
                displayIcon
              ) : (
                (() => {
                  const IconComp = displayIcon as LucideIcon;
                  return (
                    <IconComp
                      className={cn(
                        config.icon,
                        variant === "success" ? "text-emerald-500" : "text-muted-foreground",
                        iconMotion === "spin" && "animate-spin",
                        iconMotion === "pulse" && "animate-pulse",
                        animated &&
                          "animate-in zoom-in-95 duration-700 delay-150",
                      )}
                      strokeWidth={1.5}
                    />
                  );
                })()
              )}
              <div
                className={cn(
                  "absolute inset-0 blur-xl opacity-20 pointer-events-none",
                  showGradient && "bg-primary/10"
                )}
              />
            </div>
          )}

          <div className={cn("flex min-w-0 flex-col", size === "inline" ? "gap-1" : "contents")}>
            <h3
              className={cn(
                config.title,
                size === "inline"
                  ? "font-medium text-foreground"
                  : "font-semibold text-foreground/80 tracking-tight",
              )}
            >
              {finalTitle}
            </h3>

            {finalDescription && (
              <p
                className={cn(
                  config.description,
                  "text-muted-foreground max-w-sm leading-relaxed"
                )}
              >
                {finalDescription}
              </p>
            )}
          </div>
        </div>

        {action && (
          <div className="mt-2">
            <Button
              type="button"
              variant={action.variant || "outline"}
              onClick={action.onClick}
              className={cn(
                "shadow-xs",
                animated && "animate-in slide-in-from-bottom-2 duration-500 delay-300"
              )}
            >
              {action.label}
            </Button>
          </div>
        )}

        {children && (
          <div className="mt-3 w-full text-left">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

function getArticle(word: string): string {
  if (!word || word.length === 0) return 'a';
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const firstChar = word[0];
  if (!firstChar) return 'a';
  return vowels.includes(firstChar.toLowerCase()) ? 'an' : 'a';
}
