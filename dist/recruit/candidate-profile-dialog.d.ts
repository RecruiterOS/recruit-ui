import * as react from 'react';
import { ReactNode, ReactElement } from 'react';

interface CandidateProfileDialogProps {
    accessibleTitle: ReactNode;
    accessibleDescription?: ReactNode;
    trigger?: ReactElement;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    header?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    footerLayout?: "auto" | "fill";
    /** Disable only when a composed header or footer supplies its own dialog close. */
    showClose?: boolean;
    closeLabel?: string;
    contentClassName?: string;
    bodyClassName?: string;
}
/** Responsive profile shell with explicit accessibility and composition slots. */
declare function CandidateProfileDialog({ accessibleTitle, accessibleDescription, trigger, open, defaultOpen, onOpenChange, header, children, footer, footerLayout, showClose, closeLabel, contentClassName, bodyClassName, }: CandidateProfileDialogProps): react.JSX.Element;

export { CandidateProfileDialog, type CandidateProfileDialogProps };
