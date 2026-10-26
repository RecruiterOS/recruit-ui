import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { CandidateCoverHeaderPadding } from './candidate-cover-header.js';

interface CandidateProfileProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
    header?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
}
/** Structural profile composition. Data loading and record policy stay outside. */
declare function CandidateProfile({ header, children, footer, className, ...props }: CandidateProfileProps): react.JSX.Element;
interface CandidateProfileHeaderProps extends HTMLAttributes<HTMLDivElement> {
    name: ReactNode;
    avatar?: ReactNode;
    cover?: ReactNode;
    eyebrow?: ReactNode;
    status?: ReactNode;
    meta?: ReactNode;
    summary?: ReactNode;
    actions?: ReactNode;
    /**
     * `lg` (the default) pads the header like a card's. `dialog` pads it like
     * the kit's dialog header, so as a CandidateProfileDialog's `header` the
     * name starts at the body's left edge, in line with what the body holds.
     * `none` sits it flush in a container the host already pads, such as a
     * drawer body.
     */
    padding?: Extract<CandidateCoverHeaderPadding, "lg" | "dialog" | "none">;
}
declare function CandidateProfileHeader({ name, avatar, cover, eyebrow, status, meta, summary, actions, padding, className, ...props }: CandidateProfileHeaderProps): react.JSX.Element;
interface CandidateProfileBodyProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    divided?: boolean;
}
declare function CandidateProfileBody({ children, divided, className, ...props }: CandidateProfileBodyProps): react.JSX.Element;
interface CandidateProfileFooterProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
}
declare function CandidateProfileFooter({ children, ...props }: CandidateProfileFooterProps): react.JSX.Element;

export { CandidateProfile, CandidateProfileBody, type CandidateProfileBodyProps, CandidateProfileFooter, type CandidateProfileFooterProps, CandidateProfileHeader, type CandidateProfileHeaderProps, type CandidateProfileProps };
