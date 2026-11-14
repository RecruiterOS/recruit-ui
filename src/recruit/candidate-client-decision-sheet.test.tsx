import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CandidateClientDecision } from "./candidate-client-decision";

// Records when the voice-first sheet (and with it the kit's Chat) is first
// evaluated; vi.mock is hoisted above the imports. A file of its own, so no
// other test has loaded the module first.
const sheetLoads = vi.hoisted(() => vi.fn());
vi.mock("./candidate-decision-reason-sheet", async (importOriginal) => {
  sheetLoads();
  return importOriginal();
});

// Fictional people and reasons only.
const SUGGESTIONS = { yes: ["Right level"], no: ["Too senior", "Too far away"] };

describe("candidate client decision, asking why through the voice-first sheet", () => {
  // First, while nothing has loaded the sheet: this is the order that proves it.
  it("never downloads the sheet for a row that asks in the dialog", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const { unmount } = render(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} />);

    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(screen.getByRole("dialog", { name: "Yes to Mei Tanaka" })).toBeInTheDocument();
    // Give a stray dynamic import a chance to settle before checking.
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(sheetLoads).not.toHaveBeenCalled();
    unmount();
  });

  it("downloads it as a sheet row mounts, closed, so a press opens it at once", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(
      <CandidateClientDecision
        candidateName="Mei Tanaka"
        onDecide={onDecide}
        suggestions={SUGGESTIONS}
        reasonPrompt="sheet"
      />,
    );

    await waitFor(() => expect(sheetLoads).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByRole("button", { name: "No" }));
    const sheet = await screen.findByRole("dialog", { name: "Why no?" });
    expect(sheet).toHaveAccessibleDescription("Give your reason for Mei Tanaka, or pick one.");
    expect(sheet.querySelector("[data-slot='candidate-decision-reason-sheet']")).toHaveAttribute("data-decision", "no");
    // The answer's own one-tap reasons, and no way round a required reason.
    expect(within(sheet).getByRole("button", { name: "Too far away" })).toBeInTheDocument();
    expect(within(sheet).queryByRole("button", { name: "Right level" })).toBeNull();
    expect(within(sheet).queryByRole("button", { name: /skip/i })).toBeNull();
    expect(onDecide).not.toHaveBeenCalled();

    await user.click(within(sheet).getByRole("button", { name: "Too senior" }));
    expect(onDecide.mock.calls).toEqual([["no", "Too senior"]]);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("saves a typed reason, trimmed, and closing the sheet decides nothing", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} reasonPrompt="sheet" />);

    await user.click(screen.getByRole("button", { name: "Yes" }));
    const sheet = await screen.findByRole("dialog", { name: "Why yes?" });
    await user.click(within(sheet).getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onDecide).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Yes" }));
    // Nothing here can dictate, so the sheet opens on the typed reason.
    await user.type(await screen.findByPlaceholderText("Type a reason…"), "  A fictional reason  {Enter}");
    expect(onDecide.mock.calls).toEqual([["yes", "A fictional reason"]]);
  });

  it("lets Skip save with no reason where the reason is optional", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(
      <CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} reasonPrompt="sheet" reasonOptional />,
    );

    await user.click(screen.getByRole("button", { name: "Yes" }));
    await user.click(await screen.findByRole("button", { name: "Skip — just mark Yes" }));
    // The row hands the host an empty reason, as its dialog does.
    expect(onDecide.mock.calls).toEqual([["yes", ""]]);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("keeps a failed save in the sheet, with the reason, and shows no error of its own", async () => {
    const user = userEvent.setup();
    let fail: (cause: Error) => void = () => undefined;
    const onDecide = vi
      .fn<(decision: "yes" | "no", reason: string) => Promise<void>>()
      .mockImplementationOnce(() => new Promise<void>((_resolve, reject) => { fail = reject; }))
      .mockResolvedValue(undefined);
    render(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} reasonPrompt="sheet" />);

    await user.click(screen.getByRole("button", { name: "No" }));
    const sheet = await screen.findByRole("dialog", { name: "Why no?" });
    await user.type(within(sheet).getByRole("textbox"), "A fictional reason{Enter}");
    // Held on a saving state, said aloud, while the host saves.
    expect(within(sheet).getByRole("status")).toHaveTextContent("Saving…");

    await act(async () => fail(new Error("offline")));
    expect(within(sheet).getByRole("alert")).toHaveTextContent("That didn't save. Try again.");
    expect(within(sheet).getByRole("textbox")).toHaveValue("A fictional reason");
    // One error, where the reason is, and the row behind says nothing.
    expect(screen.getAllByRole("alert")).toHaveLength(1);

    await user.type(within(sheet).getByRole("textbox"), "{Enter}");
    expect(onDecide.mock.calls).toEqual([["no", "A fictional reason"], ["no", "A fictional reason"]]);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("words the sheet as the host asks, for the answer being explained", async () => {
    const user = userEvent.setup();
    const reasonSheet = vi.fn((decision: "yes" | "no") => ({
      title: `Why ${decision}?`,
      subtitle: `Say why, or pick a reason for Mei Tanaka.`,
      skipLabel: `Skip, just say ${decision}`,
    }));
    const { rerender } = render(
      <CandidateClientDecision
        candidateName="Mei Tanaka"
        onDecide={vi.fn().mockResolvedValue(undefined)}
        reasonPrompt="sheet"
        reasonOptional
        reasonSheet={reasonSheet}
      />,
    );
    // Nothing to word until there is an answer to explain.
    expect(reasonSheet).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "No" }));
    const sheet = await screen.findByRole("dialog", { name: "Why no?" });
    expect(sheet).toHaveAccessibleDescription("Say why, or pick a reason for Mei Tanaka.");
    expect(within(sheet).getByRole("button", { name: "Skip, just say no" })).toBeInTheDocument();
    expect(reasonSheet).toHaveBeenLastCalledWith("no");
    await user.click(within(sheet).getByRole("button", { name: "Cancel" }));

    // The same settings for either answer, as plain props.
    rerender(
      <CandidateClientDecision
        candidateName="Mei Tanaka"
        onDecide={vi.fn().mockResolvedValue(undefined)}
        reasonPrompt="sheet"
        reasonSheet={{ title: "Tell us why", labels: { placeholder: "A line is enough" } }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Yes" }));
    const worded = await screen.findByRole("dialog", { name: "Tell us why" });
    expect(within(worded).getByPlaceholderText("A line is enough")).toBeInTheDocument();
  });

  it("holds the buttons while a save is on its way, even with the sheet closed, and says if it then fails", async () => {
    const user = userEvent.setup();
    let fail: (cause: Error) => void = () => undefined;
    let settle: () => void = () => undefined;
    const onDecide = vi
      .fn<(decision: "yes" | "no", reason: string) => Promise<void>>()
      .mockImplementationOnce(() => new Promise<void>((_resolve, reject) => { fail = reject; }))
      .mockImplementationOnce(() => new Promise<void>((resolve) => { settle = resolve; }));
    render(
      <CandidateClientDecision
        candidateName="Mei Tanaka"
        onDecide={onDecide}
        suggestions={SUGGESTIONS}
        reasonPrompt="sheet"
      />,
    );

    await user.click(screen.getByRole("button", { name: "No" }));
    await user.click(await screen.findByRole("button", { name: "Too senior" }));
    // The sheet never holds a person in it, so it can be closed mid-save...
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    // ...but a second answer can't be started on top of the first.
    for (const name of ["Yes", "No"]) expect(screen.getByRole("button", { name })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onDecide).toHaveBeenCalledTimes(1);

    // It failed after the sheet had gone, so the row says so.
    await act(async () => fail(new Error("offline")));
    expect(screen.getByRole("alert")).toHaveTextContent("That didn't save. Try again.");
    for (const name of ["Yes", "No"]) expect(screen.getByRole("button", { name })).toBeEnabled();

    // And one that saves after the sheet was closed leaves the next sheet alone.
    await user.click(screen.getByRole("button", { name: "Yes" }));
    await user.click(await screen.findByRole("button", { name: "Right level" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await act(async () => settle());
    expect(onDecide.mock.calls).toEqual([["no", "Too senior"], ["yes", "Right level"]]);
    expect(screen.queryByRole("alert")).toBeNull();
    for (const name of ["Yes", "No"]) expect(screen.getByRole("button", { name })).toBeEnabled();
  });

  it("takes the sheet's settings one by one: nothing else in them reopens it or renames who it is about", async () => {
    const user = userEvent.setup();
    // A host's wider object, handed over whole.
    const settings = {
      title: "Tell us why",
      open: false,
      candidateName: "Someone Else",
      reasonRequired: false,
      decision: "yes",
      onConfirm: vi.fn(),
    };
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(
      <CandidateClientDecision
        candidateName="this candidate"
        onDecide={onDecide}
        reasonPrompt="sheet"
        reasonSheet={settings}
        suggestions={SUGGESTIONS}
      />,
    );

    await user.click(screen.getByRole("button", { name: "No" }));
    const sheet = await screen.findByRole("dialog", { name: "Tell us why" });
    expect(sheet).toHaveAccessibleDescription("Give your reason for this candidate, or pick one.");
    expect(document.body).not.toHaveTextContent("Someone Else");
    // Still the answer asked about, still required, and still the row's to save.
    expect(sheet.querySelector("[data-slot='candidate-decision-reason-sheet']")).toHaveAttribute("data-decision", "no");
    expect(within(sheet).queryByRole("button", { name: /skip/i })).toBeNull();
    await user.click(within(sheet).getByRole("button", { name: "Too senior" }));
    expect(onDecide.mock.calls).toEqual([["no", "Too senior"]]);
    expect(settings.onConfirm).not.toHaveBeenCalled();
  });

  it("asks again through the sheet from Change", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(
      <CandidateClientDecision
        candidateName="Mei Tanaka"
        decision="yes"
        reason="A fictional reason"
        onDecide={onDecide}
        reasonPrompt="sheet"
        suggestions={SUGGESTIONS}
      />,
    );

    expect(screen.getByText("You said Yes")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Change" }));
    await user.click(screen.getByRole("button", { name: "No" }));
    await user.click(await screen.findByRole("button", { name: "Too far away" }));
    expect(onDecide.mock.calls).toEqual([["no", "Too far away"]]);
  });
});
