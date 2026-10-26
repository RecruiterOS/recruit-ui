import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CandidatePresentationRecorder,
  supportedRecordingMimeType,
} from "./candidate-presentation-recorder";

// Fictional media URLs only.

const originalMediaRecorder = globalThis.MediaRecorder;
const originalMediaDevices = navigator.mediaDevices;
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

function setGlobal(target: object, key: string, value: unknown) {
  Object.defineProperty(target, key, { configurable: true, writable: true, value });
}

afterEach(() => {
  // Unmount first: the recorder revokes its take's URL as it goes.
  cleanup();
  setGlobal(globalThis, "MediaRecorder", originalMediaRecorder);
  setGlobal(navigator, "mediaDevices", originalMediaDevices);
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
});

/** A MediaRecorder that records one chunk of fictional audio on stop. */
class RecorderStub {
  static isTypeSupported(mime: string) {
    return mime === "audio/webm;codecs=opus";
  }
  static last: RecorderStub | null = null;
  state: "inactive" | "recording" = "inactive";
  mimeType: string;
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(_stream: unknown, options?: { mimeType?: string }) {
    this.mimeType = options?.mimeType ?? "";
    RecorderStub.last = this;
  }
  start() {
    this.state = "recording";
  }
  stop() {
    this.state = "inactive";
    this.ondataavailable?.({ data: new Blob(["fictional audio"], { type: this.mimeType }) });
    this.onstop?.();
  }
}

function installRecorder() {
  setGlobal(globalThis, "MediaRecorder", RecorderStub);
  setGlobal(navigator, "mediaDevices", {
    getUserMedia: vi.fn(async () => ({ getTracks: () => [{ stop: vi.fn() }] })),
  });
  URL.createObjectURL = vi.fn(() => "blob:fictional-take");
  URL.revokeObjectURL = vi.fn();
}

describe("supportedRecordingMimeType", () => {
  it("chooses the first recording format the browser supports, or none without a recorder", () => {
    setGlobal(globalThis, "MediaRecorder", RecorderStub);
    expect(supportedRecordingMimeType()).toBe("audio/webm;codecs=opus");
    setGlobal(globalThis, "MediaRecorder", undefined);
    expect(supportedRecordingMimeType()).toBe("");
  });
});

describe("candidate presentation recorder", () => {
  it("keeps an existing recording playable until a replacement is accepted", () => {
    const { container } = render(
      <CandidatePresentationRecorder
        existingAudio="https://media.example/recommendation.m4a"
        onAccept={async () => undefined}
      />,
    );

    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-presentation-recorder");
    expect(screen.getByLabelText("Current voice recommendation")).toHaveAttribute(
      "src",
      "https://media.example/recommendation.m4a",
    );
    expect(screen.getByRole("button", { name: /Record a replacement/ })).toBeInTheDocument();
  });

  it("renders players through the host's slot and wording", () => {
    render(
      <CandidatePresentationRecorder
        existingAudio="https://media.example/note.m4a"
        onAccept={async () => undefined}
        renderAudio={({ src, label }) => <figure aria-label={label} data-src={src} />}
        labels={{ description: "Tell the client why.", existingPlayer: "Your note", replace: "Record again" }}
      />,
    );

    expect(screen.getByText("Tell the client why.")).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: "Your note" })).toHaveAttribute("data-src", "https://media.example/note.m4a");
    expect(screen.getByRole("button", { name: /Record again/ })).toBeInTheDocument();
  });

  it("records, hands the take to onAccept as soon as it stops, and reports pending", async () => {
    installRecorder();
    const user = userEvent.setup();
    const onAccept = vi.fn(async () => undefined);
    const onPendingChange = vi.fn();
    render(<CandidatePresentationRecorder onAccept={onAccept} onPendingChange={onPendingChange} />);

    await user.click(screen.getByRole("button", { name: /Record voice note/ }));
    const stop = await screen.findByRole("button", { name: /Stop recording/ });
    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(onPendingChange).toHaveBeenLastCalledWith(true);

    await user.click(stop);
    await waitFor(() => expect(onAccept).toHaveBeenCalledTimes(1));
    const [blob, mimeType] = onAccept.mock.calls[0] as unknown as [Blob, string];
    expect(blob.size).toBeGreaterThan(0);
    expect(mimeType).toBe("audio/webm;codecs=opus");
    expect(await screen.findByText("Voice note added. It will be included when you share.")).toBeInTheDocument();
    expect(screen.getByLabelText("Preview voice recommendation")).toHaveAttribute("src", "blob:fictional-take");
    expect(onPendingChange).toHaveBeenLastCalledWith(false);
  });

  it("keeps a take whose upload failed, to retry or discard", async () => {
    installRecorder();
    const user = userEvent.setup();
    const onAccept = vi
      .fn<(blob: Blob, mimeType: string) => Promise<void>>()
      .mockRejectedValueOnce(new Error("Upload failed. Try again."))
      .mockResolvedValueOnce(undefined);
    render(<CandidatePresentationRecorder onAccept={onAccept} />);

    await user.click(screen.getByRole("button", { name: /Record voice note/ }));
    await user.click(await screen.findByRole("button", { name: /Stop recording/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Upload failed. Try again.");
    expect(screen.getByLabelText("Preview voice recommendation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Discard recording/ })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Retry voice note/ }));
    await waitFor(() => expect(onAccept).toHaveBeenCalledTimes(2));
    expect(await screen.findByText(/Voice note added/)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("explains a browser without a recorder, and a blocked microphone", async () => {
    const user = userEvent.setup();
    setGlobal(globalThis, "MediaRecorder", undefined);
    const { unmount } = render(<CandidatePresentationRecorder onAccept={async () => undefined} />);
    await user.click(screen.getByRole("button", { name: /Record voice note/ }));
    expect(screen.getByRole("alert")).toHaveTextContent("Voice recording is not supported in this browser.");
    unmount();

    installRecorder();
    setGlobal(navigator, "mediaDevices", {
      getUserMedia: vi.fn(async () => {
        throw Object.assign(new Error("denied"), { name: "NotAllowedError" });
      }),
    });
    render(<CandidatePresentationRecorder onAccept={async () => undefined} labels={{ blocked: "Allow the microphone." }} />);
    await user.click(screen.getByRole("button", { name: /Record voice note/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Allow the microphone.");
  });

  it("shows the host's transcribing state over its own", () => {
    const { rerender } = render(
      <CandidatePresentationRecorder onAccept={async () => undefined} externalState="transcribing" />,
    );
    expect(screen.getByRole("button", { name: "Transcribing…" })).toBeDisabled();

    act(() => {
      rerender(<CandidatePresentationRecorder onAccept={async () => undefined} externalState="ready" />);
    });
    expect(screen.getByRole("button", { name: /Record voice note/ })).toBeEnabled();
  });
});
