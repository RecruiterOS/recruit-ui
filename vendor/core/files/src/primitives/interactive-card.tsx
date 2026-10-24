"use client";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type KeyboardEvent,
} from "react";
import { cn } from "../lib/utils";

export interface InteractiveCardVariants {
  /** Currently chosen — the card the detail pane is showing. */
  selected?: boolean;
  /**
   * @deprecated Interactive cards now have one universal border-only treatment.
   * Retained as a no-op so existing call sites keep compiling.
   */
  flat?: boolean;
  /** Clip child media/content to the card's rounded boundary. */
  clip?: boolean;
  /**
   * Spacing is semantic so product-required breathing room survives refactors.
   * `comfortable` is for identity/detail rows such as candidate summaries.
   */
  padding?: "none" | "compact" | "row" | "comfortable" | "roomy";
  radius?: "none" | "lg" | "xl";
  joined?: "none" | "top";
  border?: "default" | "none";
  /** Keep the standard treatment or use a quieter 1px border for nested rows. */
  borderWidth?: "default" | "thin";
  display?: "inline" | "block";
  textSize?: "inherit" | "sm";
  opacity?: "full" | "subdued";
  /** Theme-token surface. Subtle adds quiet grouping without changing interaction states. */
  surface?: "card" | "subtle";
  /**
   * @deprecated Interactive cards no longer render a leading accent bar.
   * Retained as a no-op so existing call sites keep compiling.
   */
  indicator?: "bar" | "none";
}

/**
 * The hover treatment for any card you can click.
 *
 * Exported as a class recipe as well as a component so other card primitives
 * can adopt exactly the same states without being restructured.
 * Two competing hover treatments in one kit is how a design system starts
 * drifting.
 *
 * The card owns a stable border, so hover and focus can strengthen its colour
 * without moving the content. It defaults to 2px; nested rows can request the
 * 1px `thin` treatment. It has no accent bar, shadow or lift.
 * Consumers can opt into one quiet token-based surface tint when a dense list
 * needs stronger structure without inventing product-specific colours.
 *
 * Focus-visible gets the same treatment as hover, so keyboard navigation is
 * not a second-class way to move through a list. Tailwind v4 scopes `hover:`
 * to devices that actually hover, so a tap on a phone doesn't leave a card
 * stuck looking active.
 */
export function interactiveCardClass({
  selected,
  surface = "card",
  borderWidth = "default",
}: InteractiveCardVariants = {}): string {
  return cn(
    "group relative w-full rounded-xl text-left",
    borderWidth === "thin" ? "border" : "border-2",
    surface === "subtle" ? "bg-muted/20" : "bg-card",
    "transition-colors duration-150",
    "hover:border-foreground/40",
    "focus-visible:outline-hidden focus-visible:border-foreground/40",
    "focus-visible:ring-2 focus-visible:ring-ring",
    selected ? "border-primary" : "border-border",
  );
}

export type InteractiveCardProps<T extends ElementType = "button"> =
  InteractiveCardVariants & {
    /** Defaults to `button`. Use `a` for a real navigation target. */
    as?: T;
  } & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * A clickable list card wearing `interactiveCardClass`.
 *
 * Defaults to a `<button>` because most of these select something rather than
 * navigate; pass `as="a"` (or a router link) when the card really is a link,
 * so it can be middle-clicked and opened in a new tab.
 */
export const InteractiveCard = forwardRef<HTMLElement, InteractiveCardProps<ElementType>>(
  function InteractiveCard(
    { as, selected, flat, clip, padding = "none", radius = "xl", joined = "none", border = "default", borderWidth = "default", display = "inline", textSize = "inherit", opacity = "full", surface = "card", indicator = "bar", className, onClick, onKeyDown, ...props },
    ref,
  ) {
    const Component = (as ?? "button") as ElementType;
    const needsButtonSemantics = Component !== "button" && Component !== "a" && !!onClick;
    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event as never);
      if (event.defaultPrevented || !needsButtonSemantics) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick?.(event as never);
      }
    };
    return (
      <Component
        ref={ref}
        // A bare <button> inside a form would submit it; these never do.
        {...(Component === "button" ? { type: "button" } : {})}
        {...(needsButtonSemantics ? { role: "button", tabIndex: 0 } : {})}
        // Announce chosen-ness rather than leaving it to colour alone.
        {...(selected !== undefined ? { "aria-current": selected || undefined } : {})}
        className={cn(
          interactiveCardClass({ selected, flat, indicator, surface, borderWidth }),
          clip && "overflow-hidden",
          padding === "compact" && "p-3",
          padding === "row" && "px-3 py-2",
          padding === "comfortable" && "px-5 py-4",
          padding === "roomy" && "p-5 md:p-6",
          radius === "lg" && "rounded-lg",
          radius === "none" && "rounded-none",
          joined === "top" && "rounded-b-none rounded-t-xl",
          border === "none" && "border-0",
          display === "block" && "block",
          textSize === "sm" && "text-sm",
          opacity === "subdued" && "opacity-60",
          className,
        )}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);
