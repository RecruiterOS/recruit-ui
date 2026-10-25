import * as react from 'react';
import { ReactNode } from 'react';
import { CallParticipant, CallSegment } from '@epicbagel/saas-kit/primitives/call-card';
import { CallPerson, CallTranscript, SearchCallPeople, CallInsights } from './call-data.cjs';

/** Host-owned wording for the card's fixed parts. */
interface MatchedCallCardLabels {
    /** The heading when the call has no title and no linked people. */
    untitled: string;
    /** The transcript toggle while it is closed. */
    showTranscript: string;
    /** Between two linked people in the heading. */
    peopleSeparator: ReactNode;
    /** Accessible name of a linked person's button. */
    openPerson: (name: string) => string;
    /** The heading over the insights. */
    insights: ReactNode;
    generate: ReactNode;
    regenerate: ReactNode;
    noRolesTitle: string;
    noRolesDescription: string;
    /** The header action that opens the link dialog. */
    linkPerson: ReactNode;
    linkTitle: ReactNode;
    searchPlaceholder: string;
    searching: ReactNode;
    noMatchesTitle: string;
    noMatchesDescription: string;
}
/** Links the call to one more person, found by name. */
interface MatchedCallLinkPerson<TPerson extends CallPerson = CallPerson> {
    searchPeople: SearchCallPeople<TPerson>;
    /**
     * Links the call. Resolve once it is linked: the dialog then closes and
     * clears its search, and the host adds the person to `people`. Reject when
     * it failed, having told the user why; the dialog stays open.
     */
    onLink: (person: TPerson) => Promise<void>;
}
interface MatchedCallCardProps<TPerson extends CallPerson = CallPerson> {
    /** The call's title, shown when no person is linked yet. */
    title?: ReactNode;
    /** The people the call is linked to. They replace the title as buttons that open each one. */
    people?: readonly TPerson[];
    onOpenPerson?: (person: TPerson) => void;
    source?: ReactNode;
    timestamp?: ReactNode;
    /** Who was on the call besides the people in the heading. */
    participants?: readonly CallParticipant[];
    summary?: ReactNode;
    /** The transcript preview, until the full transcript loads. */
    transcript?: ReactNode;
    segments?: readonly CallSegment[] | null;
    /** Fetches the full transcript the first time it is opened. */
    loadTranscript?: () => Promise<CallTranscript | null | undefined>;
    /** Offers to link the call to another person. Omit it and the header has no link action. */
    linkPerson?: MatchedCallLinkPerson<TPerson>;
    /** The host's check of the call against its open roles. */
    insights: CallInsights;
    /** The roles the check suggested. Once insights are ready and this is empty, the card says no role fits. */
    roleMatches?: ReactNode;
    labels?: Partial<MatchedCallCardLabels>;
    /** Class for the card. Its root is the kit's CallCard, which takes no other attributes. */
    className?: string;
}
/**
 * A call already linked to one or more people, so it can be found again: the
 * linked people head the card and open each person, the transcript loads in
 * full when opened, and the footer holds the call's insights with a generate
 * action. A header action links the call to one more person through a search
 * dialog. The card keeps no record of its own: the host updates `people`
 * once a link is saved.
 */
declare function MatchedCallCard<TPerson extends CallPerson>({ title, people, onOpenPerson, source, timestamp, participants, summary, transcript, segments, loadTranscript, linkPerson, insights, roleMatches, labels, className, }: MatchedCallCardProps<TPerson>): react.JSX.Element;

export { MatchedCallCard, type MatchedCallCardLabels, type MatchedCallCardProps, type MatchedCallLinkPerson };
