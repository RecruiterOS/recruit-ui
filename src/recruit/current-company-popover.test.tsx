import { act, fireEvent, render, screen } from "@testing-library/react";
import type { HTMLAttributes, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

// This file owns the open state and the lazy-content boundary. Radix's
// portal, positioning and presence animation add timers that say nothing
// about either, so the kit popover is a pass-through here: the trigger's
// click toggles through `onOpenChange`, as Radix's does.
const popoverBridge = vi.hoisted(() => ({
  open: false,
  onOpenChange: undefined as ((open: boolean) => void) | undefined,
}));

vi.mock("@epicbagel/saas-kit/primitives/popover", () => ({
  Popover: ({ children, open, onOpenChange }: { children: ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
    popoverBridge.open = !!open;
    popoverBridge.onOpenChange = onOpenChange;
    return <>{children}</>;
  },
  PopoverTrigger: ({ children }: { children: ReactNode }) => (
    <span onClickCapture={() => popoverBridge.onOpenChange?.(!popoverBridge.open)}>{children}</span>
  ),
  PopoverContent: ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div role="dialog" {...props}>{children}</div>
  ),
}));

import { CurrentCompanyPopover } from "./current-company-popover";

function pointer(type: string, pointerType: string) {
  const event = new MouseEvent(type, { bubbles: true });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  return event;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("current company popover", () => {
  it("renders the content only once a tap or click opens it, without reaching the card", () => {
    const renderContent = vi.fn(() => <p>Fictional career history</p>);
    const onCard = vi.fn();
    const { container } = render(
      <div onClick={onCard}>
        <CurrentCompanyPopover
          company="Fernhill Example Co"
          tenure="started 2 years ago"
          triggerTitle="View Fernhill Example Co career history"
          renderContent={renderContent}
        />
      </div>,
    );

    const label = container.querySelector('[data-slot="current-company-label"]');
    expect(label).toHaveTextContent("Fernhill Example Co · started 2 years ago");
    expect(renderContent).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();

    const trigger = screen.getByRole("button", { name: "Fernhill Example Co" });
    expect(trigger).toHaveAttribute("title", "View Fernhill Example Co career history");
    fireEvent.click(trigger);

    expect(renderContent).toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toHaveAttribute("data-slot", "current-company-popover");
    expect(screen.getByText("Fictional career history")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Fictional career history"));
    expect(onCard).not.toHaveBeenCalled();

    fireEvent.click(trigger);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens on mouse hover, not on touch, and closes after the delay once the pointer leaves", () => {
    vi.useFakeTimers();
    render(
      <CurrentCompanyPopover
        company="Saltmarsh Example Robotics"
        triggerTitle="View Saltmarsh Example Robotics career history"
        renderContent={() => <p>Fictional roles</p>}
        closeDelayMs={200}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Saltmarsh Example Robotics" });
    fireEvent(trigger, pointer("pointerover", "touch"));
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent(trigger, pointer("pointerover", "mouse"));
    expect(screen.getByText("Fictional roles")).toBeInTheDocument();

    // Leaving the trigger for the popover keeps it open.
    fireEvent(trigger, pointer("pointerout", "mouse"));
    fireEvent(screen.getByRole("dialog"), pointer("pointerover", "mouse"));
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByText("Fictional roles")).toBeInTheDocument();

    fireEvent(screen.getByRole("dialog"), pointer("pointerout", "mouse"));
    act(() => vi.advanceTimersByTime(199));
    expect(screen.getByText("Fictional roles")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("Fictional roles")).toBeNull();
  });
});
