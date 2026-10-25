import { act, fireEvent, render, renderHook, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link2 } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CandidateCardColumnsToggle, useCandidateCardColumns } from "./candidate-card-columns-toggle";
import { CandidateCardList } from "./candidate-card-list";
import { CandidateContactChannelsMenu } from "./candidate-contact-channels-menu";
import { CandidateFavouriteButton } from "./candidate-favourite-button";
import { CandidateGradeBadge } from "./candidate-grade";
import { CandidateProfileLinkButton } from "./candidate-profile-link-button";
import { CandidateSharedProfileButton } from "./candidate-shared-profile-button";

// The setup file reports every media query as matching, which the kit's
// ResponsiveView reads as a phone: it keeps the desktop branch mounted but
// hidden, so the toggle is queried with `hidden: true`.
function useCleanSession() {
  afterEach(() => window.sessionStorage.clear());
}

describe("candidate favourite button", () => {
  it("toggles without selecting the card around it", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onCard = vi.fn();
    const { rerender } = render(
      <div onClick={onCard}>
        <CandidateFavouriteButton favourited={false} onToggle={onToggle} />
      </div>,
    );

    const button = screen.getByRole("button", { name: "Add to favourites" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAttribute("type", "button");
    // The kit's own slot stays on the root, so theme styles still apply.
    expect(button).toHaveAttribute("data-slot", "button");
    await user.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onCard).not.toHaveBeenCalled();

    rerender(
      <div onClick={onCard}>
        <CandidateFavouriteButton
          favourited
          onToggle={onToggle}
          labels={{ remove: "Unstar Fictional Person" }}
        />
      </div>,
    );
    expect(screen.getByRole("button", { name: "Unstar Fictional Person" })).toHaveAttribute("aria-pressed", "true");
  });

  it("draws the idle star muted by default, or in the surrounding colour", () => {
    const { rerender } = render(<CandidateFavouriteButton favourited={false} onToggle={vi.fn()} />);
    const star = () => screen.getByRole("button", { name: "Add to favourites" }).querySelector("svg")!;
    expect(star().getAttribute("class")).toContain("text-muted-foreground");

    rerender(<CandidateFavouriteButton favourited={false} idleTone="inherit" onToggle={vi.fn()} />);
    expect(star().getAttribute("class")).toContain("text-current");
    expect(star().getAttribute("class")).not.toContain("text-muted-foreground");

    // A favourite is always the warning tone, whatever the idle tone.
    rerender(<CandidateFavouriteButton favourited idleTone="inherit" onToggle={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Remove from favourites" }).querySelector("svg")!.getAttribute("class")).toContain("text-amber-600");
  });

  it("lets the host veto a toggle from its own click handler", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <CandidateFavouriteButton
        favourited={false}
        onToggle={onToggle}
        onClick={(event) => event.preventDefault()}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Add to favourites" }));
    expect(onToggle).not.toHaveBeenCalled();
  });
});

describe("candidate profile link button", () => {
  it("opens the host's profile URL in a new tab without selecting the card", () => {
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateProfileLinkButton
          href="https://profiles.example.com/fictional-person"
          title="Open profile on Example Network"
          icon={Link2}
        />
      </div>,
    );

    const link = screen.getByRole("link", { name: "Open profile on Example Network" });
    expect(link).toHaveAttribute("href", "https://profiles.example.com/fictional-person");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toHaveAttribute("data-slot", "button");
    fireEvent.click(link);
    expect(onCard).not.toHaveBeenCalled();
  });

  it("renders a labelled outline button with the host's wording", () => {
    render(
      <CandidateProfileLinkButton
        href="https://profiles.example.com/search?q=Fictional"
        title="Search for Fictional Person"
        icon={Link2}
        presentation="button"
        buttonLabel="Find on Example Network"
      />,
    );
    const link = screen.getByRole("link", { name: "Find on Example Network" });
    expect(link).toHaveAttribute("title", "Search for Fictional Person");
    expect(link).toHaveAttribute("data-variant", "outline");
  });
});

describe("candidate shared profile button", () => {
  it("opens the existing shared page without triggering its parent card", () => {
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateSharedProfileButton
          href="/p/fictional-share"
          label="Preview Fictional Person's shared profile"
        />
      </div>,
    );

    const link = screen.getByRole("link", { name: "Preview Fictional Person's shared profile" });
    expect(link).toHaveAttribute("href", "/p/fictional-share");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("data-size", "icon-sm");
    fireEvent.click(link);
    expect(onCard).not.toHaveBeenCalled();
  });
});

describe("candidate card columns", () => {
  useCleanSession();

  it("remembers the choice per list id, defaulting to one column", () => {
    const { result } = renderHook(() => useCandidateCardColumns("fictional-list"));
    expect(result.current.columns).toBe(1);
    act(() => result.current.setColumns(2));
    expect(result.current.columns).toBe(2);
    expect(window.sessionStorage.getItem("layout-preference-fictional-list")).toContain("compact");

    const again = renderHook(() => useCandidateCardColumns("fictional-list"));
    expect(again.result.current.columns).toBe(2);
    const other = renderHook(() => useCandidateCardColumns("another-fictional-list"));
    expect(other.result.current.columns).toBe(1);
  });

  it("reports one or two columns with host wording", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CandidateCardColumnsToggle
        columns={2}
        onChange={onChange}
        labels={{ group: "Layout", one: "Single column" }}
      />,
    );

    const group = screen.getByRole("radiogroup", { name: "Layout", hidden: true });
    expect(group).toHaveAttribute("data-slot", "candidate-card-columns-toggle");
    expect(within(group).getByRole("radio", { name: "Two cards per row", hidden: true })).toBeChecked();
    await user.click(within(group).getByRole("radio", { name: "Single column", hidden: true }));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});

