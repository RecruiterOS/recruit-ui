// src/recruit/pending-action.ts
import { useState } from "react";
function usePendingAction(action) {
  const [pending, setPending] = useState(false);
  const run = () => {
    if (!action) return;
    const result = action();
    if (result && typeof result.then === "function") {
      setPending(true);
      const settle = () => setPending(false);
      void result.then(settle, settle);
    }
  };
  return [pending, run];
}

export {
  usePendingAction
};
