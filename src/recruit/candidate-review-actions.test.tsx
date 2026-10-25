import { act, fireEvent, render, renderHook, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mail } from "lucide-react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CandidateDecisionButtons } from "./candidate-decision-buttons";
import { CandidateDecisionReasonDialog } from "./candidate-decision-reason-dialog";
import { CandidateHeaderActions, CandidateIconAction } from "./candidate-header-actions";
import { CandidatePendingNote } from "./candidate-pending-note";
import { CandidateQuote } from "./candidate-quote";
import { CandidateReviewActionRow } from "./candidate-review-action-row";
import { CandidateReviewCard } from "./candidate-review-card";
import { CandidateSelectableAvatar } from "./candidate-selectable-avatar";
import { CandidateStageActions } from "./candidate-stage-actions";
import { CandidateStageSelect } from "./candidate-stage-select";
import { useCandidateVoiceNote } from "./candidate-voice-note";

const STAGES = [
  { value: "screened", label: "Screened" },
  { value: "shortlisted", label: "Shortlisted" },
] as const;

describe("candidate decision buttons", () => {
  it("keeps Yes and No as equal neutral choices", () => {
    render(<CandidateDecisionButtons onChoose={vi.fn()} />);

    const yes = screen.getByRole("button", { name: "Yes" });
    const no = screen.getByRole("button", { name: "No" });
    for (const button of [yes, no]) {
      expect(button).toHaveAttribute("data-variant", "outline");
      expect(button.className).toContain("border-input");
      expect(button.className).not.toContain("bg-primary");
      expect(button.className).not.toContain("bg-destructive");
      expect(button.className).not.toContain("text-destructive");
    }
    expect(yes.closest("[data-slot='candidate-decision-buttons']")).toBe(no.parentElement);
  });

  it("reports the choice without selecting the card, and keeps the host's sheet inside the group", async () => {
    const user = userEvent.setup();
    const onChoose = vi.fn();
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateDecisionButtons onChoose={onChoose} labels={{ yes: "Advance", no: "Pass" }}>
          <button type="button">Host sheet</button>
        </CandidateDecisionButtons>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Advance" }));
    await user.click(screen.getByRole("button", { name: "Pass" }));
    await user.click(screen.getByRole("button", { name: "Host sheet" }));
    expect(onChoose.mock.calls).toEqual([["yes"], ["no"]]);
    expect(onCard).not.toHaveBeenCalled();
  });

  it("stretches both buttons across an action bar", () => {
    render(<CandidateDecisionButtons onChoose={vi.fn()} stretch size="default" />);
    const group = screen.getByRole("button", { name: "Yes" }).parentElement!;
    expect(group.className).toContain("flex-1");
    for (const name of ["Yes", "No"]) {
      const button = screen.getByRole("button", { name });
      expect(button.className).toContain("flex-1");
      expect(button).toHaveAttribute("data-size", "default");
    }
  });
});

