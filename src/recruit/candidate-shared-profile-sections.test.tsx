import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Globe } from "lucide-react";
import { COVER_BANNER_VARIANTS, coverBannerVariant } from "@epicbagel/saas-kit/primitives/cover-banner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CandidateSharedProfileAnswer,
  CandidateSharedProfileFit,
  CandidateSharedProfileHeader,
  CandidateSharedProfileNote,
  CandidateSharedProfileNotes,
  CandidateSharedProfileSection,
  CandidateSharedProfileSwitcher,
  CandidateSharedProfileVoiceNote,
  candidateSharedProfileLabels,
  type CandidateSharedProfileClientNote,
  type CandidateSharedProfilePersonOption,
} from "./candidate-shared-profile-sections";
import { sharedProfileRootAttributes } from "./shared-profile-attributes";

// Fictional people, organisations and notes only.
const PEOPLE: CandidateSharedProfilePersonOption[] = [
  { id: "mei", name: "Mei Tanaka", avatar: <img alt="Mei Tanaka" src="https://example.com/mei.png" /> },
  { id: "tomas", name: "Tomas Example" },
  { id: "imogen", name: "Imogen Example" },
];

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

afterEach(() => {
  recognitions.length = 0;
  delete (window as SpeechWindow).SpeechRecognition;
});

