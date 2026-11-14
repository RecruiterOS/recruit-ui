import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CandidateClientDecision } from "./candidate-client-decision";

// The voice-first sheet as a chunk that won't download, as after a deploy
// has replaced it or on a connection that dropped. A file of its own, since
// the mock stands for the whole module.
const sheetLoads = vi.hoisted(() => vi.fn());
vi.mock("./candidate-decision-reason-sheet", () => {
  sheetLoads();
  throw new Error("Loading chunk failed");
});

describe("candidate client decision, where the voice-first sheet won't download", () => {
  it("stays on the page and asks why in its dialog", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(
      <main>
        <h1>Mei Tanaka</h1>
        <CandidateClientDecision
          candidateName="Mei Tanaka"
          onDecide={onDecide}
          suggestions={{ no: ["Too senior"] }}
          reasonPrompt="sheet"
          reasonOptional
        />
      </main>,
    );

    await waitFor(() => expect(sheetLoads).toHaveBeenCalled());
    // The page the row sits on is still there, and so are the answers.
    await waitFor(() => expect(screen.getByRole("button", { name: "No" })).toBeEnabled());
    expect(screen.getByRole("heading", { level: 1, name: "Mei Tanaka" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "No" }));
    // The typed dialog, with the same reasons and the same rule on leaving it empty.
    const dialog = await screen.findByRole("dialog", { name: "No to Mei Tanaka" });
    expect(within(dialog).getByLabelText("Why? (optional)")).toBeInTheDocument();
    await user.click(within(dialog).getByText("Too senior"));
    await user.click(within(dialog).getByRole("button", { name: "Save No" }));

    expect(onDecide.mock.calls).toEqual([["no", "Too senior"]]);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
