import type { CallParticipant, CallSegment } from "@epicbagel/saas-kit/primitives/call-card";

export type { CallParticipant, CallSegment };

/** A person a call can be attached to: whatever record the host keeps, with a display name. */
export interface CallPerson {
  id: string | number;
  name: string;
}

/** The full transcript of a call, fetched on demand by the host. */
export interface CallTranscript {
  content: string;
  segments?: readonly CallSegment[] | null;
}

/**
 * Finds people for a typed name. Called with the trimmed query once it is at
 * least two characters and typing has paused; the signal aborts when the
 * query changes or the component unmounts, so pass it to your fetch.
 */
export type SearchCallPeople<TPerson extends CallPerson = CallPerson> = (
  query: string,
  signal: AbortSignal,
) => Promise<readonly TPerson[]>;

/** Where the host's check of a call against its open roles stands. */
export type CallInsightsStatus = "idle" | "ready" | "failed";

/**
 * The host's insight state for one call, as the call cards read it. The
 * host runs the check, polls for it and words the error; the cards only show
 * the state and call `onGenerate`.
 */
export interface CallInsights {
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
export function normalizeCallParticipants(raw: readonly unknown[]): CallParticipant[] {
  const seen = new Set<string>();
  const output: CallParticipant[] = [];
  for (const participant of raw) {
    let name: string | undefined;
    let email: string | undefined;
    if (typeof participant === "string") {
      if (participant.includes("@")) email = participant.trim();
      else name = participant.trim();
    } else if (participant && typeof participant === "object") {
      const value = participant as { name?: string; email?: string };
      name = value.name?.trim() || undefined;
      email = value.email?.trim() || undefined;
    }
    if (!name && !email) continue;
    const key = (email || name || "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push({ name, email });
  }
  return output;
}

/** Keeps the transcript turns that have text to show, dropping anything else in the list. */
export function normalizeCallSegments(raw: readonly unknown[]): CallSegment[] {
  return raw.filter(
    (segment): segment is CallSegment =>
      segment != null &&
      typeof segment === "object" &&
      typeof (segment as { text?: unknown }).text === "string" &&
      (segment as { text: string }).text !== "",
  );
}
