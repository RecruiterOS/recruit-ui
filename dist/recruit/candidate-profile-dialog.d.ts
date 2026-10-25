import * as react from 'react';
import { ReactNode, ReactElement } from 'react';

/**
 * How the profile opens. `dialog` is a centred dialog, and a bottom drawer
 * below the kit dialog's 1024px breakpoint. `sheet` slides in from the right,
 * beside the list it was opened from, and up from the bottom below the kit's
 * 768px mobile breakpoint, so between the two a dialog is already a drawer
 * while a sheet is still at the side.
 *
 * The footer differs on a phone too: a dialog's (`footerLayout="auto"`)
 * becomes a two-column grid, while a sheet's stays one right-aligned row.
 */
type CandidateProfileDialogPresentation = "dialog" | "sheet";
interface CandidateProfileDialogProps {
    accessibleTitle: ReactNode;
    accessibleDescription?: ReactNode;
    trigger?: ReactElement;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** `dialog` (the default) or `sheet`. */
    presentation?: CandidateProfileDialogPresentation;
    header?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    footerLayout?: "auto" | "fill";
    /**
     * Disable only when a composed header or footer supplies its own close: the
     * kit's ResponsiveDialogClose in a dialog, its SheetClose in a sheet.
     */
    showClose?: boolean;
    closeLabel?: string;
    /**
     * Class for the dialog or sheet surface. A sheet is as wide as the centred
     * dialog by default; widen it here, for example for a two-column profile.
     */
    contentClassName?: string;
    bodyClassName?: string;
}
/**
 * Responsive profile shell with explicit accessibility and composition slots,
 * presented as a centred dialog or as a side sheet.
 *
 * The surface is marked `data-slot="candidate-profile-dialog"`, with
 * `data-presentation` naming the presentation and, for a sheet, `data-side`
 * the edge it opens from.
 */
declare function CandidateProfileDialog({ presentation, ...props }: CandidateProfileDialogProps): react.JSX.Element;

export { CandidateProfileDialog, type CandidateProfileDialogPresentation, type CandidateProfileDialogProps };
