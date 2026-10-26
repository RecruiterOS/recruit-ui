import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface CandidateInlineCardProps extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "title"> {
    name: ReactNode;
    avatar?: ReactNode;
    headline?: ReactNode;
    /**
     * The caption line under the headline, such as a location. A leading glyph
     * (an `svg`, such as the kit's Icon, passed before the text) sits on the
     * text's line, centred on its capitals, with a small gap after it.
     */
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
     * On a coarse pointer (a touchscreen) every link and button in a compact
     * card's `actions` is at least 44px square, whatever size it asked for, so
     * a dense row keeps its touch targets on a phone.
     */
    density?: CandidateInlineCardDensity;
}
/** How much room a CandidateInlineCard takes. */
type CandidateInlineCardDensity = "comfortable" | "compact";
/**
 * A compact candidate trigger suitable for lists, messages, and previews.
 *
 * The root is the kit InteractiveCard as an `article`, marked
 * `data-slot="candidate-inline-card"` and `data-density`. The `actions` sit in
 * an element marked `data-slot="candidate-inline-card-actions"` that takes no
 * box of its own (`display: contents`), so they lay out as before. The meta
 * line is marked `data-slot="candidate-inline-card-meta"`.
 */
declare function CandidateInlineCard({ name, avatar, headline, meta, assessment, status, actions, selected, subdued, onSelect, selectLabel, density, "aria-expanded": ariaExpanded, className, ...props }: CandidateInlineCardProps): react.JSX.Element;

export { CandidateInlineCard, type CandidateInlineCardDensity, type CandidateInlineCardProps };
