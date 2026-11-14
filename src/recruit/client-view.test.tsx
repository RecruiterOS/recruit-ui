import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CandidateClientDecision } from "./candidate-client-decision";
import { JobSearchProgress } from "./job-search-progress";

describe("job search progress", () => {
  const steps = [
    { id: "brief", title: "Brief", state: "done" as const, description: "Fictional brief received." },
    {
      id: "intake",
      title: "Intake call",
      state: "current" as const,
      meta: "30 minutes",
      action: <a href="#book">Book the call</a>,
    },
    { id: "shortlist", title: "Shortlist", state: "upcoming" as const },
  ];

  it("lists the steps in order, each with its state in words, and marks the current one", () => {
    const { container } = render(<JobSearchProgress steps={steps} id="example-progress" />);

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "job-search-progress");
    expect(root).toHaveAttribute("id", "example-progress");

    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.getAttribute("data-state"))).toEqual(["done", "current", "upcoming"]);
    expect(items[0]).toHaveTextContent("Done: Brief");
    expect(items[1]).toHaveTextContent("In progress: Intake call");
    expect(items[2]).toHaveTextContent("Not started: Shortlist");

    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(within(items[1]!).getByRole("link", { name: "Book the call" })).toBeInTheDocument();
    expect(within(items[1]!).getByText("30 minutes")).toBeInTheDocument();
    expect(within(items[0]!).getByText("Fictional brief received.")).toBeInTheDocument();
  });

  it("words each state as the host asks", () => {
    render(<JobSearchProgress steps={steps} labels={{ current: "Now" }} />);
    expect(screen.getAllByRole("listitem")[1]).toHaveTextContent("Now: Intake call");
  });
});

