import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

/**
 * Where a recording stands. The recorder moves itself through `idle`,
 * `requesting` (asking for the microphone), `recording`, `uploading` (while
 * `onAccept` runs), `ready`, `preview` (a take whose upload failed, kept to
 * retry) and `error`. `transcribing` is yours to show through
 * `externalState`, as `uploading` can be.
 */
type CandidatePresentationRecorderState = "idle" | "requesting" | "recording" | "preview" | "uploading" | "transcribing" | "ready" | "error";
/**
 * The first audio format this browser's MediaRecorder can write, preferring
 * MP4 (which every browser plays back) over WebM and Ogg, or "" when it has
 * no MediaRecorder or supports none of them.
 */
declare function supportedRecordingMimeType(): string;
interface CandidatePresentationRecorderLabels {
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
/** What `renderAudio` receives: a playable URL and the player's accessible name. */
interface CandidatePresentationRecorderAudio {
    src: string;
    label: string;
}
interface CandidatePresentationRecorderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
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
declare function CandidatePresentationRecorder({ onAccept, externalState, existingAudio, onPendingChange, disabled, renderAudio, labels, ...props }: CandidatePresentationRecorderProps): react.JSX.Element;

export { CandidatePresentationRecorder, type CandidatePresentationRecorderAudio, type CandidatePresentationRecorderLabels, type CandidatePresentationRecorderProps, type CandidatePresentationRecorderState, supportedRecordingMimeType };
