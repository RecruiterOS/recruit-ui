"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Plug,
  RefreshCw,
} from "lucide-react";
import {
  useState,
  type HTMLAttributeAnchorTarget,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Badge, type BadgeVariant } from "./badge";
import { Button } from "./button";

export type ConnectionStatusBarState =
  | "disconnected"
  | "syncing"
  | "connected"
  | "error";

export interface ConnectionStatusBarAction {
  label: ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  external?: boolean;
  iconOnly?: boolean;
  disabled?: boolean;
}

export interface ConnectionStatusBarFact {
  label: ReactNode;
  variant?: BadgeVariant;
}

export interface ConnectionStatusBarProps {
  state: ConnectionStatusBarState;
  /** Integration name, or the setup prompt before a source is connected. */
  name: ReactNode;
  /** Current activity or health summary. */
  description?: ReactNode;
  /** Compact, structured values displayed as separate data badges. */
  facts?: readonly ConnectionStatusBarFact[];
  /** One primary action retained for backwards compatibility. */
  action?: ConnectionStatusBarAction;
  /** Compact action group, rendered in the supplied order. */
  actions?: readonly ConnectionStatusBarAction[];
  /** A real 0–100 value. Omit it for an indeterminate syncing treatment. */
  progress?: number;
  /** Accessible label for the progress indicator. */
  progressLabel?: string;
  /** Optional supporting content revealed by the trailing chevron. */
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const statePresentation: Record<ConnectionStatusBarState, {
  icon: typeof Plug;
  iconClassName: string;
}> = {
  disconnected: { icon: Plug, iconClassName: "text-muted-foreground" },
  syncing: { icon: RefreshCw, iconClassName: "text-blue-600 dark:text-blue-400" },
  connected: { icon: CheckCircle2, iconClassName: "text-emerald-600 dark:text-emerald-400" },
  error: { icon: AlertCircle, iconClassName: "text-destructive" },
};

function StatusAction({
  action,
  state,
}: {
  action: ConnectionStatusBarAction;
  state: ConnectionStatusBarState;
}) {
  const external = action.external || action.target === "_blank";
  const ariaLabel = action.ariaLabel
    ?? (typeof action.label === "string" ? action.label : undefined);
  const showSyncIcon = !external && (state === "connected" || state === "syncing");
  const content = (
    <>
      {showSyncIcon ? (
        <RefreshCw
          aria-hidden="true"
          className={state === "syncing" ? "animate-spin" : undefined}
        />
      ) : null}
      {action.iconOnly ? null : action.label}
      {external ? <ExternalLink aria-hidden="true" /> : null}
    </>
  );
  const className = cn(
    state === "disconnected" && "bg-foreground text-background hover:bg-foreground/90",
    state === "error" && "border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive",
  );
  const variant = state === "disconnected"
    ? "default"
    : action.iconOnly
      ? "quiet"
      : "outline";
  const size = action.iconOnly ? "icon-sm" : "sm";

  if (action.href) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <a
          href={action.href}
          target={action.target ?? (action.external ? "_blank" : undefined)}
          rel={external ? "noreferrer" : undefined}
          aria-label={action.iconOnly ? ariaLabel : undefined}
          title={action.iconOnly ? ariaLabel : undefined}
          aria-disabled={action.disabled || undefined}
          onClick={(event) => {
            if (action.disabled) {
              event.preventDefault();
              return;
            }
            action.onClick?.();
          }}
        >
          {content}
        </a>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      aria-label={action.iconOnly ? ariaLabel : undefined}
      title={action.iconOnly ? ariaLabel : undefined}
      disabled={action.disabled}
      onClick={action.onClick}
    >
      {content}
    </Button>
  );
}

/**
 * A single, shared status row for data-source connections. It covers setup,
 * active syncing, healthy connections, and recoverable errors without making
 * each product recreate the layout or semantic colour treatment.
 */
