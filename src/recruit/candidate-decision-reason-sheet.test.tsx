import { DictationProvider } from "@epicbagel/saas-kit/primitives/dictation-provider";
import { Dialog, DialogContent, DialogTitle } from "@epicbagel/saas-kit/primitives/dialog";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CandidateDecisionButtons, type CandidateDecisionChoice } from "./candidate-decision-buttons";
import {
  CandidateDecisionReasonSheet,
  type CandidateDecisionReasonSheetProps,
} from "./candidate-decision-reason-sheet";
import { CandidateReviewCard } from "./candidate-review-card";

// Fictional people and reasons only.
const REASONS = ["Too senior", "Outside salary band"];

/** The browser's speech recognition, enough of it for the kit's mic to show and to hear a sentence. */
const recognitions: FakeRecognition[] = [];
class FakeRecognition {
  continuous = false;
  interimResults = false;
  lang = "";
  onresult: ((event: unknown) => void) | null = null;
  onerror: (() => void) | null = null;
  onend: (() => void) | null = null;
  constructor() {
    recognitions.push(this);
  }
  start() {}
  stop() { this.onend?.(); }
  abort() {}
}

type SpeechWindow = { SpeechRecognition?: unknown };

function renderSheet(overrides: Partial<CandidateDecisionReasonSheetProps> = {}) {
  const onConfirm = vi.fn<(reason?: string) => unknown>();
  const onClose = vi.fn();
  const props: CandidateDecisionReasonSheetProps = {
    open: true,
    decision: "no",
    candidateName: "Fictional Person",
    reasons: REASONS,
    onConfirm,
    onClose,
    ...overrides,
  };
  const view = render(<CandidateDecisionReasonSheet {...props} />);
  return { ...view, props, onConfirm, onClose };
}

const sheet = () => screen.getByRole("dialog");

afterEach(() => {
  recognitions.length = 0;
  delete (window as SpeechWindow).SpeechRecognition;
});

