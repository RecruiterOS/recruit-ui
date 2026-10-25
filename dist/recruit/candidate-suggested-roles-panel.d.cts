import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';

interface CandidateSuggestedRolesPanelProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
    /** How many roles are suggested. Zero shows the empty state instead of `children`. */
    count: number;
    /** The section heading. */
    title?: ReactNode;
    /** A muted line under the heading explaining where the suggestions come from. */
    description?: ReactNode;
    /** The blank slate's wording. Defaults to "No suggested roles yet". */
    empty?: CandidateEmptyCopy;
    /** The suggestions, usually a CandidateRoleMatchList. */
    children?: ReactNode;
}
/**
 * A counted section for the roles suggested for one person: the heading and
 * count, a line on where the suggestions come from, then the host's list, or
 * the kit's empty state when there are none. The root is the kit
 * PanelSection, marked `data-slot="candidate-suggested-roles-panel"`.
 */
declare function CandidateSuggestedRolesPanel({ count, title, description, empty, children, ...props }: CandidateSuggestedRolesPanelProps): react.JSX.Element;

export { CandidateSuggestedRolesPanel, type CandidateSuggestedRolesPanelProps };