describe("candidate review action row", () => {
  it("lets a gap click open the card unless the row isolates its clicks", async () => {
    const user = userEvent.setup();
    const onCard = vi.fn();
    const { container, rerender } = render(
      <div onClick={onCard}>
        <CandidateReviewActionRow>
          <span>Fictional control</span>
        </CandidateReviewActionRow>
      </div>,
    );
    const row = container.querySelector("[data-slot='candidate-review-action-row']")!;
    expect(row.tagName).toBe("SECTION");
    await user.click(screen.getByText("Fictional control"));
    expect(onCard).toHaveBeenCalledTimes(1);

    rerender(
      <div onClick={onCard}>
        <CandidateReviewActionRow isolateClicks>
          <span>Fictional control</span>
        </CandidateReviewActionRow>
      </div>,
    );
    await user.click(screen.getByText("Fictional control"));
    expect(onCard).toHaveBeenCalledTimes(1);
  });

  it("packs inline controls at the host's gap, or splits a pair without a keyline", () => {
    const { container, rerender } = render(
      <CandidateReviewActionRow gap="xs">
        <button type="button">Copy link</button>
        <button type="button">Open link</button>
      </CandidateReviewActionRow>,
    );
    const inner = () => container.querySelector("[data-slot='candidate-review-action-row']")!.firstElementChild!;
    expect(inner().className).toContain("gap-1");
    expect(inner().className).toContain("border-t");

    rerender(
      <CandidateReviewActionRow>
        <button type="button">Copy link</button>
      </CandidateReviewActionRow>,
    );
    expect(inner().className).toContain("gap-2");

    rerender(
      <CandidateReviewActionRow layout="split">
        <button type="button">Remove</button>
        <button type="button">Include</button>
      </CandidateReviewActionRow>,
    );
    expect(inner().className).toContain("grid-cols-2");
    expect(inner().className).toContain("sm:flex");
    expect(inner().className).not.toContain("border-t");
    expect(inner().children).toHaveLength(2);
  });

  it("isolates clicks in the split layout too", async () => {
    const user = userEvent.setup();
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateReviewActionRow layout="split" isolateClicks>
          <span>Remove</span>
          <span>Include</span>
        </CandidateReviewActionRow>
      </div>,
    );
    await user.click(screen.getByText("Include"));
    expect(onCard).not.toHaveBeenCalled();
  });

  it("draws the keyline once inside a review card's action slot", () => {
    const { container } = render(
      <CandidateReviewCard
        name="Fictional Person"
        actions={
          <CandidateReviewActionRow>
            <CandidateDecisionButtons onChoose={vi.fn()} />
          </CandidateReviewActionRow>
        }
      />,
    );
    const row = container.querySelector("[data-slot='candidate-review-action-row']")!;
    expect(row.firstElementChild?.className).toContain("border-t");
    expect(container.querySelectorAll(".border-t")).toHaveLength(1);
  });
});

