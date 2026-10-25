"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/call-hooks.ts
var _react = require('react');
var CALL_PEOPLE_SEARCH_MIN_LENGTH = 2;
var CALL_PEOPLE_SEARCH_DELAY_MS = 250;
function useCallPeopleSearch(query, enabled, search) {
  const [results, setResults] = _react.useState.call(void 0, []);
  const [searching, setSearching] = _react.useState.call(void 0, false);
  const searchRef = _react.useRef.call(void 0, search);
  _react.useEffect.call(void 0, () => {
    searchRef.current = search;
  });
  _react.useEffect.call(void 0, () => {
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
      } catch (e) {
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
  const [full, setFull] = _react.useState.call(void 0, null);
  const loading = _react.useRef.call(void 0, false);
  const load = _react.useCallback.call(void 0, async () => {
    if (!loadTranscript || full || loading.current) return;
    loading.current = true;
    try {
      const next = await loadTranscript();
      if (next) setFull(next);
    } catch (e2) {
    } finally {
      loading.current = false;
    }
  }, [full, loadTranscript]);
  return {
    transcript: _nullishCoalesce(_optionalChain([full, 'optionalAccess', _ => _.content]), () => ( transcript)),
    segments: _nullishCoalesce(_nullishCoalesce(_optionalChain([full, 'optionalAccess', _2 => _2.segments]), () => ( segments)), () => ( void 0)),
    onLoadTranscript: loadTranscript ? () => void load() : void 0
  };
}





exports.CALL_PEOPLE_SEARCH_MIN_LENGTH = CALL_PEOPLE_SEARCH_MIN_LENGTH; exports.useCallPeopleSearch = useCallPeopleSearch; exports.useCallTranscript = useCallTranscript;
