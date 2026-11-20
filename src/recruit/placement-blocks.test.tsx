import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { InterviewScheduler, JobStatusBlock, type ScheduledInterview } from "../blocks";

const defaults = {
  label: "Portfolio review", scheduledAt: "2027-01-12T16:30:00+02:00",
  interviewer: "Alex Example", location: "Studio",
};
const saved: ScheduledInterview = { ...defaults, id: "17", version: "one", status: "SCHEDULED" };
const base = { candidate: "Sam Example", role: "Designer", defaults, timeZone: "America/New_York" };
const press = (name: string) => fireEvent.click(screen.getByRole("button", { name }));

describe("the interview block", () => {
  it("records a UTC instant, reschedules, then completes the same appointment with feedback", async () => {
    const update = vi.fn();
    function Host() {
      const [appointment, set] = useState<ScheduledInterview | null>(null);
      return <InterviewScheduler {...base} appointment={appointment}
        onSchedule={details => set({ ...saved, ...details })}
        onUpdate={(original, patch) => { update(original, patch); set({ ...original, ...patch, version: "two" }); }} />;
    }
    render(<Host />);
    expect(screen.getByLabelText("Time (UTC)")).toHaveValue("14:30");
    expect(screen.getByText(/America\/New York.*09:30/)).toBeVisible();
    press("Schedule interview");
    expect(await screen.findByText(/09:30/)).toBeVisible();
    press("Edit interview");
    fireEvent.change(screen.getByLabelText("Date (UTC)"), { target: { value: "2027-01-13" } });
    press("Save changes");
    await screen.findByText(/Wed.*09:30/);
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ version: "one" }), expect.objectContaining({ scheduledAt: "2027-01-13T14:30:00.000Z" }));
    press("Record feedback");
    fireEvent.change(screen.getByLabelText(/Feedback from/), { target: { value: "Clear on the brief." } });
    press("Complete interview");
    expect(await screen.findByText("Completed")).toBeVisible();
    expect(screen.getByText("Clear on the brief.")).toBeVisible();
    expect(update).toHaveBeenLastCalledWith(expect.objectContaining({ version: "two" }), { status: "COMPLETED", feedback: "Clear on the brief." });
  });

  it("keeps the draft and the version originally opened across a refresh or failed save", async () => {
    const onUpdate = vi.fn().mockRejectedValue(new Error("Someone changed the appointment."));
    const props = { ...base, onSchedule: vi.fn(), onUpdate };
    const view = render(<InterviewScheduler {...props} appointment={saved} />);
    press("Edit interview");
    fireEvent.change(screen.getByLabelText("Interview name"), { target: { value: "Design review" } });
    view.rerender(<InterviewScheduler {...props} appointment={{ ...saved, version: "two" }} />);
    press("Save changes");
    expect(await screen.findByRole("alert")).toHaveTextContent("Someone changed");
    expect(screen.getByLabelText("Interview name")).toHaveValue("Design review");
    expect(onUpdate).toHaveBeenCalledWith(saved, expect.objectContaining({ label: "Design review" }));
  });

  it("asks before cancelling and waits for the host before allowing a second save", async () => {
    let done!: () => void;
    const onUpdate = vi.fn(() => new Promise<void>(resolve => { done = resolve; }));
    render(<InterviewScheduler {...base} appointment={saved} onSchedule={vi.fn()} onUpdate={onUpdate} />);
    press("Cancel interview");
    press("Go back");
    expect(onUpdate).not.toHaveBeenCalled();
    press("Cancel interview");
    press("Confirm cancellation");
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
    done();
    await waitFor(() => expect(onUpdate).toHaveBeenCalledWith(saved, { status: "CANCELLED" }));
    await screen.findByRole("button", { name: "Edit interview" });
  });

  it("shows a rejected close and leaves the job open", async () => {
    render(<JobStatusBlock title="Designer" client="Example Studio" statusLabel="Open" onClose={() => Promise.reject(new Error())} />);
    press("Close job");
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn’t close");
    expect(screen.getByText("Open")).toBeVisible();
  });
});