describe("candidate shared profile section", () => {
  it("is a section named by its heading, at the level asked for", () => {
    const { rerender } = render(
      <CandidateSharedProfileSection title="Fictional section" id="example-section">
        <p>Fictional words</p>
      </CandidateSharedProfileSection>,
    );

    const section = screen.getByRole("region", { name: "Fictional section" });
    expect(section.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("data-slot", "candidate-shared-profile-section");
    expect(section).toHaveAttribute("id", "example-section");
    expect(within(section).getByRole("heading", { level: 2, name: "Fictional section" })).toBeInTheDocument();
    expect(within(section).getByText("Fictional words")).toBeInTheDocument();
    expect(section.className).not.toContain("print:hidden");
    // A word longer than the line wraps: a section used alone still sits in something that clips.
    expect(section).toHaveClass("[overflow-wrap:anywhere]");

    // Deeper in a page's outline, only the tag changes; a host's own slot and print rule hold.
    const look = screen.getByRole("heading", { level: 2 }).className;
    rerender(
      <CandidateSharedProfileSection title="Fictional section" titleLevel={4} printVisibility="hidden" data-slot="host-section">
        <p>Fictional words</p>
      </CandidateSharedProfileSection>,
    );
    expect(screen.getByRole("heading", { level: 4, name: "Fictional section" }).className).toBe(look);
    expect(screen.getByRole("region", { name: "Fictional section" })).toHaveAttribute("data-slot", "host-section");
    expect(screen.getByRole("region", { name: "Fictional section" })).toHaveClass("print:hidden");
  });
});

describe("what a shared profile's roots pass to the page", () => {
  it("is an id, a style and data- and aria- attributes, and nothing else", () => {
    expect(
      sharedProfileRootAttributes({
        id: "example",
        style: { margin: 0 },
        className: "merged-by-the-caller",
        "data-testid": "section",
        "aria-label": "Fictional section",
        title: "Fictional tooltip",
        onClick: () => undefined,
        internalNote: "Fictional internal note",
        dataset: "not an attribute",
        aria: "nor this",
      }),
    ).toEqual({
      id: "example",
      style: { margin: 0 },
      "data-testid": "section",
      "aria-label": "Fictional section",
    });
  });

  it("holds for every section's own root", () => {
    const spread = { internalNote: "Fictional internal note", tooltip: "Fictional tooltip", "data-testid": "root" };
    // A record's own `title`, spread in with the rest, as TypeScript allows.
    const record = { ...spread, title: "Internal: fictional pay is too high" };
    const { container, rerender } = render(
      <CandidateSharedProfileSection title="Fictional section" {...spread} />,
    );
    const check = () => {
      expect(container.innerHTML).not.toContain("Fictional internal note");
      expect(container.innerHTML).not.toContain("Fictional tooltip");
      const root = container.querySelector("[data-testid='root']");
      expect(root).not.toBeNull();
      // And each lets a long word wrap, used alone as much as in the profile.
      expect(root).toHaveClass("[overflow-wrap:anywhere]");
    };
    check();

    rerender(<CandidateSharedProfileSwitcher people={PEOPLE} value="mei" {...spread} />);
    check();
    rerender(<CandidateSharedProfileHeader person={{ name: "Mei Tanaka" }} {...spread} />);
    check();
    // These three take no title of their own: a spread one never becomes the heading.
    const untitled = () => {
      check();
      expect(container.innerHTML).not.toContain("fictional pay");
    };
    rerender(<CandidateSharedProfileVoiceNote src="https://example.com/note.m4a" {...record} />);
    untitled();
    expect(screen.getByRole("region", { name: "A note from your recruiter" })).toBeInTheDocument();
    rerender(<CandidateSharedProfileNote text="A fictional note" {...record} />);
    untitled();
    expect(screen.getByRole("region", { name: "A note for you" })).toBeInTheDocument();
    rerender(<CandidateSharedProfileFit summary="A fictional summary" {...record} />);
    untitled();
    expect(screen.getByRole("region", { name: "Fit" })).toBeInTheDocument();
    rerender(<CandidateSharedProfileAnswer candidateName="Mei Tanaka" decision="yes" {...spread} />);
    check();
    rerender(<CandidateSharedProfileNotes notes={[]} candidateName="Mei Tanaka" onAdd={vi.fn()} {...spread} />);
    check();
  });
});

describe("candidate shared profile switcher", () => {
  it("lists the people as chips in a group its caption names, the one showing pressed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<CandidateSharedProfileSwitcher people={PEOPLE} value="mei" onChange={onChange} />);

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "candidate-shared-profile-switcher");
    expect(root).not.toHaveAttribute("data-opening");
    // Controls for the screen, not the page.
    expect(root).toHaveClass("print:hidden");

    const group = screen.getByRole("group", { name: "3 people shared with you" });
    const chips = within(group).getAllByRole("button");
    expect(chips.map((chip) => chip.textContent)).toEqual(["Mei Tanaka", "Tomas Example", "Imogen Example"]);
    expect(chips.map((chip) => chip.getAttribute("aria-pressed"))).toEqual(["true", "false", "false"]);
    // A face beside a name says nothing a screen reader hasn't heard: the name is the chip's.
    expect(within(group).getByRole("button", { name: "Mei Tanaka" })).toBeInTheDocument();
    expect(container.querySelector("img")!.closest("[aria-hidden='true']")).not.toBeNull();

    await user.click(screen.getByRole("button", { name: "Tomas Example" }));
    expect(onChange.mock.calls).toEqual([["tomas"]]);
    // The person already showing isn't picked again.
    await user.click(screen.getByRole("button", { name: "Mei Tanaka" }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("draws nothing for one person, or when the person showing isn't on the link", () => {
    const { container, rerender } = render(
      <CandidateSharedProfileSwitcher people={PEOPLE.slice(0, 1)} value="mei" onChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();

    rerender(<CandidateSharedProfileSwitcher people={PEOPLE} value="someone-else" onChange={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<CandidateSharedProfileSwitcher people={[]} value="mei" onChange={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("tells two people with one name apart by their detail, and leaves the rest alone", () => {
    render(
      <CandidateSharedProfileSwitcher
        value="a"
        onChange={vi.fn()}
        people={[
          { id: "a", name: "Riley Example", detail: "Example Labs" },
          { id: "b", name: "Riley Example", detail: "Sample Analytics" },
          { id: "c", name: "Owen Sample", detail: "Fictional Robotics" },
          { id: "d", name: "Dana Example" },
          { id: "e", name: "Dana Example" },
        ]}
      />,
    );

    expect(screen.getAllByRole("button").map((chip) => chip.textContent)).toEqual([
      "Riley Example · Example Labs",
      "Riley Example · Sample Analytics",
      "Owen Sample",
      // Nothing to tell these two apart by, so nothing is made up.
      "Dana Example",
      "Dana Example",
    ]);
  });

  it("says who is opening and holds the chips while the host's promise is pending", async () => {
    const user = userEvent.setup();
    let settle: () => void = () => undefined;
    const onChange = vi.fn(() => new Promise<void>((resolve) => { settle = resolve; }));
    const { container } = render(<CandidateSharedProfileSwitcher people={PEOPLE} value="mei" onChange={onChange} />);
    const root = container.firstElementChild!;

    const pressed = screen.getByRole("button", { name: "Imogen Example" });
    await user.click(pressed);
    // The caption is the group's name, and says it aloud as it changes: it
    // sits in nothing marked busy, which would have a screen reader wait.
    const group = screen.getByRole("group", { name: "Opening Imogen Example…" });
    expect(screen.getByText("Opening Imogen Example…")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Opening Imogen Example…").closest("[aria-busy]")).toBeNull();
    expect(root).toHaveAttribute("data-opening", "true");
    // Held, and said to be disabled, but not disabled outright: the chip
    // that was pressed keeps the keyboard's focus, which a browser takes
    // from a control disabled while it has it.
    for (const chip of within(group).getAllByRole("button")) {
      expect(chip).toHaveAttribute("aria-disabled", "true");
      expect(chip).not.toBeDisabled();
    }
    expect(pressed).toHaveFocus();
    // Still the person on screen until the host says otherwise.
    expect(screen.getByRole("button", { name: "Mei Tanaka" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Tomas Example" }));
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledTimes(1);

    await act(async () => settle());
    expect(screen.getByRole("group", { name: "3 people shared with you" })).toBeInTheDocument();
    expect(root).not.toHaveAttribute("data-opening");
    for (const chip of screen.getAllByRole("button")) expect(chip).not.toHaveAttribute("aria-disabled");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("says a profile didn't open, and lets it be tried again", async () => {
    const user = userEvent.setup();
    let fail: (cause: Error) => void = () => undefined;
    const onChange = vi
      .fn<(id: string) => unknown>()
      .mockImplementationOnce(() => new Promise<void>((_resolve, reject) => { fail = reject; }))
      .mockImplementationOnce(() => {
        throw new Error("That link has been archived.");
      })
      .mockResolvedValue(undefined);
    const { rerender } = render(<CandidateSharedProfileSwitcher people={PEOPLE} value="mei" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Tomas Example" }));
    expect(screen.getByRole("group", { name: "Opening Tomas Example…" })).toBeInTheDocument();
    await act(async () => fail(new Error("offline")));

    // The chips come back, with what went wrong under them.
    expect(screen.getByRole("group", { name: "3 people shared with you" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("That profile didn't open. Try again.");
    for (const chip of screen.getAllByRole("button")) expect(chip).not.toHaveAttribute("aria-disabled");

    // A callback that throws is said the same way, in the host's words where it has them.
    rerender(
      <CandidateSharedProfileSwitcher
        people={PEOPLE}
        value="mei"
        onChange={onChange}
        labels={{ switchFailed: (cause) => (cause instanceof Error ? cause.message : "Not opened.") }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Imogen Example" }));
    expect(screen.getByRole("alert")).toHaveTextContent("That link has been archived.");

    // Trying again clears it.
    await user.click(screen.getByRole("button", { name: "Tomas Example" }));
    expect(onChange).toHaveBeenCalledTimes(3);
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  it("holds the chips for a host that knows who is opening, and where it gives no way to switch", () => {
    const { container, rerender } = render(
      <CandidateSharedProfileSwitcher people={PEOPLE} value="mei" onChange={vi.fn()} opening="tomas" />,
    );

    expect(screen.getByRole("group", { name: "Opening Tomas Example…" })).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("data-opening", "true");
    for (const chip of screen.getAllByRole("button")) expect(chip).toHaveAttribute("aria-disabled", "true");

    // A host that knows a profile didn't open some other way says so here too.
    rerender(<CandidateSharedProfileSwitcher people={PEOPLE} value="mei" onChange={vi.fn()} error="That profile has gone." />);
    expect(screen.getByRole("alert")).toHaveTextContent("That profile has gone.");

    // With no way to switch, the chips are out of use altogether.
    rerender(<CandidateSharedProfileSwitcher people={PEOPLE} value="mei" />);
    expect(screen.getByRole("group", { name: "3 people shared with you" })).toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveAttribute("data-opening");
    for (const chip of screen.getAllByRole("button")) expect(chip).toBeDisabled();
  });

  it("names nobody and shows no face where the profile is anonymised", () => {
    const { container } = render(
      <CandidateSharedProfileSwitcher people={PEOPLE} value="tomas" onChange={vi.fn()} opening="imogen" anonymised />,
    );

    expect(screen.getAllByRole("button").map((chip) => chip.textContent)).toEqual([
      "Candidate 1",
      "Candidate 2",
      "Candidate 3",
    ]);
    expect(screen.getByRole("button", { name: "Candidate 2" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("group", { name: "Opening Candidate 3…" })).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
    expect(container).not.toHaveTextContent(/Mei|Tomas|Imogen/);
  });

  it("words the caption and the chips as the host asks", () => {
    render(
      <CandidateSharedProfileSwitcher
        people={PEOPLE}
        value="mei"
        onChange={vi.fn()}
        labels={{ people: (count) => `${count} on this shortlist` }}
      />,
    );
    expect(screen.getByRole("group", { name: "3 on this shortlist" })).toBeInTheDocument();
  });
});

describe("candidate shared profile header", () => {
  const person = {
    name: "Mei Tanaka",
    avatar: <img alt="Mei Tanaka's photo" src="https://example.com/mei.png" />,
    cover: <img alt="Fictional skyline" src="https://example.com/cover.png" />,
    title: "Staff Engineer",
    company: "Sample Analytics",
    location: "Example City",
    yearsExperience: 11,
    profileLink: { href: "https://example.com/mei", title: "Open Mei Tanaka's profile", icon: Globe },
  };

  it("shows who the profile is about, with their link beside the whole identity", () => {
    const { container } = render(<CandidateSharedProfileHeader person={person} />);

    const header = container.firstElementChild!;
    expect(header).toHaveAttribute("data-slot", "candidate-profile-header");
    expect(screen.getByRole("heading", { level: 1, name: "Mei Tanaka" })).toBeInTheDocument();
    expect(screen.getByAltText("Mei Tanaka's photo")).toBeInTheDocument();
    expect(screen.getByAltText("Fictional skyline")).toBeInTheDocument();
    expect(header).toHaveTextContent("Staff Engineer · Sample Analytics");
    expect(screen.getByText("Sample Analytics")).toHaveAttribute("data-slot", "current-company-label");
    expect(header).toHaveTextContent("Example City · 11 yrs experience");

    const link = screen.getByRole("link", { name: "Open Mei Tanaka's profile" });
    expect(link).toHaveAttribute("href", "https://example.com/mei");
    expect(link).toHaveAttribute("target", "_blank");
    // Off the name's line, so the tall control can't push the title down; not on paper; a full target on a touchscreen.
    expect(link.closest("[data-slot='candidate-profile-header-actions']")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 1 }).parentElement).not.toContainElement(link);
    expect(link).toHaveClass("print:hidden");
    expect(link.className).toContain("pointer-coarse:min-h-[max(44px,2.75rem)]");
  });

  it("leaves out whatever it isn't given, one fact at a time", () => {
    const { container, rerender } = render(<CandidateSharedProfileHeader person={{ name: "Mei Tanaka" }} />);
    const header = () => container.firstElementChild!;

    expect(screen.getByRole("heading", { level: 1, name: "Mei Tanaka" })).toBeInTheDocument();
    // A name alone is a heading: no face is made up for it.
    expect(header()).toHaveTextContent(/^Mei Tanaka$/);
    expect(container.querySelector("svg, img")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
    // Over it, the kit's stock banner, dealt by the name or by the host's seed, unless the host wants none.
    const banner = () => container.querySelector("[data-slot='candidate-cover-image'] [data-slot='cover-banner']");
    expect(banner()).toHaveAttribute("data-variant", coverBannerVariant("Mei Tanaka"));
    rerender(<CandidateSharedProfileHeader person={{ name: "Mei Tanaka", coverSeed: "person-9" }} />);
    expect(banner()).toHaveAttribute("data-variant", coverBannerVariant("person-9"));
    expect(coverBannerVariant("person-9")).not.toBe(coverBannerVariant("Mei Tanaka"));
    rerender(<CandidateSharedProfileHeader person={{ name: "Mei Tanaka", cover: null }} />);
    expect(container.querySelector("[data-slot='candidate-cover-image']")).toBeNull();

    rerender(<CandidateSharedProfileHeader person={{ name: "Mei Tanaka", company: "Sample Analytics" }} />);
    // No dangling separator.
    expect(header()).toHaveTextContent(/^Mei TanakaSample Analytics$/);

    rerender(<CandidateSharedProfileHeader person={{ name: "Mei Tanaka", yearsExperience: 1 }} />);
    expect(header()).toHaveTextContent(/^Mei Tanaka1 yr experience$/);

    rerender(
      <CandidateSharedProfileHeader
        person={{ name: "Mei Tanaka", location: "Example City", yearsExperience: 0 }}
        labels={{ yearsExperience: (years) => `${years} years in work` }}
      />,
    );
    expect(header()).toHaveTextContent(/^Mei TanakaExample City · 0 years in work$/);
  });

  it("puts the name at the heading level asked for", () => {
    render(<CandidateSharedProfileHeader person={{ name: "Mei Tanaka" }} titleLevel={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "Mei Tanaka" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
  });

  it("never shows the name, the face, the cover or the link of an anonymised person, whatever it is handed", () => {
    const { container, rerender } = render(<CandidateSharedProfileHeader person={person} anonymised />);

    expect(screen.getByRole("heading", { level: 1, name: "Confidential candidate" })).toBeInTheDocument();
    expect(container).not.toHaveTextContent("Mei");
    expect(container.querySelector("img")).toBeNull();
    // Their own cover is gone. The stock banner over the header is the first
    // design, dealt by nothing of theirs, so it is the same for everyone.
    const banner = () => container.querySelector("[data-slot='candidate-cover-image'] [data-slot='cover-banner']");
    expect(banner()).toHaveAttribute("data-variant", COVER_BANNER_VARIANTS[0]);
    expect(coverBannerVariant("person-9")).not.toBe(COVER_BANNER_VARIANTS[0]);
    rerender(<CandidateSharedProfileHeader person={{ ...person, coverSeed: "person-9" }} anonymised />);
    expect(banner()).toHaveAttribute("data-variant", COVER_BANNER_VARIANTS[0]);
    rerender(<CandidateSharedProfileHeader person={{ ...person, cover: null }} anonymised />);
    expect(container.querySelector("[data-slot='candidate-cover-image']")).toBeNull();
    rerender(<CandidateSharedProfileHeader person={person} anonymised />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(container.querySelector("a")).toBeNull();
    // A glyph stands in: never initials, which would be somebody's.
    const glyph = container.querySelector("svg")!;
    expect(glyph.closest("[aria-hidden='true']")).not.toBeNull();
    expect(container).not.toHaveTextContent("MT");
    // What the host chose to pass as their work still shows: that is the host's to redact.
    expect(container).toHaveTextContent("Staff Engineer · Sample Analytics");
  });

  it("gives a person with no name the same heading, and keeps what else it was given", () => {
    const { container, rerender } = render(<CandidateSharedProfileHeader person={{ name: "  ", title: "Staff Engineer" }} />);

    expect(screen.getByRole("heading", { level: 1, name: "Confidential candidate" })).toBeInTheDocument();
    // Not anonymised, so nothing stands in for a face: there just isn't one.
    expect(container.querySelector("svg, img")).toBeNull();

    rerender(
      <CandidateSharedProfileHeader
        person={{ name: null, avatar: <img alt="A fictional face" src="https://example.com/face.png" /> }}
        labels={{ anonymous: "Name withheld" }}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Name withheld" })).toBeInTheDocument();
    expect(screen.getByAltText("A fictional face")).toBeInTheDocument();
  });
});

describe("candidate shared profile labels", () => {
  it("ships its default wording whole, for a host to build on", () => {
    expect(Object.isFrozen(candidateSharedProfileLabels)).toBe(true);
    expect(candidateSharedProfileLabels.anonymous).toBe("Confidential candidate");
    expect(candidateSharedProfileLabels.anonymousReference).toBe("this candidate");
    expect(candidateSharedProfileLabels.people(3)).toBe("3 people shared with you");
    expect(candidateSharedProfileLabels.yearsExperience(1)).toBe("1 yr experience");
    expect(candidateSharedProfileLabels.note()).toBe("A note for you");
    expect(candidateSharedProfileLabels.noteFailed(new Error("offline"))).toBe("That note didn't save. Try again.");
  });
});

describe("candidate shared profile voice note", () => {
  it("plays the recording and gives its transcript to read", () => {
    const { container } = render(
      <CandidateSharedProfileVoiceNote
        src="https://example.com/note.m4a"
        transcript={"A fictional first line.\nA fictional second line."}
      />,
    );

    const section = screen.getByRole("region", { name: "A note from your recruiter" });
    expect(section).toHaveAttribute("data-slot", "candidate-shared-profile-voice-note");
    const player = container.querySelector("audio")!;
    expect(player).toHaveAttribute("src", "https://example.com/note.m4a");
    expect(player).toHaveAttribute("aria-label", "Recruiter voice note");
    expect(player).toHaveAttribute("controls");
    // No wider than its section, and dark controls on a dark theme.
    expect(player).toHaveClass("max-w-full", "dark:[color-scheme:dark]");
    const transcript = screen.getByText(/A fictional first line/);
    expect(transcript).toHaveTextContent("A fictional first line. A fictional second line.");
    expect(transcript).toHaveClass("whitespace-pre-line");

    // On paper there is nothing to play: the transcript stands alone.
    expect(player.parentElement).toHaveClass("print:hidden");
    expect(section).not.toHaveClass("print:hidden");
  });

  it("isn't printed at all with nothing to read, and plays through the host's own player", () => {
    const renderAudio = vi.fn(({ src, label }: { src: string; label: string }) => (
      <button type="button" data-src={src}>{label}</button>
    ));
    render(
      <CandidateSharedProfileVoiceNote
        src="https://example.com/note.m4a"
        transcript="  "
        titleLevel={3}
        renderAudio={renderAudio}
        labels={{ voiceNote: "A word from Robin", voiceNotePlayer: "Robin's voice note" }}
      />,
    );

    const section = screen.getByRole("region", { name: "A word from Robin" });
    expect(section).toHaveClass("print:hidden");
    expect(within(section).getByRole("heading", { level: 3 })).toBeInTheDocument();
    expect(renderAudio).toHaveBeenCalledWith({ src: "https://example.com/note.m4a", label: "Robin's voice note" });
    expect(screen.getByRole("button", { name: "Robin's voice note" })).toHaveAttribute("data-src", "https://example.com/note.m4a");
    expect(section.querySelector("audio")).toBeNull();
  });
});

describe("candidate shared profile note", () => {
  it("shows the words under who they are from, as written", () => {
    const { rerender } = render(
      <CandidateSharedProfileNote text={"Worth meeting this week.\n\nAsk about the fictional rebuild."} author="Robin Example" />,
    );

    const section = screen.getByRole("region", { name: "Note from Robin Example" });
    expect(section).toHaveAttribute("data-slot", "candidate-shared-profile-note");
    expect(within(section).getByText(/Worth meeting this week/)).toHaveClass("whitespace-pre-line");

    // With nobody named, it still says what it is.
    rerender(<CandidateSharedProfileNote text="Worth meeting this week." author="  " />);
    expect(screen.getByRole("region", { name: "A note for you" })).toBeInTheDocument();

    rerender(
      <CandidateSharedProfileNote
        text="Worth meeting this week."
        author="Robin Example"
        labels={{ note: (author) => `${author} writes` }}
      />,
    );
    expect(screen.getByRole("region", { name: "Robin Example writes" })).toBeInTheDocument();
  });
});

describe("candidate shared profile fit", () => {
  it("shows the grade in the host's words, a line on why and the evidence with each line's sentiment said", () => {
    render(
      <CandidateSharedProfileFit
        roleTitle="Staff Engineer"
        grade={{ grade: "a", label: "Strong fit", tone: "success" }}
        summary="Led the same fictional rebuild."
        evidence={[
          { text: "Rebuilt a fictional platform", sentiment: "positive" },
          { text: "New to a regulated industry", sentiment: "warning", sentimentLabel: "To check" },
        ]}
      />,
    );

    const section = screen.getByRole("region", { name: "Fit for Staff Engineer" });
    expect(section).toHaveAttribute("data-slot", "candidate-shared-profile-fit");
    // One line of text, in the tone the host chose: nothing is read into the letter.
    const badge = section.querySelector("[data-grade]")!;
    expect(badge).toHaveAttribute("data-grade", "A");
    expect(badge).toHaveTextContent(/^A — Strong fit$/);
    expect(badge.tagName).toBe("SPAN");
    expect(within(section).getByText("Led the same fictional rebuild.")).toBeInTheDocument();

    const lines = within(section).getAllByRole("listitem");
    // The dot's colour is said in a word, the host's own where it gave one.
    expect(lines.map((line) => line.textContent)).toEqual([
      "Positive: Rebuilt a fictional platform",
      "To check: New to a regulated industry",
    ]);
    // The tone and the dots are backgrounds, which a browser prints only when told to.
    expect(section).toHaveClass("[print-color-adjust:exact]");
  });

  it("keeps further lists with the assessment, each under its own heading, one level under the section's", () => {
    const { container, rerender } = render(
      <CandidateSharedProfileFit
        roleTitle="Staff Engineer"
        titleLevel={3}
        evidence={[{ text: "Rebuilt a fictional platform", sentiment: "positive" }]}
        groups={[
          { title: "What to test", items: [{ text: "Has only led small teams", sentiment: "warning", sentimentLabel: "To test" }] },
          { title: "Nothing here", items: [] },
          { title: "What stands out", items: [{ text: "Above the fictional salary band", sentiment: "negative" }] },
        ]}
      />,
    );

    const section = screen.getByRole("region", { name: "Fit for Staff Engineer" });
    // The evidence first, then each group that holds a line, in the host's order.
    const groups = [...section.querySelectorAll('[data-slot="candidate-shared-profile-fit-group"]')];
    expect(groups.map((group) => within(group as HTMLElement).getByRole("heading", { level: 4 }).textContent)).toEqual([
      "What to test",
      "What stands out",
    ]);
    expect(within(section).queryByText("Nothing here")).toBeNull();
    expect(within(section).getAllByRole("listitem").map((line) => line.textContent)).toEqual([
      "Positive: Rebuilt a fictional platform",
      "To test: Has only led small teams",
      "Negative: Above the fictional salary band",
    ]);
    // Each is a region of its own, named by its heading, inside the fit's, so its dots print in colour too.
    expect(screen.getByRole("region", { name: "What to test" })).toBe(groups[0]);
    expect(section).toHaveClass("[print-color-adjust:exact]");
    expect(section).toContainElement(groups[1] as HTMLElement);

    // A group alone is a fit; groups with no lines are none.
    rerender(<CandidateSharedProfileFit groups={[{ title: "What to test", items: [{ text: "A fictional line", sentiment: "neutral" }] }]} />);
    expect(within(screen.getByRole("region", { name: "Fit" })).getByRole("heading", { level: 3, name: "What to test" })).toBeInTheDocument();
    rerender(<CandidateSharedProfileFit roleTitle="Staff Engineer" groups={[{ title: "What to test", items: [] }]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("draws nothing with no grade, summary or evidence, and takes each alone", () => {
    const { container, rerender } = render(<CandidateSharedProfileFit roleTitle="Staff Engineer" />);
    expect(container).toBeEmptyDOMElement();

    rerender(<CandidateSharedProfileFit roleTitle="Staff Engineer" grade={{ grade: null }} evidence={[]} summary="" />);
    expect(container).toBeEmptyDOMElement();

    rerender(<CandidateSharedProfileFit grade={{ grade: "B", format: "split", labels: { B: "Good fit" } }} titleLevel={3} />);
    const section = screen.getByRole("region", { name: "Fit" });
    expect(within(section).getByRole("heading", { level: 3, name: "Fit" })).toBeInTheDocument();
    // The host's own badge settings win over the section's.
    expect(within(section).getByLabelText("Grade B")).toBeInTheDocument();
    expect(within(section).queryByRole("list")).toBeNull();

    rerender(
      <CandidateSharedProfileFit
        roleTitle="Staff Engineer"
        evidence={[{ text: "A fictional line", sentiment: "neutral" }]}
        labels={{ fit: (role) => <>Why {role}</> }}
      />,
    );
    expect(screen.getByRole("region", { name: "Why Staff Engineer" })).toBeInTheDocument();
    expect(screen.getByRole("region").querySelector("[data-grade]")).toBeNull();

    // Not graded yet: the host's own words for that stand alone.
    rerender(<CandidateSharedProfileFit grade={{ grade: null, label: "Being reviewed" }} />);
    const ungraded = screen.getByRole("region", { name: "Fit" }).querySelector("[data-grade]")!;
    expect(ungraded).toHaveAttribute("data-grade", "ungraded");
    expect(ungraded).toHaveTextContent(/^Being reviewed$/);
  });

  it("draws the grade from the fields that say what it reads and how it looks, and no others", () => {
    const grade = { grade: "A", label: "Strong fit", title: "Graded on the fictional brief", score: 9731, onClick: vi.fn() };
    const { container } = render(<CandidateSharedProfileFit grade={grade} />);

    const badge = container.querySelector("[data-grade]")!;
    expect(badge).toHaveAttribute("title", "Graded on the fictional brief");
    expect(badge.getAttributeNames()).not.toContain("score");
    expect(container.innerHTML).not.toContain("9731");
  });
});

describe("candidate shared profile answer", () => {
  it("asks Yes or No under a heading, asks why, and hands the host the answer", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(
      <CandidateSharedProfileAnswer
        candidateName="Mei Tanaka"
        onDecide={onDecide}
        reasonSuggestions={{ yes: ["Right level"], no: ["Too senior"] }}
      />,
    );

    const section = screen.getByRole("region", { name: "Your answer" });
    expect(section).toHaveAttribute("data-slot", "candidate-shared-profile-answer");
    expect(section.tagName).toBe("SECTION");
    // A section of the profile like the rest, in the page's outline.
    expect(within(section).getByRole("heading", { level: 2, name: "Your answer" })).toBeInTheDocument();
    // The reader's controls: not on paper, and each a full target on a touchscreen.
    expect(section).toHaveClass("print:hidden");
    expect(section.className).toContain("pointer-coarse:[&_button]:min-h-[max(44px,2.75rem)]");
    // The decision row sits flush in the section, which pads and rules it.
    const row = section.querySelector("[data-slot='candidate-client-decision']")!;
    expect(row).toHaveAttribute("data-decision", "none");
    expect(row.className).not.toMatch(/(^|\s)p[xytb]?-/);
    expect(section.querySelector("[data-slot='candidate-review-action-row-controls']")).toBeNull();

    await user.click(within(section).getByRole("button", { name: "No" }));
    const dialog = screen.getByRole("dialog", { name: "No to Mei Tanaka" });
    expect(onDecide).not.toHaveBeenCalled();
    await user.click(within(dialog).getByText("Too senior"));
    await user.click(within(dialog).getByRole("button", { name: "Save No" }));
    expect(onDecide.mock.calls).toEqual([["no", "Too senior"]]);

    // Nothing is recorded here: the host passes the answer back.
    expect(within(section).getByRole("button", { name: "No" })).toBeInTheDocument();
    rerender(
      <CandidateSharedProfileAnswer candidateName="Mei Tanaka" onDecide={onDecide} decision="no" reason="Too senior" />,
    );
    expect(within(section).getByText("You said No")).toBeInTheDocument();
    expect(within(section).getByText("Too senior")).toBeInTheDocument();
    expect(within(section).getByRole("button", { name: "Change" })).toBeInTheDocument();
  });

  it("says the save failed and keeps the buttons", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockRejectedValue(new Error("offline"));
    render(<CandidateSharedProfileAnswer candidateName="Mei Tanaka" onDecide={onDecide} reasonOptional />);

    await user.click(screen.getByRole("button", { name: "Yes" }));
    // Optional: it can be saved with no reason at all.
    await user.click(screen.getByRole("button", { name: "Save Yes" }));
    expect(onDecide.mock.calls).toEqual([["yes", ""]]);
    expect(await screen.findByRole("alert")).toHaveTextContent("That didn't save. Try again.");
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
  });

  it("asks why voice first where the host asks for the sheet", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(
      <CandidateSharedProfileAnswer
        candidateName="Mei Tanaka"
        onDecide={onDecide}
        reasonPrompt="sheet"
        reasonOptional
        reasonSheet={(decision) => ({ skipLabel: `Skip, just say ${decision}` })}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Yes" }));
    const sheet = await screen.findByRole("dialog", { name: "Why yes?" });
    await user.click(within(sheet).getByRole("button", { name: "Skip, just say yes" }));
    expect(onDecide.mock.calls).toEqual([["yes", ""]]);
  });

  it("only shows the answer where there is nothing to save it, or it is read only", () => {
    const onDecide = vi.fn();
    const { rerender } = render(
      <CandidateSharedProfileAnswer candidateName="Mei Tanaka" decision="yes" reason="Right level" />,
    );

    // In the third person, under a heading that doesn't say "your".
    const section = screen.getByRole("region", { name: "Answer" });
    expect(within(section).getByText("Said Yes")).toBeInTheDocument();
    expect(within(section).getByText("Right level")).toBeInTheDocument();
    expect(within(section).queryByRole("button")).toBeNull();
    expect(section.querySelector("[data-slot='candidate-client-decision']")).toHaveAttribute("data-read-only", "true");

    rerender(<CandidateSharedProfileAnswer candidateName="Mei Tanaka" onDecide={onDecide} readOnly />);
    expect(screen.getByRole("region", { name: "Answer" })).toHaveTextContent("No answer yet");
    expect(screen.queryByRole("button")).toBeNull();

    rerender(
      <CandidateSharedProfileAnswer
        candidateName="Mei Tanaka"
        onDecide={onDecide}
        readOnly
        decision="no"
        labels={{ answerReadOnly: "The client's answer" }}
        decisionLabels={{ readOnlyNo: "They said No" }}
      />,
    );
    expect(screen.getByRole("region", { name: "The client's answer" })).toHaveTextContent("They said No");
    expect(onDecide).not.toHaveBeenCalled();
  });

  it("holds Yes, No and Change where the host says to", () => {
    const { rerender } = render(<CandidateSharedProfileAnswer candidateName="Mei Tanaka" onDecide={vi.fn()} disabled />);
    for (const name of ["Yes", "No"]) expect(screen.getByRole("button", { name })).toBeDisabled();

    rerender(<CandidateSharedProfileAnswer candidateName="Mei Tanaka" onDecide={vi.fn()} decision="yes" disabled />);
    expect(screen.getByRole("button", { name: "Change" })).toBeDisabled();
  });

  it("puts its heading, and the notes', where the page's outline has them", () => {
    render(
      <>
        <CandidateSharedProfileAnswer candidateName="Mei Tanaka" onDecide={vi.fn()} titleLevel={4} />
        <CandidateSharedProfileNotes
          notes={[{ id: 1, text: "A fictional note" }]}
          candidateName="Mei Tanaka"
          onAdd={vi.fn()}
          titleLevel={4}
        />
      </>,
    );

    // The kit's small header is an h3 element whatever it heads: its level is said.
    expect(screen.getByRole("heading", { level: 4, name: "Your answer" }).tagName).toBe("H3");
    expect(screen.getByRole("heading", { level: 4, name: /Your notes/ })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });
});

describe("candidate shared profile notes", () => {
  const NOTES: CandidateSharedProfileClientNote[] = [
    { id: 2, text: "Asked Robin to set up a call.", date: "12 Jan, 14:02" },
    { id: 1, text: "Strong on the platform side.\nMore on the team she ran?", author: "Imogen Example", date: "11 Jan, 09:30" },
  ];

  it("lists the reader's notes, each from someone, with room for another", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    const { container } = render(<CandidateSharedProfileNotes notes={NOTES} candidateName="Mei Tanaka" onAdd={onAdd} />);

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "candidate-shared-profile-notes");
    expect(root).toHaveClass("print:hidden");
    expect(root.className).toContain("pointer-coarse:[&_button]:min-h-[max(44px,2.75rem)]");

    const section = screen.getByRole("region", { name: "Your notes" });
    expect(section.tagName).toBe("SECTION");
    // The heading counts them, at the level of the profile's other sections.
    expect(within(section).getByRole("heading", { level: 2 })).toHaveTextContent(/^Your notes2$/);
    const cards = [...section.querySelectorAll("[data-slot='card']")];
    expect(cards).toHaveLength(2);
    // Hers by default, or whoever the host names; the words are kept as written.
    expect(cards[0]).toHaveTextContent("You12 Jan, 14:02Asked Robin to set up a call.");
    expect(cards[1]).toHaveTextContent("Imogen Example11 Jan, 09:30");
    expect(within(cards[1] as HTMLElement).getByText(/Strong on the platform side/)).toHaveClass("whitespace-pre-wrap");

    // Nothing here can dictate, so the field is open for typing, named for who it is about.
    const field = screen.getByRole("textbox", { name: "Note about Mei Tanaka" });
    expect(field).toHaveAttribute("placeholder", "Add a note");
    expect(screen.queryByRole("button", { name: "Tap to speak" })).toBeNull();
    await user.type(field, "  A fictional note  ");
    await user.click(screen.getByRole("button", { name: "Add note" }));

    expect(onAdd.mock.calls).toEqual([["A fictional note"]]);
    // Saved: the host passes it back in `notes`, and the field is ready for the next.
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Note about Mei Tanaka" })).toHaveValue(""));
    expect(section.querySelectorAll("[data-slot='card']")).toHaveLength(2);
  });

  it("says there are none yet, in the kit's blank slate", () => {
    render(<CandidateSharedProfileNotes notes={[]} candidateName="Mei Tanaka" onAdd={vi.fn()} />);

    const section = screen.getByRole("region", { name: "Your notes" });
    expect(section.querySelector("[data-slot='empty-state']")).toHaveTextContent("No notes yet");
    expect(screen.getByRole("textbox", { name: "Note about Mei Tanaka" })).toBeInTheDocument();
  });

  it("keeps a typed note that didn't save, and says why where the host knows", async () => {
    const user = userEvent.setup();
    const onAdd = vi
      .fn<(text: string) => Promise<void>>()
      .mockRejectedValueOnce(new Error("Notes are closed on this link."))
      .mockResolvedValue(undefined);
    render(
      <CandidateSharedProfileNotes
        notes={[]}
        candidateName="Mei Tanaka"
        onAdd={onAdd}
        maxLength={200}
        labels={{ noteFailed: (cause) => (cause instanceof Error ? cause.message : "Not saved.") }}
      />,
    );

    const field = screen.getByRole("textbox", { name: "Note about Mei Tanaka" });
    expect(field).toHaveAttribute("maxlength", "200");
    await user.type(field, "A fictional note");
    await user.click(screen.getByRole("button", { name: "Add note" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Notes are closed on this link.");
    expect(screen.getByRole("textbox", { name: "Note about Mei Tanaka" })).toHaveValue("A fictional note");

    // Sent again, it saves, and the error goes.
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(onAdd.mock.calls).toEqual([["A fictional note"], ["A fictional note"]]);
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
    expect(screen.getByRole("textbox", { name: "Note about Mei Tanaka" })).toHaveValue("");
  });

  it("says the default when a note doesn't save, and Cancel clears it", async () => {
    const user = userEvent.setup();
    render(
      <CandidateSharedProfileNotes notes={[]} candidateName="Mei Tanaka" onAdd={vi.fn().mockRejectedValue(new Error("offline"))} />,
    );

    await user.type(screen.getByRole("textbox"), "A fictional note");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That note didn't save. Try again.");

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("only shows the notes where there is nothing to save one, or it is read only", () => {
    const { rerender } = render(<CandidateSharedProfileNotes notes={NOTES} candidateName="Mei Tanaka" />);

    // Not the reader's own page, so not "your" notes.
    const section = screen.getByRole("region", { name: "Notes" });
    expect(section.querySelectorAll("[data-slot='card']")).toHaveLength(2);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();

    rerender(<CandidateSharedProfileNotes notes={[]} candidateName="Mei Tanaka" onAdd={vi.fn()} readOnly />);
    expect(screen.getByRole("region", { name: "Notes" })).toHaveTextContent("No notes yet");
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("holds the composer where the host says to", () => {
    render(<CandidateSharedProfileNotes notes={[]} candidateName="Mei Tanaka" onAdd={vi.fn()} disabled />);
    expect(screen.getByRole("textbox", { name: "Note about Mei Tanaka" })).toBeDisabled();
  });

  it("draws the words, who they are from and when, and nothing else it is handed", () => {
    // A host's own note record, passed whole by mistake.
    const record = {
      id: 7,
      text: "A fictional note",
      author: "Imogen Example",
      date: "12 Jan",
      kind: "agent",
      pinned: { label: "Internal · pinned" },
      scope: { label: "Fictional client account" },
      onDelete: vi.fn(),
      internalNotes: "Fictional salary expectations",
    };
    render(
      <CandidateSharedProfileNotes
        notes={[record as CandidateSharedProfileClientNote]}
        candidateName="Mei Tanaka"
      />,
    );

    const card = screen.getByRole("region", { name: "Notes" }).querySelector("[data-slot='card']")!;
    expect(card).toHaveTextContent(/^Imogen Example12 JanA fictional note$/);
    expect(screen.queryByRole("button")).toBeNull();

    // And the type takes no more than that.
    const note: CandidateSharedProfileClientNote = {
      id: 1,
      text: "A fictional note",
      // @ts-expect-error a note has no field for a record's own marks
      pinned: { label: "Internal · pinned" },
    };
    void note;
  });

  describe("where dictation can run", () => {
    beforeEach(() => {
      (window as SpeechWindow).SpeechRecognition = FakeRecognition;
    });

    const speak = async (user: ReturnType<typeof userEvent.setup>, words: string) => {
      await user.click(screen.getByRole("button", { name: "Tap to speak" }));
      const overlay = await screen.findByRole("dialog", { name: "Voice dictation" });
      const heard = Object.assign([{ transcript: words }], { isFinal: true });
      act(() => recognitions.at(-1)!.onresult?.({ resultIndex: 0, results: [heard] }));
      await user.click(within(overlay).getByRole("button", { name: /done/i }));
      return overlay;
    };

    it("takes a spoken note first, with typing a tap away", async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn().mockResolvedValue(undefined);
      render(<CandidateSharedProfileNotes notes={[]} candidateName="Mei Tanaka" onAdd={onAdd} />);

      // Voice first: no field until it is asked for.
      expect(screen.queryByRole("textbox")).toBeNull();
      expect(screen.getByRole("button", { name: "or type instead" })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Tap to speak" }));
      const overlay = await screen.findByRole("dialog", { name: "Voice dictation" });
      expect(within(overlay).getByRole("heading", { name: "Leave a note about Mei Tanaka" })).toBeInTheDocument();
      const heard = Object.assign([{ transcript: "A fictional spoken note" }], { isFinal: true });
      act(() => recognitions[0]!.onresult?.({ resultIndex: 0, results: [heard] }));
      await user.click(within(overlay).getByRole("button", { name: /done/i }));

      expect(onAdd.mock.calls).toEqual([["A fictional spoken note"]]);
      // Saved, so the composer is back to its mic.
      await waitFor(() => expect(screen.getByRole("button", { name: "Tap to speak" })).toBeInTheDocument());
      expect(screen.queryByRole("textbox")).toBeNull();
    });

    it("puts a spoken note that didn't save in the field, to send again or discard", async () => {
      const user = userEvent.setup();
      const onAdd = vi
        .fn<(text: string) => Promise<void>>()
        .mockRejectedValueOnce(new Error("offline"))
        .mockResolvedValue(undefined);
      render(<CandidateSharedProfileNotes notes={[]} candidateName="Mei Tanaka" onAdd={onAdd} />);

      await speak(user, "A fictional spoken note");
      // It needn't be said again: the words are in the field, with what went wrong.
      const field = await screen.findByRole("textbox", { name: "Note about Mei Tanaka" });
      expect(field).toHaveValue("A fictional spoken note");
      expect(screen.getByRole("alert")).toHaveTextContent("That note didn't save. Try again.");
      expect(screen.getByRole("button", { name: "Discard unsaved note" })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Add note" }));
      expect(onAdd.mock.calls).toEqual([["A fictional spoken note"], ["A fictional spoken note"]]);
      await waitFor(() => expect(screen.getByRole("button", { name: "Tap to speak" })).toBeInTheDocument());
      expect(screen.queryByRole("alert")).toBeNull();
    });

    it("holds the composer while a spoken note saves, so it can't be said twice", async () => {
      const user = userEvent.setup();
      let settle: () => void = () => undefined;
      const onAdd = vi.fn(() => new Promise<void>((resolve) => { settle = resolve; }));
      render(<CandidateSharedProfileNotes notes={[]} candidateName="Mei Tanaka" onAdd={onAdd} />);

      await speak(user, "A fictional spoken note");
      expect(onAdd.mock.calls).toEqual([["A fictional spoken note"]]);
      // On its way: the mic and the way to typing are held, and said to be busy.
      expect(screen.getByRole("button", { name: "Tap to speak" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "or type instead" })).toBeDisabled();
      expect(document.querySelector("[data-slot='candidate-note-composer']")).toHaveAttribute("aria-busy", "true");
      await user.click(screen.getByRole("button", { name: "Tap to speak" }));
      expect(screen.queryByRole("dialog", { name: "Voice dictation" })).toBeNull();
      expect(onAdd).toHaveBeenCalledTimes(1);

      await act(async () => settle());
      expect(screen.getByRole("button", { name: "Tap to speak" })).toBeEnabled();
      expect(document.querySelector("[data-slot='candidate-note-composer']")).not.toHaveAttribute("aria-busy", "true");
    });

    it("puts a spoken note that runs too long in the field to shorten, unsaved", async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn().mockResolvedValue(undefined);
      render(<CandidateSharedProfileNotes notes={[]} candidateName="Mei Tanaka" onAdd={onAdd} maxLength={20} />);

      await speak(user, "A fictional spoken note that runs on past the limit");
      // The limit a typed note has holds for a spoken one: nothing is sent.
      expect(onAdd).not.toHaveBeenCalled();
      const field = await screen.findByRole("textbox", { name: "Note about Mei Tanaka" });
      expect(field).toHaveValue("A fictional spoken note that runs on past the limit");
      expect(screen.getByRole("alert")).toHaveTextContent("That note is over 20 characters. Shorten it to save it.");
      expect(screen.getByRole("button", { name: "Add note" })).toBeDisabled();

      await user.clear(field);
      await user.type(field, "A shorter note");
      await user.click(screen.getByRole("button", { name: "Add note" }));
      expect(onAdd.mock.calls).toEqual([["A shorter note"]]);
    });

    it("discards a recovered note on request", async () => {
      const user = userEvent.setup();
      render(
        <CandidateSharedProfileNotes
          notes={[]}
          candidateName="Mei Tanaka"
          onAdd={vi.fn().mockRejectedValue(new Error("offline"))}
          labels={{ noteDiscard: "Throw it away" }}
        />,
      );

      await speak(user, "A fictional spoken note");
      await user.click(await screen.findByRole("button", { name: "Throw it away" }));
      expect(screen.queryByRole("textbox")).toBeNull();
      expect(screen.queryByRole("alert")).toBeNull();
      expect(screen.getByRole("button", { name: "Tap to speak" })).toBeInTheDocument();
    });

    it("leaves dictation out when the host turns it off", () => {
      render(<CandidateSharedProfileNotes notes={[]} candidateName="Mei Tanaka" onAdd={vi.fn()} voice={false} />);

      expect(screen.getByRole("textbox", { name: "Note about Mei Tanaka" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Tap to speak" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Start dictation" })).toBeNull();
    });
  });
});
