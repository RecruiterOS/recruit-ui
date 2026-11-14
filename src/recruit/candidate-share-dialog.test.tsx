import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CandidateShareDialog,
  candidateShareDialogLabels,
  candidateShareLinkText,
  type CandidateShareAudience,
  type CandidateShareChoices,
  type CandidateShareDialogProps,
} from "./candidate-share-dialog";

// A window whose width the tests decide. The kit's responsive dialog asks
// the browser once, as its module loads, how to match a media query, so this
// stands in before anything is imported. It is wide unless a test narrows it.
const viewport = vi.hoisted(() => {
  type Listener = (event: { matches: boolean; media: string }) => void;
  const listeners = new Set<Listener>();
  const state = { wide: true };
  window.matchMedia = ((query: string) => ({
    get matches() {
      return state.wide;
    },
    media: query,
    onchange: null,
    addListener: (listener: Listener) => listeners.add(listener),
    removeListener: (listener: Listener) => listeners.delete(listener),
    addEventListener: (_type: string, listener: Listener) => listeners.add(listener),
    removeEventListener: (_type: string, listener: Listener) => listeners.delete(listener),
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  return {
    resize(wide: boolean) {
      state.wide = wide;
      for (const listener of [...listeners]) listener({ matches: wide, media: "" });
    },
  };
});

// Fictional people, organisations and links only.
const LINK = "https://www.example.com/p/V1StGXR8Z5jdHi6BmyT";

const AUDIENCES: CandidateShareAudience[] = [
  { id: "client", label: "The client", description: "They see the profile and can answer Yes or No." },
  { id: "candidate", label: "The candidate", description: "They see the role and why you thought of them." },
];

function renderDialog(overrides: Partial<CandidateShareDialogProps> = {}) {
  const onOpenChange = vi.fn();
  const props: CandidateShareDialogProps = {
    open: true,
    onOpenChange,
    candidateName: "Mei Tanaka",
    ...overrides,
  };
  const view = render(<CandidateShareDialog {...props} />);
  return { ...view, props, onOpenChange };
}

const dialog = () => screen.getByRole("dialog", { name: "Share Mei Tanaka" });
const body = () => dialog().querySelector("[data-slot='candidate-share-dialog']") as HTMLElement;

/** Puts a clipboard of the test's own on the browser, after user-event has put its stub there. */
const clipboardBefore = Object.getOwnPropertyDescriptor(navigator, "clipboard");
function useClipboard(clipboard: Partial<Record<"writeText" | "write", unknown>> | undefined) {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: clipboard });
}

function readText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

afterEach(() => {
  act(() => viewport.resize(true));
  if (clipboardBefore) Object.defineProperty(navigator, "clipboard", clipboardBefore);
  else delete (navigator as { clipboard?: unknown }).clipboard;
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("candidate share dialog, before a link is made", () => {
  it("asks for nothing it wasn't given: a title and a way to make the link", () => {
    renderDialog({ onShare: vi.fn() });

    // The kit's dialog content keeps its slot; the dialog marks its own body.
    expect(dialog()).toHaveAttribute("data-slot", "dialog-content");
    expect(body()).toHaveAttribute("data-view", "compose");
    // No description to point at, so none is claimed.
    expect(dialog()).not.toHaveAttribute("aria-describedby");
    expect(within(dialog()).getByRole("heading", { level: 2, name: "Share Mei Tanaka" })).toBeInTheDocument();
    expect(within(dialog()).queryByRole("group")).toBeNull();
    expect(within(dialog()).queryByRole("radiogroup")).toBeNull();
    expect(within(dialog()).queryByRole("textbox")).toBeNull();
    expect(within(dialog()).queryByRole("tablist")).toBeNull();
    expect(dialog().querySelector("[data-slot='candidate-share-dialog-link']")).toBeNull();
    expect(within(dialog()).getByRole("button", { name: "Create link" })).toBeEnabled();
  });

  it("shows who is being shared, and the sharer's own reason", () => {
    renderDialog({
      avatar: <img alt="Mei Tanaka's photo" src="https://example.com/mei.png" />,
      headline: "Staff Engineer · Sample Analytics",
      reason: "Has done the fictional rebuild twice.",
      labels: { description: "Make a link to their profile." },
    });

    expect(dialog()).toHaveAccessibleDescription("Make a link to their profile.");
    // A reason with a pasted link in it wraps, not widens the dialog.
    expect(body().firstElementChild).toHaveClass("[overflow-wrap:anywhere]");
    const summary = dialog().querySelector("[data-slot='candidate-share-dialog-summary']") as HTMLElement;
    expect(within(summary).getByAltText("Mei Tanaka's photo")).toBeInTheDocument();
    expect(summary).toHaveTextContent("Mei TanakaStaff Engineer · Sample AnalyticsYour reasonHas done the fictional rebuild twice.");
  });

  it("asks who the link is for, each with its own words and its own fields", async () => {
    const user = userEvent.setup();
    const onShare = vi.fn().mockResolvedValue(LINK);

    function Host() {
      const [booking, setBooking] = useState("");
      return (
        <CandidateShareDialog
          open
          onOpenChange={() => undefined}
          candidateName="Mei Tanaka"
          onShare={onShare}
          audiences={[
            AUDIENCES[0]!,
            {
              ...AUDIENCES[1]!,
              // The host's own field, and its own rule for when it is filled in.
              fields: (
                <label>
                  Booking link
                  <input value={booking} onChange={(event) => setBooking(event.target.value)} />
                </label>
              ),
              ready: booking.trim() !== "",
            },
          ]}
        />
      );
    }
    render(<Host />);

    const group = within(dialog()).getByRole("group", { name: "Who is this link for?" });
    const chips = within(group).getAllByRole("button");
    expect(chips.map((chip) => chip.textContent)).toEqual(["The client", "The candidate"]);
    expect(chips.map((chip) => chip.getAttribute("aria-pressed"))).toEqual(["true", "false"]);
    expect(dialog()).toHaveTextContent("They see the profile and can answer Yes or No.");
    expect(screen.queryByLabelText("Booking link")).toBeNull();
    expect(screen.getByRole("button", { name: "Create link" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "The candidate" }));
    expect(screen.getByRole("button", { name: "The candidate" })).toHaveAttribute("aria-pressed", "true");
    expect(dialog()).toHaveTextContent("They see the role and why you thought of them.");
    expect(dialog()).not.toHaveTextContent("They see the profile and can answer Yes or No.");
    // Held until the audience's own fields are filled in.
    expect(screen.getByRole("button", { name: "Create link" })).toBeDisabled();
    await user.type(screen.getByLabelText("Booking link"), "https://example.com/book");
    await user.click(screen.getByRole("button", { name: "Create link" }));

    // The host holds what was typed in its fields; the dialog says who the link is for.
    expect(onShare.mock.calls).toEqual([[{ audience: "candidate", anonymised: false, note: "" }]]);
  });

  it("makes no second link for an audience that has a live one, and starts on one that hasn't", () => {
    const onShare = vi.fn();
    const { rerender, props } = renderDialog({
      onShare,
      anonymisable: true,
      note: true,
      audiences: [{ ...AUDIENCES[0]!, live: true, fields: <p>Client fields</p> }, AUDIENCES[1]!],
    });

    // The one still to share with.
    expect(screen.getByRole("button", { name: "The candidate" })).toHaveAttribute("aria-pressed", "true");
    // The live one says so on its chip.
    expect(screen.getByRole("button", { name: "The client Live" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Create link" })).toBeEnabled();
    expect(screen.getByRole("radiogroup", { name: "How they appear" })).toBeInTheDocument();

    rerender(<CandidateShareDialog {...props} choices={{ audience: "client" }} />);
    expect(dialog()).toHaveTextContent("A link for them is already live. Stop sharing it to make a new one.");
    // Nothing to fill in for a link that won't be made.
    expect(dialog()).not.toHaveTextContent("They see the profile and can answer Yes or No.");
    expect(screen.queryByText("Client fields")).toBeNull();
    expect(screen.queryByRole("radiogroup")).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.getByRole("button", { name: "Create link" })).toBeDisabled();

    rerender(
      <CandidateShareDialog
        {...props}
        choices={{ audience: "client" }}
        audiences={[{ ...AUDIENCES[0]!, live: true, liveDescription: "Mei has a live client link, on her card." }, AUDIENCES[1]!]}
      />,
    );
    expect(dialog()).toHaveTextContent("Mei has a live client link, on her card.");

    // With every audience live, it starts on the first.
    rerender(<CandidateShareDialog {...props} audiences={AUDIENCES.map((audience) => ({ ...audience, live: true }))} />);
    expect(screen.getByRole("button", { name: "The client Live" })).toHaveAttribute("aria-pressed", "true");
    expect(onShare).not.toHaveBeenCalled();
  });

  it("shows a live audience's link where the host has it, to copy or to save again", async () => {
    const user = userEvent.setup();
    const onShare = vi.fn().mockResolvedValue(LINK);
    renderDialog({ onShare, audiences: [{ ...AUDIENCES[0]!, live: true }], url: LINK });

    // The link is there, so the audience's own words are too, and it can be saved again.
    expect(dialog()).toHaveTextContent("They see the profile and can answer Yes or No.");
    expect(dialog().querySelector("[data-slot='candidate-share-dialog-link']")).toHaveTextContent("example.com/p/V1StGXR8Z5jdHi6BmyT");
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it("asks whether the page names them, named unless chosen otherwise", async () => {
    const user = userEvent.setup();
    const onShare = vi.fn().mockResolvedValue(LINK);
    renderDialog({ onShare, anonymisable: true });

    const choice = within(dialog()).getByRole("radiogroup", { name: "How they appear" });
    const named = within(choice).getByRole("radio", { name: /^Named/ });
    const anonymised = within(choice).getByRole("radio", { name: /^Anonymised/ });
    expect(named).toBeChecked();
    expect(anonymised).not.toBeChecked();
    // Each is named by its title and described by what it shows, outright:
    // not left to how a browser reads a label wrapped round a group.
    expect(named).toHaveAccessibleName("Named");
    expect(named).toHaveAccessibleDescription("Shows their name and photo.");
    expect(anonymised).toHaveAccessibleName("Anonymised");
    expect(anonymised).toHaveAccessibleDescription("Leaves out their name and photo.");
    expect(named).toHaveAttribute("aria-labelledby");
    // The whole card is still the target.
    expect(anonymised.closest("label")).toHaveAttribute("for", anonymised.id);

    await user.click(anonymised);
    expect(anonymised).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Create link" }));
    expect(onShare.mock.calls).toEqual([[{ audience: undefined, anonymised: true, note: "" }]]);
  });

  it("never asks for an anonymised page it didn't offer", async () => {
    const user = userEvent.setup();
    const onShare = vi.fn().mockResolvedValue(LINK);
    renderDialog({ onShare, defaultChoices: { anonymised: true }, choices: { anonymised: true } });

    expect(screen.queryByRole("radiogroup")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Create link" }));
    expect(onShare.mock.calls[0]![0]).toMatchObject({ anonymised: false });
  });

  it("takes a typed note, trimmed, for whoever opens the link", async () => {
    const user = userEvent.setup();
    const onShare = vi.fn().mockResolvedValue(LINK);
    renderDialog({ onShare, note: true, noteMaxLength: 500 });

    const field = within(dialog()).getByRole("textbox", { name: "A note for them" });
    expect(field).toHaveAccessibleDescription("Optional. It shows above the profile.");
    expect(field).toHaveAttribute("placeholder", "Why should they meet this person?");
    expect(field).toHaveAttribute("maxlength", "500");
    expect(within(dialog()).queryByRole("tablist")).toBeNull();

    await user.type(field, "  Worth meeting this week.  ");
    await user.click(screen.getByRole("button", { name: "Create link" }));
    expect(onShare.mock.calls).toEqual([[{ audience: undefined, anonymised: false, note: "Worth meeting this week." }]]);
  });

  it("puts a recorder and the typed note behind a switch, and loses neither to it", async () => {
    const user = userEvent.setup();
    function Recorder() {
      const [takes, setTakes] = useState(0);
      return (
        <button type="button" onClick={() => setTakes((count) => count + 1)}>
          Fictional recorder, {takes} takes
        </button>
      );
    }
    const { rerender, props } = renderDialog({ onShare: vi.fn(), note: true, recorder: <Recorder /> });

    const tabs = within(dialog()).getByRole("tablist", { name: "Note format" });
    expect(within(tabs).getAllByRole("tab").map((tab) => tab.textContent)).toEqual(["Voice note", "Written note"]);
    // The recorder first.
    expect(within(tabs).getByRole("tab", { name: "Voice note" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Voice note" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Fictional recorder, 0 takes" }));

    await user.click(within(tabs).getByRole("tab", { name: "Written note" }));
    await user.type(screen.getByRole("textbox", { name: "A note for them" }), "A fictional note");
    // Hidden, not unmounted: the take is still there when the switch goes back.
    expect(screen.getByText("Fictional recorder, 1 takes").closest("[role='tabpanel']")).toHaveClass("data-[state=inactive]:hidden");
    expect(screen.getByText("Fictional recorder, 1 takes").closest("[role='tabpanel']")).toHaveAttribute("data-state", "inactive");

    await user.click(within(tabs).getByRole("tab", { name: "Voice note" }));
    expect(screen.getByRole("button", { name: "Fictional recorder, 1 takes" })).toBeInTheDocument();
    await user.click(within(tabs).getByRole("tab", { name: "Written note" }));
    expect(screen.getByRole("textbox", { name: "A note for them" })).toHaveValue("A fictional note");

    // A recorder alone needs no switch.
    rerender(<CandidateShareDialog {...props} note={false} />);
    expect(within(dialog()).queryByRole("tablist")).toBeNull();
    expect(within(dialog()).queryByRole("textbox")).toBeNull();
    expect(screen.getByRole("button", { name: /Fictional recorder/ })).toBeInTheDocument();
  });

  it("opens on the typed note where the host says the link has one", () => {
    renderDialog({
      onShare: vi.fn(),
      note: true,
      recorder: <button type="button">Fictional recorder</button>,
      defaultNoteFormat: "written",
      choices: { note: "A fictional saved note" },
    });

    expect(screen.getByRole("tab", { name: "Written note" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("textbox", { name: "A note for them" })).toHaveValue("A fictional saved note");
    expect(screen.getByRole("textbox", { name: "A note for them" })).toBeVisible();
    // The recorder is a tap away, and mounted all along.
    expect(screen.getByText("Fictional recorder").closest("[role='tabpanel']")).toHaveAttribute("data-state", "inactive");
  });

  it("holds sharing for what the host says it is waiting for", async () => {
    const user = userEvent.setup();
    const onShare = vi.fn().mockResolvedValue(LINK);
    const { rerender, props } = renderDialog({ onShare, waitingFor: "Finish the voice note to share" });

    const button = screen.getByRole("button", { name: "Finish the voice note to share" });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onShare).not.toHaveBeenCalled();

    rerender(<CandidateShareDialog {...props} waitingFor={null} />);
    expect(screen.getByRole("button", { name: "Create link" })).toBeEnabled();
  });

  it("lets a host hold the choices, and tells it each one as it changes", async () => {
    const user = userEvent.setup();
    const onChoicesChange = vi.fn();
    const onShare = vi.fn().mockResolvedValue(LINK);

    function Host() {
      // A host that fills the note in from a link it already has.
      const [choices, setChoices] = useState<Partial<CandidateShareChoices>>({ note: "A fictional saved note", anonymised: true });
      return (
        <CandidateShareDialog
          open
          onOpenChange={() => undefined}
          candidateName="Mei Tanaka"
          audiences={AUDIENCES}
          anonymisable
          note
          choices={choices}
          onChoicesChange={(next) => {
            onChoicesChange(next);
            setChoices(next);
          }}
          onShare={onShare}
        />
      );
    }
    render(<Host />);

    expect(screen.getByRole("textbox", { name: "A note for them" })).toHaveValue("A fictional saved note");
    expect(screen.getByRole("radio", { name: /^Anonymised/ })).toBeChecked();

    await user.click(screen.getByRole("button", { name: "The candidate" }));
    expect(onChoicesChange).toHaveBeenLastCalledWith({ audience: "candidate", anonymised: true, note: "A fictional saved note" });
    await user.click(screen.getByRole("radio", { name: /^Named/ }));
    expect(onChoicesChange).toHaveBeenLastCalledWith({ audience: "candidate", anonymised: false, note: "A fictional saved note" });
    await user.type(screen.getByRole("textbox", { name: "A note for them" }), "!");
    expect(onChoicesChange).toHaveBeenLastCalledWith({ audience: "candidate", anonymised: false, note: "A fictional saved note!" });

    await user.click(screen.getByRole("button", { name: "Create link" }));
    expect(onShare.mock.calls).toEqual([[{ audience: "candidate", anonymised: false, note: "A fictional saved note!" }]]);
  });

  it("starts from the host's defaults", () => {
    renderDialog({
      audiences: AUDIENCES,
      anonymisable: true,
      note: true,
      defaultChoices: { audience: "candidate", anonymised: true, note: "A fictional start" },
    });

    expect(screen.getByRole("button", { name: "The candidate" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("radio", { name: /^Anonymised/ })).toBeChecked();
    expect(screen.getByRole("textbox", { name: "A note for them" })).toHaveValue("A fictional start");
  });

  it("shows an error of the host's own", () => {
    renderDialog({ onShare: vi.fn(), error: "This person's links couldn't be read." });
    expect(within(dialog()).getByRole("alert")).toHaveTextContent("This person's links couldn't be read.");
  });

  it("says what the host words", () => {
    renderDialog({
      onShare: vi.fn(),
      audiences: AUDIENCES,
      anonymisable: true,
      note: true,
      reason: "A fictional reason",
      labels: {
        title: (name) => `Share ${name}'s profile`,
        reason: "Your yes",
        audience: "Send it to",
        visibility: "Named or blind",
        named: "Named profile",
        anonymised: "Blind profile",
        note: "Written note",
        create: () => "Create client link",
      },
    });

    const shared = screen.getByRole("dialog", { name: "Share Mei Tanaka's profile" });
    expect(shared).toHaveTextContent("Your yesA fictional reason");
    expect(within(shared).getByRole("group", { name: "Send it to" })).toBeInTheDocument();
    expect(within(shared).getByRole("radiogroup", { name: "Named or blind" })).toBeInTheDocument();
    expect(within(shared).getByRole("radio", { name: /^Blind profile/ })).toBeInTheDocument();
    expect(within(shared).getByRole("textbox", { name: "Written note" })).toBeInTheDocument();
    expect(within(shared).getByRole("button", { name: "Create client link" })).toBeInTheDocument();
  });
});

describe("candidate share dialog, making the link", () => {
  it("holds itself while the host makes the link, then shows it with Copy", async () => {
    const user = userEvent.setup();
    let make: (link: string) => void = () => undefined;
    const onShare = vi.fn(() => new Promise<string>((resolve) => { make = resolve; }));
    const { onOpenChange } = renderDialog({ onShare, audiences: AUDIENCES, note: true });

    // The line that will say the link is ready is in the dialog already,
    // saying nothing and taking no room: a screen reader announces what a
    // live region comes to say, not one that arrives already saying it.
    const status = within(dialog()).getByRole("status");
    expect(status).toBeEmptyDOMElement();
    expect(status.parentElement).toHaveClass("sr-only");

    await user.click(screen.getByRole("button", { name: "Create link" }));
    const busy = screen.getByRole("button", { name: "Creating link…" });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute("aria-busy", "true");
    // The choices are what was sent: they hold too.
    for (const chip of within(screen.getByRole("group", { name: "Who is this link for?" })).getAllByRole("button")) {
      expect(chip).toBeDisabled();
    }
    expect(screen.getByRole("textbox", { name: "A note for them" })).toBeDisabled();
    // A second press sends nothing.
    await user.click(busy);
    expect(onShare).toHaveBeenCalledTimes(1);

    await act(async () => make(`  ${LINK}  `));

    expect(body()).toHaveAttribute("data-view", "result");
    // The link, cut short to read, whole in its tooltip.
    const link = dialog().querySelector("[data-slot='candidate-share-dialog-link']") as HTMLElement;
    const shown = within(link).getByText("example.com/p/V1StGXR8Z5jdHi6BmyT");
    expect(shown).toHaveAttribute("title", LINK);
    // The same line, now with something to say, and somewhere to be seen.
    expect(within(dialog()).getByRole("status")).toBe(status);
    expect(status).toHaveTextContent("Your link is ready.");
    expect(status.parentElement).not.toHaveClass("sr-only");
    // Copy is the next thing to press, so it has the focus.
    const copy = within(link).getByRole("button", { name: "Copy" });
    await waitFor(() => expect(copy).toHaveFocus());
    // The form has done its work.
    expect(screen.queryByRole("group", { name: "Who is this link for?" })).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("button", { name: "Create link" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("takes a link handed straight back, with no promise", async () => {
    const user = userEvent.setup();
    renderDialog({ onShare: () => LINK });

    await user.click(screen.getByRole("button", { name: "Create link" }));
    expect(await screen.findByText("example.com/p/V1StGXR8Z5jdHi6BmyT")).toBeInTheDocument();
    expect(body()).toHaveAttribute("data-view", "result");
  });

  it("closes when the host makes a link it shows somewhere else", async () => {
    const user = userEvent.setup();
    const onShare = vi.fn().mockResolvedValue(undefined);
    const { onOpenChange } = renderDialog({ onShare });

    await user.click(screen.getByRole("button", { name: "Create link" }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(dialog().querySelector("[data-slot='candidate-share-dialog-link']")).toBeNull();
  });

  it("says a link couldn't be made, keeps what was chosen, and tries again", async () => {
    const user = userEvent.setup();
    const onShare = vi
      .fn<(choices: CandidateShareChoices) => Promise<string>>()
      .mockRejectedValueOnce(new Error("That person is no longer on the search."))
      .mockResolvedValue(LINK);
    const { onOpenChange } = renderDialog({
      onShare,
      note: true,
      labels: { failed: (cause) => (cause instanceof Error ? cause.message : "Not made.") },
    });

    await user.type(screen.getByRole("textbox", { name: "A note for them" }), "A fictional note");
    await user.click(screen.getByRole("button", { name: "Create link" }));

    // The host's own reason, where it has one.
    expect(await within(dialog()).findByRole("alert")).toHaveTextContent("That person is no longer on the search.");
    expect(body()).toHaveAttribute("data-view", "compose");
    expect(screen.getByRole("textbox", { name: "A note for them" })).toHaveValue("A fictional note");
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Create link" }));
    expect(await screen.findByText("example.com/p/V1StGXR8Z5jdHi6BmyT")).toBeInTheDocument();
    expect(within(dialog()).queryByRole("alert")).toBeNull();
    expect(onShare).toHaveBeenCalledTimes(2);
  });

  it("says the default when the host throws, and clears it once something is changed", async () => {
    const user = userEvent.setup();
    renderDialog({
      audiences: AUDIENCES,
      onShare: () => {
        throw new Error("offline");
      },
    });

    await user.click(screen.getByRole("button", { name: "Create link" }));
    expect(within(dialog()).getByRole("alert")).toHaveTextContent("That link couldn't be made. Try again.");
    expect(screen.getByRole("button", { name: "Create link" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "The candidate" }));
    expect(within(dialog()).queryByRole("alert")).toBeNull();
  });

  it("starts again each time it opens", async () => {
    const user = userEvent.setup();
    const onShare = vi.fn().mockResolvedValue(LINK);
    const { rerender, props } = renderDialog({ onShare, note: true, audiences: AUDIENCES });

    await user.click(screen.getByRole("button", { name: "The candidate" }));
    await user.type(screen.getByRole("textbox", { name: "A note for them" }), "A fictional note");
    await user.click(screen.getByRole("button", { name: "Create link" }));
    expect(await screen.findByText("Your link is ready.")).toBeInTheDocument();

    rerender(<CandidateShareDialog {...props} open={false} />);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    rerender(<CandidateShareDialog {...props} candidateName="Tomas Example" />);

    // The next person gets the form, with nothing of the last one's in it.
    const next = screen.getByRole("dialog", { name: "Share Tomas Example" });
    expect(next.querySelector("[data-slot='candidate-share-dialog']")).toHaveAttribute("data-view", "compose");
    expect(within(next).getByRole("button", { name: "The client" })).toHaveAttribute("aria-pressed", "true");
    expect(within(next).getByRole("textbox", { name: "A note for them" })).toHaveValue("");
    expect(next.querySelector("[data-slot='candidate-share-dialog-link']")).toBeNull();
  });
});

describe("candidate share dialog, across openings and window sizes", () => {
  it("drops a share that settles after the dialog has been opened again", async () => {
    const user = userEvent.setup();
    let make: (link: string) => void = () => undefined;
    const onShare = vi.fn(() => new Promise<string>((resolve) => { make = resolve; }));
    const { rerender, props, onOpenChange } = renderDialog({ onShare });

    await user.click(screen.getByRole("button", { name: "Create link" }));
    // Closed while the host is still making the link, then opened for someone else.
    rerender(<CandidateShareDialog {...props} open={false} />);
    rerender(<CandidateShareDialog {...props} candidateName="Tomas Example" />);
    await act(async () => make(LINK));

    // The link was the last person's: the new opening shows none, and is still open.
    const next = screen.getByRole("dialog", { name: "Share Tomas Example" });
    expect(next.querySelector("[data-slot='candidate-share-dialog']")).toHaveAttribute("data-view", "compose");
    expect(next.querySelector("[data-slot='candidate-share-dialog-link']")).toBeNull();
    expect(within(next).getByRole("button", { name: "Create link" })).toBeEnabled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("keeps the note, a share on its way and the link when the window narrows to a bottom sheet", async () => {
    // The kit's dialog swaps a dialog for a drawer as the window narrows,
    // and remounts what it holds.
    const resize = (wide: boolean) => act(() => viewport.resize(wide));
    const user = userEvent.setup();
    let make: (link: string) => void = () => undefined;
    const onShare = vi.fn(() => new Promise<string>((resolve) => { make = resolve; }));
    renderDialog({ onShare, note: true });
    expect(dialog()).toHaveAttribute("data-slot", "dialog-content");

    await user.type(screen.getByRole("textbox", { name: "A note for them" }), "A fictional note");
    resize(false);
    // A bottom sheet now, with the note still in it.
    expect(dialog()).toHaveAttribute("data-slot", "drawer-content");
    expect(screen.getByRole("textbox", { name: "A note for them" })).toHaveValue("A fictional note");

    resize(true);
    await user.click(screen.getByRole("button", { name: "Create link" }));
    resize(false);
    // Still on its way, and not sent twice.
    expect(dialog()).toHaveAttribute("data-slot", "drawer-content");
    expect(screen.getByRole("button", { name: "Creating link…" })).toBeDisabled();
    await act(async () => make(LINK));
    expect(await screen.findByText("example.com/p/V1StGXR8Z5jdHi6BmyT")).toBeInTheDocument();
    expect(body()).toHaveAttribute("data-view", "result");

    resize(true);
    expect(dialog()).toHaveAttribute("data-slot", "dialog-content");
    expect(screen.getByText("example.com/p/V1StGXR8Z5jdHi6BmyT")).toBeInTheDocument();
    expect(within(dialog()).getByRole("status")).toHaveTextContent("Your link is ready.");
    expect(onShare.mock.calls).toEqual([[{ audience: undefined, anonymised: false, note: "A fictional note" }]]);
  });
});

describe("candidate share dialog, with a link", () => {
  it("copies inside the click, says so, and goes back to Copy", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    let finish: () => void = () => undefined;
    const writeText = vi.fn(() => new Promise<void>((resolve) => { finish = resolve; }));
    renderDialog({ url: LINK });
    useClipboard({ writeText });

    // The host's own link, with nothing to make: the link and its Copy are the dialog.
    expect(body()).toHaveAttribute("data-view", "result");
    const link = dialog().querySelector("[data-slot='candidate-share-dialog-link']") as HTMLElement;
    const copy = within(link).getByRole("button", { name: "Copy" });
    const status = within(dialog()).getByRole("status");
    expect(status).toHaveTextContent("Your link is ready.");

    // Asked for as the button is pressed, before anything is awaited: some
    // browsers take a clipboard write only from inside the gesture.
    act(() => {
      copy.click();
      expect(writeText.mock.calls).toEqual([[LINK]]);
    });
    expect(within(link).getByRole("button", { name: "Copy" })).toBeInTheDocument();

    await act(async () => finish());
    expect(within(link).getByRole("button", { name: "Copied" })).toBeInTheDocument();
    // Said aloud too, where the same element said the link was ready.
    expect(status).toHaveTextContent("Link copied.");
    expect(within(link).getByText("example.com/p/V1StGXR8Z5jdHi6BmyT")).toBeInTheDocument();

    // A confirmation, not a state to stay in.
    act(() => vi.advanceTimersByTime(2_000));
    expect(within(link).getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(status).toHaveTextContent("Your link is ready.");

    await user.click(within(link).getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it("puts the whole link in a field, selected, when the browser refuses the clipboard", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new Error("NotAllowedError"));
    renderDialog({ url: LINK });
    useClipboard({ writeText });

    await user.click(screen.getByRole("button", { name: "Copy" }));

    const field = await screen.findByRole("textbox", { name: "Link" });
    expect(field).toHaveValue(LINK);
    expect(field).toHaveAttribute("readonly");
    // Ready to copy by hand.
    await waitFor(() => expect(field).toHaveFocus());
    expect([(field as HTMLInputElement).selectionStart, (field as HTMLInputElement).selectionEnd]).toEqual([0, LINK.length]);
    expect(within(dialog()).getByRole("status")).toHaveTextContent(
      "Copying didn't work in this browser. The link is selected, so you can copy it yourself.",
    );
    // Copy is still there to try again, and nothing claims it worked.
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copied" })).toBeNull();
  });

  it("does the same where there is no clipboard to ask, or it throws", async () => {
    const user = userEvent.setup();
    const { rerender, props } = renderDialog({ url: LINK });
    useClipboard(undefined);

    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await screen.findByRole("textbox", { name: "Link" })).toHaveValue(LINK);

    rerender(<CandidateShareDialog {...props} open={false} />);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    rerender(<CandidateShareDialog {...props} />);
    useClipboard({
      writeText: () => {
        throw new Error("blocked");
      },
    });
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await screen.findByRole("textbox", { name: "Link" })).toHaveValue(LINK);
  });

  it("shows a link the host already has beside the form, and offers to save again", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const onShare = vi.fn().mockResolvedValue("https://example.com/p/updated");
    renderDialog({ url: LINK, onShare, note: true });
    useClipboard({ writeText });

    // Still the form: the link is the one these choices already have.
    expect(body()).toHaveAttribute("data-view", "compose");
    expect(screen.getByRole("textbox", { name: "A note for them" })).toBeInTheDocument();
    const link = dialog().querySelector("[data-slot='candidate-share-dialog-link']") as HTMLElement;
    expect(within(link).getByText("example.com/p/V1StGXR8Z5jdHi6BmyT")).toBeInTheDocument();
    // Nothing has been made, so nothing is announced.
    expect(within(dialog()).getByRole("status")).toBeEmptyDOMElement();

    await user.click(within(link).getByRole("button", { name: "Copy" }));
    expect(writeText.mock.calls).toEqual([[LINK]]);
    expect(await within(link).findByRole("button", { name: "Copied" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onShare).toHaveBeenCalledTimes(1);
    // The link the host hands back is the one shown from then on.
    expect(await screen.findByText("example.com/p/updated")).toBeInTheDocument();
    expect(body()).toHaveAttribute("data-view", "result");
  });
});

describe("candidate share dialog, copying as it makes the link", () => {
  it("asks the clipboard inside the click, for a link that arrives later", async () => {
    userEvent.setup();
    let make: (link: string) => void = () => undefined;
    const onShare = vi.fn(() => new Promise<string>((resolve) => { make = resolve; }));
    const items: Array<Record<string, Promise<Blob>>> = [];
    vi.stubGlobal("ClipboardItem", class {
      constructor(item: Record<string, Promise<Blob>>) {
        items.push(item);
      }
    });
    const write = vi.fn(async () => {
      await items[0]!["text/plain"];
    });
    const writeText = vi.fn().mockResolvedValue(undefined);
    renderDialog({ onShare, copyOnShare: true });
    useClipboard({ write, writeText });

    act(() => {
      screen.getByRole("button", { name: "Create and copy link" }).click();
      // Before the link exists: the write is asked for in the gesture, and handed the link when it comes.
      expect(onShare).toHaveBeenCalledTimes(1);
      expect(write).toHaveBeenCalledTimes(1);
      expect(items).toHaveLength(1);
    });

    await act(async () => make(LINK));
    const copied = (await items[0]!["text/plain"])!;
    expect(copied.type).toBe("text/plain");
    expect(await readText(copied)).toBe(LINK);

    // The link shows already copied, and says so.
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(within(dialog()).getByRole("status")).toHaveTextContent("Link copied.");
    expect(writeText).not.toHaveBeenCalled();
  });

  it("writes the link once it is here, in a browser that can't be asked ahead", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const onShare = vi.fn().mockResolvedValue(LINK);
    renderDialog({ onShare, copyOnShare: true, url: "https://example.com/p/earlier" });
    useClipboard({ writeText });

    // The host already has a link, so this saves it again, and copies.
    await user.click(screen.getByRole("button", { name: "Save and copy link" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(writeText.mock.calls).toEqual([[LINK]]);
  });

  it("falls back to writing it once it is here when the browser turns the early ask down", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("ClipboardItem", class {
      constructor() {
        throw new TypeError("no promises here");
      }
    });
    const write = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const { rerender, props } = renderDialog({ onShare: vi.fn().mockResolvedValue(LINK), copyOnShare: true });
    useClipboard({ write, writeText });

    await user.click(screen.getByRole("button", { name: "Create and copy link" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(write).not.toHaveBeenCalled();
    expect(writeText.mock.calls).toEqual([[LINK]]);

    // The same when the early write is taken and then refused.
    rerender(<CandidateShareDialog {...props} open={false} />);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    vi.stubGlobal("ClipboardItem", class {});
    useClipboard({ write: vi.fn().mockRejectedValue(new Error("NotAllowedError")), writeText });
    rerender(<CandidateShareDialog {...props} />);
    await user.click(screen.getByRole("button", { name: "Create and copy link" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it("leaves the link with its Copy button when the browser won't copy it", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new Error("NotAllowedError"));
    renderDialog({ onShare: vi.fn().mockResolvedValue(LINK), copyOnShare: true });
    useClipboard({ writeText });

    await user.click(screen.getByRole("button", { name: "Create and copy link" }));

    // Made, not copied, and nothing says otherwise: Copy is there to press.
    expect(await screen.findByText("Your link is ready.")).toBeInTheDocument();
    expect(screen.getByText("example.com/p/V1StGXR8Z5jdHi6BmyT")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copied" })).toBeNull();
  });

  it("copies nothing when the link couldn't be made", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const unhandled = vi.fn();
    process.on("unhandledRejection", unhandled);
    renderDialog({ onShare: vi.fn().mockRejectedValue(new Error("offline")), copyOnShare: true });
    useClipboard({ writeText });

    await user.click(screen.getByRole("button", { name: "Create and copy link" }));
    expect(await within(dialog()).findByRole("alert")).toHaveTextContent("That link couldn't be made. Try again.");
    await new Promise((resolve) => setTimeout(resolve, 20));
    process.off("unhandledRejection", unhandled);

    expect(writeText).not.toHaveBeenCalled();
    // The failed share is reported once, in the dialog, and nowhere left dangling.
    expect(unhandled).not.toHaveBeenCalled();
  });
});

describe("candidate share link text", () => {
  it("reads as a person would say it, and cuts a long tail", () => {
    expect(candidateShareLinkText(LINK)).toBe("example.com/p/V1StGXR8Z5jdHi6BmyT");
    expect(candidateShareLinkText("  http://example.com/  ")).toBe("example.com");
    expect(candidateShareLinkText("https://agency.example.com/shared/profiles/V1StGXR8Z5jdHi6BmyT")).toBe(
      "agency.example.com/shared/profiles/…",
    );
    expect(candidateShareLinkText("https://agency.example.com/shared/profiles/V1StGXR8Z5jdHi6BmyT")).toHaveLength(36);
    expect(candidateShareLinkText(LINK, 20)).toBe("example.com/p/V1StG…");
    // Not a link at all: said as it is.
    expect(candidateShareLinkText("a fictional link")).toBe("a fictional link");
    expect(candidateShareDialogLabels.create(false)).toBe("Create link");
  });
});
