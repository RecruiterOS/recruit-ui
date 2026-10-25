import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalendarDays, Link2, Mail, MessageSquare, Phone } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { CandidateActivityTimeline, type CandidateActivityGroup } from "./candidate-activity-timeline";
import { CandidateChannelActions, type CandidateChannel } from "./candidate-channel-actions";

// Fictional people and activity only.
const GROUPS: CandidateActivityGroup[] = [
  {
    id: "today",
    label: "Today",
    items: [
      {
        id: 1,
        icon: CalendarDays,
        iconTone: "info",
        title: "Quarterly planning with Mei",
        subtitle: "Meeting · Fictional notes",
        timestamp: "today",
        body: "Mei: We are hiring two account leads.\nOwen: Let's meet next week.",
        bodyLabel: "Full transcript (68 characters)",
      },
      { id: 2, icon: Mail, title: "Re: Example role", subtitle: "Email · you", timestamp: "today" },
    ],
  },
  { id: "week", label: "This week", items: [] },
  {
    id: "older",
    label: "Older",
    count: 1,
    items: [{ id: 3, icon: MessageSquare, title: "Intro message", timestamp: "2y" }],
  },
];

describe("candidate activity timeline", () => {
  it("groups rows by period under their headings and leaves out empty periods", () => {
    render(<CandidateActivityTimeline groups={GROUPS} aria-label="Fictional history" />);

    // A labelled timeline is a named region, so the label isn't on a generic element.
    const timeline = screen.getByRole("region", { name: "Fictional history" });
    expect(timeline).toHaveAttribute("data-slot", "candidate-activity-timeline");
    const periods = timeline.querySelectorAll('[data-slot="candidate-activity-period"]');
    expect(periods).toHaveLength(2);
    expect(within(periods[0] as HTMLElement).getByRole("heading", { name: "Today" })).toBeInTheDocument();
    expect(within(periods[1] as HTMLElement).getByRole("heading", { name: "Older 1" })).toBeInTheDocument();
    expect(screen.queryByText("This week")).toBeNull();

    const row = screen.getByText("Quarterly planning with Mei");
    expect(row).toHaveClass("line-clamp-2", "whitespace-normal");
    expect(row).not.toHaveClass("font-normal");
    expect(screen.getByText("Meeting · Fictional notes")).toBeInTheDocument();
    expect(screen.getAllByText("today")).toHaveLength(2);
  });

  it("adds no role when unlabelled, and keeps a host role", () => {
    const { unmount } = render(<CandidateActivityTimeline groups={GROUPS} />);
    expect(document.querySelector('[data-slot="candidate-activity-timeline"]')).not.toHaveAttribute("role");
    unmount();
    render(<CandidateActivityTimeline groups={GROUPS} role="group" aria-label="Fictional group" />);
    expect(screen.getByRole("group", { name: "Fictional group" })).toHaveAttribute("data-slot", "candidate-activity-timeline");
  });

  it("keeps a row's body behind a toggle", async () => {
    const user = userEvent.setup();
    render(<CandidateActivityTimeline groups={GROUPS} labels={{ hideBody: "Hide transcript" }} />);

    expect(screen.queryByText(/hiring two account leads/)).toBeNull();
    const toggle = screen.getByRole("button", { name: "Full transcript (68 characters)" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/hiring two account leads/)).toHaveClass("whitespace-pre-wrap");
    await user.click(screen.getByRole("button", { name: "Hide transcript" }));
    expect(screen.queryByText(/hiring two account leads/)).toBeNull();
    // A row without a body has no toggle.
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("makes a row a link or a button that opens something", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn((event) => event.preventDefault());
    const onOpen = vi.fn();
    render(
      <CandidateActivityTimeline
        groups={[
          {
            id: "recent",
            label: "Recently imported",
            items: [
              { id: "a", title: "Weekly sync", subtitle: "Fictional notes · 4k characters", href: "/people/7", onSelect },
              { id: "b", title: "Follow-up call", onSelect: onOpen },
            ],
          },
        ]}
      />,
    );

    const link = screen.getByRole("link", { name: /Weekly sync/ });
    expect(link).toHaveAttribute("href", "/people/7");
    await user.click(link);
    expect(onSelect).toHaveBeenCalledTimes(1);

    const button = screen.getByRole("button", { name: /Follow-up call/ });
    expect(button).toHaveAttribute("type", "button");
    await user.click(button);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("shows skeleton rows while loading and the empty state when nothing happened", () => {
    const { rerender } = render(<CandidateActivityTimeline groups={[]} loading />);
    expect(document.querySelector('[data-slot="candidate-activity-timeline"]')).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("No activity yet")).toBeNull();

    rerender(<CandidateActivityTimeline groups={[{ id: "today", label: "Today", items: [] }]} />);
    expect(screen.getByText("No activity yet")).toBeInTheDocument();
    // No generic filler under a title-only blank slate.
    expect(screen.queryByText(/Get started/)).toBeNull();

    rerender(
      <CandidateActivityTimeline
        groups={[]}
        empty={{ title: "No conversations yet", description: "Emails and calls appear here." }}
      />,
    );
    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
    expect(screen.getByText("Emails and calls appear here.")).toBeInTheDocument();
  });
});

const CHANNELS: CandidateChannel[] = [
  { kind: "email", href: "mailto:mei@example.com", label: "Email Mei", icon: Mail },
  { kind: "phone", href: "tel:5550100", label: "Call Mei", icon: Phone },
  { kind: "profile", href: "https://example.com/in/mei", label: "Mei's profile", icon: Link2 },
];

describe("candidate channel actions", () => {
  it("renders each channel as a named icon link, opening web links in a new tab", () => {
    render(<CandidateChannelActions channels={CHANNELS} label="Contact Mei" />);

    const group = screen.getByRole("group", { name: "Contact Mei" });
    expect(group).toHaveAttribute("data-slot", "candidate-channel-actions");
    expect(group).toHaveAttribute("data-presentation", "icons");
    const email = within(group).getByRole("link", { name: "Email Mei" });
    expect(email).toHaveAttribute("href", "mailto:mei@example.com");
    expect(email).toHaveAttribute("data-channel", "email");
    expect(email).toHaveAttribute("data-slot", "button");
    expect(email).toHaveClass("rounded-full", "h-11", "w-11");
    expect(email).not.toHaveAttribute("target");
    const profile = within(group).getByRole("link", { name: "Mei's profile" });
    expect(profile).toHaveAttribute("target", "_blank");
    expect(profile).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("labels each link in a bar and keeps clicks from a surrounding card", async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();
    render(
      <div onClick={onCardClick}>
        <CandidateChannelActions
          presentation="bar"
          channels={[{ ...CHANNELS[0]!, href: "#email" }, { ...CHANNELS[2]!, external: false, href: "#profile" }]}
        />
      </div>,
    );

    const group = screen.getByRole("group", { name: "Contact" });
    expect(group).toHaveAttribute("data-presentation", "bar");
    const email = within(group).getByRole("link", { name: "Email Mei" });
    expect(email).toHaveTextContent("Email Mei");
    expect(email).toHaveClass("flex-1");
    expect(within(group).getByRole("link", { name: "Mei's profile" })).not.toHaveAttribute("target");
    await user.click(email);
    expect(onCardClick).not.toHaveBeenCalled();
  });

  it("sizes icons down for a dense row and renders nothing without channels", () => {
    const { container, rerender } = render(<CandidateChannelActions channels={CHANNELS} size="compact" />);
    expect(screen.getByRole("link", { name: "Email Mei" })).toHaveClass("h-7", "w-7");

    rerender(<CandidateChannelActions channels={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders two channels of the same kind without a key clash", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <CandidateChannelActions
        channels={[
          { kind: "phone", href: "tel:5550100", label: "Call Mei at work", icon: Phone },
          { kind: "phone", href: "tel:5550101", label: "Call Mei at home", icon: Phone },
        ]}
      />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(error.mock.calls.flat().join(" ")).not.toMatch(/same key/);
    error.mockRestore();
  });
});
