import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CallReconcileCard } from "./call-reconcile-card";

// Records when the dialogs module (and with it the kit's ResponsiveDialog and
// its phone drawer) is first evaluated; vi.mock is hoisted above the imports.
// A file of its own, so no other test has loaded the module first.
const dialogLoads = vi.hoisted(() => vi.fn());
vi.mock("./call-reconcile-dialogs", async (importOriginal) => {
  dialogLoads();
  return importOriginal();
});

// Fictional people and calls only.
const MEI = { id: 7, name: "Mei Example" };
const participants = [{ name: "Mei Example", email: "mei@example.com" }];

describe("call reconcile card's dialogs load only in search mode", () => {
  it("never loads them in picker mode", async () => {
    const user = userEvent.setup();
    const onPickOther = vi.fn();
    const { unmount } = render(
      <CallReconcileCard
        title="Call with Mei"
        participants={participants}
        onDismiss={vi.fn()}
        onPickOther={onPickOther}
        suggestions={<button type="button">Mei Example</button>}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Someone else" }));
    expect(onPickOther).toHaveBeenCalledTimes(1);
    // Give a stray dynamic import a chance to settle before checking.
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(dialogLoads).not.toHaveBeenCalled();
    unmount();
  });

  it("loads them with a search-mode card, closed, so a pick opens at once", async () => {
    const user = userEvent.setup();
    const onAttach = vi.fn();
    render(
      <CallReconcileCard
        title="Call with Mei"
        participants={participants}
        guesses={[MEI]}
        searchPeople={vi.fn(async () => [])}
        onDismiss={vi.fn()}
        onAttach={onAttach}
        onCreateAttach={vi.fn()}
        renderPreview={(person) => <p>Preview of {person.name}</p>}
      />,
    );

    // Loaded on mount, before anything is picked, and nothing shows.
    await waitFor(() => expect(dialogLoads).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Mei Example" }));
    expect(await screen.findByText("Preview of Mei Example")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Attach this call" }));
    expect(onAttach).toHaveBeenCalledWith(MEI);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
