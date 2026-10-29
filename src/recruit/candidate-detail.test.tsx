import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Archive, RefreshCw } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { CandidateChannelLog, CandidateContactDetails, CandidateDefinitionSection } from "./candidate-contact-details";
import { CandidateDecisionSummary } from "./candidate-decision-summary";
import {
  CandidateActionMenu,
  CandidateDetailHeader,
  CandidateDetailLayout,
  CandidateDetailTabs,
} from "./candidate-detail-layout";
import { CandidateFactList, formatFactValue } from "./candidate-fact-list";
import { CandidateJobEvidence } from "./candidate-job-evidence";
import { CandidateNoteCard, CandidateNoteComposer, CandidateNoteList } from "./candidate-notes";
import { CandidateOutreachComposer, type CandidateOutreachGuidance } from "./candidate-outreach-composer";
import { CandidatePipelineList, CandidateSummaryBullets } from "./candidate-pipeline-list";

// Fictional people, organisations and roles only.

describe("candidate detail layout", () => {
  it("keeps the header, tabs and footer fixed around a body that scrolls on its own", () => {
    const { container } = render(
      <CandidateDetailLayout
        header={<header>Head</header>}
        alert={<p role="alert">Refresh failed</p>}
        tabs={<nav>Tabs</nav>}
        footer={<footer>Foot</footer>}
      >
        <p>Body</p>
      </CandidateDetailLayout>,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-slot", "candidate-detail-layout");
    expect(root.className).toContain("overflow-hidden");
    expect([...root.children].map((child) => child.textContent)).toEqual(["Head", "Refresh failed", "Tabs", "Body", "Foot"]);
    const body = screen.getByText("Body").parentElement as HTMLElement;
    expect(body.className).toContain("overflow-y-auto");
    expect(root.querySelectorAll(".overflow-y-auto")).toHaveLength(1);
  });

  it("shows the verified badge, its date and the two lines only when given, and closes", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container, rerender } = render(
      <CandidateDetailHeader
        avatar={<span>IE</span>}
        name="Imogen Example"
        verified={{ label: "verified", title: "Email verified" }}
        verifiedAt="verified last week"
        headline="Staff Engineer at Fernhill Example Co"
        provenance="Added from a referral"
        actions={<button type="button">Favourite</button>}
        onClose={onClose}
      />,
    );

    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-detail-header");
    expect(screen.getByRole("heading", { level: 3, name: "Imogen Example" })).toBeInTheDocument();
    expect(screen.getByText("verified").closest("[data-slot=badge]")).toHaveAttribute("title", "Email verified");
    expect(screen.getByText("verified last week")).toBeInTheDocument();
    expect(screen.getByText("Staff Engineer at Fernhill Example Co")).toBeInTheDocument();
    expect(screen.getByText("Added from a referral")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <CandidateDetailHeader avatar={null} name="Mei Example" verifiedAt="verified today" onClose={onClose} closeLabel="Close profile" />,
    );
    expect(screen.queryByText("verified today")).toBeNull();
    expect(screen.queryByText(/Fernhill/)).toBeNull();
    expect(screen.getByRole("button", { name: "Close profile" })).toBeInTheDocument();
  });

  it("runs the host's secondary actions from the menu, with a spinner while busy", async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    const onArchive = vi.fn();
    const items = [
      { id: "refresh", label: "Refresh profile", icon: RefreshCw, onSelect: onRefresh, disabled: true },
      { id: "archive", label: "Archive", icon: Archive, onSelect: onArchive, tone: "warning" as const },
    ];
    const { rerender } = render(<CandidateActionMenu items={items} />);

    const trigger = screen.getByRole("button", { name: "More actions" });
    expect(trigger.querySelector(".animate-spin")).toBeNull();
    await user.click(trigger);
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("data-slot", "candidate-action-menu");
    expect(within(menu).getByRole("menuitem", { name: "Refresh profile" })).toHaveAttribute("data-disabled");
    const archive = within(menu).getByRole("menuitem", { name: "Archive" });
    expect(archive.querySelector("svg")?.getAttribute("class")).toContain("text-amber-600");
    await user.click(archive);
    expect(onArchive).toHaveBeenCalledTimes(1);
    expect(onRefresh).not.toHaveBeenCalled();

    rerender(<CandidateActionMenu items={items} busy label="Profile actions" />);
    expect(screen.getByRole("button", { name: "Profile actions" }).querySelector(".animate-spin")).not.toBeNull();
  });

  it("sits among a card's quiet actions without selecting the card", async () => {
    const user = userEvent.setup();
    const onCard = vi.fn();
    const onPause = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateActionMenu
          variant="quiet"
          itemIconSize="sm"
          isolateClicks
          items={[{ id: "pause", label: "Pause", icon: RefreshCw, onSelect: onPause }]}
        />
      </div>,
    );

    const trigger = screen.getByRole("button", { name: "More actions" });
    expect(trigger).toHaveAttribute("data-variant", "quiet");
    await user.click(trigger);
    const item = within(screen.getByRole("menu")).getByRole("menuitem", { name: "Pause" });
    expect(item.querySelector("svg")?.getAttribute("class")).toContain("size-3.5");
    await user.click(item);
    expect(onPause).toHaveBeenCalledTimes(1);
    expect(onCard).not.toHaveBeenCalled();
  });

  it("uses the danger theme for actionable tab counts and hides a zero count", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <CandidateDetailTabs
        value="detail"
        onChange={onChange}
        tabs={[
          { value: "detail", label: "Detail" },
          { value: "roles", label: "Roles", count: 3 },
          { value: "signals", label: "Signals", count: 2 },
          { value: "calls", label: "Calls", count: 0 },
        ]}
      />,
    );

    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-detail-tabs");
    for (const count of ["2", "3"]) {
      const badge = screen.getByText(count);
      expect(badge.className).toContain("bg-destructive");
      expect(badge.className).toContain("text-destructive-foreground");
    }
    expect(screen.getByRole("tab", { name: "Calls" }).textContent).toBe("Calls");
    await user.click(screen.getByRole("tab", { name: /Signals/ }));
    expect(onChange).toHaveBeenCalledWith("signals");
  });
});

