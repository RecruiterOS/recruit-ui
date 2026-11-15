import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Globe } from "lucide-react";
import { COVER_BANNER_VARIANTS } from "@epicbagel/saas-kit/primitives/cover-banner";
import { describe, expect, it, vi } from "vitest";

import { CandidateSharedProfile, type CandidateSharedProfileProps } from "./candidate-shared-profile";
import { CandidateSharedProfileSection } from "./candidate-shared-profile-sections";

// Fictional people, organisations and notes only.
const PERSON: CandidateSharedProfileProps["person"] = {
  name: "Mei Tanaka",
  avatar: <img alt="Mei Tanaka's photo" src="https://example.com/mei.png" />,
  cover: <img alt="Fictional skyline" src="https://example.com/cover.png" />,
  title: "Staff Engineer",
  company: "Sample Analytics",
  location: "Example City",
  yearsExperience: 11,
  profileLink: { href: "https://example.com/mei", title: "Open Mei Tanaka's profile", icon: Globe },
};

const EVERYTHING: CandidateSharedProfileProps = {
  person: PERSON,
  eyebrow: "Staff Engineer · Example Labs",
  people: [
    { id: "mei", name: "Mei Tanaka" },
    { id: "tomas", name: "Tomas Example" },
  ],
  personId: "mei",
  onPersonChange: () => undefined,
  voiceNote: { src: "https://example.com/note.m4a", transcript: "A fictional transcript." },
  note: { text: "Worth meeting this week.", author: "Robin Example" },
  fit: {
    roleTitle: "Staff Engineer",
    grade: { grade: "A", label: "Strong fit", tone: "success" },
    summary: "Led the same fictional rebuild.",
    evidence: [{ text: "Rebuilt a fictional platform", sentiment: "positive" }],
  },
  summary: "A fictional platform engineer.\nEleven years in.",
  experience: [
    { title: "Staff Engineer", company: "Sample Analytics", dateRange: "2021 – Present", description: "Leads the fictional platform group." },
    { title: "Engineer", company: "Fictional Robotics", dateRange: "2015 – 2021" },
  ],
  education: [
    { title: "MSc, Distributed Systems", institution: "Example University", date: "2013" },
    { institution: "Example College", date: "2011" },
  ],
  skills: ["Go", "Kubernetes"],
  certifications: ["Fictional Cloud Architect"],
  languages: ["English", "Japanese"],
  decision: null,
  onDecide: async () => undefined,
  clientNotes: [{ id: 1, text: "A fictional note", date: "12 Jan" }],
  onAddNote: async () => undefined,
  credit: "Shared by Example Search",
};

const slots = (container: HTMLElement) =>
  [...container.querySelectorAll("[data-slot^='candidate-shared-profile'], [data-slot='candidate-profile-header'], [data-slot='candidate-profile-footer']")]
    .map((element) => element.getAttribute("data-slot"));

