import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { CandidateCoverHeaderPadding } from './candidate-cover-header.cjs';

interface CandidateProfileProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
    header?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    /**
     * `default` prints the card as it looks on screen. `flat` prints it without
     * its border (or a shadow a host gave it), so a printed profile reads as a
     * page rather than a card on one.
     */
    printMode?: CandidateProfilePrintMode;
}
/** How a CandidateProfile prints. */
type CandidateProfilePrintMode = "default" | "flat";
/** Structural profile composition. Data loading and record policy stay outside. */
declare function CandidateProfile({ header, children, footer, printMode, className, ...props }: CandidateProfileProps): react.JSX.Element;
interface CandidateProfileHeaderProps extends HTMLAttributes<HTMLDivElement> {
    name: ReactNode;
    avatar?: ReactNode;
    cover?: ReactNode;
    eyebrow?: ReactNode;
    status?: ReactNode;
    meta?: ReactNode;
    summary?: ReactNode;
    actions?: ReactNode;
    /**
     * Where `actions` sit. `name` (the default) puts them on the name line, at
     * its end, with the meta running under them. `aside` gives them a column
     * of their own beside the whole identity, top-aligned, so a control taller
     * than the name's line doesn't push the meta away from the name.
     */
    actionsPlacement?: CandidateProfileHeaderActionsPlacement;
    /**
     * `lg` (the default) pads the header like a card's. `dialog` pads it like
     * the kit's dialog header, so as a CandidateProfileDialog's `header` the
     * name starts at the body's left edge, in line with what the body holds.
     * `none` sits it flush in a container the host already pads, such as a
     * drawer body.
     */
    padding?: Extract<CandidateCoverHeaderPadding, "lg" | "dialog" | "none">;
    /**
     * The name's heading level. 1 (the default) suits a profile that is the
     * page. 2, 3 or 4 suit one inside something that already has the page's
     * h1, such as a dialog over a page or a section of one. Only the tag
     * changes: the name looks the same at every level.
     */
    titleLevel?: CandidateProfileHeaderTitleLevel;
}
/** Where a CandidateProfileHeader puts its actions. */
type CandidateProfileHeaderActionsPlacement = "name" | "aside";
/** The heading level of a CandidateProfileHeader's name. */
type CandidateProfileHeaderTitleLevel = 1 | 2 | 3 | 4;
declare function CandidateProfileHeader({ name, avatar, cover, eyebrow, status, meta, summary, actions, actionsPlacement, padding, titleLevel, className, ...props }: CandidateProfileHeaderProps): react.JSX.Element;
interface CandidateProfileBodyProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    divided?: boolean;
}
declare function CandidateProfileBody({ children, divided, className, ...props }: CandidateProfileBodyProps): react.JSX.Element;
interface CandidateProfileFooterProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    /** Where the row's content sits along it. `start` by default. */
    justify?: CandidateProfileFooterJustify;
    /**
     * The kit PanelSection's padding: `default` (26px) for a row of actions,
     * `compact` for a single line such as a credit.
     */
    padding?: CandidateProfileFooterPadding;
    /** `hidden` leaves the footer off a printed profile. */
    printVisibility?: CandidateProfileFooterPrintVisibility;
}
/** Where a CandidateProfileFooter puts its content along the row. */
type CandidateProfileFooterJustify = "start" | "center" | "end" | "between";
/** The space inside a CandidateProfileFooter. */
type CandidateProfileFooterPadding = "default" | "compact";
/** Whether a CandidateProfileFooter prints. */
type CandidateProfileFooterPrintVisibility = "visible" | "hidden";
declare function CandidateProfileFooter({ children, justify, padding, printVisibility, className, ...props }: CandidateProfileFooterProps): react.JSX.Element;

export { CandidateProfile, CandidateProfileBody, type CandidateProfileBodyProps, CandidateProfileFooter, type CandidateProfileFooterJustify, type CandidateProfileFooterPadding, type CandidateProfileFooterPrintVisibility, type CandidateProfileFooterProps, CandidateProfileHeader, type CandidateProfileHeaderActionsPlacement, type CandidateProfileHeaderProps, type CandidateProfileHeaderTitleLevel, type CandidateProfilePrintMode, type CandidateProfileProps };