describe("candidate decision summary and job evidence", () => {
  it("shows the decision and the assessment as two rows of one card, and nothing without either", () => {
    const { container, rerender } = render(
      <CandidateDecisionSummary
        decision={{ heading: "Your decision", verdict: "No", tone: "negative", stage: "Rejected", reason: "Wants a fully\nremote role" }}
        assessment={{ letter: "B", tone: "info", title: "Grade B", heading: "Assessment", label: "Good fit" }}
      />,
    );

    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-decision-summary");
    expect(screen.getByText("No").className).toContain("text-destructive");
    expect(screen.getByText("· Rejected")).toBeInTheDocument();
    expect(screen.getByText(/Wants a fully/).className).toContain("whitespace-pre-wrap");
    const tile = screen.getByText("B");
    expect(tile).toHaveAttribute("title", "Grade B");
    expect(tile.parentElement?.className).toContain("border-t");

    rerender(<CandidateDecisionSummary assessment={{ letter: "A", tone: "success", heading: "Assessment", label: "Strong fit · awaiting a decision" }} />);
    expect(screen.queryByText("Your decision")).toBeNull();
    expect(screen.getByText("A").parentElement?.className).not.toContain("border-t");

    rerender(<CandidateDecisionSummary />);
    expect(container.firstElementChild).toBeNull();
  });

  it("keeps sourcing rationale and human judgement distinct for each role", () => {
    render(
      <>
        <CandidateJobEvidence
          sourced={{ title: "Why sourced for Platform Lead", text: "Built onboarding" }}
          feedback={{ title: "Recruiter feedback · no", text: "Wrong location", byline: "Robin Example" }}
        />
        <CandidateJobEvidence
          sourced={{ title: "Why sourced for Regional Lead", text: "Relevant regional network" }}
          feedback={{ title: "Recruiter feedback · yes", text: "Good territory fit", byline: "Robin Example" }}
        />
      </>,
    );
    expect(screen.getByText("Why sourced for Platform Lead")).toBeInTheDocument();
    expect(screen.getByText("Why sourced for Regional Lead")).toBeInTheDocument();
    expect(screen.getByText("Wrong location")).toBeInTheDocument();
    expect(screen.getByText("Good territory fit")).toBeInTheDocument();
    expect(screen.getAllByText("Robin Example")).toHaveLength(2);
  });

  it("shows sourced reasons before anyone has given feedback, and nothing with neither", () => {
    const { container, rerender } = render(
      <CandidateJobEvidence sourced={{ title: "Why sourced", text: "Existing warm relationship" }} />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-job-evidence");
    expect(screen.getByText("Existing warm relationship")).toBeInTheDocument();
    expect(screen.queryByText(/feedback/)).toBeNull();

    rerender(<CandidateJobEvidence />);
    expect(container.firstElementChild).toBeNull();
  });
});

describe("candidate notes", () => {
  it("lists notes with their count, a skeleton while loading, or the empty state, above the composer", () => {
    const empty = { title: "No notes yet", description: "Add the first note below." };
    const { container, rerender } = render(
      <CandidateNoteList count={0} loading empty={empty} composer={<p>Composer</p>} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-slot", "candidate-note-list");
    expect(root.querySelector("[data-slot=count-badge], .tabular-nums")).toBeNull();
    expect(screen.queryByText("No notes yet")).toBeNull();

    rerender(<CandidateNoteList count={0} empty={empty} composer={<p>Composer</p>} />);
    expect(screen.getByText("No notes yet")).toBeInTheDocument();
    expect(screen.getByText("Composer")).toBeInTheDocument();

    rerender(
      <CandidateNoteList count={1} empty={empty} composer={<p>Composer</p>}>
        <p>A note</p>
      </CandidateNoteList>,
    );
    expect(screen.queryByText("No notes yet")).toBeNull();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("A note").compareDocumentPosition(screen.getByText("Composer")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("marks how a note was left, pins it, scopes it and deletes it only when the host allows", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const { container, rerender } = render(
      <CandidateNoteCard
        author="Robin Example"
        kind="voice"
        scope={{ label: "Platform Lead", title: "Note left for Platform Lead", highlighted: true }}
        date="2 days ago"
        text={"Keen on the role.\nWants to talk pay."}
        onDelete={onDelete}
      />,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toHaveAttribute("data-surface", "muted");
    expect(screen.getByText("· voice")).toBeInTheDocument();
    expect(screen.getByText("Platform Lead").closest("[data-slot=badge]")).toHaveAttribute("title", "Note left for Platform Lead");
    expect(screen.getByText(/Keen on the role/).className).toContain("whitespace-pre-wrap");
    const remove = screen.getByRole("button", { name: "Delete note" });
    expect(remove.className).toContain("group-hover");
    await user.click(remove);
    expect(onDelete).toHaveBeenCalledTimes(1);

    rerender(
      <CandidateNoteCard
        author="Assistant"
        kind="voice"
        labels={{ voice: null }}
        pinned={{ label: "Pinned for the client", title: "Edit this from sharing" }}
        revealDelete="always"
      />,
    );
    expect(card).toHaveAttribute("data-surface", "card");
    expect(screen.queryByText("· voice")).toBeNull();
    expect(screen.getByText("Pinned for the client")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("dictates through the host, and types a note that clears only once saved", async () => {
    const user = userEvent.setup();
    const onVoice = vi.fn();
    let settle: (() => void) | undefined;
    const onSubmit = vi.fn(() => new Promise<void>((resolve) => { settle = resolve; }));
    const { container } = render(
      <CandidateNoteComposer onVoice={onVoice} onSubmit={onSubmit} suggestions={["Worth a call", "Not now"]} />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-note-composer");

    await user.click(screen.getByRole("button", { name: "Tap to speak" }));
    expect(onVoice).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "or type instead" }));
    const field = screen.getByPlaceholderText("Type your note…");
    expect(field).toHaveFocus();
    const add = screen.getByRole("button", { name: "Add note" });
    expect(add).toBeDisabled();
    await user.type(field, "  Follow up in spring  ");
    await user.click(add);
    expect(onSubmit).toHaveBeenCalledWith("Follow up in spring");
    expect(screen.getByPlaceholderText("Type your note…")).toBeInTheDocument();
    settle?.();
    await waitFor(() => expect(screen.queryByPlaceholderText("Type your note…")).toBeNull());

    await user.click(screen.getByRole("button", { name: "Worth a call" }));
    expect(onSubmit).toHaveBeenLastCalledWith("Worth a call");
  });

  it("keeps the typed note when saving fails, and cancel discards it", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(() => Promise.reject(new Error("offline")));
    render(<CandidateNoteComposer onSubmit={onSubmit} />);

    // A host with no recorder opens directly for typing instead of a dead mic.
    expect(screen.queryByRole("button", { name: "Tap to speak" })).toBeNull();
    await user.type(screen.getByPlaceholderText("Type your note…"), "Call back");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Add note" })).toBeEnabled());
    expect(screen.getByPlaceholderText("Type your note…")).toHaveValue("Call back");

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByPlaceholderText("Type your note…")).toHaveValue("");
  });
});

describe("candidate facts, contact and definitions", () => {
  it("lists facts with capitalised labels, and renders nothing without any", () => {
    const { container, rerender } = render(
      <CandidateFactList facts={[{ id: 1, label: "spoken languages", value: formatFactValue(["English", "Welsh"]) }]} />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-fact-list");
    expect(screen.getByText("spoken languages").className).toContain("capitalize");
    expect(screen.getByText("English, Welsh")).toBeInTheDocument();

    rerender(<CandidateFactList facts={[]} />);
    expect(container.firstElementChild).toBeNull();
  });

  it("formats stored fact values for reading", () => {
    expect(formatFactValue(null)).toBe("—");
    expect(formatFactValue([])).toBe("—");
    expect(formatFactValue(42)).toBe("42");
    expect(formatFactValue({ amount: "£40k", sentiment: "positive" })).toBe("£40k");
    render(<p>{formatFactValue({ title: "Director", sector: "Example sector" })}</p>);
    expect(screen.getByText(/Director/).closest("p")?.textContent).toBe("Director · Example sector");
    render(<div>{formatFactValue([{ title: "CTO" }, { title: "COO", sector: { name: "Example" } }])}</div>);
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(["CTO", "COO · Example"]);
  });

  it("shows only the contact rows it is given", () => {
    const { container, rerender } = render(
      <CandidateContactDetails
        email="imogen@example.com"
        emailVerified
        phone="+44 7700 900123"
        profileUrl="https://example.com/in/imogen"
        location="Example City"
        labels={{ profile: "Network" }}
      />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-contact-details");
    expect(screen.getByRole("link", { name: /imogen@example.com/ })).toHaveAttribute("href", "mailto:imogen@example.com");
    expect(screen.getByLabelText("Email verified")).toBeInTheDocument();
    expect(screen.getByText("Network")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Profile/ })).toHaveAttribute("target", "_blank");
    expect(screen.getByText("Example City")).toBeInTheDocument();

    rerender(<CandidateContactDetails email="mei@example.com" />);
    expect(screen.queryByLabelText("Email verified")).toBeNull();
    expect(screen.queryByText("Phone")).toBeNull();
    expect(screen.queryByText("Location")).toBeNull();
  });

  it("logs the channels used, or says none is, above the host's control", () => {
    const empty = { title: "No outreach logged yet", description: "Log a channel below." };
    const { container, rerender } = render(
      <CandidateChannelLog
        title="Outreach for Platform Lead"
        entries={[{ id: "email", label: "Email", when: "yesterday" }]}
        empty={empty}
        control={<button type="button">Log a channel</button>}
      />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-channel-log");
    expect(screen.getByText("yesterday")).toBeInTheDocument();
    expect(screen.queryByText("No outreach logged yet")).toBeNull();

    rerender(<CandidateChannelLog title="Outreach" entries={[]} empty={empty} control={<button type="button">Log a channel</button>} />);
    expect(screen.getByText("No outreach logged yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log a channel" })).toBeInTheDocument();
  });

  it("drops empty values, and renders nothing when none is left", () => {
    const { container, rerender } = render(
      <CandidateDefinitionSection
        title="Details"
        items={[
          { id: "experience", label: "Experience", value: "6 years" },
          { id: "salary", label: "Salary", value: null },
        ]}
      />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-definition-section");
    expect(screen.getByText("6 years")).toBeInTheDocument();
    expect(screen.queryByText("Salary")).toBeNull();

    rerender(<CandidateDefinitionSection title="Details" items={[{ label: "Salary", value: "" }]} />);
    expect(container.firstElementChild).toBeNull();
  });
});

describe("candidate outreach composer", () => {
  const guidance = (overrides: Partial<CandidateOutreachGuidance> = {}): CandidateOutreachGuidance => ({
    text: "Short and friendly.",
    custom: true,
    editing: false,
    value: "",
    onEdit: vi.fn(),
    onChange: vi.fn(),
    onReset: vi.fn(),
    onSave: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  });
  const channels = [
    { value: "email", label: "email" },
    { value: "chat", label: "chat" },
  ];

  it("picks a channel, opens the guidance and drafts for that channel", async () => {
    const user = userEvent.setup();
    const onChannelChange = vi.fn();
    const onDraft = vi.fn();
    const shown = guidance();
    const { container } = render(
      <CandidateOutreachComposer
        channels={channels}
        channel="chat"
        onChannelChange={onChannelChange}
        guidance={shown}
        onDraft={onDraft}
        onCopy={vi.fn()}
        onEditDraft={vi.fn()}
        error="The draft could not be written."
      />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-outreach-composer");
    await user.click(screen.getByRole("button", { name: "email" }));
    expect(onChannelChange).toHaveBeenCalledWith("email");
    expect(screen.getByText("custom")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Short and friendly/ }));
    expect(shown.onEdit).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Draft chat message" }));
    expect(onDraft).toHaveBeenCalledTimes(1);
    expect(screen.getByText("The draft could not be written.")).toBeInTheDocument();
  });

  it("edits the guidance in place, and Save waits for somewhere to save", async () => {
    const user = userEvent.setup();
    const editing = guidance({ editing: true, value: "Warm", canSave: false });
    const { rerender } = render(
      <CandidateOutreachComposer channels={channels} channel="email" onChannelChange={vi.fn()} guidance={editing} onDraft={vi.fn()} onCopy={vi.fn()} onEditDraft={vi.fn()} />,
    );
    expect(screen.getByText("email tone").className).toContain("uppercase");
    expect(screen.getByRole("textbox")).toHaveFocus();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Reset default" }));
    expect(editing.onReset).toHaveBeenCalledTimes(1);

    const saving = guidance({ editing: true, value: "Warm", saving: true });
    rerender(
      <CandidateOutreachComposer channels={channels} channel="email" onChannelChange={vi.fn()} guidance={saving} onDraft={vi.fn()} onCopy={vi.fn()} onEditDraft={vi.fn()} />,
    );
    expect(screen.queryByRole("button", { name: "Save" })).toBeNull();
    expect(document.querySelector("[data-slot=candidate-outreach-composer] .animate-spin")).not.toBeNull();
  });

  it("shows the editable draft with its subject and tone, and copies it", async () => {
    const user = userEvent.setup();
    const onEditDraft = vi.fn();
    const onCopy = vi.fn();
    const { rerender } = render(
      <CandidateOutreachComposer
        channels={channels}
        channel="email"
        onChannelChange={vi.fn()}
        guidance={guidance()}
        draft={{ subject: "A platform role", message: "Hi Imogen", tone: "warm" }}
        onDraft={vi.fn()}
        onCopy={onCopy}
        onEditDraft={onEditDraft}
      />,
    );
    expect(screen.getByText("A platform role")).toBeInTheDocument();
    expect(screen.getByText("Tone: warm")).toBeInTheDocument();
    await user.type(screen.getByDisplayValue("Hi Imogen"), "!");
    expect(onEditDraft).toHaveBeenLastCalledWith("Hi Imogen!");
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(onCopy).toHaveBeenCalledTimes(1);

    rerender(
      <CandidateOutreachComposer channels={channels} channel="chat" onChannelChange={vi.fn()} guidance={guidance()} draft={{ message: "Hi" }} copied onDraft={vi.fn()} onCopy={onCopy} onEditDraft={onEditDraft} />,
    );
    expect(screen.queryByText("Subject:", { exact: false })).toBeNull();
    expect(screen.queryByText(/Tone:/)).toBeNull();
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
  });
});

describe("candidate pipeline list", () => {
  const stages = [
    { value: "sourced", label: "Sourced" },
    { value: "screened", label: "Screened" },
  ];

  it("shows a skeleton, the empty state, or counted rows that open their role", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const empty = { title: "Not on any roles yet", description: "Add them to a role to start." };
    const { container, rerender } = render(<CandidatePipelineList rows={[]} loading empty={empty} />);
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-pipeline-list");
    expect(screen.queryByText("Not on any roles yet")).toBeNull();

    rerender(<CandidatePipelineList rows={[]} empty={empty} action={<button type="button">Add to role</button>} />);
    expect(screen.getByText("Not on any roles yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to role" })).toBeInTheDocument();

    rerender(
      <CandidatePipelineList
        empty={empty}
        labels={{ open: "Open role" }}
        rows={[
          {
            id: 1,
            title: "Platform Lead",
            grade: <span>A</span>,
            subtitle: "Fernhill Example Co",
            onOpen,
            stage: { value: "sourced", options: stages, onChange: vi.fn() },
            children: <p>Evidence</p>,
          },
        ]}
      />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Evidence")).toBeInTheDocument();
    expect(container.querySelector("[data-slot=candidate-stage-select]")).toHaveTextContent("Sourced");
    await user.click(screen.getByTitle("Open role"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("says each line's sentiment to a screen reader, not only with the dot's colour", () => {
    const { rerender } = render(
      <CandidateSummaryBullets
        bullets={[
          { text: "Fictional promotion last spring", sentiment: "positive" },
          { text: "Example tenure under a year", sentiment: "warning" },
          { text: "Fictional gap in the record", sentiment: "negative" },
          { text: "Example note", sentiment: "neutral" },
        ]}
      />,
    );
    const lines = screen.getAllByRole("listitem");
    expect(lines.map((line) => line.textContent)).toEqual([
      "Positive: Fictional promotion last spring",
      "Caution: Example tenure under a year",
      "Negative: Fictional gap in the record",
      "Neutral: Example note",
    ]);
    for (const line of lines) {
      // Standalone pipeline summaries retain their compact text treatment.
      expect(line).toHaveClass("text-xs", "text-foreground/80");
      // The word is visually hidden and sits beside the text, which keeps its own element.
      expect(line.querySelector('[data-slot="candidate-summary-bullet-sentiment"]')).toHaveClass("sr-only");
      expect(line.firstElementChild).toHaveAttribute("aria-hidden", "true");
    }
    expect(screen.getByText("Fictional promotion last spring")).toBeInTheDocument();

    rerender(
      <CandidateSummaryBullets
        labels={{ sentiment: { negative: "Risk" } }}
        bullets={[
          { text: "Fictional gap in the record", sentiment: "negative" },
          { text: "Example tenure under a year", sentiment: "warning" },
          { text: "Fictional promotion last spring", sentiment: "positive", sentimentLabel: "Green" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem").map((line) => line.textContent)).toEqual([
      "Risk: Fictional gap in the record",
      "Caution: Example tenure under a year",
      "Green: Fictional promotion last spring",
    ]);
  });

  it("generates a summary, then offers to refresh it, and shows why it failed", async () => {
    const user = userEvent.setup();
    const onGenerate = vi.fn();
    const { container, rerender } = render(
      <CandidateSummaryBullets
        bullets={[{ text: "Built a team from scratch", sentiment: "positive" }, { text: "Long notice period", sentiment: "warning" }]}
        onGenerate={onGenerate}
      />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-summary-bullets");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Generate summary" }));
    expect(onGenerate).toHaveBeenCalledTimes(1);

    rerender(<CandidateSummaryBullets bullets={[]} onGenerate={onGenerate} generated />);
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByRole("button", { name: "Refresh summary" })).toBeInTheDocument();

    rerender(<CandidateSummaryBullets bullets={[]} onGenerate={onGenerate} generating error="Try again later." />);
    expect(screen.getByRole("button", { name: "Generating…" })).toBeDisabled();
    expect(screen.getByText("Try again later.")).toBeInTheDocument();

    rerender(<CandidateSummaryBullets bullets={[]} />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