describe("candidate decision reason sheet, where dictation can run", () => {
  beforeEach(() => {
    (window as SpeechWindow).SpeechRecognition = FakeRecognition;
  });

  it("asks why voice first, with the reasons to pick, typing a tap away and a way to skip", () => {
    renderSheet();

    // Named and described once for a screen reader, with one heading to find.
    const dialog = screen.getByRole("dialog", { name: "Why no?" });
    expect(dialog).toHaveAccessibleDescription("Give your reason for Fictional Person, or pick one.");
    expect(within(dialog).getAllByRole("heading")).toHaveLength(1);
    expect(within(dialog).getByRole("heading", { level: 2, name: "Why no?" })).toBeInTheDocument();
    // The copies that name and describe the dialog stay out of the reading order.
    for (const words of ["Why no?", "Give your reason for Fictional Person, or pick one."]) {
      const [hidden, visible, ...rest] = within(dialog).getAllByText(words);
      expect(hidden).toHaveAttribute("aria-hidden", "true");
      expect(visible).not.toHaveAttribute("aria-hidden");
      expect(rest).toHaveLength(0);
    }

    // The kit's dialog content keeps its slot; the sheet marks its own layout.
    expect(dialog).toHaveAttribute("data-slot", "dialog-content");
    const root = dialog.querySelector("[data-slot='candidate-decision-reason-sheet']")!;
    expect(root).toHaveAttribute("data-decision", "no");

    expect(within(dialog).getByRole("button", { name: "Start dictation" })).toBeInTheDocument();
    expect(within(dialog).getByText("Tap to speak")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "or type instead" })).toBeInTheDocument();
    expect(within(dialog).queryByRole("textbox")).toBeNull();

    const reasons = within(dialog).getByRole("group", { name: "or pick a reason" });
    expect(within(reasons).getAllByRole("button").map((button) => button.textContent)).toEqual(REASONS);

    const footer = dialog.querySelector("[data-slot='candidate-decision-reason-sheet-footer']")!;
    expect(within(footer as HTMLElement).getByRole("button", { name: "Skip — just mark No" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveAttribute("title", "Cancel");
  });

  it("confirms with a spoken reason, under the dictation title", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderSheet();

    await user.click(within(sheet()).getByRole("button", { name: "Start dictation" }));
    const overlay = await screen.findByRole("dialog", { name: "Voice dictation" });
    expect(within(overlay).getByRole("heading", { name: "Why no on Fictional Person?" })).toBeInTheDocument();
    expect(recognitions).toHaveLength(1);

    const heard = Object.assign([{ transcript: "Not enough fictional experience" }], { isFinal: true });
    act(() => recognitions[0]!.onresult?.({ resultIndex: 0, results: [heard] }));
    await user.click(within(overlay).getByRole("button", { name: /done/i }));

    expect(onConfirm.mock.calls).toEqual([["Not enough fictional experience"]]);
  });

  it("confirms with a picked reason in one tap", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderSheet({ reasons: ["Too senior", " Too senior ", "", "Outside salary band"] });

    // The same reason twice is one chip.
    expect(within(sheet()).getAllByRole("button", { name: "Too senior" })).toHaveLength(1);
    await user.click(within(sheet()).getByRole("button", { name: "Outside salary band" }));

    expect(onConfirm.mock.calls).toEqual([["Outside salary band"]]);
  });

  it("confirms with a typed reason, trimmed", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderSheet({ decision: "yes" });

    expect(screen.getByRole("dialog", { name: "Why yes?" })).toBeInTheDocument();
    await user.click(within(sheet()).getByRole("button", { name: "or type instead" }));
    const field = within(sheet()).getByPlaceholderText("Type a reason…");
    await waitFor(() => expect(field).toHaveFocus());
    await user.type(field, "  Sold to the same fictional buyers  {Enter}");

    expect(onConfirm.mock.calls).toEqual([["Sold to the same fictional buyers"]]);
  });

  it("skips with no reason, and closes without deciding", async () => {
    const user = userEvent.setup();
    const { props, rerender, onConfirm, onClose } = renderSheet({ decision: "yes" });

    await user.click(within(sheet()).getByRole("button", { name: "Skip — just mark Yes" }));
    expect(onConfirm.mock.calls).toEqual([[undefined]]);
    expect(onClose).not.toHaveBeenCalled();

    await user.click(within(sheet()).getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onConfirm).toHaveBeenCalledTimes(1);

    rerender(<CandidateDecisionReasonSheet {...props} open={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("takes Skip away where a reason is required, and the bottom bar with it", () => {
    const { props, rerender } = renderSheet({ reasonRequired: true });

    expect(within(sheet()).queryByRole("button", { name: /skip/i })).toBeNull();
    expect(sheet().querySelector("[data-slot='candidate-decision-reason-sheet-footer']")).toBeNull();
    // A reason is still one tap or a sentence away.
    expect(within(sheet()).getByRole("button", { name: "Too senior" })).toBeInTheDocument();

    rerender(<CandidateDecisionReasonSheet {...props} reasonRequired footer={<span>Host footer</span>} />);
    const footer = sheet().querySelector("[data-slot='candidate-decision-reason-sheet-footer']") as HTMLElement;
    expect(within(footer).getByText("Host footer")).toBeInTheDocument();
    expect(within(footer).queryByRole("button")).toBeNull();
  });

  it("puts the host's footer over the bottom row and its actions before Skip, and reads their state on confirm", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn();
    const onElsewhere = vi.fn();

    function Host() {
      const [contacted, setContacted] = useState(false);
      return (
        <CandidateDecisionReasonSheet
          open
          decision="yes"
          candidateName="Fictional Person"
          onClose={() => undefined}
          onConfirm={(reason) => onDecide(reason, contacted)}
          skipLabel={contacted ? "Skip — just mark contacted" : "Skip — just longlist"}
          footer={(
            <label>
              <input type="checkbox" checked={contacted} onChange={(event) => setContacted(event.target.checked)} />
              Already contacted
            </label>
          )}
          actions={<button type="button" onClick={onElsewhere}>Another fictional job</button>}
        />
      );
    }
    render(<Host />);

    const footer = sheet().querySelector("[data-slot='candidate-decision-reason-sheet-footer']") as HTMLElement;
    expect(within(footer).getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Another fictional job",
      "Skip — just longlist",
    ]);
    // The footer comes first: it changes what the row under it does.
    expect(footer.firstElementChild).toContainElement(within(footer).getByRole("checkbox"));

    await user.click(within(footer).getByRole("button", { name: "Another fictional job" }));
    expect(onElsewhere).toHaveBeenCalledTimes(1);
    expect(onDecide).not.toHaveBeenCalled();

    await user.click(within(footer).getByRole("checkbox", { name: "Already contacted" }));
    await user.click(within(footer).getByRole("button", { name: "Skip — just mark contacted" }));
    expect(onDecide.mock.calls).toEqual([[undefined, true]]);
  });

  it("says what the host words, for a question that isn't Yes or No", async () => {
    const user = userEvent.setup();
    renderSheet({
      decision: undefined,
      title: "Not looking?",
      subtitle: "Note why Fictional Person isn't looking right now.",
      voiceTitle: "Why is Fictional Person declining?",
      skipLabel: "Skip — just mark declined",
      reasons: ["Happy in a fictional role"],
      labels: {
        cancel: "Never mind",
        speak: "Say it",
        typeInstead: "write it instead",
        reasons: "or choose one",
        placeholder: "Write a reason",
      },
    });

    const dialog = screen.getByRole("dialog", { name: "Not looking?" });
    expect(dialog).toHaveAccessibleDescription("Note why Fictional Person isn't looking right now.");
    expect(dialog.querySelector("[data-slot='candidate-decision-reason-sheet']")).not.toHaveAttribute("data-decision");
    expect(within(dialog).getByText("Say it")).toBeInTheDocument();
    expect(within(dialog).getByRole("group", { name: "or choose one" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Skip — just mark declined" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Never mind" })).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "write it instead" }));
    expect(within(dialog).getByPlaceholderText("Write a reason")).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Start dictation" }));
    const overlay = await screen.findByRole("dialog", { name: "Voice dictation" });
    expect(within(overlay).getByRole("heading", { name: "Why is Fictional Person declining?" })).toBeInTheDocument();
  });

  it("words itself plainly with nothing but an open sheet", () => {
    renderSheet({ decision: undefined, candidateName: undefined, reasons: undefined });

    const dialog = screen.getByRole("dialog", { name: "Why?" });
    expect(dialog).toHaveAccessibleDescription("Give your reason.");
    expect(within(dialog).queryByRole("group")).toBeNull();
    expect(within(dialog).getByRole("button", { name: "Skip" })).toBeInTheDocument();
  });

  it("leaves the description out when the host passes none", () => {
    renderSheet({ subtitle: null });

    const dialog = screen.getByRole("dialog", { name: "Why no?" });
    expect(dialog).not.toHaveAttribute("aria-describedby");
    expect(dialog.querySelector("[data-slot='chat-empty-subtitle']")).toBeNull();
  });

  it("holds the sheet while the host saves, and keeps a typed reason when the save fails", async () => {
    const user = userEvent.setup();
    let fail: (cause: Error) => void = () => undefined;
    const onConfirm = vi.fn(() => new Promise<void>((_resolve, reject) => { fail = reject; }));
    renderSheet({ onConfirm });

    await user.click(within(sheet()).getByRole("button", { name: "or type instead" }));
    await user.type(within(sheet()).getByRole("textbox"), "A fictional reason{Enter}");
    expect(onConfirm.mock.calls).toEqual([["A fictional reason"]]);

    // Saving, said aloud: nothing left to send a second time, though a
    // person can still leave if the save never comes back.
    expect(within(sheet()).getByRole("status")).toHaveTextContent("Saving…");
    expect(within(sheet()).queryByRole("textbox")).toBeNull();
    expect(within(sheet()).queryByRole("button", { name: "Too senior" })).toBeNull();
    expect(within(sheet()).getByRole("button", { name: "Skip — just mark No" })).toBeDisabled();
    expect(within(sheet()).getByRole("button", { name: "Cancel" })).toBeEnabled();

    await act(async () => fail(new Error("offline")));

    expect(within(sheet()).getByRole("alert")).toHaveTextContent("That didn't save. Try again.");
    expect(within(sheet()).getByRole("textbox")).toHaveValue("A fictional reason");
    expect(within(sheet()).queryByText("Saving…")).toBeNull();
    expect(within(sheet()).getByRole("button", { name: "Skip — just mark No" })).toBeEnabled();

    // Trying again clears the error while it saves.
    await user.type(within(sheet()).getByRole("textbox"), "{Enter}");
    expect(onConfirm).toHaveBeenCalledTimes(2);
    expect(within(sheet()).queryByRole("alert")).toBeNull();
    expect(within(sheet()).getByText("Saving…")).toBeInTheDocument();
  });

  it("shows a failed skip too, and stays put until the host closes it", async () => {
    const user = userEvent.setup();
    let settle: () => void = () => undefined;
    const onConfirm = vi
      .fn<(reason?: string) => Promise<void>>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockImplementation(() => new Promise<void>((resolve) => { settle = resolve; }));
    const { props, rerender } = renderSheet({ onConfirm, labels: { failed: "Not saved.", saving: "One moment" } });

    await user.click(within(sheet()).getByRole("button", { name: "Skip — just mark No" }));
    expect(await within(sheet()).findByRole("alert")).toHaveTextContent("Not saved.");

    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));
    expect(onConfirm.mock.calls).toEqual([[undefined], ["Too senior"]]);
    expect(within(sheet()).getByText("One moment")).toBeInTheDocument();

    await act(async () => settle());
    // Saved: the composer is back, and closing is the host's to do.
    expect(within(sheet()).getByRole("button", { name: "Start dictation" })).toBeInTheDocument();
    rerender(<CandidateDecisionReasonSheet {...props} open={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("starts again each time it opens", async () => {
    const user = userEvent.setup();
    const { props, rerender } = renderSheet();

    await user.click(within(sheet()).getByRole("button", { name: "or type instead" }));
    await user.type(within(sheet()).getByRole("textbox"), "A fictional draft");

    rerender(<CandidateDecisionReasonSheet {...props} open={false} />);
    rerender(<CandidateDecisionReasonSheet {...props} candidateName="Another Fictional Person" />);

    // Voice first again, with nothing left of the last person's draft.
    expect(within(sheet()).getByRole("button", { name: "Start dictation" })).toBeInTheDocument();
    await user.click(within(sheet()).getByRole("button", { name: "or type instead" }));
    expect(within(sheet()).getByRole("textbox")).toHaveValue("");
  });

  it("keeps its clicks and key presses from a clickable card it is rendered in", async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();
    const onCardKey = vi.fn();
    const onConfirm = vi.fn();
    render(
      // What a selectable card listens for, round the sheet as React sees it.
      <div onClick={onCardClick} onKeyDown={onCardKey}>
        <CandidateDecisionReasonSheet
          open
          decision="no"
          candidateName="Fictional Person"
          reasons={REASONS}
          onConfirm={onConfirm}
          onClose={vi.fn()}
        />
      </div>,
    );

    await user.click(within(sheet()).getByRole("button", { name: "or type instead" }));
    const field = within(sheet()).getByRole("textbox");

    // A space still types a space and Shift+Enter still starts a new line:
    // the sheet stops them reaching the card, it doesn't cancel them.
    expect(fireEvent.keyDown(field, { key: " ", code: "Space" })).toBe(true);
    expect(fireEvent.keyDown(field, { key: "Enter", shiftKey: true })).toBe(true);
    await user.type(field, "A fictional reason");
    await user.click(within(sheet()).getByRole("heading", { name: "Why no?" }));
    expect(onCardClick).not.toHaveBeenCalled();
    expect(onCardKey).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();

    await user.type(field, "{Enter}");
    expect(onConfirm.mock.calls).toEqual([["A fictional reason"]]);
    await user.click(within(sheet()).getByRole("button", { name: "Skip — just mark No" }));
    expect(onCardClick).not.toHaveBeenCalled();
    expect(onCardKey).not.toHaveBeenCalled();
  });

  it("asks why from a review card's Yes and No without opening the card", async () => {
    const user = userEvent.setup();
    const onOpenCard = vi.fn();
    const onDecide = vi.fn();

    function Actions() {
      const [asking, setAsking] = useState<CandidateDecisionChoice | null>(null);
      return (
        <>
          <CandidateDecisionButtons onChoose={setAsking} />
          <CandidateDecisionReasonSheet
            open={asking !== null}
            decision={asking ?? undefined}
            candidateName="Fictional Person"
            reasons={REASONS}
            onClose={() => setAsking(null)}
            onConfirm={(reason) => {
              onDecide(asking, reason);
              setAsking(null);
            }}
          />
        </>
      );
    }
    render(<CandidateReviewCard name="Fictional Person" facts={[]} onSelect={onOpenCard} actions={<Actions />} />);

    await user.click(screen.getByRole("button", { name: "No" }));
    // The sheet's own words are no control, which is what a card opens on.
    await user.click(within(sheet()).getByRole("heading", { name: "Why no?" }));
    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));

    expect(onDecide.mock.calls).toEqual([["no", "Too senior"]]);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onOpenCard).not.toHaveBeenCalled();
  });

  it("gives focus back to the control it was opened from, closed or decided", async () => {
    const user = userEvent.setup();
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Ask why</button>
          <CandidateDecisionReasonSheet
            open={open}
            decision="no"
            onConfirm={() => setOpen(false)}
            onClose={() => setOpen(false)}
          />
        </>
      );
    }
    render(<Host />);
    const opener = screen.getByRole("button", { name: "Ask why" });

    await user.click(opener);
    // Focus is in the sheet while it is open.
    expect(sheet()).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    await waitFor(() => expect(opener).toHaveFocus());

    await user.click(opener);
    await user.click(within(sheet()).getByRole("button", { name: "Skip — just mark No" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("keeps its composer focusable when it opens from another dialog", async () => {
    const user = userEvent.setup();
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Fictional Person</DialogTitle>
          <CandidateDecisionReasonSheet open decision="no" onConfirm={vi.fn()} onClose={vi.fn()} />
        </DialogContent>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog", { name: "Why no?" });
    await user.click(within(dialog).getByRole("button", { name: "or type instead" }));
    const field = within(dialog).getByRole("textbox");
    await user.type(field, "A fictional reason");

    await waitFor(() => expect(field).toHaveFocus());
    expect(field).toHaveValue("A fictional reason");
  });

  it("leaves dictation out when the host turns it off", () => {
    renderSheet({ voice: false });

    expect(within(sheet()).getByRole("textbox")).toBeInTheDocument();
    expect(within(sheet()).queryByRole("button", { name: "Start dictation" })).toBeNull();
    expect(within(sheet()).queryByText("Tap to speak")).toBeNull();
  });
});

describe("candidate decision reason sheet, where dictation can't run", () => {
  it("opens on the typed reason, with the reasons and Skip still there", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderSheet();

    const field = within(sheet()).getByPlaceholderText("Type a reason…");
    // Ready to type, since there is nothing to tap first.
    expect(field).toHaveFocus();
    expect(within(sheet()).queryByText("Tap to speak")).toBeNull();
    expect(within(sheet()).queryByRole("button", { name: "Start dictation" })).toBeNull();
    expect(within(sheet()).getByRole("button", { name: "Too senior" })).toBeInTheDocument();
    expect(within(sheet()).getByRole("button", { name: "Skip — just mark No" })).toBeInTheDocument();

    await user.type(field, "A fictional reason{Enter}");
    expect(onConfirm.mock.calls).toEqual([["A fictional reason"]]);
  });
});

