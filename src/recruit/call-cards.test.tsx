import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  normalizeCallParticipants,
  normalizeCallSegments,
  type CallInsights,
} from "./call-data";
import { CallReconcileCard } from "./call-reconcile-card";
import { CandidateCallCard } from "./candidate-call-card";
import { CandidateCallList } from "./candidate-call-list";
import { MatchedCallCard } from "./matched-call-card";

// Fictional people and calls only.
const MEI = { id: 7, name: "Mei Example" };
const OWEN = { id: 8, name: "Owen Sample" };

function insights(overrides: Partial<CallInsights> = {}): CallInsights {
  return { status: "idle", generating: false, error: null, onGenerate: vi.fn(), ...overrides };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("call data helpers", () => {
  it("lists each participant once, by email or else by name, ignoring case and blanks", () => {
    expect(
      normalizeCallParticipants([
        " Mei Example ",
        { name: "Owen Sample", email: "owen@example.com" },
        "OWEN@example.com",
        { name: " ", email: " " },
        "mei example",
        "",
        null,
        42,
        "riley@example.com ",
      ]),
    ).toEqual([
      { name: "Mei Example", email: undefined },
      { name: "Owen Sample", email: "owen@example.com" },
      { name: undefined, email: "riley@example.com" },
    ]);
  });

  it("keeps only transcript turns with text", () => {
    const turn = { speaker: "Mei Example", text: "Thanks for joining." };
    expect(normalizeCallSegments([turn, { speaker: "Owen Sample", text: "" }, { speaker: "x" }, "text", null])).toEqual([turn]);
  });
});

describe("candidate call list", () => {
  it("shows a skeleton without a count, the empty state, or the calls", () => {
    const empty = { title: "No calls linked yet", description: "Calls attach here once linked." };
    const { container, rerender } = render(<CandidateCallList count={0} loading empty={empty} />);
    const section = container.querySelector("[data-slot='candidate-call-list']")!;
    expect(section).toBeInTheDocument();
    expect(within(section as HTMLElement).queryByText("0")).toBeNull();
    expect(screen.queryByText("No calls linked yet")).toBeNull();

    rerender(<CandidateCallList count={0} empty={empty} />);
    expect(screen.getByText("No calls linked yet")).toBeInTheDocument();

    rerender(
      <CandidateCallList count={1} empty={empty} title="Conversations">
        <p>Fictional call</p>
      </CandidateCallList>,
    );
    expect(screen.getByText("Conversations")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Fictional call")).toBeInTheDocument();
    expect(screen.queryByText("No calls linked yet")).toBeNull();
  });

  it("words its blank slate plainly when the host passes no empty copy", () => {
    render(<CandidateCallList count={0} />);
    expect(screen.getByText("No calls yet")).toBeInTheDocument();
  });
});

describe("candidate call card", () => {
  it("offers the check before insights exist, with the last error", async () => {
    const user = userEvent.setup();
    const state = insights({ status: "failed", error: "The transcript is too short." });
    const { rerender } = render(
      <CandidateCallCard
        participants={[{ name: "Mei Example" }, { name: "Owen Sample", email: "owen@example.com" }]}
        transcript="Owen: Thanks for joining."
        confidence="high"
        onUnlink={vi.fn(async () => undefined)}
        insights={state}
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Untitled call" })).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("owen@example.com")).toBeInTheDocument();
    expect(screen.getByText("The transcript is too short.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Check against open jobs" }));
    expect(state.onGenerate).toHaveBeenCalledWith(false);

    rerender(
      <CandidateCallCard title="Intro call" onUnlink={vi.fn(async () => undefined)} insights={{ ...state, generating: true }} />,
    );
    expect(screen.getByRole("button", { name: "Checking…" })).toBeDisabled();
    expect(screen.queryByText("high")).toBeNull();
  });

  it("shows the host's role matches once ready, an empty state when none fit, and rechecks", async () => {
    const user = userEvent.setup();
    const ready = insights({ status: "ready", error: "An older failure" });
    const { rerender } = render(
      <CandidateCallCard
        title="Intro call"
        onUnlink={vi.fn(async () => undefined)}
        insights={ready}
        roleMatches={<p>Staff Engineer · A</p>}
      />,
    );

    expect(screen.getByText("Staff Engineer · A")).toBeInTheDocument();
    expect(screen.queryByText("No suggested roles yet")).toBeNull();
    // Errors belong to the first check; once insights exist they stay out of the way.
    expect(screen.queryByText("An older failure")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Recheck against open jobs" }));
    expect(ready.onGenerate).toHaveBeenCalledWith(true);

    rerender(<CandidateCallCard title="Intro call" onUnlink={vi.fn(async () => undefined)} insights={ready} />);
    expect(screen.getByText("No suggested roles yet")).toBeInTheDocument();
  });

  it("unlinks only after confirmation, with a spinner until the host settles", async () => {
    const user = userEvent.setup();
    let finish!: () => void;
    const onUnlink = vi.fn(() => new Promise<void>((resolve) => { finish = resolve; }));
    render(
      <CandidateCallCard
        onUnlink={onUnlink}
        insights={insights()}
        labels={{ unlinkDescription: "Fictional explanation." }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Unlink" }));
    const dialog = await screen.findByRole("alertdialog");
    expect(within(dialog).getByText("Unlink this call?")).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Fictional explanation.");
    expect(dialog).toHaveTextContent("this call");
    expect(onUnlink).not.toHaveBeenCalled();

    await user.click(within(dialog).getByRole("button", { name: "Unlink call" }));
    expect(onUnlink).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    const busy = screen.getAllByRole("button").find((button) => button.querySelector(".animate-spin"));
    expect(busy).toBeDisabled();

    await act(async () => finish());
    expect(screen.getByRole("button", { name: "Unlink" })).toBeEnabled();
  });
});

describe("matched call card", () => {
  const search = (people: readonly { id: number; name: string }[]) =>
    vi.fn(async (query: string) => people.filter((person) => person.name.toLowerCase().includes(query.toLowerCase())));

  it("heads the card with the linked people, each opening that person", async () => {
    const user = userEvent.setup();
    const onOpenPerson = vi.fn();
    const { rerender } = render(
      <MatchedCallCard title="Pipeline review" people={[MEI, OWEN]} onOpenPerson={onOpenPerson} insights={insights()} />,
    );

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Mei Example and Owen Sample");
    await user.click(screen.getByRole("button", { name: "Open Owen Sample" }));
    expect(onOpenPerson).toHaveBeenCalledWith(OWEN);
    // Without a link action the header has none.
    expect(screen.queryByRole("button", { name: "Link another person" })).toBeNull();

    rerender(<MatchedCallCard title="Pipeline review" insights={insights()} />);
    expect(screen.getByRole("heading", { level: 3, name: "Pipeline review" })).toBeInTheDocument();
    rerender(<MatchedCallCard insights={insights()} />);
    expect(screen.getByRole("heading", { level: 3, name: "Untitled call" })).toBeInTheDocument();
  });

  it("generates insights, regenerates once ready, and shows any error", async () => {
    const user = userEvent.setup();
    const idle = insights({ status: "failed", error: "Fictional failure." });
    const { rerender } = render(<MatchedCallCard insights={idle} />);
    expect(screen.getByText("Fictional failure.")).toBeInTheDocument();
    expect(screen.queryByText("No suggested roles yet")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Generate" }));
    expect(idle.onGenerate).toHaveBeenCalledWith(false);

    const ready = insights({ status: "ready", error: "Regeneration failed." });
    rerender(<MatchedCallCard insights={ready} />);
    expect(screen.getByText("No suggested roles yet")).toBeInTheDocument();
    expect(screen.getByText("Regeneration failed.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Regenerate" }));
    expect(ready.onGenerate).toHaveBeenCalledWith(true);

    rerender(<MatchedCallCard insights={{ ...ready, generating: true }} roleMatches={<p>Staff Engineer · B</p>} />);
    expect(screen.getByRole("button", { name: "Regenerate" })).toBeDisabled();
    expect(screen.getByText("Staff Engineer · B")).toBeInTheDocument();
  });

  it("loads the full transcript once, the first time it opens", async () => {
    const user = userEvent.setup();
    const loadTranscript = vi.fn(async () => ({
      content: "Mei: The full fictional conversation.",
      segments: [{ speaker: "Mei Example", text: "The full fictional conversation." }],
    }));
    render(<MatchedCallCard transcript="Mei: The preview…" loadTranscript={loadTranscript} insights={insights()} />);

    const toggle = screen.getByRole("button", { name: "Show full transcript" });
    await user.click(toggle);
    expect(await screen.findByText("The full fictional conversation.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Hide transcript" }));
    await user.click(screen.getByRole("button", { name: "Show full transcript" }));
    expect(loadTranscript).toHaveBeenCalledTimes(1);
  });

  it("searches after a pause, from two characters, and drops a superseded search", async () => {
    vi.useFakeTimers();
    const searchPeople = vi.fn<(query: string, signal: AbortSignal) => Promise<{ id: number; name: string }[]>>(
      async (query) => [MEI, OWEN].filter((person) => person.name.toLowerCase().includes(query.toLowerCase())),
    );
    render(
      <MatchedCallCard insights={insights()} linkPerson={{ searchPeople, onLink: vi.fn(async () => undefined) }} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Link another person" }));
    const input = await vi.waitFor(() => screen.getByPlaceholderText("Search people…"));

    fireEvent.change(input, { target: { value: "M" } });
    act(() => vi.advanceTimersByTime(1000));
    expect(searchPeople).not.toHaveBeenCalled();
    expect(screen.queryByText("Searching…")).toBeNull();

    fireEvent.change(input, { target: { value: "Me" } });
    expect(screen.getByText("Searching…")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(249));
    expect(searchPeople).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: " Mei " } });
    act(() => vi.advanceTimersByTime(249));
    expect(searchPeople).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(1));
    expect(searchPeople).toHaveBeenCalledTimes(1);
    expect(searchPeople.mock.calls[0]![0]).toBe("Mei");
    expect(screen.getByRole("button", { name: "Mei Example" })).toBeInTheDocument();
    expect(screen.queryByText("Searching…")).toBeNull();

    // A query too short to search clears the results and the progress line.
    fireEvent.change(input, { target: { value: "Ow" } });
    expect(screen.getByText("Searching…")).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "O" } });
    expect(screen.queryByText("Searching…")).toBeNull();
    expect(screen.queryByRole("button", { name: "Mei Example" })).toBeNull();

    fireEvent.change(input, { target: { value: "Zed" } });
    await act(async () => vi.advanceTimersByTime(250));
    expect(screen.getByText("No people match that name")).toBeInTheDocument();
  });

  it("aborts the search in flight when the query changes or the card unmounts", async () => {
    vi.useFakeTimers();
    const signals: AbortSignal[] = [];
    const searchPeople = vi.fn((_query: string, signal: AbortSignal) => {
      signals.push(signal);
      return new Promise<{ id: number; name: string }[]>(() => undefined);
    });
    const { unmount } = render(
      <MatchedCallCard insights={insights()} linkPerson={{ searchPeople, onLink: vi.fn(async () => undefined) }} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Link another person" }));
    const input = await vi.waitFor(() => screen.getByPlaceholderText("Search people…"));
    fireEvent.change(input, { target: { value: "Mei" } });
    await act(async () => vi.advanceTimersByTime(250));
    fireEvent.change(input, { target: { value: "Owen" } });
    expect(signals[0]!.aborted).toBe(true);
    await act(async () => vi.advanceTimersByTime(250));
    expect(signals[1]!.aborted).toBe(false);
    unmount();
    expect(signals[1]!.aborted).toBe(true);
  });

  it("closes the link dialog once the host links the person, and stays open when it fails", async () => {
    const user = userEvent.setup();
    let fail = true;
    const onLink = vi.fn(async () => {
      if (fail) throw new Error("Fictional failure");
    });
    render(<MatchedCallCard insights={insights()} linkPerson={{ searchPeople: search([MEI, OWEN]), onLink }} />);

    await user.click(screen.getByRole("button", { name: "Link another person" }));
    await user.type(await screen.findByPlaceholderText("Search people…"), "Owen");
    await user.click(await screen.findByRole("button", { name: "Owen Sample" }));
    expect(onLink).toHaveBeenCalledWith(OWEN);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search people…")).toHaveValue("Owen");

    fail = false;
    await user.click(screen.getByRole("button", { name: "Owen Sample" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    await user.click(screen.getByRole("button", { name: "Link another person" }));
    expect(await screen.findByPlaceholderText("Search people…")).toHaveValue("");
  });
});

describe("call reconcile card", () => {
  const participants = [{ name: "Mei Example" }, { name: "Owen Sample", email: "owen@example.com" }];
  const base = {
    title: "Call with Mei",
    participants,
    transcript: "Mei: Exploring a move next year.",
    searchPeople: vi.fn(async () => [OWEN]),
    onDismiss: vi.fn(),
    onAttach: vi.fn(),
    onCreateAttach: vi.fn(),
    renderPreview: (person: { id: number; name: string }, close: () => void) => (
      <div>
        <p>Preview of {person.name}</p>
        <button type="button" onClick={close}>Close preview</button>
      </div>
    ),
  };

  it("shows whose call it is and hints at a person the host couldn't find", () => {
    const { rerender } = render(
      <CallReconcileCard {...base} owner={{ label: "Riley Example" }} suggestedPerson={{ name: "Dana Example" }} />,
    );
    expect(screen.getByText("Riley Example").className).toContain("border");
    expect(screen.getByText(/We couldn't find Dana Example\. Search or add them below/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search for Dana Example")).toBeInTheDocument();

    rerender(<CallReconcileCard {...base} owner={{ label: "You", isViewer: true }} externalSearch={<button type="button">Look up</button>} />);
    expect(screen.getByText("You").className).toContain("bg-secondary");
    expect(screen.queryByText(/We couldn't find/)).toBeNull();
    expect(screen.getByPlaceholderText("Search by name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Look up" })).toBeInTheDocument();
  });

  it("previews a likely person before attaching, and can cancel", async () => {
    const user = userEvent.setup();
    const onAttach = vi.fn();
    const onDismiss = vi.fn();
    render(<CallReconcileCard {...base} guesses={[MEI]} onAttach={onAttach} onDismiss={onDismiss} />);

    expect(screen.getByText("Possible matches")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Mei Example" }));
    expect(await screen.findByText("Preview of Mei Example")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByText("Preview of Mei Example")).toBeNull());
    expect(onAttach).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Mei Example" }));
    await user.click(await screen.findByRole("button", { name: "Close preview" }));
    await waitFor(() => expect(screen.queryByText("Preview of Mei Example")).toBeNull());

    await user.click(screen.getByRole("button", { name: "Mei Example" }));
    await user.click(await screen.findByRole("button", { name: "Attach this call" }));
    expect(onAttach).toHaveBeenCalledWith(MEI);
    await waitFor(() => expect(screen.queryByText("Preview of Mei Example")).toBeNull());

    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledWith();
  });

  it("finds a person by name and previews them", async () => {
    const user = userEvent.setup();
    const searchPeople = vi.fn(async (query: string) => [MEI, OWEN].filter((person) => person.name.startsWith(query)));
    render(<CallReconcileCard {...base} searchPeople={searchPeople} />);

    await user.type(screen.getByPlaceholderText("Search by name"), "Ow");
    await user.click(await screen.findByRole("button", { name: "Owen Sample" }));
    expect(await screen.findByText("Preview of Owen Sample")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByText("Preview of Owen Sample")).toBeNull());

    await user.clear(screen.getByPlaceholderText("Search by name"));
    await user.type(screen.getByPlaceholderText("Search by name"), "Zed");
    expect(await screen.findByText("No people match that name")).toBeInTheDocument();
  });

  it("creates a person from the call, seeded from the suggestion or a participant with an email", async () => {
    const user = userEvent.setup();
    const onCreateAttach = vi.fn();
    const { rerender } = render(<CallReconcileCard {...base} onCreateAttach={onCreateAttach} />);

    await user.click(screen.getByRole("button", { name: "Manually add" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByPlaceholderText("Full name")).toHaveValue("Owen Sample");
    expect(within(dialog).getByPlaceholderText("email@example.com")).toHaveValue("owen@example.com");
    await user.click(within(dialog).getByRole("button", { name: "Mei Example" }));
    expect(within(dialog).getByPlaceholderText("Full name")).toHaveValue("Mei Example");
    expect(within(dialog).getByPlaceholderText("email@example.com")).toHaveValue("");
    await user.clear(within(dialog).getByPlaceholderText("Full name"));
    expect(within(dialog).getByRole("button", { name: "Create & attach this call" })).toBeDisabled();
    await user.type(within(dialog).getByPlaceholderText("Full name"), "  Mei Example  ");
    await user.click(within(dialog).getByRole("button", { name: "Create & attach this call" }));
    expect(onCreateAttach).toHaveBeenCalledWith({ name: "Mei Example", email: undefined });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    rerender(
      <CallReconcileCard {...base} onCreateAttach={onCreateAttach} suggestedPerson={{ name: "Dana Example", email: "dana@example.com" }} />,
    );
    await user.click(screen.getByRole("button", { name: "Manually add" }));
    const seeded = await screen.findByRole("dialog");
    expect(within(seeded).getByPlaceholderText("Full name")).toHaveValue("Dana Example");
    expect(within(seeded).getByPlaceholderText("email@example.com")).toHaveValue("dana@example.com");
  });
});
