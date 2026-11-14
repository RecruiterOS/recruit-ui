import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CandidateShareDialog,
  candidateShareDialogLabels,
  candidateShareLinkText,
  type CandidateShareAudience,
  type CandidateShareChoices,
  type CandidateShareDialogProps,
  type CandidateShareNoteFormat,
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
const part = (name: string) => dialog().querySelector(`[data-slot='candidate-share-dialog-${name}']`) as HTMLElement;
/** Whether `later` comes after `earlier` as the dialog is read, top to bottom. */
const follows = (earlier: Node, later: Node) =>
  Boolean(earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING);

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

  it("shows who is being shared beside the title, which names them once, and the sharer's own reason", () => {
    const { rerender, props } = renderDialog({
      avatar: <img alt="Mei Tanaka's photo" src="https://example.com/mei.png" />,
      headline: "Staff Engineer · Sample Analytics",
      reason: "Has done the fictional rebuild twice.",
      labels: { description: "Make a link to their profile." },
    });

    expect(dialog()).toHaveAccessibleDescription("Make a link to their profile.");
    // A reason with a pasted link in it wraps, not widens the dialog.
    expect(body().firstElementChild).toHaveClass("[overflow-wrap:anywhere]");
    // Their face and headline sit with the title, above the part that scrolls.
    const summary = part("summary");
    expect(within(summary).getByAltText("Mei Tanaka's photo")).toBeInTheDocument();
    expect(within(summary).getByRole("heading", { level: 2, name: "Share Mei Tanaka" })).toBeInTheDocument();
    expect(summary).toHaveTextContent("Share Mei TanakaStaff Engineer · Sample Analytics");
    expect(body()).not.toContainElement(summary);
    // The title says the name, so nothing says it again.
    expect(dialog().textContent?.match(/Mei Tanaka/g)).toHaveLength(1);
    // The reason is under them, first in the part that scrolls.
    expect(part("reason")).toHaveTextContent("Your reasonHas done the fictional rebuild twice.");
    expect(body()).toContainElement(part("reason"));

    // A headline needs no face, nor a face a headline.
    rerender(<CandidateShareDialog {...props} avatar={undefined} reason={undefined} />);
    expect(part("summary")).toHaveTextContent("Share Mei TanakaStaff Engineer · Sample Analytics");
    expect(part("reason")).toBeNull();
    rerender(<CandidateShareDialog {...props} headline={undefined} />);
    expect(part("summary")).toHaveTextContent("Share Mei Tanaka");
    // With neither, the title stands alone, as the kit sets it.
    rerender(<CandidateShareDialog {...props} avatar={undefined} headline={undefined} />);
    expect(part("summary")).toBeNull();
    expect(within(dialog()).getByRole("heading", { level: 2, name: "Share Mei Tanaka" })).toBeInTheDocument();
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
    // The two sit side by side where there is room, and are still one
    // group to the arrow keys. The choice follows focus while the key is
    // down, so each is held as a person holds it.
    await user.keyboard("{ArrowLeft>}");
    await waitFor(() => expect(named).toBeChecked());
    expect(named).toHaveFocus();
    await user.keyboard("{/ArrowLeft}{ArrowDown>}");
    await waitFor(() => expect(anonymised).toBeChecked());
    await user.keyboard("{/ArrowDown}");
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

describe("candidate share dialog, the note's side held by the host", () => {
  const mounts = vi.fn();
  function Recorder() {
    const [takes, setTakes] = useState(0);
    useEffect(() => {
      mounts();
    }, []);
    return (
      <button type="button" onClick={() => setTakes((count) => count + 1)}>
        Fictional recorder, {takes} takes
      </button>
    );
  }
  const side = (name: string) => screen.getByRole("tab", { name });
  const held = (noteFormat: CandidateShareNoteFormat, overrides: Partial<CandidateShareDialogProps> = {}) =>
    renderDialog({ onShare: vi.fn(), anonymisable: true, note: true, recorder: <Recorder />, noteFormat, ...overrides });

  afterEach(() => mounts.mockClear());

  it("switches sides when the host says, remounting nothing and leaving focus where it was", async () => {
    const user = userEvent.setup();
    const { rerender, props } = held("voice");
    const surface = dialog();
    expect(side("Voice note")).toHaveAttribute("aria-selected", "true");

    // A take in the recorder.
    await user.click(screen.getByRole("button", { name: "Fictional recorder, 0 takes" }));
    const recorder = screen.getByRole("button", { name: "Fictional recorder, 1 takes" });
    // The person sharing has just asked for an anonymised page. The host
    // has a link for that already, and its note is a written one.
    const anonymised = screen.getByRole("radio", { name: /^Anonymised/ });
    await user.click(anonymised);
    expect(anonymised).toHaveFocus();

    rerender(<CandidateShareDialog {...props} noteFormat="written" choices={{ note: "A fictional saved note" }} />);
    expect(side("Written note")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Written note" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("textbox", { name: "A note for them" })).toHaveValue("A fictional saved note");
    // The same dialog, and the same recorder with its take, hidden and not unmounted.
    expect(dialog()).toBe(surface);
    expect(screen.getByText("Fictional recorder, 1 takes")).toBe(recorder);
    expect(recorder.closest("[role='tabpanel']")).toHaveAttribute("data-state", "inactive");
    expect(mounts).toHaveBeenCalledTimes(1);
    // Focus is where the person sharing left it.
    expect(anonymised).toHaveFocus();

    rerender(<CandidateShareDialog {...props} noteFormat="voice" />);
    expect(side("Voice note")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("button", { name: "Fictional recorder, 1 takes" })).toBe(recorder);
    expect(dialog()).toBe(surface);
    expect(mounts).toHaveBeenCalledTimes(1);
    expect(anonymised).toHaveFocus();
  });

  it("tells the host which side the person sharing asks for, once a press, and shows the side the host holds", async () => {
    const user = userEvent.setup();
    const onNoteFormatChange = vi.fn();
    const { rerender, props } = held("voice", { onNoteFormatChange });

    await user.click(side("Written note"));
    expect(onNoteFormatChange.mock.calls).toEqual([["written"]]);
    // Held, so it is the host that switches.
    expect(side("Voice note")).toHaveAttribute("aria-selected", "true");
    // Asked again, the host is told again.
    await user.click(side("Written note"));
    expect(onNoteFormatChange.mock.calls).toEqual([["written"], ["written"]]);
    // The side already showing is nothing to ask for.
    await user.click(side("Voice note"));
    expect(onNoteFormatChange).toHaveBeenCalledTimes(2);

    rerender(<CandidateShareDialog {...props} noteFormat="written" />);
    expect(side("Written note")).toHaveAttribute("aria-selected", "true");
    await user.click(side("Voice note"));
    expect(onNoteFormatChange.mock.calls).toEqual([["written"], ["written"], ["voice"]]);
  });

  it("switches on a press, Enter or Space, and never because focus reached a tab", async () => {
    const user = userEvent.setup();
    const onNoteFormatChange = vi.fn();
    renderDialog({ note: true, recorder: <Recorder />, onNoteFormatChange });

    // The arrow keys move between the two tabs, and change nothing.
    await user.click(side("Voice note"));
    await user.keyboard("{ArrowRight}");
    await waitFor(() => expect(side("Written note")).toHaveFocus());
    expect(side("Voice note")).toHaveAttribute("aria-selected", "true");
    expect(onNoteFormatChange).not.toHaveBeenCalled();

    await user.keyboard("{Enter}");
    expect(side("Written note")).toHaveAttribute("aria-selected", "true");
    expect(onNoteFormatChange.mock.calls).toEqual([["written"]]);

    await user.keyboard("{ArrowLeft}");
    await waitFor(() => expect(side("Voice note")).toHaveFocus());
    expect(side("Written note")).toHaveAttribute("aria-selected", "true");
    await user.keyboard(" ");
    expect(side("Voice note")).toHaveAttribute("aria-selected", "true");
    expect(onNoteFormatChange.mock.calls).toEqual([["written"], ["voice"]]);
  });

  it("keeps the host's side when focus comes back to the other side's tab", async () => {
    const user = userEvent.setup();
    const onNoteFormatChange = vi.fn();
    const { rerender, props } = held("voice", { onNoteFormatChange });

    // Focus is on the tab of the side showing when the host switches sides.
    await user.click(side("Voice note"));
    expect(side("Voice note")).toHaveFocus();
    rerender(<CandidateShareDialog {...props} noteFormat="written" />);
    expect(side("Written note")).toHaveAttribute("aria-selected", "true");
    expect(side("Voice note")).toHaveFocus();

    // Another window comes in front and goes: focus leaves the tab and
    // returns to it. A tab that took its side with it on focus would switch
    // back here, and tell the host a side nobody asked for.
    act(() => {
      side("Voice note").blur();
      side("Voice note").focus();
    });
    // The same from the keyboard, away and back.
    await user.tab();
    await user.tab({ shift: true });

    expect(side("Written note")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Written note" })).toHaveAttribute("data-state", "active");
    expect(onNoteFormatChange).not.toHaveBeenCalled();
  });

  it("follows a host that keeps the side in its own state", async () => {
    const user = userEvent.setup();
    function Host() {
      const [format, setFormat] = useState<CandidateShareNoteFormat>("written");
      return (
        <CandidateShareDialog
          open
          onOpenChange={() => undefined}
          candidateName="Mei Tanaka"
          note
          recorder={<Recorder />}
          noteFormat={format}
          onNoteFormatChange={setFormat}
        />
      );
    }
    render(<Host />);

    expect(side("Written note")).toHaveAttribute("aria-selected", "true");
    await user.click(side("Voice note"));
    expect(side("Voice note")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Voice note" })).toHaveAttribute("data-state", "active");
  });

  it("still switches by itself where the host holds nothing, and says which side", async () => {
    const user = userEvent.setup();
    const onNoteFormatChange = vi.fn();
    renderDialog({ note: true, recorder: <Recorder />, defaultNoteFormat: "written", onNoteFormatChange });

    expect(side("Written note")).toHaveAttribute("aria-selected", "true");
    await user.click(side("Voice note"));
    expect(side("Voice note")).toHaveAttribute("aria-selected", "true");
    expect(onNoteFormatChange.mock.calls).toEqual([["voice"]]);
  });

  it("puts focus on the switch when the side it was in is the one hidden", async () => {
    const user = userEvent.setup();
    const { rerender, props } = held("written", { defaultChoices: { note: "A fictional note" } });

    // In the note, as someone reading it over would be.
    const field = screen.getByRole("textbox", { name: "A note for them" });
    await user.click(field);
    expect(field).toHaveFocus();

    // Hidden, the field could not keep it, and the browser would drop it on
    // the page behind the dialog.
    rerender(<CandidateShareDialog {...props} noteFormat="voice" />);
    expect(side("Voice note")).toHaveFocus();
    // The note is still there for when the switch goes back.
    expect(field).toHaveValue("A fictional note");
    expect(field).toBe(screen.getByRole("textbox", { name: "A note for them" }));
  });

  it("finds its own hidden side, not a hidden panel inside the recorder", async () => {
    const user = userEvent.setup();
    // A host's recorder with tabs of its own, one of them not showing.
    const recorder = (
      <div>
        <div role="tabpanel" data-state="inactive" aria-label="Fictional recorder settings">
          <button type="button">Fictional setting</button>
        </div>
        <button type="button">Fictional recorder</button>
      </div>
    );
    const { rerender, props } = held("written", { recorder, defaultChoices: { note: "A fictional note" } });

    await user.click(screen.getByRole("textbox", { name: "A note for them" }));
    rerender(<CandidateShareDialog {...props} noteFormat="voice" />);
    expect(side("Voice note")).toHaveFocus();

    // And focus in the recorder is its own to keep while the recorder shows.
    await user.click(screen.getByRole("button", { name: "Fictional setting" }));
    rerender(<CandidateShareDialog {...props} noteFormat="voice" choices={{ note: "Another fictional note" }} />);
    expect(screen.getByRole("button", { name: "Fictional setting" })).toHaveFocus();
  });

  it("ignores a held side where there is no switch", () => {
    renderDialog({ note: true, noteFormat: "voice" });

    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.getByRole("textbox", { name: "A note for them" })).toBeInTheDocument();
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

  it("brings a link that couldn't be made, or an error of the host's, into view", async () => {
    // It is under everything the dialog asks, which on a small window is
    // under the dialog's own fold. This DOM has no scrolling of its own.
    const scrolled: Array<[Element, unknown]> = [];
    const prototype = Element.prototype as { scrollIntoView?: (options?: unknown) => void };
    const before = prototype.scrollIntoView;
    prototype.scrollIntoView = function scrollIntoView(this: Element, options?: unknown) {
      scrolled.push([this, options]);
    };
    try {
      const user = userEvent.setup();
      const onShare = vi.fn().mockRejectedValue(new Error("offline"));
      const { rerender, props } = renderDialog({ onShare, note: true });
      expect(scrolled).toEqual([]);

      await user.click(screen.getByRole("button", { name: "Create link" }));
      const alert = await within(dialog()).findByRole("alert");
      expect(scrolled).toEqual([[alert, { block: "nearest" }]]);

      // Again each time it fails, since the person may have scrolled away.
      await user.click(screen.getByRole("button", { name: "Create link" }));
      await waitFor(() => expect(scrolled).toHaveLength(2));
      expect(scrolled[1]).toEqual([within(dialog()).getByRole("alert"), { block: "nearest" }]);

      // An error of the host's own, the same.
      rerender(<CandidateShareDialog {...props} open={false} />);
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
      scrolled.length = 0;
      rerender(<CandidateShareDialog {...props} onShare={vi.fn()} />);
      expect(scrolled).toEqual([]);
      rerender(<CandidateShareDialog {...props} onShare={vi.fn()} error="This person's links couldn't be read." />);
      expect(scrolled).toEqual([[within(dialog()).getByRole("alert"), { block: "nearest" }]]);
    } finally {
      if (before) prototype.scrollIntoView = before;
      else delete prototype.scrollIntoView;
    }
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

describe("candidate share dialog, fitting a laptop", () => {
  it("lets the centred dialog be as tall as the window, and leaves a phone the kit's bottom sheet", () => {
    renderDialog({ onShare: vi.fn(), avatar: <span>Fictional face</span>, note: true });

    // The kit caps its centred dialog at 85% of the window. The dialog asks
    // for the window's height less a margin, and for room beside the close
    // control, on the kit's own marks for the centred dialog and its header.
    expect(dialog()).toHaveAttribute("data-slot", "dialog-content");
    expect(dialog()).toHaveClass("data-[slot=dialog-content]:max-h-[calc(100dvh-2rem)]");
    const header = dialog().querySelector("[data-slot='dialog-header']") as HTMLElement;
    expect(header).toContainElement(part("summary"));
    expect(header).toHaveClass("data-[slot=dialog-header]:pe-12");
    // A long word in the title, or in the line under it, wraps: left whole
    // it would widen a bottom sheet's header past the sheet.
    expect(header).toHaveClass("[overflow-wrap:anywhere]");

    // Those marks aren't on a bottom sheet, so the same classes change
    // nothing there: it keeps the kit's height, and has no close control to
    // leave room for. Nothing sets either outright.
    act(() => viewport.resize(false));
    expect(dialog()).toHaveAttribute("data-slot", "drawer-content");
    const sheetHeader = dialog().querySelector("[data-slot='drawer-header']") as HTMLElement;
    expect(sheetHeader).toContainElement(part("summary"));
    expect([...dialog().classList].filter((name) => name.endsWith("max-h-[calc(100dvh-2rem)]"))).toEqual([
      "data-[slot=dialog-content]:max-h-[calc(100dvh-2rem)]",
    ]);
    expect([...sheetHeader.classList].filter((name) => name.endsWith("pe-12"))).toEqual(["data-[slot=dialog-header]:pe-12"]);
    // Beside a face, the sheet's title reads from the face, not from the middle.
    expect(sheetHeader).toHaveClass("text-start");
    expect(sheetHeader).not.toHaveClass("text-center");
  });

  it("leaves a title with no face beside it as the kit sets it", () => {
    renderDialog({ onShare: vi.fn() });

    act(() => viewport.resize(false));
    const sheetHeader = dialog().querySelector("[data-slot='drawer-header']") as HTMLElement;
    expect(sheetHeader).not.toHaveClass("text-start");
    expect(part("summary")).toBeNull();
  });

  it("shows a link there already is before anything it asks, with Copy the first thing to reach", () => {
    renderDialog({
      url: LINK,
      onShare: vi.fn(),
      avatar: <span>Fictional face</span>,
      reason: "Has done the fictional rebuild twice.",
      audiences: AUDIENCES,
      anonymisable: true,
      note: true,
      recorder: <button type="button">Fictional recorder</button>,
    });

    const link = part("link");
    expect(body()).toHaveAttribute("data-view", "compose");
    // Under the summary and the reason, above every question.
    expect(follows(part("reason"), link)).toBe(true);
    for (const question of ["audience", "visibility", "note"]) expect(follows(link, part(question))).toBe(true);
    // So someone back for the link reaches Copy before anything else in the dialog's body.
    const first = body().querySelector("button, input, textarea, [tabindex]");
    expect(first).toBe(within(link).getByRole("button", { name: "Copy" }));
  });

  it("sets the note's switch on the note's own heading line", () => {
    renderDialog({ onShare: vi.fn(), note: true, recorder: <button type="button">Fictional recorder</button> });

    const line = within(part("note")).getByRole("heading", { name: "A note for them" }).parentElement as HTMLElement;
    expect(within(line).getByRole("tablist", { name: "Note format" })).toBeInTheDocument();
    // The two sides are under the line, not on it.
    expect(within(line).queryByRole("tabpanel")).toBeNull();
    expect(within(part("note")).getAllByRole("tabpanel", { hidden: true })).toHaveLength(2);
  });

  it("keeps the side of the note showing when the window narrows to a bottom sheet", async () => {
    const user = userEvent.setup();
    renderDialog({ onShare: vi.fn(), note: true, recorder: <button type="button">Fictional recorder</button> });

    await user.click(screen.getByRole("tab", { name: "Written note" }));
    act(() => viewport.resize(false));
    expect(dialog()).toHaveAttribute("data-slot", "drawer-content");
    expect(screen.getByRole("tab", { name: "Written note" })).toHaveAttribute("aria-selected", "true");
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
    // Over the questions the button says so, and the line that says it too
    // is only heard: shown, it would push every question down and back.
    const status = within(dialog()).getByRole("status");
    expect(status).toHaveTextContent("Link copied.");
    expect(status).toHaveClass("sr-only");

    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onShare).toHaveBeenCalledTimes(1);
    // The link the host hands back is the one shown from then on.
    expect(await screen.findByText("example.com/p/updated")).toBeInTheDocument();
    expect(body()).toHaveAttribute("data-view", "result");
    // With the questions gone, the line is there to read, in the same element.
    expect(within(dialog()).getByRole("status")).toBe(status);
    expect(status).toHaveTextContent("Your link is ready.");
    expect(status).not.toHaveClass("sr-only");
  });

  it("says in view that the browser wouldn't copy a link shown over the questions", async () => {
    const user = userEvent.setup();
    renderDialog({ url: LINK, onShare: vi.fn(), note: true });
    useClipboard({ writeText: vi.fn().mockRejectedValue(new Error("NotAllowedError")) });

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(await screen.findByRole("textbox", { name: "Link" })).toHaveValue(LINK);
    expect(body()).toHaveAttribute("data-view", "compose");
    const status = within(dialog()).getByRole("status");
    expect(status).toHaveTextContent("Copying didn't work in this browser. The link is selected, so you can copy it yourself.");
    // Nothing else says it, so this is to be read.
    expect(status).not.toHaveClass("sr-only");
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
