"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/pending-action.ts
var _react = require('react');
function usePendingAction(action) {
  const [pending, setPending] = _react.useState.call(void 0, false);
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



exports.usePendingAction = usePendingAction;
