import * as react from 'react';
import { ReactNode } from 'react';
import { CallParticipant, CallSegment } from '@epicbagel/saas-kit/primitives/call-card';
export { CallParticipant, CallSegment } from '@epicbagel/saas-kit/primitives/call-card';
import { CallInsights } from './call-data.js';
export { CallInsightsStatus, CallPerson, CallTranscript, SearchCallPeople, normalizeCallParticipants, normalizeCallSegments } from './call-data.js';

/** Host-owned wording for the card's fixed parts. */
interface CandidateCallCardLabels {
    /** The heading when the call has no title. */
    untitled: string;
    /** The transcript toggle while it is closed. */
    showTranscript: string;
    unlink: ReactNode;
    unlinkTitle: string;
    /** What unlinking does, in the confirmation. */
    unlinkDescription: string;
    /** Names the call in the confirmation when it has no title. */
    unlinkItem: string;
    unlinkConfirm: string;
    /** Starts the first check of the call against open roles. */
    check: ReactNode;
    /** Runs the check again once insights exist. */
    recheck: ReactNode;
    /** Either check button while a check runs. */
    checking: ReactNode;
    noRolesTitle: string;
    noRolesDescription: string;
}
interface CandidateCallCardProps {
    /** The call's title. Without one, the card says `labels.untitled`. */
    title?: string | null;
    /** Where the call came from, already worded. */
    source?: ReactNode;
    /** When it happened, already formatted. */
    timestamp?: ReactNode;
    /** Who was on it. `normalizeCallParticipants` prepares raw lists. */
    participants?: readonly CallParticipant[];
    /** Speaker-labelled turns. `normalizeCallSegments` prepares raw lists. */
    segments?: readonly CallSegment[] | null;
    /** The flat transcript, shown when there are no segments. */
    transcript?: ReactNode;
    /** How sure the host is that the call belongs to this person, shown as a badge. */
    confidence?: ReactNode;
    /**
     * Called once the recruiter confirms the unlink. The button shows a spinner
     * until it settles; the host removes the card, or reports why it couldn't.
     */
    onUnlink: () => Promise<void>;
    /** The host's check of the call against its open roles. */
    insights: CallInsights;
    /**
     * The roles the check suggested, usually a CandidateRoleMatchSummary. Once
     * insights are ready and this is empty, the card says no role fits.
     */
    roleMatches?: ReactNode;
    labels?: Partial<CandidateCallCardLabels>;
    /** Class for the card. Its root is the kit's CallCard, which takes no other attributes. */
    className?: string;
}
/**
 * One call linked to a person: the kit's CallCard with a confidence badge,
 * an unlink action behind a confirmation, and the check of the call against
 * open roles. Before insights exist the card offers the check and shows its
 * last error; once they do, it shows the host's role matches, or an empty
 * state when none fit, and offers a recheck.
 */
declare function CandidateCallCard({ title, source, timestamp, participants, segments, transcript, confidence, onUnlink, insights, roleMatches, labels, className, }: CandidateCallCardProps): react.JSX.Element;

export { CallInsights, CandidateCallCard, type CandidateCallCardLabels, type CandidateCallCardProps };
