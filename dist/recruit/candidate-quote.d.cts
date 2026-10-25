import * as react from 'react';
import { BlockquoteHTMLAttributes, ReactNode } from 'react';

/** Clamps a long excerpt behind a show-more toggle on the attribution line. */
interface CandidateQuoteCollapsible {
    /** Lines shown while collapsed. */
    lines: 1 | 2 | 3;
    /**
     * Offer the toggle only when the excerpt is longer than this many
     * characters. It applies to a plain-string excerpt; any other excerpt
     * always gets the toggle.
     */
    threshold?: number;
    moreLabel: ReactNode;
    lessLabel: ReactNode;
}
interface CandidateQuoteProps extends BlockquoteHTMLAttributes<HTMLQuoteElement> {
    children: ReactNode;
    attribution?: ReactNode;
    action?: ReactNode;
    /** Clamp the excerpt to this many lines. `collapsible` replaces it. */
    lineClamp?: 1 | 2 | 3;
    collapsible?: CandidateQuoteCollapsible;
}
/** A quiet excerpt whose hierarchy comes from whitespace, never a nested card. */
declare function CandidateQuote({ children, attribution, action, lineClamp, collapsible, ...props }: CandidateQuoteProps): react.JSX.Element;

export { CandidateQuote, type CandidateQuoteCollapsible, type CandidateQuoteProps };
