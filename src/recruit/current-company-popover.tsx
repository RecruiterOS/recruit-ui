"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Popover, PopoverContent, PopoverTrigger } from "@epicbagel/saas-kit/primitives/popover";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

import { CurrentCompanyLabel, type CurrentCompanyLabelProps } from "./current-company-label";

export interface CurrentCompanyPopoverProps
  extends Omit<CurrentCompanyLabelProps, "company" | "children"> {
  /** The company name. It becomes the trigger, a link-styled button. */
  company: ReactNode;
  /** The trigger's tooltip and accessible description, such as "View Example Co career history". */
  triggerTitle: string;
  /**
   * The popover's content. Called only while the popover is open, so a host
   * can load what it shows (a career history, say) on demand.
   */
  renderContent: () => ReactNode;
  /** How long the popover stays open after a mouse pointer leaves it. */
  closeDelayMs?: number;
}

/**
 * A current-company line whose company opens a popover: on hover for a
 * mouse, and on tap or click everywhere. Moving the mouse from the company
 * into the popover keeps it open; leaving both closes it after a short delay.
 *
 * Clicks on the trigger and inside the popover stop propagating, so the line
 * works inside a clickable candidate card. The content is mounted only while
 * the popover is open. The host supplies the tenure wording and the content;
 * the popover surface is marked `data-slot="current-company-popover"`.
 */
export function CurrentCompanyPopover({
  company,
  triggerTitle,
  renderContent,
  closeDelayMs = 180,
  size = "sm",
  tone = "muted",
  ...props
}: CurrentCompanyPopoverProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), closeDelayMs);
  }, [cancelClose, closeDelayMs]);
  useEffect(() => () => cancelClose(), [cancelClose]);

  const openOnMouse = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    setOpen(true);
  };

  return (
    <CurrentCompanyLabel
      size={size}
      tone={tone}
      {...props}
      company={(
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="link"
              size="bare"
              title={triggerTitle}
              onPointerEnter={openOnMouse}
              onPointerLeave={scheduleClose}
              onClick={(event) => event.stopPropagation()}
            >
              <Text variant="inherit" as="span" size={size} tone={tone} truncate>
                {company}
              </Text>
            </Button>
          </PopoverTrigger>
          {open && (
            <PopoverContent
              width="lg"
              data-slot="current-company-popover"
              onPointerEnter={cancelClose}
              onPointerLeave={scheduleClose}
              onClick={(event) => event.stopPropagation()}
            >
              {renderContent()}
            </PopoverContent>
          )}
        </Popover>
      )}
    />
  );
}
