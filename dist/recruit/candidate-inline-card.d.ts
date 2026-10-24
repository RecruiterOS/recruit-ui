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
}
/** A compact candidate trigger suitable for lists, messages, and previews. */
declare function CandidateInlineCard({ name, avatar, headline, meta, assessment, status, actions, selected, subdued, onSelect, selectLabel, "aria-expanded": ariaExpanded, className, ...props }: CandidateInlineCardProps): react.JSX.Element;

export { CandidateInlineCard, type CandidateInlineCardProps };