describe("candidate client decision", () => {
  it("asks why before it calls the host, and saves nothing on cancel", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} />);

    await user.click(screen.getByRole("button", { name: "Yes" }));
    const dialog = screen.getByRole("dialog", { name: "Yes to Mei Tanaka" });
    expect(onDecide).not.toHaveBeenCalled();
    // The reason is required.
    expect(within(dialog).getByRole("button", { name: "Save Yes" })).toBeDisabled();

    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onDecide).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "No" }));
    const no = screen.getByRole("dialog", { name: "No to Mei Tanaka" });
    await user.type(within(no).getByRole("textbox"), "  Fictional reason  ");
    await user.click(within(no).getByRole("button", { name: "Save No" }));

    expect(onDecide).toHaveBeenCalledWith("no", "Fictional reason");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("offers each answer's own one-tap reasons", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(
      <CandidateClientDecision
        candidateName="Mei Tanaka"
        onDecide={onDecide}
        suggestions={{ yes: ["Right level"], no: ["Too junior"] }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Yes" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).queryByText("Too junior")).toBeNull();
    await user.click(within(dialog).getByText("Right level"));
    await user.click(within(dialog).getByRole("button", { name: "Save Yes" }));
    expect(onDecide).toHaveBeenCalledWith("yes", "Right level");
  });

  it("shows a recorded answer in words with its reason, and Change asks again", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const { container } = render(
      <CandidateClientDecision
        candidateName="Mei Tanaka"
        decision="yes"
        reason="Fictional reason"
        onDecide={onDecide}
      />,
    );

    const root = container.querySelector("[data-slot=candidate-client-decision]")!;
    expect(root).toHaveAttribute("data-decision", "yes");
    expect(screen.getByText("You said Yes")).toBeInTheDocument();
    expect(screen.getByText("Fictional reason")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Yes" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Change" }));
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument();
  });

  it("brings the buttons back with an error when the save fails", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockRejectedValue(new Error("offline"));
    render(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} />);

    await user.click(screen.getByRole("button", { name: "Yes" }));
    const dialog = screen.getByRole("dialog");
    await user.type(within(dialog).getByRole("textbox"), "Fictional reason");
    await user.click(within(dialog).getByRole("button", { name: "Save Yes" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("That didn't save. Try again.");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
  });

  it("never stays on an error once the host records the answer", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(undefined);
    const { rerender } = render(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} />);

    for (const _ of [0, 1]) {
      await user.click(screen.getByRole("button", { name: "No" }));
      const dialog = screen.getByRole("dialog");
      await user.type(within(dialog).getByRole("textbox"), "Fictional reason");
      await user.click(within(dialog).getByRole("button", { name: "Save No" }));
    }
    rerender(<CandidateClientDecision candidateName="Mei Tanaka" decision="no" reason="Fictional reason" onDecide={onDecide} />);

    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText("You said No")).toBeInTheDocument();
  });

  it("still asks why, and saves with no reason, where the reason is optional", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(
      <CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} reasonOptional />,
    );

    await user.click(screen.getByRole("button", { name: "Yes" }));
    const dialog = screen.getByRole("dialog", { name: "Yes to Mei Tanaka" });
    // The field says it can be left empty, and tells a screen reader so.
    const field = within(dialog).getByLabelText("Why? (optional)");
    expect(field).toHaveAttribute("aria-required", "false");
    expect(onDecide).not.toHaveBeenCalled();
    await user.click(within(dialog).getByRole("button", { name: "Save Yes" }));

    expect(onDecide.mock.calls).toEqual([["yes", ""]]);
    expect(screen.queryByRole("dialog")).toBeNull();

    // A reason given is still handed over, trimmed.
    await user.click(screen.getByRole("button", { name: "No" }));
    await user.type(within(screen.getByRole("dialog")).getByRole("textbox"), "  Fictional reason  ");
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Save No" }));
    expect(onDecide.mock.calls[1]).toEqual(["no", "Fictional reason"]);

    // An answer recorded without a reason shows without one.
    rerender(<CandidateClientDecision candidateName="Mei Tanaka" decision="yes" reason="" onDecide={onDecide} reasonOptional />);
    expect(screen.getByText("You said Yes").closest("[data-slot=candidate-client-decision]")).toHaveTextContent(/^You said YesChange$/);
  });

  it("words the reason field as the host asks, optional or not", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(
      <CandidateClientDecision
        candidateName="Mei Tanaka"
        onDecide={onDecide}
        reasonOptional
        labels={{ reason: "Anything to add?" }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "No" }));
    expect(within(screen.getByRole("dialog")).getByLabelText("Anything to add?")).toBeInTheDocument();
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Cancel" }));

    // Without the mode, nothing has changed: the reason is required and asked for plainly.
    rerender(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} />);
    await user.click(screen.getByRole("button", { name: "No" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByLabelText("Why?")).toHaveAttribute("aria-required", "true");
    expect(within(dialog).getByRole("button", { name: "Save No" })).toBeDisabled();
    expect(onDecide).not.toHaveBeenCalled();
  });

  it("shows the answer and takes none where it is only read", () => {
    const onDecide = vi.fn();
    const { container, rerender } = render(
      <CandidateClientDecision
        candidateName="Mei Tanaka"
        decision="no"
        reason="Fictional reason"
        onDecide={onDecide}
        readOnly
      />,
    );

    const root = container.querySelector("[data-slot=candidate-client-decision]")!;
    expect(root).toHaveAttribute("data-decision", "no");
    expect(root).toHaveAttribute("data-read-only", "true");
    // In the third person: the reader isn't the client.
    expect(screen.getByText("Said No")).toBeInTheDocument();
    expect(screen.getByText("Fictional reason")).toBeInTheDocument();
    expect(screen.queryByText("You said No")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();

    rerender(<CandidateClientDecision candidateName="Mei Tanaka" decision="yes" onDecide={onDecide} readOnly />);
    expect(screen.getByText("Said Yes")).toBeInTheDocument();

    // No answer yet: that is said, and there is still nothing to press.
    rerender(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} readOnly />);
    expect(container.querySelector("[data-slot=candidate-client-decision]")).toHaveAttribute("data-decision", "none");
    expect(screen.getByText("No answer yet")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();

    rerender(
      <CandidateClientDecision
        candidateName="Mei Tanaka"
        onDecide={onDecide}
        readOnly
        labels={{ unanswered: "Waiting on the client", readOnlyYes: "The client said Yes" }}
      />,
    );
    expect(screen.getByText("Waiting on the client")).toBeInTheDocument();
    rerender(
      <CandidateClientDecision
        candidateName="Mei Tanaka"
        decision="yes"
        onDecide={onDecide}
        readOnly
        labels={{ unanswered: "Waiting on the client", readOnlyYes: "The client said Yes" }}
      />,
    );
    expect(screen.getByText("The client said Yes")).toBeInTheDocument();
    expect(onDecide).not.toHaveBeenCalled();
  });

  it("marks no row read-only unless asked", () => {
    const { container } = render(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={vi.fn()} />);
    expect(container.querySelector("[data-slot=candidate-client-decision]")).not.toHaveAttribute("data-read-only");
  });

  it("holds its controls without hiding them where the host says to", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} disabled />);

    for (const name of ["Yes", "No"]) expect(screen.getByRole("button", { name })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    // A recorded answer still shows, and can't be changed for now.
    rerender(<CandidateClientDecision candidateName="Mei Tanaka" decision="yes" onDecide={onDecide} disabled />);
    expect(screen.getByText("You said Yes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change" })).toBeDisabled();

    rerender(<CandidateClientDecision candidateName="Mei Tanaka" decision="yes" onDecide={onDecide} />);
    expect(screen.getByRole("button", { name: "Change" })).toBeEnabled();
    expect(onDecide).not.toHaveBeenCalled();
  });

  it("holds the buttons while a save is on its way with the dialog closed, and says if it then fails", async () => {
    const user = userEvent.setup();
    let fail: (cause: Error) => void = () => undefined;
    const onDecide = vi.fn(() => new Promise<void>((_resolve, reject) => { fail = reject; }));
    render(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} reasonOptional />);

    await user.click(screen.getByRole("button", { name: "No" }));
    await user.click(screen.getByRole("button", { name: "Save No" }));
    // Escape still closes a dialog whose save is slow.
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    // A second answer can't be started on top of the first.
    for (const name of ["Yes", "No"]) expect(screen.getByRole("button", { name })).toBeDisabled();

    await act(async () => fail(new Error("offline")));
    expect(screen.getByRole("alert")).toHaveTextContent("That didn't save. Try again.");
    for (const name of ["Yes", "No"]) expect(screen.getByRole("button", { name })).toBeEnabled();
    expect(onDecide).toHaveBeenCalledTimes(1);
  });

  it("drops a reason being asked for when the host holds the row", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} />);

    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(screen.getByRole("dialog", { name: "Yes to Mei Tanaka" })).toBeInTheDocument();

    rerender(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} disabled />);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(onDecide).not.toHaveBeenCalled();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("is a review card's inset row under a keyline, or sits flush where a container pads it", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const onCard = vi.fn();
    const { container, rerender } = render(<CandidateClientDecision candidateName="Mei Tanaka" onDecide={onDecide} />);

    const root = () => container.querySelector("[data-slot=candidate-client-decision]") as HTMLElement;
    const padded = /(^|\s)p[xytb]?-/;
    // The action row: inset, with its controls under a rule.
    expect(root().tagName).toBe("SECTION");
    expect(root().className).toMatch(padded);
    expect(root().querySelector("[data-slot=candidate-review-action-row-controls]")).toHaveClass("border-t");

    rerender(
      <div onClick={onCard}>
        <CandidateClientDecision
          candidateName="Mei Tanaka"
          decision="no"
          reason="Fictional reason"
          onDecide={onDecide}
          padding="none"
        />
      </div>,
    );
    // Flush: the same marks on a plain row, with no inset and no rule.
    expect(root()).toHaveAttribute("data-decision", "no");
    expect(root().className).not.toMatch(padded);
    expect(root().className).not.toContain("border-t");
    expect(container.querySelector("[data-slot=candidate-review-action-row-controls]")).toBeNull();
    expect(screen.getByText("You said No")).toBeInTheDocument();
    expect(screen.getByText("Fictional reason")).toBeInTheDocument();

    // It asks and saves as the row does, and still keeps its clicks from a card.
    await user.click(screen.getByRole("button", { name: "Change" }));
    await user.click(screen.getByRole("button", { name: "Yes" }));
    await user.type(within(screen.getByRole("dialog", { name: "Yes to Mei Tanaka" })).getByRole("textbox"), "Fictional reason");
    await user.click(screen.getByRole("button", { name: "Save Yes" }));
    expect(onDecide.mock.calls).toEqual([["yes", "Fictional reason"]]);
    expect(onCard).not.toHaveBeenCalled();
  });
});
