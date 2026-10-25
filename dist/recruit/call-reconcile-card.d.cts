import * as react from 'react';
import { ReactNode } from 'react';
import { CallParticipant, CallSegment } from '@epicbagel/saas-kit/primitives/call-card';
import { CallPerson, CallTranscript, SearchCallPeople } from './call-data.cjs';

/** Host-owned wording for the card's fixed parts. */
interface CallReconcileCardLabels {
    /** The heading when the call has no title. */
    untitled: string;
    /** The transcript toggle while it is closed. */
    showTranscript: string;
    /** What the footer asks the recruiter to do. */
    heading: ReactNode;
    dismiss: ReactNode;
    /** Starts the hint when the host suggests a person it couldn't find. */
    notFound: (name: string) => ReactNode;
    /** The rest of the hint under the heading. */
    hint: ReactNode;
    /** The rest of the hint when the host picks the person (`onPickOther`). */
    pickHint: ReactNode;
    /** The button that hands picking a person to the host, worded by whether there are possible matches above it. */
    pickOther: (hasMatches: boolean) => ReactNode;
    /** The eyebrow over the possible matches. */
    possibleMatches: ReactNode;
    /** The search field's placeholder, given the suggested person's name when there is one. */
    searchPlaceholder: (suggestedName?: string) => string;
    /** Opens the dialog that adds a new person from the call. */
    addManually: ReactNode;
    searching: ReactNode;
    noMatchesTitle: string;
    noMatchesDescription: string;
    createTitle: ReactNode;
    /** The eyebrow over the participant shortcuts in the create dialog. */
    useParticipant: ReactNode;
    name: ReactNode;
    namePlaceholder: string;
    email: ReactNode;
    emailPlaceholder: string;
    createSubmit: ReactNode;
    /** The preview dialog's title, read by screen readers only. */
    previewTitle: ReactNode;
    cancel: ReactNode;
    attach: ReactNode;
}
/** Whose call this is, already worded. */
interface CallReconcileOwner {
    label: ReactNode;
    /** The person viewing owns the call: a filled badge rather than an outline. */
    isViewer?: boolean;
}
/** Someone on the call the host believes is new, not yet among its people. */
interface CallReconcileSuggestedPerson {
    name: string;
    email?: string | null;
}
/** The person to create from the call and attach it to. */
interface CallReconcileNewPerson {
    name: string;
    email?: string;
}
/** What every reconcile card shows, however the person is picked. */
interface CallReconcileCardBaseProps {
    title?: ReactNode;
    source?: ReactNode;
    /** The gist of the call, clamped with a show-more toggle when long. */
    summary?: ReactNode;
    timestamp?: ReactNode;
    /** Who was on the call. Also offered as shortcuts in the create dialog. */
    participants?: readonly CallParticipant[];
    /** The transcript preview, until the full transcript loads. */
    transcript?: ReactNode;
    segments?: readonly CallSegment[] | null;
    /** Fetches the full transcript the first time it is opened. */
    loadTranscript?: () => Promise<CallTranscript | null | undefined>;
    /** Whose call it is, as a badge in the header. */
    owner?: CallReconcileOwner;
    /**
     * The host's own controls for the people the call may be about, under the
     * possible-matches eyebrow: buttons that confirm before attaching, say.
     * Shown in place of the buttons `guesses` renders.
     */
    suggestions?: ReactNode;
    /** Named in the hint and the search, and seeds the create dialog. */
    suggestedPerson?: CallReconcileSuggestedPerson | null;
    onDismiss: () => void;
    labels?: Partial<CallReconcileCardLabels>;
    /** Class for the card. Its root is the kit's CallCard, which takes no other attributes. */
    className?: string;
}
/**
 * The card picks the person itself: likely guesses and people found by name
 * are previewed before the call attaches, and a person can be created from
 * the call.
 */
interface CallReconcileSearchProps<TPerson extends CallPerson = CallPerson> {
    /** People the call may be about, offered first. */
    guesses?: readonly TPerson[];
    searchPeople: SearchCallPeople<TPerson>;
    /** Beside the search field, such as a button that looks the suggested person up elsewhere. */
    externalSearch?: ReactNode;
    /** Attaches the call to a person picked from the guesses or the search, after the preview. */
    onAttach: (person: TPerson) => void;
    /** Creates a person from the create dialog and attaches the call to them. */
    onCreateAttach: (person: CallReconcileNewPerson) => void;
    /**
     * The preview of a picked person, above Cancel and Attach this call. `close`
     * dismisses the preview without attaching.
     */
    renderPreview: (person: TPerson, close: () => void) => ReactNode;
    onPickOther?: never;
}
/**
 * The host picks the person: the card offers the host's `suggestions` and one
 * button that opens the host's own people picker, and has no search, preview
 * or create dialog of its own.
 */
interface CallReconcilePickerProps {
    /** Opens the host's people picker. */
    onPickOther: () => void;
    guesses?: never;
    searchPeople?: never;
    externalSearch?: never;
    onAttach?: never;
    onCreateAttach?: never;
    renderPreview?: never;
}
type CallReconcileCardProps<TPerson extends CallPerson = CallPerson> = CallReconcileCardBaseProps & (CallReconcileSearchProps<TPerson> | CallReconcilePickerProps);
/**
 * A call nobody has been attached to yet, and the one decision it needs:
 * attach it to an existing person (a likely guess, or one found by name, each
 * previewed first), create a person from it, or dismiss it. The host owns
 * what each choice saves and removes the card afterwards.
 *
 * With `onPickOther` the host picks the person instead: the card shows the
 * host's `suggestions` and one button for its own picker.
 */
declare function CallReconcileCard<TPerson extends CallPerson>({ title, source, summary, timestamp, participants, transcript, segments, loadTranscript, owner, suggestions, guesses, suggestedPerson, searchPeople, externalSearch, onDismiss, onAttach, onCreateAttach, renderPreview, onPickOther, labels, className, }: CallReconcileCardProps<TPerson>): react.JSX.Element;

export { CallReconcileCard, type CallReconcileCardBaseProps, type CallReconcileCardLabels, type CallReconcileCardProps, type CallReconcileNewPerson, type CallReconcileOwner, type CallReconcilePickerProps, type CallReconcileSearchProps, type CallReconcileSuggestedPerson };
