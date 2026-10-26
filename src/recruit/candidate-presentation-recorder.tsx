"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { CircleStop, Mic, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";

/**
 * Where a recording stands. The recorder moves itself through `idle`,
 * `requesting` (asking for the microphone), `recording`, `uploading` (while
 * `onAccept` runs), `ready`, `preview` (a take whose upload failed, kept to
 * retry) and `error`. `transcribing` is yours to show through
 * `externalState`, as `uploading` can be.
 */
export type CandidatePresentationRecorderState =
  | "idle"
  | "requesting"
  | "recording"
  | "preview"
  | "uploading"
  | "transcribing"
  | "ready"
  | "error";

const MIME_CANDIDATES = [
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
];

/**
 * The first audio format this browser's MediaRecorder can write, preferring
 * MP4 (which every browser plays back) over WebM and Ogg, or "" when it has
 * no MediaRecorder or supports none of them.
 */
export function supportedRecordingMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  return MIME_CANDIDATES.find((mime) => MediaRecorder.isTypeSupported(mime)) ?? "";
}

function clock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export interface CandidatePresentationRecorderLabels {
  /** The muted line above the controls: what the note is for and what happens to it. */
  description: ReactNode;
  /** Starts a first recording. */
  record: ReactNode;
  /** Starts a recording that replaces `existingAudio`. */
  replace: ReactNode;
  /** While the browser asks for the microphone. */
  requesting: ReactNode;
  /** Stops the recording, which hands the take to `onAccept`. */
  stop: ReactNode;
  /** Hands a take whose upload failed to `onAccept` again. */
  retry: ReactNode;
  /** Throws away a take whose upload failed. */
  discard: ReactNode;
  /** While `onAccept` runs. */
  uploading: ReactNode;
  /** While `externalState` is `transcribing`. */
  transcribing: ReactNode;
  /** Under the controls once a new take is accepted. */
  added: ReactNode;
  /** The new take's player's accessible name. */
  takePlayer: string;
  /** The `existingAudio` player's accessible name. */
  existingPlayer: string;
  /** The browser can't record audio. */
  unsupported: ReactNode;
  /** The person or the browser blocked the microphone. */
  blocked: ReactNode;
  /** No microphone was found. */
  noMicrophone: ReactNode;
  /** The recording stopped with an error. */
  interrupted: ReactNode;
  /** The take came back empty. */
  empty: ReactNode;
  /** `onAccept` failed without a message of its own. */
  acceptFailed: ReactNode;
}

const LABELS: CandidatePresentationRecorderLabels = {
  description: "Optional. It’s added automatically when you stop recording.",
  record: "Record voice note",
  replace: "Record a replacement",
  requesting: "Requesting microphone…",
  stop: "Stop recording",
  retry: "Retry voice note",
  discard: "Discard recording",
  uploading: "Uploading…",
  transcribing: "Transcribing…",
  added: "Voice note added. It will be included when you share.",
  takePlayer: "Preview voice recommendation",
  existingPlayer: "Current voice recommendation",
  unsupported: "Voice recording is not supported in this browser.",
  blocked: "Microphone access is blocked. Allow it in your browser, then try again.",
  noMicrophone: "No microphone is available.",
  interrupted: "The recording was interrupted. Try another take.",
  empty: "Nothing was recorded. Try another take.",
  acceptFailed: "The recording could not be uploaded. Your take is still here; retry when ready.",
};

/** What `renderAudio` receives: a playable URL and the player's accessible name. */
export interface CandidatePresentationRecorderAudio {
  src: string;
  label: string;
}

function NativeAudio({ src, label }: CandidatePresentationRecorderAudio) {
  return <audio src={src} aria-label={label} controls preload="metadata" />;
}

export interface CandidatePresentationRecorderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Called with each finished take, as soon as recording stops. Upload or
   * save it here. While it runs the recorder shows `uploading`; if it throws,
   * the take stays playable with Retry and Discard, and the error's message
   * (or `labels.acceptFailed`) shows under the controls.
   */
  onAccept: (blob: Blob, mimeType: string) => Promise<void>;
  /**
   * Shows `uploading` or `transcribing` from outside, such as while you
   * transcribe an accepted take. Any other value leaves the recorder's own
   * state showing.
   */
  externalState?: CandidatePresentationRecorderState;
  /** A recording already saved, playable until a new take is accepted. */
  existingAudio?: string | null;
  /**
   * Told whether a take is in progress or unsaved (requesting, recording,
   * uploading, transcribing, or a take kept to retry), so you can hold off
   * closing or sharing until it settles.
   */
  onPendingChange?: (pending: boolean) => void;
  /** Disables starting, retrying and discarding. Stopping a recording stays possible. */
  disabled?: boolean;
  /** Renders a player. Defaults to the browser's own audio controls. */
  renderAudio?: (audio: CandidatePresentationRecorderAudio) => ReactNode;
  labels?: Partial<CandidatePresentationRecorderLabels>;
}