describe("candidate stage actions", () => {
  it("advances with the split button and jumps ahead from its menu", async () => {
    const user = userEvent.setup();
    const onAdvance = vi.fn();
    const onMove = vi.fn();
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateStageActions
          advance={{ label: "Mark contacted", outline: true, onAdvance }}
          moveOptions={STAGES}
          onMove={onMove}
        />
      </div>,
    );

    const primary = screen.getByRole("button", { name: "Mark contacted" });
    expect(primary).toHaveAttribute("data-variant", "outline");
    await user.click(primary);
    expect(onAdvance).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Move to…" }));
    await user.click(await screen.findByRole("menuitem", { name: "Move to Shortlisted" }));
    expect(onMove).toHaveBeenCalledWith("shortlisted");
    expect(onCard).not.toHaveBeenCalled();
  });

  it("offers a plain advance without move options, and a move menu without an advance", async () => {
    const user = userEvent.setup();
    const onAdvance = vi.fn();
    const onMove = vi.fn();
    const onCard = vi.fn();
    const { rerender } = render(
      <div onClick={onCard}>
        <CandidateStageActions advance={{ label: "Shortlist", onAdvance }} />
      </div>,
    );
    const advance = screen.getByRole("button", { name: "Shortlist" });
    expect(advance).toHaveAttribute("data-variant", "default");
    expect(screen.queryByRole("button", { name: "Move to…" })).toBeNull();
    await user.click(advance);
    expect(onAdvance).toHaveBeenCalledTimes(1);

    rerender(
      <div onClick={onCard}>
        <CandidateStageActions moveOptions={STAGES} onMove={onMove} labels={{ moveTo: (label) => <>Send to {label}</> }} />
      </div>,
    );
    const trigger = screen.getByRole("button", { name: "Move to" });
    expect(trigger).toHaveAttribute("title", "Move to…");
    await user.click(trigger);
    const menu = await screen.findByRole("menu");
    expect(menu).toHaveAttribute("data-slot", "candidate-stage-menu");
    await user.click(within(menu).getByRole("menuitem", { name: "Send to Screened" }));
    expect(onMove).toHaveBeenCalledWith("screened");
    expect(onCard).not.toHaveBeenCalled();
  });

  it("requests present, reject and declined without opening the card", async () => {
    const user = userEvent.setup();
    const onPresent = vi.fn();
    const onRequestReject = vi.fn();
    const onRequestDecline = vi.fn();
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateStageActions
          contact={<span>Contact slot</span>}
          onPresent={onPresent}
          onRequestReject={onRequestReject}
          onRequestDecline={onRequestDecline}
        />
      </div>,
    );

    expect(screen.getByText("Contact slot")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Present to client" }));
    const reject = screen.getByRole("button", { name: "Reject" });
    expect(reject).toHaveAttribute("title", "Reject — move to rejected");
    expect(reject).toHaveAttribute("data-variant", "ghost-destructive");
    await user.click(reject);
    await user.click(screen.getByRole("button", { name: "Declined" }));
    expect(onPresent).toHaveBeenCalledTimes(1);
    expect(onRequestReject).toHaveBeenCalledTimes(1);
    expect(onRequestDecline).toHaveBeenCalledTimes(1);
    expect(onCard).not.toHaveBeenCalled();
  });

  it("renders nothing it has no callback for", () => {
    const { container } = render(<CandidateStageActions />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("candidate stage select", () => {
  beforeEach(() => {
    // Radix Select scrolls the selected item into view and captures the pointer.
    Element.prototype.scrollIntoView = vi.fn();
    Element.prototype.hasPointerCapture = vi.fn(() => false);
    Element.prototype.releasePointerCapture = vi.fn();
  });

  it("shows the current stage and reports a move", async () => {
    const onChange = vi.fn();
    render(
      <CandidateStageSelect
        value="screened"
        options={STAGES}
        onChange={onChange}
        controlSize="sm"
        textSize="xs"
        title="Move stage"
      />,
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("data-slot", "candidate-stage-select");
    expect(trigger).toHaveAttribute("title", "Move stage");
    expect(trigger).toHaveTextContent("Screened");

    fireEvent.keyDown(trigger, { key: "Enter" });
    const option = await screen.findByRole("option", { name: "Shortlisted" });
    expect(option.className).toContain("text-xs");
    fireEvent.keyDown(option, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("shortlisted");
  });
});

describe("candidate selectable avatar", () => {
  it("toggles selection without opening the card", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onCard = vi.fn();
    const { container, rerender } = render(
      <div onClick={onCard}>
        <CandidateSelectableAvatar selected={false} onToggle={onToggle} label="Select Fictional Person">
          <span>FP</span>
        </CandidateSelectableAvatar>
      </div>,
    );

    const toggle = screen.getByRole("button", { name: "Select Fictional Person" });
    expect(toggle).toHaveAttribute("data-slot", "candidate-selectable-avatar");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveAttribute("title", "Select");
    await user.click(toggle);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onCard).not.toHaveBeenCalled();
    expect(toggle.querySelector("svg")).toBeNull();

    rerender(
      <div onClick={onCard}>
        <CandidateSelectableAvatar selected onToggle={onToggle} label="Select Fictional Person">
          <span>FP</span>
        </CandidateSelectableAvatar>
      </div>,
    );
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("title", "Deselect");
    // The kit's selection overlay draws a check over the avatar.
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

describe("candidate header actions", () => {
  it("runs an icon action without opening the card and keeps the kit's slot", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateHeaderActions>
          <CandidateIconAction icon={Mail} title="Email Fictional Person" onClick={onClick} />
        </CandidateHeaderActions>
      </div>,
    );

    const button = screen.getByRole("button", { name: "Email Fictional Person" });
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveAttribute("data-variant", "quiet");
    expect(button.parentElement).toHaveAttribute("data-slot", "candidate-header-actions");
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onCard).not.toHaveBeenCalled();
  });
});

describe("candidate voice note", () => {
  const instances: FakeRecognition[] = [];
  class FakeRecognition {
    continuous = false;
    interimResults = false;
    lang = "";
    onresult: ((event: unknown) => void) | null = null;
    onerror: (() => void) | null = null;
    onend: (() => void) | null = null;
    constructor() {
      instances.push(this);
    }
    start() {}
    stop() {}
    abort() {}
  }

  afterEach(() => {
    instances.length = 0;
    delete (window as { SpeechRecognition?: unknown }).SpeechRecognition;
  });

  function Card({ onCommit, onCard }: { onCommit: (text: string) => void; onCard: () => void }) {
    const voice = useCandidateVoiceNote({ onCommit, title: "Leave a note on Fictional Person" });
    return (
      <div onClick={onCard}>
        <CandidateHeaderActions>{voice.trigger}</CandidateHeaderActions>
        {voice.control}
      </div>
    );
  }

  it("opens dictation from the trigger and commits the transcript", async () => {
    (window as { SpeechRecognition?: unknown }).SpeechRecognition = FakeRecognition;
    const user = userEvent.setup();
    const onCommit = vi.fn();
    const onCard = vi.fn();
    render(<Card onCommit={onCommit} onCard={onCard} />);

    // The control mounts once speech recognition is detected.
    await screen.findByRole("button", { name: "Start dictation", hidden: true });
    await user.click(screen.getByRole("button", { name: "Leave a note on Fictional Person" }));
    const overlay = await screen.findByRole("dialog", { name: "Voice dictation" });
    expect(instances).toHaveLength(1);

    const final = Object.assign([{ transcript: "Strong fit for the fictional role" }], { isFinal: true });
    act(() => instances[0]!.onresult?.({ resultIndex: 0, results: [final] }));
    await user.click(within(overlay).getByRole("button", { name: /done/i }));

    expect(onCommit).toHaveBeenCalledWith("Strong fit for the fictional role");
    expect(onCard).not.toHaveBeenCalled();
  });

  it("renders no control where the browser has no speech recognition", () => {
    const { result } = renderHook(() => useCandidateVoiceNote({ onCommit: vi.fn() }));
    const { container } = render(<>{result.current.control}</>);
    expect(container.querySelector("button")).toBeNull();
    // Opening with nothing mounted is a no-op rather than an error.
    expect(() => result.current.open()).not.toThrow();
  });
});

describe("candidate pending note", () => {
  it("quotes the fresh note and shows the assistant thinking, then its reply", () => {
    const { container, rerender } = render(
      <CandidatePendingNote
        text="Prefers a hybrid role"
        timeLabel="just now"
        agent={{ name: "Assistant", thinking: true }}
      />,
    );
    const root = container.querySelector("[data-slot='candidate-pending-note']")!;
    expect(root).toHaveTextContent("“Prefers a hybrid role”— just now");
    expect(root).toHaveTextContent("Assistant");

    rerender(
      <CandidatePendingNote
        text="Prefers a hybrid role"
        timeLabel="just now"
        agent={{ name: "Assistant", message: "Noted. No decision to suggest." }}
      />,
    );
    expect(screen.getByText("Noted. No decision to suggest.")).toBeInTheDocument();

    rerender(<CandidatePendingNote text="Prefers a hybrid role" timeLabel="just now" />);
    expect(screen.queryByText("Assistant")).toBeNull();
  });
});

describe("candidate quote collapsible", () => {
  const collapsible = { lines: 3, threshold: 40, moreLabel: "Show more", lessLabel: "Show less" } as const;

  it("clamps a long excerpt and toggles it without opening the card", async () => {
    const user = userEvent.setup();
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateQuote attribution="call" collapsible={collapsible}>
          A fictional call summary that runs well past the forty character threshold.
        </CandidateQuote>
      </div>,
    );

    const text = screen.getByText(/fictional call summary/);
    expect(text.className).toContain("line-clamp-3");
    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(text.className).not.toContain("line-clamp");
    await user.click(screen.getByRole("button", { name: "Show less" }));
    expect(text.className).toContain("line-clamp-3");
    expect(onCard).not.toHaveBeenCalled();
  });

  it("offers no toggle for a short string, but keeps the clamp", () => {
    render(
      <CandidateQuote attribution="note" collapsible={collapsible} action={<button type="button">Host action</button>}>
        Short fictional note.
      </CandidateQuote>,
    );
    expect(screen.getByText(/Short fictional note/).className).toContain("line-clamp-3");
    expect(screen.queryByRole("button", { name: "Show more" })).toBeNull();
    expect(screen.getByRole("button", { name: "Host action" })).toBeInTheDocument();
  });

  it("always offers the toggle beside the host action for rich content", () => {
    render(
      <CandidateQuote collapsible={collapsible} action={<button type="button">Host action</button>}>
        <strong>Rich</strong> fictional note
      </CandidateQuote>,
    );
    const buttons = screen.getAllByRole("button").map((button) => button.textContent);
    expect(buttons).toEqual(["Host action", "Show more"]);
  });
});

describe("candidate decision reason dialog", () => {
  function renderDialog(overrides: Partial<Parameters<typeof CandidateDecisionReasonDialog>[0]> = {}) {
    const onSubmit = vi.fn<(reason: string) => Promise<void>>(() => Promise.resolve());
    const onClose = vi.fn();
    const props = {
      open: true,
      title: "Reject: Fictional Person",
      suggestions: ["Outside salary band", "Too senior"],
      placeholder: "e.g. A fictional reason",
      confirmLabel: "Reject",
      confirmTone: "destructive" as const,
      onSubmit,
      onClose,
      ...overrides,
    };
    const view = render(<CandidateDecisionReasonDialog {...props} />);
    return { ...view, props, onSubmit, onClose };
  }

  it("requires a reason, builds one from suggestions and submits it trimmed", async () => {
    const user = userEvent.setup();
    let settle: () => void = () => undefined;
    const onSubmit = vi.fn(() => new Promise<void>((resolve) => { settle = resolve; }));
    renderDialog({ onSubmit, id: "fictional-reason" });

    expect(screen.getByRole("heading", { name: "Reject: Fictional Person" })).toBeInTheDocument();
    const confirm = screen.getByRole("button", { name: "Reject" });
    expect(confirm).toHaveAttribute("data-variant", "destructive");
    expect(confirm).toBeDisabled();

    const field = screen.getByLabelText("Why?");
    expect(field).toHaveAttribute("id", "fictional-reason");
    expect(field).toHaveAttribute("placeholder", "e.g. A fictional reason");
    await user.click(screen.getByText("Outside salary band"));
    await user.click(screen.getByText("Too senior"));
    expect(field).toHaveValue("Outside salary band · Too senior");
    await user.type(field, "  ");

    await user.click(confirm);
    expect(onSubmit).toHaveBeenCalledWith("Outside salary band · Too senior");
    expect(confirm).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    await act(async () => settle());
    await waitFor(() => expect(screen.getByRole("button", { name: "Cancel" })).toBeEnabled());
  });

  it("closes from cancel and starts empty when reopened", async () => {
    const user = userEvent.setup();
    const { props, rerender, onClose } = renderDialog({ suggestions: [] });
    expect(screen.queryByText("Tap a signal to use it as the reason")).toBeNull();
    // A generated id still ties the label to the field.
    await user.type(screen.getByLabelText("Why?"), "Draft reason");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(<CandidateDecisionReasonDialog {...props} suggestions={[]} open={false} />);
    rerender(<CandidateDecisionReasonDialog {...props} suggestions={[]} open />);
    expect(screen.getByLabelText("Why?")).toHaveValue("");
  });
});
