import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { CandidateCoverSeed, CandidateCoverImageSize } from './candidate-cover-header.js';

interface CandidateReviewFact {
    label: ReactNode;
    value: ReactNode;
}
interface CandidateReviewCardProps extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "title"> {
    name: ReactNode;
    avatar?: ReactNode;
    /**
     * The person's own cover, as media the host owns. Left out, the kit's
     * stock banner (`CoverBanner`) is drawn in its place, in the theme's
     * colours, so everyone's card is the same height; `null` draws no cover.
     */
    cover?: ReactNode | null;
    /**
     * Deals the stock banner its design, the same one every time: the
     * person's id, say. Left out, the name is the seed where it is plain text.
     */
    coverSeed?: CandidateCoverSeed;
    /**
     * The cover's size, the person's own or the stock one. `compact` caps it
     * at 96px, for a card wide enough that a full 4:1 banner would dwarf it;
     * narrower than 384px it is 4:1 either way.
     */
    coverSize?: CandidateCoverImageSize;
    headline?: ReactNode;
    headerActions?: ReactNode;
    beforeFacts?: ReactNode;
    facts?: readonly CandidateReviewFact[];
    insight?: CandidateReviewFact;
    /** Rendered verbatim so a caller-owned action section is never double padded. */
    actions?: ReactNode;
    selected?: boolean;
    subdued?: boolean;
    onSelect?: () => void;
    selectLabel?: string;
}
/** A slot-driven human-review card with no knowledge of records or decisions. */
declare function CandidateReviewCard({ name, avatar, cover, coverSeed, coverSize, headline, headerActions, beforeFacts, facts, insight, actions, selected, subdued, onSelect, selectLabel, "aria-expanded": ariaExpanded, className, ...props }: CandidateReviewCardProps): react.JSX.Element;

export { CandidateReviewCard, type CandidateReviewCardProps, type CandidateReviewFact };
