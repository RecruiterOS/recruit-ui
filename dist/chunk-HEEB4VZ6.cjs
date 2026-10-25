"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkF6OCYUGDcjs = require('./chunk-F6OCYUGD.cjs');

// src/recruit/candidate-signal-menu.tsx
var _jsxruntime = require('react/jsx-runtime');
function CandidateSignalMenu({
  items,
  onSelect,
  disabled,
  label = "Signal actions"
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkF6OCYUGDcjs.CandidateActionMenu,
    {
      items,
      onSelect,
      disabled,
      label,
      triggerIconSize: "sm",
      isolateClicks: true
    }
  );
}



exports.CandidateSignalMenu = CandidateSignalMenu;
