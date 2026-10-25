import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface CandidateInlineCardProps extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "title"> {
    name: ReactNode;
    avatar?: ReactNode;
    headline?: ReactNode;
    meta?: ReactNode;
    assessment?: ReactNode;
    status?: ReactNode;
    actions?: ReactNode;
    selected?: boolean;
    subdued?: boolean;
    onSelect?: () => void;
    selectLabel?: string;
    /**
     * `comfortable` (the default) gives the card room for an assessment;
     * `compact` is a single dense row (smaller padding, the name and lines
     * centred on the avatar, every line truncated) for fixed-height list rows
     * and board columns: give the card a height and its content centres in it.
     */
    density?: CandidateInlineCardDensity;
}
/** How much room a CandidateInlineCard takes. */
type CandidateInlineCardDensity = "comfortable" | "compact";
/**
 * A compact candidate trigger suitable for lists, messages, and previews.
 *
 * The root is the kit InteractiveCard as an `article`, marked
 * `data-slot="candidate-inline-card"` and `data-density`.
 */
declare function CandidateInlineCard({ name, avatar, headline, meta, assessment, status, actions, selected, subdued, onSelect, selectLabel, density, "aria-expanded": ariaExpanded, className, ...props }: CandidateInlineCardProps): react.JSX.Element;

export { CandidateInlineCard, type CandidateInlineCardDensity, type CandidateInlineCardProps };
