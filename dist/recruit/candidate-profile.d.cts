import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

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
}
declare function CandidateProfileHeader({ name, avatar, cover, eyebrow, status, meta, summary, actions, className, ...props }: CandidateProfileHeaderProps): react.JSX.Element;
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
