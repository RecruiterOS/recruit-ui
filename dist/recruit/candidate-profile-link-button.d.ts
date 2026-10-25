import * as react from 'react';
import { AnchorHTMLAttributes, ElementType, ReactNode } from 'react';

interface CandidateProfileLinkButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "title" | "target"> {
    /** Where the profile lives. The host resolves it, including any search fallback. */
    href: string;
    /** Tooltip and accessible name, worded by the host. */
    title: string;
    /** The glyph for the profile's network or source, as a component reference. */
    icon: ElementType;
    /** Icon-only size. */
    size?: "default" | "lg";
    /** An icon-only ghost button, or an outline button with a visible label. */
    presentation?: "icon" | "button";
    /** Visible label for `presentation="button"`. */
    buttonLabel?: ReactNode;
    /** Icon colour: `disabled` mutes it, for example when the host has no exact profile. */
    iconTone?: "info" | "disabled";
}
/**
 * Opens a candidate's external profile in a new tab.
 *
 * The icon form stops the click from reaching a surrounding candidate card.
 * Recruit UI ships no network glyph or URL scheme: the host passes both. The
 * root is the kit Button rendered as a link, and keeps the kit's own
 * `data-slot="button"`, which theme stylesheets select on.
 */
declare function CandidateProfileLinkButton({ href, title, icon, size, presentation, buttonLabel, iconTone, onClick, ...props }: CandidateProfileLinkButtonProps): react.JSX.Element;

export { CandidateProfileLinkButton, type CandidateProfileLinkButtonProps };
