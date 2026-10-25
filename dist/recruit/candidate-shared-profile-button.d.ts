import * as react from 'react';
import { AnchorHTMLAttributes } from 'react';

interface CandidateSharedProfileButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "title" | "target"> {
    /** The page the recipient sees. The host resolves it; this never creates a share. */
    href: string;
    /** Tooltip and accessible name, such as "Preview Rafael Quintero's shared profile". */
    label: string;
    size?: "default" | "compact";
}
/**
 * An icon link that previews the profile page a candidate was shared on, in a
 * new tab. The click never reaches a surrounding candidate card. The root is
 * the kit Button rendered as a link, and keeps the kit's own
 * `data-slot="button"`, which theme stylesheets select on.
 */
declare function CandidateSharedProfileButton({ href, label, size, onClick, ...props }: CandidateSharedProfileButtonProps): react.JSX.Element;

export { CandidateSharedProfileButton, type CandidateSharedProfileButtonProps };