describe("candidate card list", () => {
  useCleanSession();

  const people = [
    { id: 1, name: "Fictional Person One" },
    { id: 2, name: "Fictional Person Two" },
  ];
  const base = {
    error: null,
    refetch: () => undefined,
    filterSchema: [],
    filters: {},
    onFiltersChange: () => undefined,
    title: "Fictional candidates",
    columnsViewId: "fictional-cards",
    getItemKey: (person: (typeof people)[number]) => person.id,
    renderItem: (person: (typeof people)[number]) => <article>{person.name}</article>,
  };

  it("lays the host's cards out in the remembered column count", async () => {
    const user = userEvent.setup();
    render(
      <CandidateCardList
        {...base}
        data={people}
        loading={false}
        filterActions={<button type="button">Host filter</button>}
      />,
    );

    const grid = document.querySelector('[data-slot="candidate-card-list"]');
    expect(grid).toBeInTheDocument();
    expect(within(grid as HTMLElement).getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Host filter" })).toBeInTheDocument();

    const oneColumn = grid?.className;
    await user.click(screen.getByRole("radio", { name: "Two cards per row", hidden: true }));
    expect(window.sessionStorage.getItem("layout-preference-fictional-cards")).toContain("compact");
    expect(document.querySelector('[data-slot="candidate-card-list"]')?.className).not.toBe(oneColumn);
  });

  it("shows four card skeletons while loading", () => {
    render(<CandidateCardList {...base} data={undefined} loading />);
    const loading = document.querySelector('[data-slot="candidate-card-list-loading"]');
    expect(loading?.children).toHaveLength(4);
  });
});

describe("candidate contact channels menu", () => {
  const options = [
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "chat", label: "Chat" },
  ];

  it("records and refreshes channels without closing or selecting the card", async () => {
    const user = userEvent.setup();
    const onTouch = vi.fn();
    const onRemove = vi.fn();
    const onCard = vi.fn();
    render(
      <div onClick={onCard}>
        <CandidateContactChannelsMenu
          options={options}
          touched={{ email: "2 days ago", phone: null }}
          onTouch={onTouch}
          onRemove={onRemove}
        />
      </div>,
    );

    const trigger = screen.getByRole("button", { name: /Contacted via/ });
    expect(trigger).toHaveAttribute("title", "Record how this candidate was contacted");
    expect(within(trigger).getByText("1")).toBeInTheDocument();
    await user.click(trigger);
    expect(onCard).not.toHaveBeenCalled();

    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("data-slot", "candidate-contact-channels-menu");
    expect(within(menu).getByText("2 days ago")).toBeInTheDocument();

    await user.click(within(menu).getByRole("menuitem", { name: /Phone/ }));
    expect(onTouch).toHaveBeenCalledWith("phone");
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(within(menu).getByRole("menuitem", { name: "Remove Email" }));
    expect(onRemove).toHaveBeenCalledWith("email");
    expect(onCard).not.toHaveBeenCalled();
  });

  it("uses the compact trigger and host wording", async () => {
    const user = userEvent.setup();
    render(
      <CandidateContactChannelsMenu
        compact
        options={options}
        touched={{ chat: "today" }}
        onTouch={() => undefined}
        onRemove={() => undefined}
        labels={{ compactTrigger: "Reached", remove: (option) => <>Clear {option.label}</> }}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Reached/ }));
    expect(screen.getByRole("menuitem", { name: "Clear Chat" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: /Clear Email/ })).not.toBeInTheDocument();
  });
});

describe("candidate grade badge formats", () => {
  it("renders the inline format as one line of text and keeps the kit's slot", () => {
    render(
      <CandidateGradeBadge
        grade="a"
        labels={{ A: "Strong fit" }}
        tone="success"
        format="inline"
        as="span"
        size="compact"
        shrink
        title="Fictional assessor grade"
      />,
    );
    const badge = screen.getByTitle("Fictional assessor grade");
    expect(badge.tagName).toBe("SPAN");
    expect(badge.childNodes).toHaveLength(1);
    expect(badge).toHaveTextContent(/^A — Strong fit$/);
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveAttribute("data-grade", "A");
    expect(badge).toHaveAttribute("data-size", "compact");
    expect(badge).toHaveClass("shrink-0");
  });

  it("drops the label when it is hidden or missing", () => {
    render(
      <>
        <CandidateGradeBadge grade="B" format="inline" title="no label" />
        <CandidateGradeBadge grade="C" labels={{ C: "Hidden" }} showLabel={false} format="inline" title="hidden label" />
        <CandidateGradeBadge grade="unknown" format="inline" title="ungraded" />
      </>,
    );
    expect(screen.getByTitle("no label")).toHaveTextContent(/^B$/);
    expect(screen.getByTitle("hidden label")).toHaveTextContent(/^C$/);
    expect(screen.getByTitle("ungraded")).toHaveTextContent(/^—$/);
    expect(screen.getByTitle("ungraded")).toHaveAttribute("data-grade", "ungraded");
  });

  it("renders the sentiment appearance as the kit's dot pill", () => {
    render(
      <CandidateGradeBadge
        grade="C"
        labels={{ C: "Worth a look" }}
        format="inline"
        appearance="sentiment"
        sentiment="warning"
      />,
    );
    const pill = screen.getByText("C — Worth a look");
    expect(pill.tagName).toBe("SPAN");
    expect(pill).toHaveClass("rounded-full", "border");
    expect(pill.firstElementChild?.tagName).toBe("SPAN");
    expect(pill).not.toHaveAttribute("data-slot");
  });
});
