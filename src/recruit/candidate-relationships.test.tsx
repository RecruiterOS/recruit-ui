import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sparkles } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { CandidateCareerHistoryPanel } from "./candidate-career-history-panel";
import { CandidateFilterChips } from "./candidate-filter-chips";
import { CandidateRelationshipCard } from "./candidate-relationship-card";
import { CandidateRoleMatchList, CandidateRoleMatchSummary } from "./candidate-role-matches";
import { CandidateSignalList } from "./candidate-signal-list";
import { CandidateSignalMenu } from "./candidate-signal-menu";
import { CandidateSuggestedRolesPanel } from "./candidate-suggested-roles-panel";

// Fictional people, organisations and roles only.
const facts = [
  { label: "Rating", value: "A — Strong fit", detail: "High confidence" },
  { label: "Pipeline", value: "Screened", detail: "Fernhill Example Co — Staff Engineer" },
  { label: "Last call", value: "Intro call with Imogen" },
];

describe("candidate relationship card", () => {
  it("keeps the signal and the note visible together, each only when given", () => {
    const { container, rerender } = render(
      <CandidateRelationshipCard
        name="Imogen Example"
        headline="Staff Engineer"
        company={<span>Fernhill Example Co</span>}
        location="Example City"
        verified
        signal={{ label: "Signal", summary: "Move window · 41 months", more: "+1 more signal" }}
        facts={facts}
        note={{ heading: "Recruiter note", text: "Warm route through a former colleague." }}
        onSelect={() => undefined}
      />,
    );

    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveAttribute("data-slot", "candidate-relationship-card");
    expect(card).toHaveAttribute("role", "button");
    expect(card.className).toContain("h-full");
    expect(screen.getByRole("heading", { level: 3, name: "Imogen Example" })).toBeInTheDocument();
    expect(screen.getByText("· Example City")).toBeInTheDocument();
    expect(screen.getByText("Move window · 41 months")).toBeInTheDocument();
    expect(screen.getByText("+1 more signal")).toBeInTheDocument();
    expect(screen.getByText("Signal").className).toContain("uppercase");
    expect(screen.getByText("Warm route through a former colleague.")).toBeInTheDocument();
    expect(screen.getByText("High confidence")).toBeInTheDocument();
    expect(screen.getByText("Rating").className).toContain("uppercase");
    // No cover media, no empty 4:1 frame.
    expect(container.querySelector("[data-radix-aspect-ratio-wrapper]")).toBeNull();

    rerender(<CandidateRelationshipCard name="Mei Example" facts={facts} onSelect={() => undefined} />);
    expect(screen.queryByText("Signal")).toBeNull();
    expect(screen.queryByText("Recruiter note")).toBeNull();
    expect(screen.queryByText(/Example City/)).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("selects by click or keyboard, but not from a nested control or the suggestion row", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onOpenRoles = vi.fn();
    const onAction = vi.fn();
    render(
      <CandidateRelationshipCard
        name="Imogen Example"
        // A host button that forgets to stop propagation still doesn't select.
        actions={<button type="button" onClick={onAction}>Star</button>}
        facts={facts}
        suggestion={{
          label: "Suggested roles",
          primary: "Saltmarsh Example Robotics — Platform Lead",
          more: { value: "+2", title: "2 more suggested roles" },
          onOpen: onOpenRoles,
        }}
        selected
        onSelect={onSelect}
      />,
    );

    const card = document.querySelector('[data-slot="candidate-relationship-card"]') as HTMLElement;
    expect(card).toHaveAttribute("aria-current", "true");

    await user.click(screen.getByRole("button", { name: "Star" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();

    const primary = screen.getByText("Saltmarsh Example Robotics — Platform Lead");
    expect(primary).toHaveAttribute("title", "Saltmarsh Example Robotics — Platform Lead");
    expect(screen.getByTitle("2 more suggested roles")).toHaveTextContent("+2");
    await user.click(primary);
    expect(onOpenRoles).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();

    await user.click(screen.getByText("Intro call with Imogen"));
    expect(onSelect).toHaveBeenCalledTimes(1);

    card.focus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(2);
    await user.keyboard(" ");
    expect(onSelect).toHaveBeenCalledTimes(3);
  });

  it("lets Enter and Space on a focused nested control activate it alone", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onToggle = vi.fn();
    const onOpenRoles = vi.fn();
    const keydowns: boolean[] = [];
    render(
      <div onKeyDown={(event) => keydowns.push(event.defaultPrevented)}>
        <CandidateRelationshipCard
          name="Imogen Example"
          actions={(
            <button type="button" onClick={(event) => { event.stopPropagation(); onToggle(); }}>
              Favourite
            </button>
          )}
          facts={facts}
          suggestion={{ label: "Suggested roles", primary: "Saltmarsh Example Robotics — Platform Lead", onOpen: onOpenRoles }}
          onSelect={onSelect}
        />
      </div>,
    );

    screen.getByRole("button", { name: "Favourite" }).focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(onSelect).not.toHaveBeenCalled();
    expect(keydowns).toEqual([false, false]);

    screen.getByText("Saltmarsh Example Robotics — Platform Lead").closest("button")!.focus();
    await user.keyboard("{Enter}");
    expect(onOpenRoles).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("runs a host onKeyDown first, and a key it prevents doesn't select", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CandidateRelationshipCard
        name="Imogen Example"
        facts={facts}
        onKeyDown={(event) => { if (event.key === " ") event.preventDefault(); }}
        onSelect={onSelect}
      />,
    );
    (document.querySelector('[data-slot="candidate-relationship-card"]') as HTMLElement).focus();
    await user.keyboard(" ");
    expect(onSelect).not.toHaveBeenCalled();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

describe("candidate signal menu", () => {
  it("offers the host's actions without selecting the card around it", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateSignalMenu
          items={[
            { id: "acted", label: "Send a note" },
            { id: "dismissed", label: "Dismiss" },
          ]}
          onSelect={onSelect}
        />
      </div>,
    );

    const trigger = screen.getByRole("button", { name: "Signal actions" });
    expect(trigger).toHaveAttribute("title", "Signal actions");
    expect(trigger.querySelector("svg")?.getAttribute("class")).toContain("size-3.5");
    await user.click(trigger);
    expect(onCard).not.toHaveBeenCalled();

    // The signal menu is the action menu with a signal's defaults.
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("data-slot", "candidate-action-menu");
    expect(within(menu).getAllByRole("menuitem").map((item) => item.textContent)).toEqual(["Send a note", "Dismiss"]);
    expect(within(menu).getByRole("menuitem", { name: "Dismiss" }).querySelector("svg")).toBeNull();
    await user.click(within(menu).getByRole("menuitem", { name: "Send a note" }));
    expect(onSelect).toHaveBeenCalledWith("acted");
    expect(onCard).not.toHaveBeenCalled();
  });

  it("takes the host's label and can be disabled", () => {
    render(<CandidateSignalMenu items={[]} onSelect={() => undefined} label="Change actions" disabled />);
    expect(screen.getByRole("button", { name: "Change actions" })).toBeDisabled();
  });
});

describe("candidate filter chips", () => {
  it("presses one chip at a time and clears from the first", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container, rerender } = render(
      <CandidateFilterChips
        value={null}
        onChange={onChange}
        allLabel="Everyone"
        options={[
          { value: "all", label: "Has changes", icon: Sparkles },
          { value: "moves", label: "Job moves" },
        ]}
        context={<span>From an update</span>}
        action={<button type="button">More</button>}
      />,
    );

    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-filter-chips");
    expect(screen.getByRole("button", { name: "Everyone" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Has changes" }).querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Job moves" }).querySelector("svg")).toBeNull();
    expect(screen.getByText("From an update")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Job moves" }));
    expect(onChange).toHaveBeenLastCalledWith("moves");

    rerender(
      <CandidateFilterChips
        value="moves"
        onChange={onChange}
        allLabel="Everyone"
        options={[{ value: "moves", label: "Job moves" }]}
      />,
    );
    expect(screen.getByRole("button", { name: "Job moves" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Everyone" })).toHaveAttribute("aria-pressed", "false");
    await user.click(screen.getByRole("button", { name: "Everyone" }));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("marks the pressed chip with the kit chip's primary border and tint, and mutes the others", () => {
    render(
      <CandidateFilterChips
        value="moves"
        onChange={() => undefined}
        allLabel="Everyone"
        options={[
          { value: "moves", label: "Job moves" },
          { value: "promotions", label: "Promotions" },
        ]}
      />,
    );

    const pressed = ["data-[state=on]:border-primary", "data-[state=on]:bg-primary/10", "data-[state=on]:text-foreground"];
    for (const name of ["Everyone", "Job moves", "Promotions"]) {
      const chip = screen.getByRole("button", { name });
      expect(chip).toHaveClass("text-muted-foreground", ...pressed);
      // The kit Toggle's faint accent fill is replaced, not stacked under it.
      expect(chip).not.toHaveClass("data-[state=on]:bg-accent");
    }
    expect(screen.getByRole("button", { name: "Job moves" })).toHaveAttribute("data-state", "on");
    expect(screen.getByRole("button", { name: "Everyone" })).toHaveAttribute("data-state", "off");
  });

  it("keeps every chip a 44px touch target on a touchscreen and the dense chip for a mouse", () => {
    render(
      <CandidateFilterChips
        value="moves"
        onChange={() => undefined}
        allLabel="Everyone"
        options={[
          { value: "moves", label: "Job moves" },
          { value: "promotions", label: "Promotions" },
        ]}
      />,
    );

    // 44 CSS pixels on a coarse pointer, not the kit's h-11, which a narrow
    // screen scales to 38.5px; the chip's own h-7 stays for a mouse.
    const touch = ["pointer-coarse:min-h-[max(44px,2.75rem)]", "pointer-coarse:min-w-[max(44px,2.75rem)]"];
    for (const name of ["Everyone", "Job moves", "Promotions"]) {
      expect(screen.getByRole("button", { name })).toHaveClass("h-7", "rounded-full", ...touch);
    }
  });
});

describe("candidate signal list", () => {
  const empty = { title: "No signals yet", description: "Changes about this person appear here." };

  it("shows skeletons while loading, then the error, then the empty state", () => {
    const { container, rerender } = render(
      <CandidateSignalList title="Signals" items={[]} loading empty={empty} />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-signal-list");
    expect(screen.getByText("Signals")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-state"]')).toBeNull();

    rerender(<CandidateSignalList title="Signals" items={[]} error="Signals could not be loaded." empty={empty} />);
    expect(screen.getByText("Signals could not be loaded.")).toBeInTheDocument();

    rerender(<CandidateSignalList title="Signals" items={[]} empty={empty} />);
    expect(container.querySelector('[data-slot="empty-state"]')).not.toBeNull();
    expect(screen.getByText("No signals yet")).toBeInTheDocument();
  });

  it("renders each signal's badges, date, summary, details and actions", () => {
    render(
      <CandidateSignalList
        title="Signals"
        empty={empty}
        items={[
          {
            id: 1,
            kind: "Promotion",
            detectedAt: <span>2 days ago</span>,
            summary: "Imogen Example was promoted to Principal Engineer.",
            details: [
              { label: "Why it matters", value: "A fresh promotion often resets the clock." },
              { label: "Suggested action", value: "Send a short congratulations note." },
            ],
            actions: <button type="button">Actions</button>,
          },
          {
            id: 2,
            kind: "Tenure milestone",
            status: "snoozed",
            detectedAt: <span>3 weeks ago</span>,
            summary: "Mei Example passed three years at Fernhill Example Co.",
          },
        ]}
      />,
    );

    expect(screen.getByText("Promotion")).toHaveAttribute("data-slot", "badge");
    expect(screen.getByText("snoozed")).toHaveAttribute("data-variant", "outline");
    expect(screen.getByText("2 days ago")).toBeInTheDocument();
    expect(screen.getByText("Why it matters")).toBeInTheDocument();
    expect(screen.getByText("Send a short congratulations note.")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Actions" })).toHaveLength(1);
    // The second signal has no details, so no definition list is drawn for it.
    expect(document.querySelectorAll("dl")).toHaveLength(1);
  });
});

describe("candidate career history panel", () => {
  it("counts the roles once loaded and scrolls within the viewport", () => {
    const { container, rerender } = render(
      <CandidateCareerHistoryPanel title="Career history" items={[]} loading />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-career-history-panel");
    expect(document.querySelector('[data-slot="candidate-career-history-loading"]')).not.toBeNull();

    rerender(
      <CandidateCareerHistoryPanel
        title="Career history"
        items={[{ title: "Staff Engineer", company: "Fernhill Example Co", startDate: "2024-01", current: true }]}
      />,
    );
    const scroll = document.querySelector('[data-slot="career-history-scroll"]');
    expect(scroll?.classList.contains("max-h-[60vh]")).toBe(true);
    expect(within(scroll as HTMLElement).getByText("Staff Engineer")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();

    rerender(<CandidateCareerHistoryPanel items={[]} empty={{ title: "No roles imported yet", description: "Nothing imported." }} />);
    expect(screen.getByText("Career history")).toBeInTheDocument();
    expect(screen.getByText("No roles imported yet")).toBeInTheDocument();
    expect(screen.getByText("Nothing imported.")).toBeInTheDocument();
  });

  it("runs at full height in a container that already scrolls", () => {
    const { container } = render(
      <CandidateCareerHistoryPanel
        scroll="none"
        items={[
          { title: "Staff Engineer", company: "Fernhill Example Co", startDate: "2024-01", current: true },
          { title: "Senior Engineer", company: "Example Works", startDate: "2020-05", endDate: "2023-12" },
        ]}
        detailedCompanyGroups={2}
      />,
    );
    const panel = container.firstElementChild as HTMLElement;
    expect(panel).toHaveAttribute("data-slot", "candidate-career-history-panel");
    expect(document.querySelector('[data-slot="career-history-scroll"]')).toBeNull();
    expect(document.querySelector("[data-radix-scroll-area-viewport]")).toBeNull();
    // The timeline sits straight under the counted header.
    const timeline = panel.querySelector('[data-slot="candidate-career-history"]');
    expect(timeline?.parentElement).toBe(panel);
    expect(screen.getByText("Career history")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
  });
});

describe("candidate role matches", () => {
  const match = {
    id: 7,
    title: "Fictional Platform Lead",
    href: "/roles/7",
    grade: <span>A</span>,
    reason: "Led a platform team of twelve at an example scale-up.",
  };
  const confirm = {
    title: (m: typeof match) => `Add Imogen to ${m.title}?`,
    description: (m: typeof match) => m.reason,
  };

  async function addThroughConfirmation(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole("button", { name: /Add to role/ }));
    expect(screen.getByText("Add Imogen to Fictional Platform Lead?")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button", { name: "Add to role" });
    await user.click(buttons[buttons.length - 1]!);
  }

  it("summarises roles as rows that open by id, and renders nothing without roles", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const { container, rerender } = render(<CandidateRoleMatchSummary matches={[match]} onOpen={onOpen} />);
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-role-match-summary");
    await user.click(screen.getByRole("button", { name: /Fictional Platform Lead/ }));
    expect(onOpen).toHaveBeenCalledWith(7);

    rerender(<CandidateRoleMatchSummary matches={[]} onOpen={onOpen} />);
    expect(container.firstElementChild).toBeNull();
  });

  it("links the role and hides the add action without onAddToRole", () => {
    const { container } = render(
      <CandidateRoleMatchList heading="Possible roles for Imogen" matches={[match]} confirm={confirm} />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-role-match-list");
    expect(screen.getByText("Possible roles for Imogen")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: match.title })).toHaveAttribute("href", "/roles/7");
    expect(screen.queryByRole("button", { name: /Add to role/ })).toBeNull();
  });

  it("opens the role in place instead of following the link when asked to", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateRoleMatchList heading="Roles" matches={[match]} confirm={confirm} onOpen={onOpen} />
      </div>,
    );
    await user.click(screen.getByRole("link", { name: match.title }));
    expect(onOpen).toHaveBeenCalledWith(7);
    expect(onCard).not.toHaveBeenCalled();
  });

  it("confirms, then marks the role added once onAddToRole resolves", async () => {
    const user = userEvent.setup();
    const onAddToRole = vi.fn().mockResolvedValue(undefined);
    render(<CandidateRoleMatchList heading="Roles" matches={[match]} confirm={confirm} onAddToRole={onAddToRole} />);

    await addThroughConfirmation(user);

    await waitFor(() => expect(screen.getByText("Added")).toBeInTheDocument());
    expect(onAddToRole).toHaveBeenCalledWith(7);
    expect(screen.queryByRole("button", { name: /Add to role/ })).toBeNull();
  });

  it("keeps the role addable when onAddToRole rejects", async () => {
    const user = userEvent.setup();
    const onAddToRole = vi.fn().mockRejectedValue(new Error("fictional failure"));
    render(<CandidateRoleMatchList heading="Roles" matches={[match]} confirm={confirm} onAddToRole={onAddToRole} />);

    await addThroughConfirmation(user);

    await waitFor(() => expect(onAddToRole).toHaveBeenCalledTimes(1));
    expect(screen.queryByText("Added")).toBeNull();
    expect(screen.getByRole("button", { name: /Add to role/ })).toBeInTheDocument();
  });

  it("shows the host's added wording for a role the candidate is already on", () => {
    render(
      <CandidateRoleMatchList
        heading="Roles"
        matches={[{ ...match, added: true, addedLabel: "Added · screening" }]}
        confirm={confirm}
        onAddToRole={async () => undefined}
      />,
    );
    expect(screen.getByText("Added · screening")).toHaveAttribute("data-variant", "success");
    expect(screen.queryByRole("button", { name: /Add to role/ })).toBeNull();
  });
});

describe("candidate suggested roles panel", () => {
  it("shows the host's list, or the empty state when there is none", () => {
    const empty = { title: "No suggested roles yet", description: "Fits surfaced by calls appear here." };
    const { container, rerender } = render(
      <CandidateSuggestedRolesPanel count={1} description="Roles raised from calls." empty={empty}>
        <p>Fictional role list</p>
      </CandidateSuggestedRolesPanel>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "candidate-suggested-roles-panel");
    expect(screen.getByText("Suggested roles")).toBeInTheDocument();
    expect(screen.getByText("Roles raised from calls.")).toBeInTheDocument();
    expect(screen.getByText("Fictional role list")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-state"]')).toBeNull();

    rerender(
      <CandidateSuggestedRolesPanel count={0} title="Other roles" empty={empty}>
        <p>Fictional role list</p>
      </CandidateSuggestedRolesPanel>,
    );
    expect(screen.getByText("Other roles")).toBeInTheDocument();
    expect(screen.queryByText("Fictional role list")).toBeNull();
    expect(screen.getByText("No suggested roles yet")).toBeInTheDocument();
  });
});
