import * as react from 'react';
import { HTMLAttributes, ReactNode, ButtonHTMLAttributes, ElementType } from 'react';

interface CandidateHeaderActionsProps extends HTMLAttributes<HTMLElement> {
    /** The controls, in order: usually icon actions and link buttons. */
    children: ReactNode;
}
/**
 * The cluster of quiet controls in a candidate card's header: favourite,
 * email, note, profile links. Pass it as `CandidateReviewCard`'s
 * `headerActions`.
 *
 * It wraps when the header is narrow and sits flush with the card's edge.
 * The root is marked `data-slot="candidate-header-actions"`.
 */
declare function CandidateHeaderActions({ children, ...props }: CandidateHeaderActionsProps): react.JSX.Element;
interface CandidateIconActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "title"> {
    /** The glyph, as a component such as a lucide icon. */
    icon: ElementType;
    /** The tooltip and accessible name, such as "Email Mei Tanaka". */
    title: string;
}
/**
 * A quiet icon-only button for a candidate card's header, such as email or
 * leave a note.
 *
 * The click never reaches a surrounding card. The root is the kit Button and
 * keeps the kit's own `data-slot="button"`, which theme stylesheets select on.
 */
declare function CandidateIconAction({ icon, title, onClick, ...props }: CandidateIconActionProps): react.JSX.Element;

export { CandidateHeaderActions, type CandidateHeaderActionsProps, CandidateIconAction, type CandidateIconActionProps };
