// src/recruit/candidate-presentation-recorder.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { CircleStop, Mic, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var MIME_CANDIDATES = [
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus"
];
function supportedRecordingMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  return MIME_CANDIDATES.find((mime) => MediaRecorder.isTypeSupported(mime)) ?? "";
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
  return /* @__PURE__ */ jsx("audio", { src, "aria-label": label, controls: true, preload: "metadata" });
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
  const [state, setState] = useState(existingAudio ? "ready" : "idle");
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [take, setTake] = useState(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const shownState = externalState === "uploading" || externalState === "transcribing" ? externalState : state;
  const pending = ["requesting", "recording", "uploading", "transcribing"].includes(shownState) || state === "preview" && !!take;
  useEffect(() => {
    onPendingChange?.(pending);
  }, [pending, onPendingChange]);
  useEffect(() => {
    if (state !== "recording") return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1e3);
    return () => window.clearInterval(timer);
  }, [state]);
  useEffect(() => () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (take) URL.revokeObjectURL(take.url);
  }, [take]);
  async function start() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
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
      const name = reason?.name;
      setError(name === "NotAllowedError" || name === "SecurityError" ? copy.blocked : copy.noMicrophone);
      setState("error");
    }
  }
  function stop() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    recorder.onstop = () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
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
      const message = reason?.message;
      setError(typeof message === "string" && message ? message : copy.acceptFailed);
      setState("preview");
    }
  }
  return /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-presentation-recorder", gap: "md", ...props, children: [
    /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", align: "start", justify: "between", gap: "md", children: [
      /* @__PURE__ */ jsx(Stack, { gap: "xs", children: /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", children: copy.description }) }),
      (shownState === "recording" || shownState === "preview") && /* @__PURE__ */ jsx(Text, { size: "sm", font: "mono", children: clock(elapsed) })
    ] }),
    take && renderAudio({ src: take.url, label: copy.takePlayer }),
    !take && existingAudio && renderAudio({ src: existingAudio, label: copy.existingPlayer }),
    /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", wrap: true, children: [
      (shownState === "idle" || shownState === "ready" || shownState === "error") && /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", disabled, onClick: () => void start(), children: [
        /* @__PURE__ */ jsx(Icon, { icon: Mic, size: "sm" }),
        " ",
        existingAudio ? copy.replace : copy.record
      ] }),
      shownState === "requesting" && /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", disabled: true, children: copy.requesting }),
      shownState === "recording" && /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", onClick: stop, children: [
        /* @__PURE__ */ jsx(Icon, { icon: CircleStop, size: "sm" }),
        " ",
        copy.stop
      ] }),
      shownState === "preview" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", disabled, onClick: () => void accept(), children: [
          /* @__PURE__ */ jsx(Icon, { icon: RotateCcw, size: "sm" }),
          " ",
          copy.retry
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "button", variant: "quiet", disabled, onClick: discard, children: [
          /* @__PURE__ */ jsx(Icon, { icon: Trash2, size: "sm" }),
          " ",
          copy.discard
        ] })
      ] }),
      (shownState === "uploading" || shownState === "transcribing") && /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", disabled: true, children: shownState === "uploading" ? copy.uploading : copy.transcribing })
    ] }),
    shownState === "ready" && take && /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", children: copy.added }),
    error && /* @__PURE__ */ jsx(Text, { role: "alert", size: "sm", tone: "destructive", children: error })
  ] });
}

export {
  supportedRecordingMimeType,
  CandidatePresentationRecorder
};
