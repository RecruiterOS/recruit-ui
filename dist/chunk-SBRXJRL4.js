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

export {
  usePendingCall,
  usePendingAction
};
