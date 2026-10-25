// src/recruit/call-hooks.ts
import { useCallback, useEffect, useRef, useState } from "react";
var CALL_PEOPLE_SEARCH_MIN_LENGTH = 2;
var CALL_PEOPLE_SEARCH_DELAY_MS = 250;
function useCallPeopleSearch(query, enabled, search) {
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(search);
  useEffect(() => {
    searchRef.current = search;
  });
  useEffect(() => {
    const term = query.trim();
    if (!enabled || term.length < CALL_PEOPLE_SEARCH_MIN_LENGTH) {
      setResults((current) => current.length ? [] : current);
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
function useCallTranscript({
  transcript,
  segments,
  loadTranscript
}) {
  const [full, setFull] = useState(null);
  const loading = useRef(false);
  const load = useCallback(async () => {
    if (!loadTranscript || full || loading.current) return;
    loading.current = true;
    try {
      const next = await loadTranscript();
      if (next) setFull(next);
    } catch {
    } finally {
      loading.current = false;
    }
  }, [full, loadTranscript]);
  return {
    transcript: full?.content ?? transcript,
    segments: full?.segments ?? segments ?? void 0,
    onLoadTranscript: loadTranscript ? () => void load() : void 0
  };
}

export {
  CALL_PEOPLE_SEARCH_MIN_LENGTH,
  useCallPeopleSearch,
  useCallTranscript
};
