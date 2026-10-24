"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/utils";

interface ContactHeaderProps {
  /** Avatar or avatar uploader. Sized by the caller; 44–48px reads best. */
  avatar?: ReactNode;
  /** The person's name — plain text, or an inline editor. */
  name: ReactNode;
  /**
   * A marker that belongs ON the name line: an unread dot, a "needs contact"
   * indicator, a verification tick. Kept out of `meta` so it can't be pushed
   * onto the second line when the chips wrap.
   */
  status?: ReactNode;
  /**
   * Secondary identity under the name — role and company, typically as chips
   * or inline editors. Wraps freely.
   */
  meta?: ReactNode;
  /** Reach-out controls. Sits on the name line, right-aligned. */
  actions?: ReactNode;
  /** Renders a close control alongside the actions. Omit outside a panel. */
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
  spacing?: "none" | "default";
}

/**
 * The identity block at the top of a contact view — avatar, name, role and
 * company, and the ways to reach them.
 *
 * Exists because composing this from a page header goes subtly wrong. A page
 * header IS a row: title left, actions right, `justify-between` between them. Put it
 * in a column beside an avatar and that row collapses to the column's width,
 * so the actions have nowhere to go but underneath — a third stacked band with
 * a lone icon in it, and a wide empty gutter to the right of the name. Its
 * page-level `text-3xl` and `mb-6` are tuned for a route heading, not for
 * sitting next to a 44px avatar.
 *
 * So this owns the whole composition instead:
 *   - one row: avatar, then a column of (name + actions) over (meta)
 *   - the actions share the name's line, which is what closes the gutter and
 *     removes the orphaned band
 *   - the close control joins the actions, so there's a single right-hand
 *     cluster rather than a × floating in the corner
 *   - the name steps down to text-xl/2xl — a contact is the subject of a
 *     panel, not the title of a page
 *
 * Every slot is a ReactNode, so the same header serves a read-only card and a
 * fully editable detail view without knowing which it is.
 */
export function ContactHeader({
  avatar,
  name,
  status,
  meta,
  actions,
  onClose,
  closeLabel = "Close",
  className,
  spacing = "default",
}: ContactHeaderProps) {
  const hasTrailing = !!actions || !!onClose;
  return (
    <div className={cn("flex items-start gap-4", spacing === "default" && "mb-6", className)}>
      {avatar && <div className="shrink-0">{avatar}</div>}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          {/* min-w-0 so a long name truncates instead of shoving the actions
              off the row. */}
          <h1 className="min-w-0 text-xl font-semibold tracking-tight md:text-2xl">
            <span className="inline-flex min-w-0 max-w-full items-center gap-2">
              {name}
              {status}
            </span>
          </h1>

          {hasTrailing && (
            <div className="flex shrink-0 items-center gap-1.5">
              {actions}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={closeLabel}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {meta && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">{meta}</div>
        )}
      </div>
    </div>
  );
}

export type { ContactHeaderProps };
