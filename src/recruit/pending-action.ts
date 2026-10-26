import { useState } from "react";

/**
 * Runs a button's action. While a returned promise is pending, `pending` is
 * true, so the button can show a spinner or disable itself without the host
 * tracking which row is busy. The host handles a failure in its own callback;
 * the button only waits for it to settle.
 */
export function usePendingAction(action: (() => unknown) | undefined) {
  const [pending, setPending] = useState(false);
  const run = () => {
    if (!action) return;
    const result = action();
    if (result && typeof (result as Promise<unknown>).then === "function") {
      setPending(true);
      const settle = () => setPending(false);
      void (result as Promise<unknown>).then(settle, settle);
    }
  };
  return [pending, run] as const;
}
