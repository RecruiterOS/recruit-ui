import { DictationProvider } from "@epicbagel/saas-kit/primitives/dictation-provider";
import { Dialog, DialogContent, DialogTitle } from "@epicbagel/saas-kit/primitives/dialog";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CandidateDecisionButtons, type CandidateDecisionChoice } from "./candidate-decision-buttons";
import {
  CandidateDecisionOutcomeChoice,
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

type Confirm = CandidateDecisionReasonSheetProps["onConfirm"];

/** The one-line reason of each confirmation, in order. */
const confirmed = (onConfirm: { mock: { calls: unknown[][] } }) => onConfirm.mock.calls.map(([reason]) => reason);

function renderSheet(overrides: Partial<CandidateDecisionReasonSheetProps> = {}) {
  const onConfirm = vi.fn<Confirm>();
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
  // The sheet remembers Single or Multiple for the browser session.
  window.sessionStorage.clear();
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

    const reasons = within(dialog).getByRole("group", { name: "Or pick a reason" });
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

    expect(confirmed(onConfirm)).toEqual(["Not enough fictional experience"]);
  });

  it("confirms with a picked reason in one tap", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderSheet({ reasons: ["Too senior", " Too senior ", "", "Outside salary band"] });

    // The same reason twice is one chip.
    expect(within(sheet()).getAllByRole("button", { name: "Too senior" })).toHaveLength(1);
    await user.click(within(sheet()).getByRole("button", { name: "Outside salary band" }));

    expect(confirmed(onConfirm)).toEqual(["Outside salary band"]);
  });

  it("confirms with a typed reason, trimmed", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderSheet({ decision: "yes" });

    expect(screen.getByRole("dialog", { name: "Why yes?" })).toBeInTheDocument();
    await user.click(within(sheet()).getByRole("button", { name: "or type instead" }));
    const field = within(sheet()).getByPlaceholderText("Type a reason…");
    await waitFor(() => expect(field).toHaveFocus());
    await user.type(field, "  Sold to the same fictional buyers  {Enter}");

    expect(confirmed(onConfirm)).toEqual(["Sold to the same fictional buyers"]);
  });

  it("skips with no reason, and closes without deciding", async () => {
    const user = userEvent.setup();
    const { props, rerender, onConfirm, onClose } = renderSheet({ decision: "yes" });

    await user.click(within(sheet()).getByRole("button", { name: "Skip — just mark Yes" }));
    expect(confirmed(onConfirm)).toEqual([undefined]);
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
    expect(confirmed(onConfirm)).toEqual(["A fictional reason"]);

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

  it("says why a save failed, in the host's words for what it rejected with", async () => {
    const user = userEvent.setup();
    const onConfirm = vi
      .fn<(reason?: string) => Promise<void>>()
      .mockRejectedValueOnce(new Error("This link has stopped."))
      .mockRejectedValueOnce("offline");
    const failed = vi.fn((cause: unknown) => (cause instanceof Error ? cause.message : "Not saved."));
    renderSheet({ onConfirm, labels: { failed } });

    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));
    expect(await within(sheet()).findByRole("alert")).toHaveTextContent("This link has stopped.");
    // Each failure is worded from what that save rejected with.
    await user.click(within(sheet()).getByRole("button", { name: "Skip — just mark No" }));
    expect(await within(sheet()).findByText("Not saved.")).toBeInTheDocument();
    expect(within(sheet()).queryByText("This link has stopped.")).toBeNull();
    expect(failed.mock.calls.map(([cause]) => cause)).toContain("offline");
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
    expect(confirmed(onConfirm)).toEqual([undefined, "Too senior"]);
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
    expect(confirmed(onConfirm)).toEqual(["A fictional reason"]);
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

  it("offers Single and Multiple over two or more reasons, and opens on Single", async () => {
    const user = userEvent.setup();
    const { props, rerender, onConfirm } = renderSheet();

    const selection = within(sheet()).getByRole("radiogroup", { name: "How many reasons" });
    expect(within(selection).getByRole("radio", { name: "Single" })).toBeChecked();
    expect(within(selection).getByRole("radio", { name: "Multiple" })).not.toBeChecked();
    expect(sheet().querySelector("[data-slot='candidate-decision-reason-sheet-reasons']")).toHaveAttribute("data-selection", "single");
    // In Single a reason is a plain button: a tap confirms with it, on its own.
    const reason = within(sheet()).getByRole("button", { name: "Too senior" });
    expect(reason).not.toHaveAttribute("aria-pressed");
    await user.click(reason);
    expect(onConfirm.mock.calls).toEqual([["Too senior", { reasons: ["Too senior"] }]]);

    // One reason leaves nothing to pick several of, and a host can leave the switch out.
    rerender(<CandidateDecisionReasonSheet {...props} reasons={["Too senior"]} />);
    expect(within(sheet()).queryByRole("radiogroup", { name: "How many reasons" })).toBeNull();
    rerender(<CandidateDecisionReasonSheet {...props} multipleReasons={false} />);
    expect(within(sheet()).queryByRole("radiogroup", { name: "How many reasons" })).toBeNull();
    expect(within(sheet()).getByRole("button", { name: "Too senior" })).not.toHaveAttribute("aria-pressed");
  });

  it("ticks several reasons in Multiple, and confirms with them from the bottom button", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderSheet({ reasons: ["Too senior", "Wrong industry", "Outside salary band"] });

    expect(sheet()).toHaveAccessibleDescription("Give your reason for Fictional Person, or pick one.");
    await user.click(within(sheet()).getByRole("radio", { name: "Multiple" }));
    expect(sheet()).toHaveAccessibleDescription("Give your reason for Fictional Person, or pick one or more.");
    expect(sheet().querySelector("[data-slot='candidate-decision-reason-sheet-reasons']")).toHaveAttribute("data-selection", "multiple");

    // Each reason is a toggle now, and a tap confirms nothing.
    const reasons = within(sheet()).getByRole("group", { name: "Or pick a reason" });
    for (const reason of within(reasons).getAllByRole("button")) expect(reason).toHaveAttribute("aria-pressed", "false");
    await user.click(within(reasons).getByRole("button", { name: "Outside salary band" }));
    await user.click(within(reasons).getByRole("button", { name: "Too senior" }));
    expect(within(reasons).getByRole("button", { name: "Too senior" })).toHaveAttribute("aria-pressed", "true");
    expect(within(reasons).getByRole("button", { name: "Wrong industry" })).toHaveAttribute("aria-pressed", "false");
    expect(onConfirm).not.toHaveBeenCalled();

    // Ticked reasons arm the bottom button, in Skip's place.
    const footer = sheet().querySelector("[data-slot='candidate-decision-reason-sheet-footer']") as HTMLElement;
    expect(within(footer).queryByRole("button", { name: /skip/i })).toBeNull();
    await user.click(within(footer).getByRole("button", { name: "Mark No" }));

    // One line, and each reason on its own, in the order they are shown.
    expect(onConfirm.mock.calls).toEqual([[
      "Too senior; Outside salary band",
      { reasons: ["Too senior", "Outside salary band"] },
    ]]);
  });

  it("goes back to Skip when the last tick is taken off", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderSheet({ defaultReasonSelection: "multiple" });

    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));
    expect(within(sheet()).getByRole("button", { name: "Mark No" })).toBeInTheDocument();
    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));
    await user.click(within(sheet()).getByRole("button", { name: "Skip — just mark No" }));

    expect(onConfirm.mock.calls).toEqual([[undefined, { reasons: [] }]]);
  });

  it("adds a typed reason to the ticked ones", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderSheet({ defaultReasonSelection: "multiple" });

    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));
    await user.click(within(sheet()).getByRole("button", { name: "or type instead" }));
    await user.type(within(sheet()).getByRole("textbox"), "Based in a fictional city{Enter}");

    expect(onConfirm.mock.calls).toEqual([[
      "Too senior; Based in a fictional city",
      { reasons: ["Too senior", "Based in a fictional city"] },
    ]]);
  });

  it("adds a spoken reason to the ticked ones", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderSheet({ defaultReasonSelection: "multiple" });

    await user.click(within(sheet()).getByRole("button", { name: "Outside salary band" }));
    await user.click(within(sheet()).getByRole("button", { name: "Start dictation" }));
    const overlay = await screen.findByRole("dialog", { name: "Voice dictation" });
    const heard = Object.assign([{ transcript: "Wants a fictional title" }], { isFinal: true });
    act(() => recognitions[0]!.onresult?.({ resultIndex: 0, results: [heard] }));
    await user.click(within(overlay).getByRole("button", { name: /done/i }));

    expect(onConfirm.mock.calls).toEqual([[
      "Outside salary band; Wants a fictional title",
      { reasons: ["Outside salary band", "Wants a fictional title"] },
    ]]);
  });

  it("words the line and the confirm button from the host, for how reasons are picked", async () => {
    const user = userEvent.setup();
    const confirmLabel = vi.fn((reasons: readonly string[]) => `Reject with ${reasons.length} reasons`);
    renderSheet({
      subtitle: (selection) => (selection === "multiple" ? "Pick one or more reasons." : "Pick a reason."),
      confirmLabel,
      labels: { selection: "Reasons to give", single: "One", multiple: "Several" },
    });

    expect(sheet()).toHaveAccessibleDescription("Pick a reason.");
    const selection = within(sheet()).getByRole("radiogroup", { name: "Reasons to give" });
    await user.click(within(selection).getByRole("radio", { name: "Several" }));
    expect(sheet()).toHaveAccessibleDescription("Pick one or more reasons.");
    expect(within(sheet()).getAllByText("Pick one or more reasons.")).toHaveLength(2);

    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));
    await user.click(within(sheet()).getByRole("button", { name: "Outside salary band" }));
    expect(within(sheet()).getByRole("button", { name: "Reject with 2 reasons" })).toBeInTheDocument();
    expect(confirmLabel).toHaveBeenLastCalledWith(["Too senior", "Outside salary band"]);
  });

  it("opens on what was chosen last in the session, with nothing ticked, and Single clears the ticks", async () => {
    const user = userEvent.setup();
    const { props, rerender } = renderSheet();

    await user.click(within(sheet()).getByRole("radio", { name: "Multiple" }));
    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));

    rerender(<CandidateDecisionReasonSheet {...props} open={false} />);
    rerender(<CandidateDecisionReasonSheet {...props} candidateName="Another Fictional Person" />);
    expect(within(sheet()).getByRole("radio", { name: "Multiple" })).toBeChecked();
    expect(within(sheet()).getByRole("button", { name: "Too senior" })).toHaveAttribute("aria-pressed", "false");

    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));
    await user.click(within(sheet()).getByRole("radio", { name: "Single" }));
    expect(within(sheet()).getByRole("button", { name: "Skip — just mark No" })).toBeInTheDocument();
    await user.click(within(sheet()).getByRole("radio", { name: "Multiple" }));
    expect(within(sheet()).getByRole("button", { name: "Too senior" })).toHaveAttribute("aria-pressed", "false");
  });

  it("lets a host keep the choice of Single or Multiple", async () => {
    const user = userEvent.setup();
    const onReasonSelectionChange = vi.fn();
    const { props, rerender } = renderSheet({ reasonSelection: "multiple", onReasonSelectionChange });

    expect(within(sheet()).getByRole("radio", { name: "Multiple" })).toBeChecked();
    await user.click(within(sheet()).getByRole("radio", { name: "Single" }));
    expect(onReasonSelectionChange.mock.calls).toEqual([["single"]]);
    // The host hasn't changed it, and the sheet keeps nothing of its own.
    expect(within(sheet()).getByRole("radio", { name: "Multiple" })).toBeChecked();
    expect(window.sessionStorage.length).toBe(0);

    rerender(<CandidateDecisionReasonSheet {...props} reasonSelection="single" />);
    expect(within(sheet()).getByRole("radio", { name: "Single" })).toBeChecked();
  });

  it("where a reason is required, keeps a button in Multiple that waits for a tick", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderSheet({ reasonRequired: true, defaultReasonSelection: "multiple", confirmLabel: "Save reasons" });

    expect(within(sheet()).queryByRole("button", { name: /skip/i })).toBeNull();
    const save = within(sheet()).getByRole("button", { name: "Save reasons" });
    expect(save).toBeDisabled();
    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));
    expect(save).toBeEnabled();
    await user.click(save);

    expect(confirmed(onConfirm)).toEqual(["Too senior"]);
  });

  it("keeps the ticks when a save fails", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn<Confirm>().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(undefined);
    renderSheet({ onConfirm, defaultReasonSelection: "multiple" });

    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));
    await user.click(within(sheet()).getByRole("button", { name: "Outside salary band" }));
    await user.click(within(sheet()).getByRole("button", { name: "Mark No" }));

    expect(await within(sheet()).findByRole("alert")).toHaveTextContent("That didn't save. Try again.");
    expect(within(sheet()).getByRole("button", { name: "Too senior" })).toHaveAttribute("aria-pressed", "true");
    expect(within(sheet()).getByRole("button", { name: "Outside salary band" })).toHaveAttribute("aria-pressed", "true");
    await user.click(within(sheet()).getByRole("button", { name: "Mark No" }));
    expect(confirmed(onConfirm)).toEqual(["Too senior; Outside salary band", "Too senior; Outside salary band"]);
  });

  it("puts the host's outcome under the reasons, and reads its state on confirm", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn();

    function Host() {
      const [contacted, setContacted] = useState(false);
      return (
        <CandidateDecisionReasonSheet
          open
          decision="yes"
          candidateName="Fictional Person"
          reasons={REASONS}
          onClose={() => undefined}
          onConfirm={(reason) => onDecide(reason, contacted)}
          outcome={(
            <label>
              <input type="checkbox" checked={contacted} onChange={(event) => setContacted(event.target.checked)} />
              Already contacted
            </label>
          )}
        />
      );
    }
    render(<Host />);

    const outcome = sheet().querySelector("[data-slot='candidate-decision-reason-sheet-outcome']") as HTMLElement;
    const reasons = sheet().querySelector("[data-slot='candidate-decision-reason-sheet-reasons']") as HTMLElement;
    // After the reasons, and out of the bottom bar.
    expect(reasons.compareDocumentPosition(outcome) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(sheet().querySelector("[data-slot='candidate-decision-reason-sheet-footer']")).not.toContainElement(outcome);

    await user.click(within(outcome).getByRole("checkbox", { name: "Already contacted" }));
    await user.click(within(sheet()).getByRole("button", { name: "Too senior" }));
    expect(onDecide.mock.calls).toEqual([["Too senior", true]]);
  });

  it("shows the host's outcome with no reasons to pick", () => {
    renderSheet({ reasons: [], outcome: <span>Host outcome</span> });

    expect(sheet().querySelector("[data-slot='candidate-decision-reason-sheet-reasons']")).toBeNull();
    const outcome = sheet().querySelector("[data-slot='candidate-decision-reason-sheet-outcome']") as HTMLElement;
    expect(within(outcome).getByText("Host outcome")).toBeInTheDocument();
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
    expect(confirmed(onConfirm)).toEqual(["A fictional reason"]);
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

describe("candidate decision outcome choice", () => {
  it("offers its options as radios under the caption, one chosen, and reports another", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const options = [
      { value: "not-contacted", label: "Not contacted" },
      { value: "contacted", label: "Contacted" },
    ] as const;
    const { container, rerender } = render(
      <CandidateDecisionOutcomeChoice label="Contact status" options={options} value="not-contacted" onChange={onChange} />,
    );

    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-decision-outcome-choice");
    const group = screen.getByRole("radiogroup", { name: "Contact status" });
    expect(within(group).getAllByRole("radio").map((radio) => radio.textContent)).toEqual(["Not contacted", "Contacted"]);
    expect(within(group).getByRole("radio", { name: "Not contacted" })).toBeChecked();

    // Pressing the chosen one leaves it chosen, and says nothing.
    await user.click(within(group).getByRole("radio", { name: "Not contacted" }));
    expect(onChange).not.toHaveBeenCalled();
    await user.click(within(group).getByRole("radio", { name: "Contacted" }));
    expect(onChange.mock.calls).toEqual([["contacted"]]);

    rerender(<CandidateDecisionOutcomeChoice label="Contact status" options={options} value="contacted" onChange={onChange} disabled />);
    expect(screen.getByRole("radio", { name: "Contacted" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Not contacted" })).toBeDisabled();
  });
});
