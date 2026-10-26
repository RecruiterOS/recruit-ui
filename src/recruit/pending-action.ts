import { useRef, useState } from "react";

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return value != null && typeof (value as PromiseLike<unknown>).then === "function";
}

/**
 * Runs a host callback with the arguments given. While a returned promise is
 * pending, `pending` is true and `pendingArgs` holds what the latest call
 * passed, so a control can keep showing what it sent (a list it saved, say)
 * until the host answers, without the host tracking it. Only the latest call
 * settles the state: an earlier promise that settles after a later call began
 * changes nothing. A callback that returns no promise is never pending. The
 * host handles a failure in its own callback; this only waits for it to
 * settle.
 */
export function usePendingCall<TArgs extends unknown[]>(
  action: ((...args: TArgs) => unknown) | undefined,
) {
  const [pendingArgs, setPendingArgs] = useState<TArgs | null>(null);
  const latest = useRef(0);
  const run = (...args: TArgs) => {
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
  return [pendingArgs !== null, run, pendingArgs] as const;
}

/**
 * Runs a button's action. While a returned promise is pending, `pending` is
 * true, so the button can show a spinner or disable itself without the host
 * tracking which row is busy. The host handles a failure in its own callback;
 * the button only waits for it to settle. The runner passes none of its own
 * arguments on, so it can be a click handler without handing the host the
 * event.
 */
export function usePendingAction(action: (() => unknown) | undefined) {
  const [pending, run] = usePendingCall(action);
  return [pending, () => run()] as const;
}
