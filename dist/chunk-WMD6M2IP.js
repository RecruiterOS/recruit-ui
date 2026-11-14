// src/recruit/pending-action.ts
import { useRef, useState } from "react";
function isPromiseLike(value) {
  return value != null && typeof value.then === "function";
}
function usePendingCall(action) {
  const [pendingArgs, setPendingArgs] = useState(null);
  const latest = useRef(0);
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
  const [pendingArgs, setPendingArgs] = useState(null);
  const [failure, setFailure] = useState(null);
  const latest = useRef(0);
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

export {
  usePendingCall,
  usePendingAction,
  useLatestCall
};