describe("candidate shared profile", () => {
  it("is a heading and nothing else, given a name alone", () => {
    const { container } = render(<CandidateSharedProfile person={{ name: "Mei Tanaka" }} id="example-profile" />);

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-slot", "candidate-shared-profile");
    expect(root).toHaveAttribute("id", "example-profile");
    expect(root).not.toHaveAttribute("data-anonymised");
    expect(root).not.toHaveAttribute("data-archived");
    expect(container.querySelector("[aria-busy]")).toBeNull();
    // A pasted link or an unbroken name wraps inside the profile, which clips at its edge.
    expect(root).toHaveClass("[overflow-wrap:anywhere]");

    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Mei Tanaka" })).toBeInTheDocument();
    // No section, no body to pad, no controls, no credit.
    expect(slots(container)).toEqual(["candidate-shared-profile", "candidate-profile-header"]);
    expect(container.querySelector("[data-slot='candidate-profile-body']")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("region")).toBeNull();
    // One article: the profile itself.
    expect(container.querySelectorAll("article")).toHaveLength(1);
  });

  it("shows every part it is given, in order, each section under the name", () => {
    const { container } = render(<CandidateSharedProfile {...EVERYTHING} />);

    expect(slots(container)).toEqual([
      "candidate-shared-profile",
      "candidate-shared-profile-switcher",
      "candidate-profile-header",
      "candidate-shared-profile-voice-note",
      "candidate-shared-profile-note",
      "candidate-shared-profile-fit",
      "candidate-shared-profile-summary",
      "candidate-shared-profile-experience",
      "candidate-shared-profile-education",
      "candidate-shared-profile-skills",
      "candidate-shared-profile-certifications",
      "candidate-shared-profile-languages",
      "candidate-shared-profile-answer",
      "candidate-shared-profile-notes",
      "candidate-profile-footer",
    ]);
    // The eyebrow sits over it all.
    expect(container.firstElementChild!.firstElementChild).toHaveTextContent("Staff Engineer · Example Labs");

    // One h1, the person, and the profile's own sections one level under it.
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "A note from your recruiter",
      "Note from Robin Example",
      "Fit for Staff Engineer",
      "Profile",
      "Experience",
      "Education",
      "Skills",
      "Certifications",
      "Languages",
      // The reader's own sections are sections of the profile too, not of whichever came last.
      "Your answer",
      "Your notes1",
    ]);

    expect(screen.getByRole("region", { name: "Profile" })).toHaveTextContent("A fictional platform engineer. Eleven years in.");
    expect(within(screen.getByRole("region", { name: "Profile" })).getByText(/A fictional platform engineer/)).toHaveClass("whitespace-pre-line");

    const experience = screen.getByRole("region", { name: "Experience" });
    expect(experience.querySelector("[data-slot='candidate-career-history']")).not.toBeNull();
    // A role is one level under its section, and so is a line of education: the outline skips nothing.
    expect(within(experience).getByRole("heading", { level: 3, name: "Staff Engineer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "MSc, Distributed Systems" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 5 })).toBeNull();
    expect(experience).toHaveTextContent("Staff EngineerSample Analytics · 2021 – PresentLeads the fictional platform group.");

    // Education reads like the career above it: what, then where and when.
    const education = screen.getByRole("region", { name: "Education" });
    expect(education).toHaveTextContent("MSc, Distributed SystemsExample University · 2013");
    // With nothing studied named, the place is the line.
    expect(education).toHaveTextContent("Example College2011");

    const skills = within(screen.getByRole("region", { name: "Skills" })).getByRole("list");
    expect(within(skills).getAllByRole("listitem").map((item) => item.textContent)).toEqual(["Go", "Kubernetes"]);
    expect(within(screen.getByRole("region", { name: "Certifications" })).getAllByRole("listitem")).toHaveLength(1);
    expect(within(screen.getByRole("region", { name: "Languages" })).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "English",
      "Japanese",
    ]);

    expect(screen.getByRole("region", { name: "Your answer" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Your notes" })).toBeInTheDocument();
    expect(container.querySelector("footer")).toHaveTextContent("Shared by Example Search");
  });

  it("puts the name under a page's own h1, and the sections under the name", () => {
    render(<CandidateSharedProfile {...EVERYTHING} titleLevel={2} />);

    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Mei Tanaka" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Fit for Staff Engineer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: "Engineer" })).toBeInTheDocument();
    // The reader's sections move with the rest, and nothing outranks the name.
    expect(screen.getByRole("heading", { level: 3, name: "Your answer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Your notes/ })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });

  it("draws a section only for what it is given, however empty the rest", () => {
    const { container } = render(
      <CandidateSharedProfile
        person={{ name: "Mei Tanaka" }}
        people={[{ id: "mei", name: "Mei Tanaka" }]}
        personId="mei"
        eyebrow=""
        voiceNote={null}
        note={null}
        fit={{ roleTitle: "Staff Engineer", evidence: [] }}
        summary=""
        experience={[]}
        education={[{ date: "2013" }]}
        skills={["", "Go"]}
        certifications={[]}
        languages={[]}
        clientNotes={[]}
        credit=""
      />,
    );

    // One skill is all there is to show.
    expect(slots(container)).toEqual([
      "candidate-shared-profile",
      "candidate-profile-header",
      "candidate-shared-profile-skills",
    ]);
    expect(within(screen.getByRole("region", { name: "Skills" })).getAllByRole("listitem")).toHaveLength(1);
    expect(container.querySelector("footer")).toBeNull();
  });

  it("draws no note with no words in it, and no player with nothing to play", () => {
    const { container } = render(
      <CandidateSharedProfile
        person={{ name: "Mei Tanaka" }}
        note={{ text: "  \n ", author: "Robin Example" }}
        voiceNote={{ src: " ", transcript: "A fictional transcript." }}
        fit={{ grade: { grade: null, label: "" } }}
      />,
    );

    expect(slots(container)).toEqual(["candidate-shared-profile", "candidate-profile-header"]);
    expect(container.querySelector("[data-slot='candidate-profile-body']")).toBeNull();
  });

  it("starts the answer and the note afresh for each person", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <CandidateSharedProfile {...EVERYTHING} decision="yes" onAddNote={vi.fn().mockRejectedValue(new Error("offline"))} />,
    );

    // Half-way through changing an answer, with a note that didn't save, on Mei.
    await user.click(screen.getByRole("button", { name: "Change" }));
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: "Note about Mei Tanaka" }), "A fictional note about Mei");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That note didn't save. Try again.");

    // None of it follows the reader to the next person.
    rerender(
      <CandidateSharedProfile
        {...EVERYTHING}
        person={{ name: "Tomas Example" }}
        personId="tomas"
        decision="no"
        onAddNote={vi.fn()}
      />,
    );
    expect(screen.getByText("You said No")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Yes" })).toBeNull();
    expect(screen.getByRole("textbox", { name: "Note about Tomas Example" })).toHaveValue("");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("adds the host's own sections under the profile's", () => {
    const { container } = render(
      <CandidateSharedProfile person={{ name: "Mei Tanaka" }} summary="A fictional summary.">
        <CandidateSharedProfileSection title="Notice period">
          <p>Three fictional months</p>
        </CandidateSharedProfileSection>
      </CandidateSharedProfile>,
    );

    const body = container.querySelector("[data-slot='candidate-profile-body']")!;
    expect([...body.querySelectorAll("section")].map((section) => section.getAttribute("aria-labelledby") && section.textContent)).toEqual([
      "ProfileA fictional summary.",
      "Notice periodThree fictional months",
    ]);
  });

  it("has no Yes or No unless the host can save one", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(<CandidateSharedProfile person={PERSON} summary="A fictional summary." />);

    expect(screen.queryByRole("button", { name: "Yes" })).toBeNull();
    expect(screen.queryByRole("button", { name: "No" })).toBeNull();
    expect(screen.queryByRole("region", { name: /answer/i })).toBeNull();

    // An answer already given is shown, with nothing to press.
    rerender(<CandidateSharedProfile person={PERSON} decision="yes" decisionReason="Right level" />);
    const shown = screen.getByRole("region", { name: "Answer" });
    expect(shown).toHaveTextContent("Said YesRight level");
    expect(within(shown).queryByRole("button")).toBeNull();

    rerender(
      <CandidateSharedProfile
        person={PERSON}
        onDecide={onDecide}
        reasonOptional
        reasonSuggestions={{ yes: ["Right level"] }}
        decisionLabels={{ yes: "Meet them" }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Meet them" }));
    const dialog = screen.getByRole("dialog", { name: "Yes to Mei Tanaka" });
    await user.click(within(dialog).getByText("Right level"));
    await user.click(within(dialog).getByRole("button", { name: "Save Yes" }));
    expect(onDecide.mock.calls).toEqual([["yes", "Right level"]]);
  });

  it("takes no notes unless the host can save one, and shows the ones it has", async () => {
    const user = userEvent.setup();
    const onAddNote = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(<CandidateSharedProfile person={PERSON} />);

    expect(screen.queryByRole("region", { name: /notes/i })).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();

    rerender(<CandidateSharedProfile person={PERSON} clientNotes={[{ id: 1, text: "A fictional note" }]} />);
    expect(screen.getByRole("region", { name: "Notes" })).toHaveTextContent("A fictional note");
    expect(screen.queryByRole("textbox")).toBeNull();

    rerender(<CandidateSharedProfile person={PERSON} onAddNote={onAddNote} noteMaxLength={500} />);
    const field = screen.getByRole("textbox", { name: "Note about Mei Tanaka" });
    expect(field).toHaveAttribute("maxlength", "500");
    await user.type(field, "Another fictional note");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(onAddNote.mock.calls).toEqual([["Another fictional note"]]);
  });

  it("shows the reader's answer and notes, and takes none, where it is read only", () => {
    render(
      <CandidateSharedProfile
        {...EVERYTHING}
        readOnly
        decision="no"
        decisionReason="Too far away"
        onDecide={vi.fn()}
        onAddNote={vi.fn()}
      />,
    );

    expect(screen.getByRole("region", { name: "Answer" })).toHaveTextContent("Said NoToo far away");
    expect(screen.getByRole("region", { name: "Notes" })).toHaveTextContent("A fictional note");
    expect(screen.queryByRole("textbox")).toBeNull();
    for (const name of ["Yes", "No", "Change", "Add note"]) expect(screen.queryByRole("button", { name })).toBeNull();
  });

  it("never shows who an anonymised person is, whatever it is handed", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const { container } = render(
      <CandidateSharedProfile
        {...EVERYTHING}
        // The host passes the name, the face, the cover, the link and the
        // people's names by mistake; its own words it has redacted.
        anonymised
        voiceNote={{ src: "https://example.com/note.m4a", transcript: "A fictional transcript." }}
        onDecide={onDecide}
        reasonOptional
      />,
    );

    expect(container.firstElementChild).toHaveAttribute("data-anonymised", "true");
    expect(screen.getByRole("heading", { level: 1, name: "Confidential candidate" })).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/Mei|Tanaka|Tomas/);
    expect(container.querySelector("img")).toBeNull();
    // Their cover is gone; the stock banner in its place is the one everybody gets.
    expect(container.querySelector("[data-slot='candidate-cover-image'] [data-slot='cover-banner']")).toHaveAttribute(
      "data-variant",
      COVER_BANNER_VARIANTS[0],
    );
    expect(screen.queryByRole("link")).toBeNull();
    expect(within(screen.getByRole("group", { name: "2 people shared with you" })).getAllByRole("button").map((chip) => chip.textContent)).toEqual([
      "Candidate 1",
      "Candidate 2",
    ]);

    // Nor do the questions it asks name them.
    expect(screen.getByRole("textbox", { name: "Note about this candidate" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(screen.getByRole("dialog", { name: "Yes to this candidate" })).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/Mei|Tanaka/);
  });

  it("holds the reader's controls while another person's profile opens", async () => {
    const user = userEvent.setup();
    let settle: () => void = () => undefined;
    const onPersonChange = vi.fn(() => new Promise<void>((resolve) => { settle = resolve; }));
    const { container, rerender } = render(<CandidateSharedProfile {...EVERYTHING} onPersonChange={onPersonChange} />);
    const profile = container.querySelector("article")!.parentElement!;

    await user.click(screen.getByRole("button", { name: "Tomas Example" }));
    expect(onPersonChange.mock.calls).toEqual([["tomas"]]);
    expect(screen.getByRole("group", { name: "Opening Tomas Example…" })).toBeInTheDocument();
    // The profile is what is changing, so it is the part marked busy. The
    // caption that says who is opening sits outside it, and is read out.
    expect(profile).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Opening Tomas Example…").closest("[aria-busy]")).toBeNull();
    // A Yes now would be about whoever is on screen, and that is changing.
    for (const name of ["Yes", "No"]) expect(screen.getByRole("button", { name })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Note about Mei Tanaka" })).toBeDisabled();

    await act(async () => settle());
    expect(profile).not.toHaveAttribute("aria-busy");
    for (const name of ["Yes", "No"]) expect(screen.getByRole("button", { name })).toBeEnabled();
    expect(screen.getByRole("textbox", { name: "Note about Mei Tanaka" })).toBeEnabled();

    // The same, for a host that knows who is opening some other way.
    rerender(<CandidateSharedProfile {...EVERYTHING} onPersonChange={onPersonChange} openingPersonId="tomas" />);
    expect(screen.getByRole("group", { name: "Opening Tomas Example…" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yes" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Note about Mei Tanaka" })).toBeDisabled();
  });

  it("says another person's profile didn't open, where it was asked for", async () => {
    const user = userEvent.setup();
    const onPersonChange = vi.fn().mockRejectedValue(new Error("offline"));
    render(
      <CandidateSharedProfile
        {...EVERYTHING}
        onPersonChange={onPersonChange}
        labels={{ switchFailed: () => "Tomas's page didn't open." }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Tomas Example" }));
    const switcher = screen.getByRole("group", { name: "2 people shared with you" }).parentElement!;
    expect(await within(switcher).findByRole("alert")).toHaveTextContent("Tomas's page didn't open.");
    // Still Mei's profile, with its controls back.
    expect(screen.getByRole("heading", { level: 1, name: "Mei Tanaka" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yes" })).toBeEnabled();
  });

  it("drops a reason being given when another person's profile starts to open", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(<CandidateSharedProfile {...EVERYTHING} onDecide={onDecide} />);

    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(screen.getByRole("dialog", { name: "Yes to Mei Tanaka" })).toBeInTheDocument();

    // The host's route changes under the dialog, as from the browser's Back.
    rerender(<CandidateSharedProfile {...EVERYTHING} onDecide={onDecide} openingPersonId="tomas" />);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(onDecide).not.toHaveBeenCalled();
  });

  it("has no switcher for one person, and one that can't be pressed with no way to switch", () => {
    const { rerender } = render(<CandidateSharedProfile person={PERSON} people={[{ id: "mei", name: "Mei Tanaka" }]} personId="mei" />);
    expect(screen.queryByRole("group")).toBeNull();

    rerender(<CandidateSharedProfile person={PERSON} people={EVERYTHING.people} personId="mei" />);
    for (const chip of within(screen.getByRole("group", { name: "2 people shared with you" })).getAllByRole("button")) {
      expect(chip).toBeDisabled();
    }
  });

  it("draws no body for an empty list of the host's own sections", () => {
    const { container } = render(
      <CandidateSharedProfile person={{ name: "Mei Tanaka" }}>{[].map(() => <p>Never drawn</p>)}</CandidateSharedProfile>,
    );
    expect(container.querySelector("[data-slot='candidate-profile-body']")).toBeNull();
  });

  it("says a profile is archived, and dims it", () => {
    const { container, rerender } = render(<CandidateSharedProfile person={PERSON} archived summary="A fictional summary." />);

    expect(container.firstElementChild).toHaveAttribute("data-archived", "true");
    const notice = container.querySelector("[data-slot='candidate-shared-profile-archived']")!;
    expect(notice).toHaveTextContent("This profile is archivedIts link has stopped working for the people it was shared with.");
    // The notice comes before the profile it is about, which still reads.
    expect(notice.compareDocumentPosition(container.querySelector("article")!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelector("article")!.parentElement).toHaveClass("opacity-70", "print:opacity-100");
    expect(screen.getByRole("heading", { level: 1, name: "Mei Tanaka" })).toBeInTheDocument();

    rerender(
      <CandidateSharedProfile
        person={PERSON}
        archived
        labels={{ archivedTitle: "You've archived this profile", archivedDescription: "" }}
      />,
    );
    expect(container.querySelector("[data-slot='candidate-shared-profile-archived']")).toHaveTextContent(/^You've archived this profile$/);

    rerender(<CandidateSharedProfile person={PERSON} />);
    expect(container.querySelector("[data-slot='candidate-shared-profile-archived']")).toBeNull();
    expect(container.querySelector("article")!.parentElement).not.toHaveClass("opacity-70");
  });

  it("prints as a resume: the profile flat, and nothing to press", () => {
    const { container } = render(<CandidateSharedProfile {...EVERYTHING} archived />);

    // A page, not a card on one.
    expect(container.querySelector("article")).toHaveClass("print:border-0", "print:shadow-none");
    const offPaper = [
      container.querySelector("[data-slot='candidate-shared-profile-switcher']"),
      container.querySelector("[data-slot='candidate-shared-profile-archived']"),
      screen.getByRole("link", { name: "Open Mei Tanaka's profile" }),
      container.querySelector("audio")!.parentElement,
      screen.getByRole("region", { name: "Your answer" }),
      container.querySelector("[data-slot='candidate-shared-profile-notes']"),
      container.querySelector("footer"),
    ];
    for (const element of offPaper) expect(element).toHaveClass("print:hidden");
    // A career's "Show more" is a control too.
    expect(screen.getByRole("region", { name: "Experience" })).toHaveClass("print:[&_button]:hidden");

    // What a resume is made of stays.
    for (const name of ["Fit for Staff Engineer", "Profile", "Experience", "Education", "Skills", "Languages"]) {
      expect(screen.getByRole("region", { name })).not.toHaveClass("print:hidden");
    }
    expect(screen.getByRole("heading", { level: 1 }).closest(".print\\:hidden")).toBeNull();
  });

  it("draws the career as the host asks, and plays the note through the host's player", () => {
    render(
      <CandidateSharedProfile
        person={PERSON}
        voiceNote={{ src: "https://example.com/note.m4a" }}
        renderAudio={({ src, label }) => <button type="button" data-src={src}>{label}</button>}
        experience={[
          { title: "Staff Engineer", company: "Sample Analytics", startDate: "2021-03-01", current: true },
          { title: "Engineer", company: "Fictional Robotics", dateRange: "2015 – 2021" },
          { title: "Graduate Engineer", company: "Placeholder Systems", dateRange: "2013 – 2015" },
        ]}
        experienceOptions={{ detailedCompanyGroups: 1, earlierLabel: "Before that", presentLabel: "Now" }}
      />,
    );

    expect(screen.getByRole("button", { name: "Recruiter voice note" })).toHaveAttribute("data-src", "https://example.com/note.m4a");
    const experience = screen.getByRole("region", { name: "Experience" });
    expect(within(experience).getByText("Before that")).toBeInTheDocument();
    expect(experience).toHaveTextContent(/2021 – Now/);
  });

  it("says what the host words", () => {
    render(
      <CandidateSharedProfile
        {...EVERYTHING}
        labels={{
          voiceNote: "A word from Robin",
          summary: "About",
          experience: "Career",
          people: (count) => `${count} on this shortlist`,
          answer: "Would you meet them?",
          notes: "Notes to Robin",
        }}
      />,
    );

    for (const name of ["A word from Robin", "About", "Career", "Would you meet them?", "Notes to Robin"]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
    expect(screen.getByRole("group", { name: "2 on this shortlist" })).toBeInTheDocument();
  });

  it("takes display values only: there is no way to hand it a record", () => {
    const note: CandidateSharedProfileProps["note"] = {
      text: "A fictional note",
      author: "Robin Example",
      // @ts-expect-error a note is its words and who they are from
      internal: true,
    };
    const clientNotes: CandidateSharedProfileProps["clientNotes"] = [
      {
        id: 1,
        text: "A fictional client note",
        // @ts-expect-error a reader's note has no field for a record's own marks
        scope: { label: "Fictional client account" },
      },
    ];
    const props: CandidateSharedProfileProps = {
      person: { name: "Mei Tanaka" },
      // @ts-expect-error there is no prop for the person's record
      candidate: { id: 7, notes: ["Fictional salary expectations"] },
    };
    const { container } = render(<CandidateSharedProfile {...props} note={note} clientNotes={clientNotes} />);

    // What it was given to show is shown, and the rest is nowhere.
    expect(container).toHaveTextContent("A fictional note");
    expect(container).toHaveTextContent("A fictional client note");
    expect(container).not.toHaveTextContent("Fictional client account");
    expect(container).not.toHaveTextContent("Fictional salary expectations");
    expect(container.innerHTML).not.toContain("candidate=");
  });

  it("writes nothing into the page that it wasn't given to show", () => {
    // A host's view model, spread in whole: TypeScript lets a spread carry more than the props.
    const viewModel = {
      person: { name: "Mei Tanaka", salaryExpectation: "A fictional salary" },
      fit: {
        roleTitle: "Staff Engineer",
        score: 9731,
        rationale: "Fictional internal rationale",
        grade: { grade: "A", label: "Strong fit", score: 9731, reviewer: "Fictional Reviewer" },
        evidence: [{ text: "Rebuilt a fictional platform", sentiment: "positive" as const, source: "Fictional internal call" }],
      },
      experience: [{ title: "Staff Engineer", company: "Sample Analytics", recordId: "fictional-role-7" }],
      clientNotes: [{ id: 1, text: "A fictional client note", authorEmail: "imogen@example.com" }],
      shareId: "fictional-share-42",
      internalNote: "Fictional internal note",
      tenant: "fictional-tenant",
      title: "Fictional tooltip",
      onClick: () => undefined,
    };
    const { container } = render(
      <CandidateSharedProfile {...viewModel} id="example-profile" className="example-class" data-testid="profile" aria-label="Mei Tanaka's profile" />,
    );

    const html = container.innerHTML;
    for (const leaked of [
      "fictional-share-42",
      "Fictional internal note",
      "fictional-tenant",
      "Fictional tooltip",
      "A fictional salary",
      "Fictional internal rationale",
      "Fictional Reviewer",
      "Fictional internal call",
      "fictional-role-7",
      "imogen@example.com",
      "9731",
    ]) {
      expect(html, leaked).not.toContain(leaked);
    }
    // What a host does mean for the root still reaches it.
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("id", "example-profile");
    expect(root).toHaveClass("example-class");
    expect(root).toHaveAttribute("data-testid", "profile");
    expect(root).toHaveAttribute("aria-label", "Mei Tanaka's profile");
    expect(root.getAttributeNames().sort()).toEqual(["aria-label", "class", "data-slot", "data-testid", "id"]);
    // And what it was given to show is all there.
    expect(screen.getByRole("region", { name: "Fit for Staff Engineer" })).toHaveTextContent("A — Strong fit");
    expect(container).toHaveTextContent("A fictional client note");
  });

  it("saves an answer through the voice-first sheet where the host asks for it", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(
      <CandidateSharedProfile
        person={PERSON}
        onDecide={onDecide}
        reasonPrompt="sheet"
        reasonOptional
        reasonSuggestions={{ no: ["Too far away"] }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "No" }));
    const sheet = await screen.findByRole("dialog", { name: "Why no?" });
    expect(sheet).toHaveAccessibleDescription("Give your reason for Mei Tanaka, or pick one.");
    await user.click(within(sheet).getByRole("button", { name: "Too far away" }));
    expect(onDecide.mock.calls).toEqual([["no", "Too far away"]]);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
