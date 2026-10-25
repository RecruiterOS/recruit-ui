import { CallSegment, CallParticipant } from '@epicbagel/saas-kit/primitives/call-card';
export { CallParticipant, CallSegment } from '@epicbagel/saas-kit/primitives/call-card';

/** A person a call can be attached to: whatever record the host keeps, with a display name. */
interface CallPerson {
    id: string | number;
    name: string;
}
/** The full transcript of a call, fetched on demand by the host. */
interface CallTranscript {
    content: string;
    segments?: readonly CallSegment[] | null;
}
/**
 * Finds people for a typed name. Called with the trimmed query once it is at
 * least two characters and typing has paused; the signal aborts when the
 * query changes or the component unmounts, so pass it to your fetch.
 */
type SearchCallPeople<TPerson extends CallPerson = CallPerson> = (query: string, signal: AbortSignal) => Promise<readonly TPerson[]>;
/** Where the host's check of a call against its open roles stands. */
type CallInsightsStatus = "idle" | "ready" | "failed";
/**
 * The host's insight state for one call, as the call cards read it. The
 * host runs the check, polls for it and words the error; the cards only show
 * the state and call `onGenerate`.
 */
interface CallInsights {
    /** `ready` once insights exist; `failed` when the last attempt left none. */
    status: CallInsightsStatus;
    /** A check is running: the generate control is disabled and shows progress. */
    generating: boolean;
    /** The last error, already worded. */
    error?: string | null;
    /** Starts a check. `force` is true when insights already exist, to regenerate them. */
    onGenerate: (force: boolean) => void;
}
/**
 * Turns raw participants (names, email addresses, or `{ name, email }`
 * objects) into the call card's participants: trimmed, with blanks dropped
 * and each person listed once, matched by email or else by name, ignoring
 * case. A bare string with an `@` is read as an email address.
 */
declare function normalizeCallParticipants(raw: readonly unknown[]): CallParticipant[];
/** Keeps the transcript turns that have text to show, dropping anything else in the list. */
declare function normalizeCallSegments(raw: readonly unknown[]): CallSegment[];

export { type CallInsights, type CallInsightsStatus, type CallPerson, type CallTranscript, type SearchCallPeople, normalizeCallParticipants, normalizeCallSegments };
