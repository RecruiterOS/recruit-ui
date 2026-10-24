import * as react from 'react';
import { BlockquoteHTMLAttributes, ReactNode } from 'react';

interface CandidateQuoteProps extends BlockquoteHTMLAttributes<HTMLQuoteElement> {
    children: ReactNode;
    attribution?: ReactNode;
    action?: ReactNode;
    lineClamp?: 1 | 2 | 3;
}
/** A quiet excerpt whose hierarchy comes from whitespace, never a nested card. */
declare function CandidateQuote({ children, attribution, action, lineClamp, ...props }: CandidateQuoteProps): react.JSX.Element;

export { CandidateQuote, type CandidateQuoteProps };
