import * as react from 'react';
import { ButtonHTMLAttributes } from 'react';

/** Host-owned wording for the two states of the toggle. */
interface CandidateFavouriteButtonLabels {
    /** Shown while the candidate is not a favourite. */
    add: string;
    /** Shown while the candidate is a favourite. */
    remove: string;
}
interface CandidateFavouriteButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type" | "onToggle"> {
    favourited: boolean;
    /** Called with no arguments; the host flips and persists the marker. */
    onToggle: () => void;
    labels?: Partial<CandidateFavouriteButtonLabels>;
    /**
     * The star's colour while the candidate is not a favourite: `muted`
     * (default) on a card, or `inherit` to take the surrounding text colour,
     * as the other icon actions in a detail header do.
     */
    idleTone?: "muted" | "inherit";
}
/**
 * A borderless star toggle for marking a candidate as a favourite.
 *
 * The click never reaches a surrounding card, so it works inside a clickable
 * candidate card. The root is the kit Button and keeps the kit's own
 * `data-slot="button"`, which theme stylesheets select on.
 */
declare function CandidateFavouriteButton({ favourited, onToggle, labels, idleTone, onClick, ...props }: CandidateFavouriteButtonProps): react.JSX.Element;

export { CandidateFavouriteButton, type CandidateFavouriteButtonLabels, type CandidateFavouriteButtonProps };