describe("candidate decision reason sheet, with the host's dictation transport", () => {
  const mediaDevices = Object.getOwnPropertyDescriptor(navigator, "mediaDevices");

  beforeEach(() => {
    // What the kit asks of a browser before it records for a host's transport.
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia: vi.fn() } });
    vi.stubGlobal("MediaRecorder", class {});
  });

  afterEach(() => {
    if (mediaDevices) Object.defineProperty(navigator, "mediaDevices", mediaDevices);
    else delete (navigator as { mediaDevices?: unknown }).mediaDevices;
    vi.unstubAllGlobals();
  });

  it("offers the mic through a DictationProvider above it, with no browser speech recognition", () => {
    const transcribe = vi.fn(async () => "A fictional transcript");
    const props = { open: true, decision: "yes" as const, onConfirm: vi.fn(), onClose: vi.fn() };
    const { unmount } = render(
      <DictationProvider transcribe={transcribe}>
        <CandidateDecisionReasonSheet {...props} />
      </DictationProvider>,
    );

    expect(within(sheet()).getByRole("button", { name: "Start dictation" })).toBeInTheDocument();
    expect(within(sheet()).getByText("Tap to speak")).toBeInTheDocument();
    expect(within(sheet()).queryByRole("textbox")).toBeNull();
    unmount();

    // The same browser with no transport has nothing to dictate with.
    render(<CandidateDecisionReasonSheet {...props} />);
    expect(within(sheet()).queryByRole("button", { name: "Start dictation" })).toBeNull();
    expect(within(sheet()).getByRole("textbox")).toBeInTheDocument();
  });
});
