"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-destination-status.tsx


var _connectionstatusbar = require('@epicbagel/saas-kit/primitives/connection-status-bar');
var _jsxruntime = require('react/jsx-runtime');
function CandidateDestinationStatus({
  state,
  name,
  description,
  facts,
  actions,
  progress,
  progressLabel,
  details,
  open,
  defaultOpen,
  onOpenChange,
  className
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _connectionstatusbar.ConnectionStatusBar,
    {
      state,
      name,
      description,
      facts,
      actions,
      progress,
      progressLabel,
      open,
      defaultOpen,
      onOpenChange,
      className,
      children: details
    }
  );
}



exports.CandidateDestinationStatus = CandidateDestinationStatus;
