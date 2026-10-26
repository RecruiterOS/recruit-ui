import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CandidateDecisionBar } from "./candidate-decision-bar";
import {
  CandidateDestinationStatus,
  type CandidateDestinationAction,
} from "./candidate-destination-status";
import { CandidateProfileHeader } from "./candidate-profile";
import { CandidateProfileDialog } from "./candidate-profile-dialog";
import { CandidateShortlist } from "./candidate-shortlist";
import { ResponsiveDialogClose } from "@epicbagel/saas-kit/primitives/responsive-dialog";
import { SheetClose } from "@epicbagel/saas-kit/primitives/sheet";

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

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: width });
}

afterEach(() => {
  setDesktopViewport(true);
  setViewportWidth(1024);
});

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

  it("keeps the header at its natural height in a dialog and in the mobile drawer", () => {
    for (const isDesktop of [true, false]) {
      setDesktopViewport(isDesktop);
      const { unmount } = render(
        <CandidateProfileDialog
          accessibleTitle="Fictional headed profile"
          open
          header={<p>Fictional profile header</p>}
        >
          <p>Fictional profile body</p>
        </CandidateProfileDialog>,
      );

      const surface = screen.getByRole("dialog", { name: "Fictional headed profile" });
      const slot = screen.getByText("Fictional profile header").parentElement;
      // Only the body scrolls; the header never shrinks, so a tall body can't clip it.
      expect(slot).toHaveAttribute("data-slot", "candidate-profile-dialog-header");
      expect(slot).toHaveClass("shrink-0");
      expect(slot?.parentElement).toBe(surface);
      expect(slot?.nextElementSibling).toContainElement(screen.getByText("Fictional profile body"));
      unmount();
    }
  });

  it("lines a dialog-padded profile header up with the body, in the dialog and the drawer", () => {
    // The left edge is the inline padding: the kit body's px-4, and the
    // header's p-4. jsdom has no layout, so the classes are the contract.
    const inlinePadding = (element: Element) => {
      const token = [...element.classList].find((name) => /^(p|px)-\S+$/.test(name));
      return token?.replace(/^px?-/, "");
    };
    for (const isDesktop of [true, false]) {
      setDesktopViewport(isDesktop);
      const { unmount } = render(
        <CandidateProfileDialog
          accessibleTitle="Fictional aligned profile"
          open
          header={<CandidateProfileHeader name="Fictional Person" padding="dialog" />}
        >
          <p>Fictional profile body</p>
        </CandidateProfileDialog>,
      );

      const header = document.querySelector('[data-slot="candidate-profile-header"]') as HTMLElement;
      const identity = header.lastElementChild as HTMLElement;
      const body = header.closest('[data-slot="candidate-profile-dialog-header"]')?.nextElementSibling as HTMLElement;
      expect(identity).toHaveClass("p-4");
      expect(identity.className).not.toMatch(/px-\[26px\]/);
      expect(body).toContainElement(screen.getByText("Fictional profile body"));
      expect(inlinePadding(body)).toBe("4");
      expect(inlinePadding(identity)).toBe(inlinePadding(body));
      unmount();
    }

    // The default stays a card's padding.
    render(<CandidateProfileHeader name="Fictional Card Person" />);
    expect(screen.getByText("Fictional Card Person").closest('[data-slot="candidate-profile-header"]')?.lastElementChild)
      .toHaveClass("px-[26px]", "py-[26px]");
  });

  it("fixes the desktop dialog's height unless asked to fit its content", () => {
    const { unmount } = render(
      <CandidateProfileDialog accessibleTitle="Fictional tall profile" open>
        <p>Fictional profile body</p>
      </CandidateProfileDialog>,
    );
    const fixed = screen.getByRole("dialog", { name: "Fictional tall profile" });
    expect(fixed).toHaveAttribute("data-height", "viewport");
    expect(fixed).toHaveClass("sm:h-[85vh]", "max-h-[85vh]");
    unmount();

    render(
      <CandidateProfileDialog accessibleTitle="Fictional short profile" open height="content">
        <p>Fictional profile body</p>
      </CandidateProfileDialog>,
    );
    const fitted = screen.getByRole("dialog", { name: "Fictional short profile" });
    expect(fitted).toHaveAttribute("data-height", "content");
    expect(fitted).toHaveClass("sm:h-auto", "max-h-[85vh]");
    expect(fitted).not.toHaveClass("sm:h-[85vh]");
  });

  it("adds no header slot without a header", () => {
    render(
      <CandidateProfileDialog accessibleTitle="Fictional headless profile" open header={false}>
        <p>Fictional profile body</p>
      </CandidateProfileDialog>,
    );
    expect(document.querySelector('[data-slot="candidate-profile-dialog-header"]')).toBeNull();
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

  it("opens the profile as a side sheet on desktop, with the same slots", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CandidateProfileDialog
        presentation="sheet"
        accessibleTitle="Fictional sheet profile"
        accessibleDescription="A fictional profile beside the list."
        header={<p>Sheet header</p>}
        footer={<button type="button">Mark as touched</button>}
        contentClassName="lg:max-w-5xl"
        open
        onOpenChange={onOpenChange}
      >
        <p>Sheet body</p>
      </CandidateProfileDialog>,
    );

    const sheet = screen.getByRole("dialog", { name: "Fictional sheet profile" });
    expect(sheet).toHaveAttribute("data-slot", "candidate-profile-dialog");
    expect(sheet).toHaveAttribute("data-presentation", "sheet");
    expect(sheet).toHaveAttribute("data-side", "right");
    expect(sheet).toHaveClass("sm:max-w-2xl", "lg:max-w-5xl");
    expect(sheet).toHaveAccessibleDescription("A fictional profile beside the list.");
    const header = screen.getByText("Sheet header").parentElement;
    expect(header).toHaveAttribute("data-slot", "candidate-profile-dialog-header");
    expect(header).toHaveClass("shrink-0");
    expect(header?.parentElement).toBe(sheet);
    expect(screen.getByText("Sheet body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mark as touched" }).parentElement).toHaveAttribute(
      "data-slot",
      "candidate-profile-dialog-footer",
    );

    // One close control: the kit sheet's own is hidden in favour of the profile's.
    const close = screen.getByRole("button", { name: "Close candidate profile" });
    expect(close).toHaveAttribute("data-slot", "candidate-profile-dialog-close");
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    await user.click(close);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("opens the sheet from the bottom on a phone, from its trigger", async () => {
    setViewportWidth(390);
    const user = userEvent.setup();
    render(
      <CandidateProfileDialog
        presentation="sheet"
        accessibleTitle="Fictional phone profile"
        trigger={<button type="button">Open profile</button>}
        closeLabel="Close contact"
        showClose={false}
        header={(
          <SheetClose asChild>
            <button type="button">Close from profile header</button>
          </SheetClose>
        )}
      >
        <p>Phone body</p>
      </CandidateProfileDialog>,
    );

    await user.click(screen.getByRole("button", { name: "Open profile" }));
    const sheet = await screen.findByRole("dialog", { name: "Fictional phone profile" });
    await waitFor(() => expect(sheet).toHaveAttribute("data-side", "bottom"));
    expect(sheet).toHaveClass("max-h-[92dvh]");
    // A capped height, so the header's slot keeps it from shrinking.
    expect(screen.getByRole("button", { name: "Close from profile header" }).parentElement).toHaveClass("shrink-0");
    expect(screen.queryByRole("button", { name: "Close contact" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close from profile header" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Fictional phone profile" })).not.toBeInTheDocument();
    });
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

describe("candidate shortlist", () => {
  const follows = (later: Node, earlier: Node) =>
    Boolean(earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING);

  it("is a section named by its title: the heading block, the people, then the footer", () => {
    render(
      <CandidateShortlist
        eyebrow="First delivery"
        title="Two people to review"
        description="Fictional shortlist for an example role."
        status={<span>Ready</span>}
        count={2}
        footer={<p>Fictional destination status</p>}
        id="example-shortlist"
      >
        <article>Mei Example</article>
        <article>Owen Sample</article>
      </CandidateShortlist>,
    );

    const section = screen.getByRole("region", { name: "Two people to review" });
    expect(section.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("data-slot", "candidate-shortlist");
    expect(section).toHaveAttribute("id", "example-shortlist");

    const heading = within(section).getByRole("heading", { level: 2, name: "Two people to review" });
    const eyebrow = within(section).getByText("First delivery");
    const description = within(section).getByText("Fictional shortlist for an example role.");
    const status = within(section).getByText("Ready");
    expect(follows(heading, eyebrow)).toBe(true);
    expect(follows(description, heading)).toBe(true);
    // The status sits at the end of the heading's row, after the text beside
    // it, in a slot that doesn't shrink, so the title wraps before it does.
    const statusSlot = status.parentElement!;
    expect(statusSlot.parentElement).toBe(heading.parentElement!.parentElement);
    expect(statusSlot).toHaveClass("shrink-0");
    expect(follows(status, description)).toBe(true);

    const people = within(section).getAllByRole("article");
    expect(people.map((person) => person.textContent)).toEqual(["Mei Example", "Owen Sample"]);
    expect(people[0]!.parentElement).toBe(people[1]!.parentElement);
    const footer = within(section).getByText("Fictional destination status");
    expect(follows(footer, people[1]!)).toBe(true);
    expect(screen.queryByText("No candidates shortlisted yet")).toBeNull();
  });

  it("renders only the title when the optional heading slots are left out", () => {
    const { container } = render(
      <CandidateShortlist title="Fictional shortlist">
        <article>Mei Example</article>
      </CandidateShortlist>,
    );

    const heading = screen.getByRole("heading", { level: 2, name: "Fictional shortlist" });
    expect(heading.parentElement!.children).toHaveLength(1);
    expect(heading.parentElement!.parentElement!.children).toHaveLength(1);
    expect(container.querySelector("[data-slot='empty-state']")).toBeNull();
  });

  it("shows the blank slate in place of the people and the footer when the count is zero", () => {
    render(
      <CandidateShortlist
        title="Fictional shortlist"
        description="Fictional description stays."
        count={0}
        footer={<p>Fictional destination status</p>}
      >
        <article>Mei Example</article>
      </CandidateShortlist>,
    );

    const section = screen.getByRole("region", { name: "Fictional shortlist" });
    expect(within(section).getByText("Fictional description stays.")).toBeInTheDocument();
    expect(within(section).getByText("No candidates shortlisted yet")).toBeInTheDocument();
    // No generic kit description under the default title.
    expect(within(section).queryByText(/Get started/)).toBeNull();
    expect(within(section).queryByRole("article")).toBeNull();
    expect(within(section).queryByText("Fictional destination status")).toBeNull();
    const blank = section.querySelector("[data-slot='empty-state']")!;
    expect(blank).toBeInTheDocument();
    expect(blank.querySelector("svg")).not.toBeNull();
  });

  it("is empty when its children render nothing and the host passes no count", () => {
    const empty = {
      title: "No example people yet",
      description: "Fictional people appear here once found.",
    };
    const { rerender } = render(
      <CandidateShortlist title="Fictional shortlist" empty={empty} footer={<p>Fictional footer</p>}>
        {[]}
        {null}
        {false}
      </CandidateShortlist>,
    );

    expect(screen.getByText("No example people yet")).toBeInTheDocument();
    expect(screen.getByText("Fictional people appear here once found.")).toBeInTheDocument();
    expect(screen.queryByText("Fictional footer")).toBeNull();

    // A count the host passes wins over what the children hold.
    rerender(
      <CandidateShortlist title="Fictional shortlist" empty={empty} count={1}>
        {null}
      </CandidateShortlist>,
    );
    expect(screen.queryByText("No example people yet")).toBeNull();
  });

  it("sizes the blank slate inline by default and md for a shortlist that is a page's main list", () => {
    const { container, rerender } = render(<CandidateShortlist title="Fictional shortlist" count={0} />);
    const message = () => container.querySelector("[data-slot='empty-state-message']")!;
    // Inline: the icon beside the words, left-aligned.
    expect(message()).toHaveClass("text-left");
    expect(message()).not.toHaveClass("text-center");

    rerender(<CandidateShortlist title="Fictional shortlist" count={0} emptySize="md" />);
    // md: the icon over the words, centred.
    expect(message()).toHaveClass("text-center");
    expect(screen.getByText("No candidates shortlisted yet")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-slot='empty-state']")).toHaveLength(1);
  });
});
