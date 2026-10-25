import * as react from 'react';
import { ReactNode } from 'react';
import { CurrentCompanyLabelProps } from './current-company-label.cjs';

interface CurrentCompanyPopoverProps extends Omit<CurrentCompanyLabelProps, "company" | "children"> {
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
declare function CurrentCompanyPopover({ company, triggerTitle, renderContent, closeDelayMs, size, tone, ...props }: CurrentCompanyPopoverProps): react.JSX.Element;

export { CurrentCompanyPopover, type CurrentCompanyPopoverProps };
