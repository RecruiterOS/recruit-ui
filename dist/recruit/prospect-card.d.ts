import * as react from 'react';
import { ReactNode } from 'react';
import { CandidateReviewFact, CandidateReviewCardProps } from './candidate-review-card.js';
import './candidate-cover-header.js';

interface ProspectMatch {
    id: string;
    name: string;
    evidence: string;
    photoUrl?: string;
}
interface ClientProspectCardProps {
    company: string;
    logo?: ReactNode;
    role: ReactNode;
    facts: readonly CandidateReviewFact[];
    signal: ReactNode;
    matches: readonly ProspectMatch[];
    actions?: ReactNode;
    empty?: ReactNode;
}
/** The opening, the relationship and the people a recruiter could introduce. */
declare function ClientProspectCard({ company, logo, role, facts, signal, matches, actions, empty }: ClientProspectCardProps): react.JSX.Element;
interface ShortlistPreviewCardProps extends Pick<CandidateReviewCardProps, "headline" | "avatar" | "facts" | "insight" | "headerActions"> {
    name: string;
    preview: ReactNode;
    previewTitle?: string;
    openLabel?: string;
}
/** Public shortlist entry. The host supplies only information available to this reader. */
declare function ShortlistPreviewCard({ name, preview, previewTitle, openLabel, ...card }: ShortlistPreviewCardProps): react.JSX.Element;

export { ClientProspectCard, type ClientProspectCardProps, type ProspectMatch, ShortlistPreviewCard, type ShortlistPreviewCardProps };
