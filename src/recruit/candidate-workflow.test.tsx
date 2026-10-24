import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CandidateDecisionBar } from "./candidate-decision-bar";
import {
  CandidateDestinationStatus,
  type CandidateDestinationAction,
} from "./candidate-destination-status";
import { CandidateProfileDialog } from "./candidate-profile-dialog";
import { ResponsiveDialogClose } from "@/components/recruit-ui/core/primitives/responsive-dialog";

function setDesktopViewport(isDesktop: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: isDesktop,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

afterEach(() => setDesktopViewport(true));

describe("candidate workflow compositions", () => {
  it("gives a controlled profile dialog an accessible title and close behavior", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CandidateProfileDialog
        accessibleTitle="Fictional candidate profile"
        accessibleDescription="A fictional profile preview."
        open
        onOpenChange={onOpenChange}
      >
        <p>Profile body</p>
      </CandidateProfileDialog>,
    );

    expect(screen.getByRole("dialog", { name: "Fictional candidate profile" })).toBeInTheDocument();
    const close = screen.getByRole("button", { name: "Close candidate profile" });
    expect(close).toHaveAttribute("data-slot", "candidate-profile-dialog-close");
    expect(close).toBeVisible();
    await user.click(close);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes an uncontrolled profile drawer through the visible mobile control", async () => {
    setDesktopViewport(false);
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CandidateProfileDialog
        accessibleTitle="Fictional mobile profile"
        defaultOpen
        onOpenChange={onOpenChange}
      >
        <p>Mobile profile body</p>
      </CandidateProfileDialog>,
    );

    expect(screen.getByRole("dialog", { name: "Fictional mobile profile" })).toBeInTheDocument();
    const close = screen.getByRole("button", { name: "Close candidate profile" });
    expect(close).toHaveAttribute("data-slot", "candidate-profile-dialog-close");
    expect(close).toBeVisible();
    await user.click(close);

    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Fictional mobile profile" })).not.toBeInTheDocument();
    });
  });

  it("allows a host-owned close to replace the default control", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CandidateProfileDialog
        accessibleTitle="Fictional composed profile"
        open
        onOpenChange={onOpenChange}
        showClose={false}
        header={(
          <ResponsiveDialogClose asChild>
            <button type="button">Close from profile header</button>
          </ResponsiveDialogClose>
        )}
      >
        <p>Composed profile body</p>
      </CandidateProfileDialog>,
    );

    expect(screen.queryByRole("button", { name: "Close candidate profile" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close from profile header" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("forwards decisions and reflects the selected option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CandidateDecisionBar
        ariaLabel="Fictional decision"
        value="review"
        options={[
          { value: "review", label: "Review" },
          { value: "pause", label: "Pause" },
        ]}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole("group", { name: "Fictional decision" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Review" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(onChange).toHaveBeenCalledWith("pause");
  });

  it("preserves destination links and canonical status rendering", () => {
    render(
      <CandidateDestinationStatus
        state="connected"
        name="Example destination"
        description="Fictional delivery status"
        facts={[{ label: "Ready", variant: "success" }]}
        actions={[
          {
            label: "Open example",
            href: "https://example.com/destination",
            target: "_blank",
            external: true,
          },
        ]}
      />,
    );

    expect(screen.getByText("Example destination")).toBeInTheDocument();
    expect(screen.getByText("Ready")).toHaveClass(
      "text-[10px]",
      "px-3",
      "py-1",
      "font-semibold",
      "shrink-0",
      "uppercase",
      "tracking-wide",
    );
    const link = screen.getByRole("link", { name: /Open example/i });
    expect(link).toHaveAttribute("href", "https://example.com/destination");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("requires and renders an accessible name for icon-only destination links", () => {
    const action = {
      label: "Open hidden destination label",
      ariaLabel: "Open fictional destination",
      iconOnly: true,
      href: "https://example.com/icon-destination",
      target: "_blank",
      external: true,
    } satisfies CandidateDestinationAction;

    render(
      <CandidateDestinationStatus
        state="connected"
        name="Example icon destination"
        actions={[action]}
      />,
    );

    const link = screen.getByRole("link", { name: "Open fictional destination" });
    expect(link).toHaveAttribute("href", "https://example.com/icon-destination");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(screen.queryByText("Open hidden destination label")).not.toBeInTheDocument();
  });

  it("rejects icon-only destination actions without a string ariaLabel", () => {
    // @ts-expect-error icon-only actions require an explicit accessible name.
    const missingLabel: CandidateDestinationAction = {
      label: "Hidden label",
      iconOnly: true,
      href: "https://example.com/missing-label",
    };

    expect(missingLabel.iconOnly).toBe(true);
  });
});