export function ConnectionStatusBar({
  state,
  name,
  description,
  facts,
  action,
  actions,
  progress,
  progressLabel = "Sync progress",
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
}: ConnectionStatusBarProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const controlled = open !== undefined;
  const isOpen = controlled ? open : uncontrolledOpen;
  const presentation = statePresentation[state];
  const StateIcon = presentation.icon;
  const clampedProgress = progress === undefined
    ? undefined
    : Math.min(100, Math.max(0, progress));
  const visibleActions = actions ?? (action ? [action] : []);

  const setOpen = (nextOpen: boolean) => {
    if (!controlled) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <CollapsiblePrimitive.Root
      open={isOpen}
      onOpenChange={setOpen}
      data-slot="connection-status-bar"
      data-status={state}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-background shadow-sm",
        className,
      )}
    >
      <div
        data-slot="connection-status-row"
        className="flex min-h-[4.75rem] flex-row items-center gap-3 px-4 py-4 sm:gap-5 sm:px-5"
      >
        <div
          data-slot="connection-status-leading"
          className="flex min-w-0 flex-1 items-center gap-3 sm:min-h-11 sm:gap-4"
        >
          <span className="flex h-11 w-5 shrink-0 items-center justify-center">
            <StateIcon
              aria-hidden="true"
              className={cn(
                "size-5",
                state === "syncing" && "animate-spin",
                presentation.iconClassName,
              )}
            />
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:min-h-11 sm:gap-4">
            <div className="flex min-w-0 shrink items-center truncate whitespace-nowrap text-sm font-semibold leading-none text-foreground">
              {name}
            </div>
            {description || facts?.length ? (
              <div aria-hidden="true" className="h-5 w-px shrink-0 bg-border" />
            ) : null}
            {description || facts?.length ? (
              <div
                data-slot="connection-status-summary"
                className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-hidden"
              >
                {description ? (
                  <div className="min-w-0 truncate whitespace-nowrap text-sm leading-none text-muted-foreground">
                    {description}
                  </div>
                ) : null}
                {facts?.map((fact, index) => (
                  <Badge
                    key={index}
                    data-status-fact="true"
                    variant={fact.variant ?? "default"}
                    size="micro"
                    padding="roomy"
                    weight="semibold"
                    shrink
                    transform="uppercase"
                    className="whitespace-nowrap tabular-nums"
                  >
                    {fact.label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          {state === "syncing" ? (
            <div
              role="progressbar"
              aria-label={progressLabel}
              aria-valuemin={clampedProgress === undefined ? undefined : 0}
              aria-valuemax={clampedProgress === undefined ? undefined : 100}
              aria-valuenow={clampedProgress}
              className="h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:w-28"
            >
              <div
                className={cn(
                  "h-full rounded-full bg-blue-600/70 transition-[width] dark:bg-blue-400/70",
                  clampedProgress === undefined && "w-3/5 animate-pulse",
                )}
                style={clampedProgress === undefined ? undefined : { width: `${clampedProgress}%` }}
              />
            </div>
          ) : null}
          {visibleActions.map((visibleAction, index) => (
            <StatusAction
              key={visibleAction.ariaLabel
                ?? (typeof visibleAction.label === "string" ? visibleAction.label : index)}
              action={visibleAction}
              state={state}
            />
          ))}
          {children ? (
            <CollapsiblePrimitive.Trigger asChild>
              <Button
                type="button"
                variant="quiet"
                size="icon-sm"
                aria-label={isOpen ? "Hide connection details" : "Show connection details"}
                aria-expanded={isOpen}
              >
                <ChevronDown
                  aria-hidden="true"
                  className={cn("transition-transform", isOpen && "rotate-180")}
                />
              </Button>
            </CollapsiblePrimitive.Trigger>
          ) : null}
        </div>
      </div>
      {children ? (
        <CollapsiblePrimitive.Content>
          <div data-slot="connection-status-details" className="border-t border-border px-5 py-4">
            {children}
          </div>
        </CollapsiblePrimitive.Content>
      ) : null}
    </CollapsiblePrimitive.Root>
  );
}