/**
 * Records a short voice note to send with a person's profile, such as your
 * recommendation to a client: Record, a running clock, Stop, then a player
 * for the take. Each take goes straight to your `onAccept`; a failed one
 * stays playable to retry or discard, so nobody has to record it again. It
 * uses the browser's MediaRecorder and picks the format with
 * `supportedRecordingMimeType`. Uploading, transcribing and saving are yours.
 *
 * The root is marked `data-slot="candidate-presentation-recorder"`.
 */
export function CandidatePresentationRecorder({
  onAccept,
  externalState = "idle",
  existingAudio,
  onPendingChange,
  disabled = false,
  renderAudio = NativeAudio,
  labels,
  ...props
}: CandidatePresentationRecorderProps) {
  const copy = { ...LABELS, ...labels };
  const [state, setState] = useState<CandidatePresentationRecorderState>(existingAudio ? "ready" : "idle");
  const [error, setError] = useState<ReactNode>(null);
  const [elapsed, setElapsed] = useState(0);
  const [take, setTake] = useState<{ blob: Blob; mimeType: string; url: string } | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const shownState = externalState === "uploading" || externalState === "transcribing" ? externalState : state;

  const pending = ["requesting", "recording", "uploading", "transcribing"].includes(shownState)
    || (state === "preview" && !!take);
  useEffect(() => {
    onPendingChange?.(pending);
  }, [pending, onPendingChange]);

  useEffect(() => {
    if (state !== "recording") return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1_000);
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
      const name = (reason as { name?: unknown } | null)?.name;
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
      // Keep the playable take so a transient upload failure never forces
      // anyone to record the note again.
      const message = (reason as { message?: unknown } | null)?.message;
      setError(typeof message === "string" && message ? message : copy.acceptFailed);
      setState("preview");
    }
  }

  return (
    <Stack data-slot="candidate-presentation-recorder" gap="md" {...props}>
      <Stack direction="horizontal" align="start" justify="between" gap="md">
        <Stack gap="xs">
          <Text size="sm" tone="muted">
            {copy.description}
          </Text>
        </Stack>
        {(shownState === "recording" || shownState === "preview") && (
          <Text size="sm" font="mono">{clock(elapsed)}</Text>
        )}
      </Stack>

      {take && renderAudio({ src: take.url, label: copy.takePlayer })}
      {!take && existingAudio && renderAudio({ src: existingAudio, label: copy.existingPlayer })}

      <Stack direction="horizontal" gap="sm" wrap>
        {(shownState === "idle" || shownState === "ready" || shownState === "error") && (
          <Button type="button" variant="outline" disabled={disabled} onClick={() => void start()}>
            <Icon icon={Mic} size="sm" /> {existingAudio ? copy.replace : copy.record}
          </Button>
        )}
        {shownState === "requesting" && <Button type="button" variant="outline" disabled>{copy.requesting}</Button>}
        {shownState === "recording" && (
          <Button type="button" variant="outline" onClick={stop}><Icon icon={CircleStop} size="sm" /> {copy.stop}</Button>
        )}
        {shownState === "preview" && (
          <>
            <Button type="button" variant="outline" disabled={disabled} onClick={() => void accept()}>
              <Icon icon={RotateCcw} size="sm" /> {copy.retry}
            </Button>
            <Button type="button" variant="quiet" disabled={disabled} onClick={discard}>
              <Icon icon={Trash2} size="sm" /> {copy.discard}
            </Button>
          </>
        )}
        {(shownState === "uploading" || shownState === "transcribing") && (
          <Button type="button" variant="outline" disabled>
            {shownState === "uploading" ? copy.uploading : copy.transcribing}
          </Button>
        )}
      </Stack>
      {shownState === "ready" && take && <Text size="sm" tone="muted">{copy.added}</Text>}
      {error && <Text role="alert" size="sm" tone="destructive">{error}</Text>}
    </Stack>
  );
}
