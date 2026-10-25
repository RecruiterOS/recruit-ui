import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import type {
  CallPerson,
  CallSegment,
  CallTranscript,
  SearchCallPeople,
} from "./call-data";

/** The shortest query that is searched. */
export const CALL_PEOPLE_SEARCH_MIN_LENGTH = 2;
/** How long typing must pause before a search runs. */
export const CALL_PEOPLE_SEARCH_DELAY_MS = 250;

/**
 * Debounced people search for the call cards. The host's search runs with
 * the trimmed query once it is long enough and typing has paused; a newer
 * query, closing the search or unmounting aborts the one in flight and
 * discards its results. A failed search shows no results.
 */
export function useCallPeopleSearch<TPerson extends CallPerson>(
  query: string,
  enabled: boolean,
  search: SearchCallPeople<TPerson>,
) {
  const [results, setResults] = useState<readonly TPerson[]>([]);
  const [searching, setSearching] = useState(false);
  // The latest search function, so a host passing an inline arrow doesn't
  // restart the debounce on every render.
  const searchRef = useRef(search);
  useEffect(() => {
    searchRef.current = search;
  });

  useEffect(() => {
    const term = query.trim();
    if (!enabled || term.length < CALL_PEOPLE_SEARCH_MIN_LENGTH) {
      setResults((current) => (current.length ? [] : current));
      setSearching(false);
      return;
    }
    const controller = new AbortController();
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const found = await searchRef.current(term, controller.signal);
        if (!controller.signal.aborted) setResults(found);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, CALL_PEOPLE_SEARCH_DELAY_MS);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, enabled]);

  return { results, searching };
}

/**
 * A call card's transcript: the preview the host passed, until the first time
 * the transcript is opened loads the full one through `loadTranscript`. It
 * loads at most once at a time and keeps what it loaded; a failed or empty
 * load leaves the preview in place.
 */
export function useCallTranscript({
  transcript,
  segments,
  loadTranscript,
}: {
  transcript?: ReactNode;
  segments?: readonly CallSegment[] | null;
  loadTranscript?: () => Promise<CallTranscript | null | undefined>;
}) {
  const [full, setFull] = useState<CallTranscript | null>(null);
  const loading = useRef(false);

  const load = useCallback(async () => {
    if (!loadTranscript || full || loading.current) return;
    loading.current = true;
    try {
      const next = await loadTranscript();
      if (next) setFull(next);
    } catch {
      // The preview stays; the host reports its own failures.
    } finally {
      loading.current = false;
    }
  }, [full, loadTranscript]);

  return {
    transcript: full?.content ?? transcript,
    segments: (full?.segments ?? segments ?? undefined) as CallSegment[] | undefined,
    onLoadTranscript: loadTranscript ? () => void load() : undefined,
  };
}
