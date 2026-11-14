"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/pending-action.ts
var _react = require('react');
function isPromiseLike(value) {
  return value != null && typeof value.then === "function";
}
function usePendingCall(action) {
  const [pendingArgs, setPendingArgs] = _react.useState.call(void 0, null);
  const latest = _react.useRef.call(void 0, 0);
  const run = (...args) => {
    if (!action) return;
    const call = ++latest.current;
    const result = action(...args);
    if (isPromiseLike(result)) {
      setPendingArgs(args);
      const settle = () => {
        if (latest.current === call) setPendingArgs(null);
      };
      void Promise.resolve(result).then(settle, settle);
    } else {
      setPendingArgs(null);
    }
  };
  return [pendingArgs !== null, run, pendingArgs];
}
function usePendingAction(action) {
  const [pending, run] = usePendingCall(action);
  return [pending, () => run()];
}
function useLatestCall(action) {
  const [pendingArgs, setPendingArgs] = _react.useState.call(void 0, null);
  const [failure, setFailure] = _react.useState.call(void 0, null);
  const latest = _react.useRef.call(void 0, 0);
  const run = (...args) => {
    if (!action) return;
    const call = ++latest.current;
    setFailure(null);
    let result;
    try {
      result = action(...args);
    } catch (cause) {
      setPendingArgs(null);
      setFailure({ cause });
      return;
    }
    if (!isPromiseLike(result)) {
      setPendingArgs(null);
      return;
    }
    setPendingArgs(args);
    void Promise.resolve(result).then(
      () => {
        if (latest.current === call) setPendingArgs(null);
      },
      (cause) => {
        if (latest.current !== call) return;
        setPendingArgs(null);
        setFailure({ cause });
      }
    );
  };
  return { pendingArgs, failure, run };
}





exports.usePendingCall = usePendingCall; exports.usePendingAction = usePendingAction; exports.useLatestCall = useLatestCall;
