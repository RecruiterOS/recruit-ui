import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CandidateAddToJobPopover } from "./candidate-add-to-job-popover";

// Fictional roles, organisations and assessors only.

const JOBS = [
  { value: "j1", label: "Fernhill Example Co — Platform lead" },
  { value: "j2", label: "Harbourline Example Ltd — Data engineer" },
];

const STAGES = [
  { value: "new", label: "New" },
  { value: "shortlist", label: "Shortlist — already vetted" },
  { value: "interview", label: "Interview" },
];

function deferred() {
  let resolve!: () => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<void>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

async function pick(name: string, option: string) {
  const trigger = screen.getByRole("combobox", { name });
  fireEvent.keyDown(trigger, { key: "Enter" });
  fireEvent.keyDown(await screen.findByRole("option", { name: option }), { key: "Enter" });
}

describe("candidate add to job popover", () => {
  beforeEach(() => {
    // Radix Select scrolls the selected item into view and captures the pointer.
    Element.prototype.scrollIntoView = vi.fn();
    Element.prototype.hasPointerCapture = vi.fn(() => false);
    Element.prototype.releasePointerCapture = vi.fn();
  });

  it("picks a job and a stage, confirms, and closes once the host settles", async () => {
    const user = userEvent.setup();
    const pending = deferred();
    const onConfirm = vi.fn(() => pending.promise);
    render(<CandidateAddToJobPopover jobs={JOBS} stages={STAGES} defaultStage="shortlist" onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Add to job" }));
    const surface = document.querySelector('[data-slot="candidate-add-to-job-popover"]');
    expect(surface).not.toBeNull();
    expect(screen.getByRole("combobox", { name: "Job" })).toHaveTextContent("Pick a job…");
    expect(screen.getByRole("combobox", { name: "Stage" })).toHaveTextContent("at Shortlist — already vetted");
    // No assessors, no mode toggle.
    expect(screen.queryByRole("radiogroup", { name: "How to add candidates" })).toBeNull();

    const confirm = screen.getByRole("button", { name: "Confirm" });
    expect(confirm).toBeDisabled();

    await pick("Job", "Harbourline Example Ltd — Data engineer");
    await pick("Stage", "at Interview");
    expect(confirm).toBeEnabled();
    await user.click(confirm);

    expect(onConfirm).toHaveBeenCalledWith("j2", "interview");
    expect(screen.getByRole("button", { name: "Adding…" })).toBeDisabled();
    pending.resolve();
    await waitFor(() => expect(document.querySelector('[data-slot="candidate-add-to-job-popover"]')).toBeNull());
  });

  it("stays open with its choices when the host's add fails", async () => {
    const user = userEvent.setup();
    const pending = deferred();
    const onConfirm = vi.fn(() => pending.promise);
    render(
      <CandidateAddToJobPopover jobs={JOBS} stages={STAGES} defaultJob="j1" onConfirm={onConfirm} />,
    );

    await user.click(screen.getByRole("button", { name: "Add to job" }));
    expect(screen.getByRole("combobox", { name: "Job" })).toHaveTextContent("Fernhill Example Co — Platform lead");
    // The first stage is picked by default.
    expect(screen.getByRole("combobox", { name: "Stage" })).toHaveTextContent("at New");
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledWith("j1", "new");

    pending.reject(new Error("Network down"));
    await waitFor(() => expect(screen.getByRole("button", { name: "Confirm" })).toBeEnabled());
    expect(screen.getByRole("combobox", { name: "Job" })).toHaveTextContent("Fernhill Example Co — Platform lead");
  });

  it("starts from the defaults each time it opens, and never resubmits a job the host left out", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const { rerender } = render(
      <CandidateAddToJobPopover jobs={JOBS} stages={STAGES} onConfirm={onConfirm} />,
    );

    await user.click(screen.getByRole("button", { name: "Add to job" }));
    await pick("Job", "Fernhill Example Co — Platform lead");
    await pick("Stage", "at Interview");
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledWith("j1", "interview");
    await waitFor(() => expect(document.querySelector('[data-slot="candidate-add-to-job-popover"]')).toBeNull());

    // The host drops the job the person is now in.
    rerender(<CandidateAddToJobPopover jobs={JOBS.slice(1)} stages={STAGES} onConfirm={onConfirm} />);
    await user.click(screen.getByRole("button", { name: "Add to job" }));
    expect(screen.getByRole("combobox", { name: "Job" })).toHaveTextContent("Pick a job…");
    expect(screen.getByRole("combobox", { name: "Stage" })).toHaveTextContent("at New");
    expect(screen.getByRole("button", { name: "Confirm" })).toBeDisabled();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector('[data-slot="candidate-add-to-job-popover"]')).toBeNull());

    // A suggestion that arrives later is picked on the next open.
    rerender(<CandidateAddToJobPopover jobs={JOBS.slice(1)} stages={STAGES} defaultJob="j2" onConfirm={onConfirm} />);
    await user.click(screen.getByRole("button", { name: "Add to job" }));
    expect(screen.getByRole("combobox", { name: "Job" })).toHaveTextContent("Harbourline Example Ltd — Data engineer");
    expect(screen.getByRole("button", { name: "Confirm" })).toBeEnabled();
  });

  it("offers an assess mode only with assessors and onAssess", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onAssess = vi.fn();
    render(
      <CandidateAddToJobPopover
        jobs={JOBS}
        stages={STAGES}
        count={3}
        defaultJob="j1"
        onConfirm={onConfirm}
        assessors={[{ value: "a1", label: "Screening checklist" }]}
        onAssess={onAssess}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add to job" }));
    expect(screen.getByText("Add 3 candidates to a job")).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "How to add candidates" })).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Assess" }));
    expect(screen.queryByRole("combobox", { name: "Stage" })).toBeNull();
    const submit = screen.getByRole("button", { name: "Assess" });
    expect(submit).toBeDisabled();

    await pick("Assessor", "Screening checklist");
    await user.click(submit);
    expect(onAssess).toHaveBeenCalledWith("j1", "a1");
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("uses a host trigger and wording, and an empty state with no jobs", async () => {
    const user = userEvent.setup();
    render(
      <CandidateAddToJobPopover
        jobs={[]}
        stages={STAGES}
        onConfirm={() => undefined}
        trigger={<button type="button">Add Imogen to a role</button>}
        empty={{ title: "No open roles yet", description: "Open a role first." }}
        labels={{ title: () => "Add to a role", job: "Role", jobPlaceholder: "Choose a role…" }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add Imogen to a role" }));
    expect(screen.getByText("Add to a role")).toBeInTheDocument();
    const trigger = screen.getByRole("combobox", { name: "Role" });
    expect(trigger).toHaveTextContent("Choose a role…");
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(await screen.findByText("No open roles yet")).toBeInTheDocument();
  });
});
