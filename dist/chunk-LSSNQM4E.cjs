"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-presentation-recorder.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var MIME_CANDIDATES = [
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus"
];
function supportedRecordingMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  return _nullishCoalesce(MIME_CANDIDATES.find((mime) => MediaRecorder.isTypeSupported(mime)), () => ( ""));
}
function clock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
var LABELS = {
  description: "Optional. It\u2019s added automatically when you stop recording.",
  record: "Record voice note",
  replace: "Record a replacement",
  requesting: "Requesting microphone\u2026",
  stop: "Stop recording",
  retry: "Retry voice note",
  discard: "Discard recording",
  uploading: "Uploading\u2026",
  transcribing: "Transcribing\u2026",
  added: "Voice note added. It will be included when you share.",
  takePlayer: "Preview voice recommendation",
  existingPlayer: "Current voice recommendation",
  unsupported: "Voice recording is not supported in this browser.",
  blocked: "Microphone access is blocked. Allow it in your browser, then try again.",
  noMicrophone: "No microphone is available.",
  interrupted: "The recording was interrupted. Try another take.",
  empty: "Nothing was recorded. Try another take.",
  acceptFailed: "The recording could not be uploaded. Your take is still here; retry when ready."
};
function NativeAudio({ src, label }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "audio", { src, "aria-label": label, controls: true, preload: "metadata" });
}
function CandidatePresentationRecorder({
  onAccept,
  externalState = "idle",
  existingAudio,
  onPendingChange,
  disabled = false,
  renderAudio = NativeAudio,
  labels,
  ...props
}) {
  const copy = { ...LABELS, ...labels };
  const [state, setState] = _react.useState.call(void 0, existingAudio ? "ready" : "idle");
  const [error, setError] = _react.useState.call(void 0, null);
  const [elapsed, setElapsed] = _react.useState.call(void 0, 0);
  const [take, setTake] = _react.useState.call(void 0, null);
  const recorderRef = _react.useRef.call(void 0, null);
  const streamRef = _react.useRef.call(void 0, null);
  const chunksRef = _react.useRef.call(void 0, []);
  const shownState = externalState === "uploading" || externalState === "transcribing" ? externalState : state;
  const pending = ["requesting", "recording", "uploading", "transcribing"].includes(shownState) || state === "preview" && !!take;
  _react.useEffect.call(void 0, () => {
    _optionalChain([onPendingChange, 'optionalCall', _ => _(pending)]);
  }, [pending, onPendingChange]);
  _react.useEffect.call(void 0, () => {
    if (state !== "recording") return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1e3);
    return () => window.clearInterval(timer);
  }, [state]);
  _react.useEffect.call(void 0, () => () => {
    if (_optionalChain([recorderRef, 'access', _2 => _2.current, 'optionalAccess', _3 => _3.state]) === "recording") recorderRef.current.stop();
    _optionalChain([streamRef, 'access', _4 => _4.current, 'optionalAccess', _5 => _5.getTracks, 'call', _6 => _6(), 'access', _7 => _7.forEach, 'call', _8 => _8((track) => track.stop())]);
    if (take) URL.revokeObjectURL(take.url);
  }, [take]);
  async function start() {
    setError(null);
    if (!_optionalChain([navigator, 'access', _9 => _9.mediaDevices, 'optionalAccess', _10 => _10.getUserMedia]) || typeof MediaRecorder === "undefined") {
      setError(copy.unsupported);
      setState("error");
      return;
    }
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = supportedRecordingMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      setElapsed(0);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        setError(copy.interrupted);
        setState("error");
      };
      recorder.start();
      setState("recording");
    } catch (reason) {
      const name = _optionalChain([reason, 'optionalAccess', _11 => _11.name]);
      setError(name === "NotAllowedError" || name === "SecurityError" ? copy.blocked : copy.noMicrophone);
      setState("error");
    }
  }
  function stop() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    recorder.onstop = () => {
      _optionalChain([streamRef, 'access', _12 => _12.current, 'optionalAccess', _13 => _13.getTracks, 'call', _14 => _14(), 'access', _15 => _15.forEach, 'call', _16 => _16((track) => track.stop())]);
      streamRef.current = null;
      recorderRef.current = null;
      const mimeType = recorder.mimeType || supportedRecordingMimeType() || "audio/webm";
      const blob = new Blob(chunksRef.current, { type: mimeType });
      chunksRef.current = [];
      if (!blob.size) {
        setError(copy.empty);
        setState("error");
        return;
      }
      if (take) URL.revokeObjectURL(take.url);
      const recorded = { blob, mimeType, url: URL.createObjectURL(blob) };
      setTake(recorded);
      void accept(recorded);
    };
    recorder.stop();
  }
  function discard() {
    if (take) URL.revokeObjectURL(take.url);
    setTake(null);
    setState(existingAudio ? "ready" : "idle");
    setError(null);
    setElapsed(0);
  }
  async function accept(recorded = take) {
    if (!recorded) return;
    setError(null);
    setState("uploading");
    try {
      await onAccept(recorded.blob, recorded.mimeType);
      setState("ready");
    } catch (reason) {
      const message = _optionalChain([reason, 'optionalAccess', _17 => _17.message]);
      setError(typeof message === "string" && message ? message : copy.acceptFailed);
      setState("preview");
    }
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-presentation-recorder", gap: "md", ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", align: "start", justify: "between", gap: "md", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { gap: "xs", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", children: copy.description }) }),
      (shownState === "recording" || shownState === "preview") && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", font: "mono", children: clock(elapsed) })
    ] }),
    take && renderAudio({ src: take.url, label: copy.takePlayer }),
    !take && existingAudio && renderAudio({ src: existingAudio, label: copy.existingPlayer }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", wrap: true, children: [
      (shownState === "idle" || shownState === "ready" || shownState === "error") && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { type: "button", variant: "outline", disabled, onClick: () => void start(), children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Mic, size: "sm" }),
        " ",
        existingAudio ? copy.replace : copy.record
      ] }),
      shownState === "requesting" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "outline", disabled: true, children: copy.requesting }),
      shownState === "recording" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { type: "button", variant: "outline", onClick: stop, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.CircleStop, size: "sm" }),
        " ",
        copy.stop
      ] }),
      shownState === "preview" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { type: "button", variant: "outline", disabled, onClick: () => void accept(), children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.RotateCcw, size: "sm" }),
          " ",
          copy.retry
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { type: "button", variant: "quiet", disabled, onClick: discard, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Trash2, size: "sm" }),
          " ",
          copy.discard
        ] })
      ] }),
      (shownState === "uploading" || shownState === "transcribing") && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "outline", disabled: true, children: shownState === "uploading" ? copy.uploading : copy.transcribing })
    ] }),
    shownState === "ready" && take && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", children: copy.added }),
    error && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { role: "alert", size: "sm", tone: "destructive", children: error })
  ] });
}




exports.supportedRecordingMimeType = supportedRecordingMimeType; exports.CandidatePresentationRecorder = CandidatePresentationRecorder;
