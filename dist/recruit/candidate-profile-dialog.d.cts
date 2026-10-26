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
/**
 * The centred dialog's height on desktop. `viewport` fixes it at 85% of the
 * viewport, so a profile doesn't change height as its sections load or as a
 * person moves between profiles. `content` sizes it to what it holds, up to
 * the same cap, for a short profile such as an example. A drawer and a sheet
 * already fit their content, so this applies to the desktop dialog only.
 */
type CandidateProfileDialogHeight = "viewport" | "content";
interface CandidateProfileDialogProps {
    accessibleTitle: ReactNode;
    accessibleDescription?: ReactNode;
    trigger?: ReactElement;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** `dialog` (the default) or `sheet`. */
    presentation?: CandidateProfileDialogPresentation;
    /** `viewport` (the default) or `content`; the desktop dialog's only. */
    height?: CandidateProfileDialogHeight;
    /**
     * The visible head, such as a CandidateProfileHeader. It keeps its natural
     * height and only the body scrolls, also in a drawer or bottom sheet, whose
     * height is capped rather than fixed. A CandidateProfileHeader with
     * `padding="dialog"` starts at the body's left edge.
     */
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
 * `data-presentation` naming the presentation and, for a dialog,
 * `data-height` its height; for a sheet, `data-side` names the edge it opens
 * from. A `header` sits in an element marked
 * `data-slot="candidate-profile-dialog-header"`.
 */
declare function CandidateProfileDialog({ presentation, height, ...props }: CandidateProfileDialogProps): react.JSX.Element;

export { CandidateProfileDialog, type CandidateProfileDialogHeight, type CandidateProfileDialogPresentation, type CandidateProfileDialogProps };
