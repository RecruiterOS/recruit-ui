import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface CandidateReviewFact {
    label: ReactNode;
    value: ReactNode;
}
interface CandidateReviewCardProps extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "title"> {
    name: ReactNode;
    avatar?: ReactNode;
    cover?: ReactNode;
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
declare function CandidateReviewCard({ name, avatar, cover, headline, headerActions, beforeFacts, facts, insight, actions, selected, subdued, onSelect, selectLabel, "aria-expanded": ariaExpanded, className, ...props }: CandidateReviewCardProps): react.JSX.Element;

export { CandidateReviewCard, type CandidateReviewCardProps, type CandidateReviewFact };
