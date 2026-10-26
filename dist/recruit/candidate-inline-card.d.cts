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
    /**
     * The name's size on a comfortable card. `default` suits a row among many;
     * `lg` sets it at the kit's section-title size, for a short list in which
     * each card stands on its own, such as the people shared with a client. A
     * compact card keeps its small name either way.
     */
    nameSize?: CandidateInlineCardNameSize;
    /**
     * On a comfortable card, `true` lets the headline wrap onto further lines
     * instead of ending in an ellipsis, so a long title and company still read
     * in full on a phone. A compact row always truncates, to keep its height.
     */
    headlineWrap?: boolean;
    /**
     * Where the `actions` sit across a comfortable card: `start` (the default)
     * level with the name, or `center`, centred on the card's height, for a
     * lone affordance such as a chevron. A compact row centres them already.
     */
    actionsAlign?: CandidateInlineCardActionsAlign;
}
/** How much room a CandidateInlineCard takes. */
type CandidateInlineCardDensity = "comfortable" | "compact";
/** How large a CandidateInlineCard sets the name. */
type CandidateInlineCardNameSize = "default" | "lg";
/** Where a CandidateInlineCard's actions sit across the card. */
type CandidateInlineCardActionsAlign = "start" | "center";
/**
 * A compact candidate trigger suitable for lists, messages, and previews.
 *
 * The root is the kit InteractiveCard as an `article`, marked
 * `data-slot="candidate-inline-card"` and `data-density`. The `actions` sit in
 * an element marked `data-slot="candidate-inline-card-actions"` that takes no
 * box of its own (`display: contents`), so they lay out as before. The
 * headline is marked `data-slot="candidate-inline-card-headline"` and the
 * meta line `data-slot="candidate-inline-card-meta"`.
 */
declare function CandidateInlineCard({ name, avatar, headline, meta, assessment, status, actions, selected, subdued, onSelect, selectLabel, density, nameSize, headlineWrap, actionsAlign, "aria-expanded": ariaExpanded, className, ...props }: CandidateInlineCardProps): react.JSX.Element;

export { CandidateInlineCard, type CandidateInlineCardActionsAlign, type CandidateInlineCardDensity, type CandidateInlineCardNameSize, type CandidateInlineCardProps };
