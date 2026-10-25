"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkL4NKRH4Qcjs = require('./chunk-L4NKRH4Q.cjs');

// src/recruit/candidate-voice-note.tsx
var _hiddencontrol = require('@epicbagel/saas-kit/primitives/hidden-control');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _voicedictationbutton = require('@epicbagel/saas-kit/primitives/voice-dictation-button');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function useCandidateVoiceNote({
  onCommit,
  title = "Leave a note",
  caption = "listening"
}) {
  const anchor = _react.useRef.call(void 0, null);
  const open = _react.useCallback.call(void 0, () => {
    _optionalChain([anchor, 'access', _ => _.current, 'optionalAccess', _2 => _2.click, 'call', _3 => _3()]);
  }, []);
  return {
    open,
    trigger: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkL4NKRH4Qcjs.CandidateIconAction, { icon: _lucidereact.Mic, title, onClick: open }),
    control: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _hiddencontrol.HiddenControl, { onClick: (event) => event.stopPropagation(), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _voicedictationbutton.VoiceDictationButton,
      {
        size: "sm",
        title,
        caption,
        onCommit: (text) => {
          void onCommit(text);
        },
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", ref: anchor })
      }
    ) })
  };
}



exports.useCandidateVoiceNote = useCandidateVoiceNote;
