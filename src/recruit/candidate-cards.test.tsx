import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CandidateInlineCard } from "./candidate-inline-card";
import { CandidateReviewCard } from "./candidate-review-card";

describe("candidate card activation", () => {
  it("keeps an inline card keyboard accessible without firing for nested actions", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onAction = vi.fn();
    render(
      <CandidateInlineCard
        name="Fictional Candidate"
        onSelect={onSelect}
        aria-expanded="true"
        actions={<button onClick={onAction}>Secondary action</button>}
      />,
    );

    const card = document.querySelector('[data-slot="candidate-inline-card"]');
    const trigger = screen.getByRole("button", {
      name: "Open candidate profile Fictional Candidate",
    });
    const secondaryAction = screen.getByRole("button", { name: "Secondary action" });
    expect(card?.tagName).toBe("ARTICLE");
    expect(card).not.toHaveAttribute("role");
    expect(card).not.toHaveAttribute("tabindex");
    expect(card).not.toHaveAttribute("aria-expanded");
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger.contains(secondaryAction)).toBe(false);

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);

    await user.click(secondaryAction);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText("Fictional Candidate"));
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it("uses the canonical thin card and preserves independent review actions", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onHeaderAction = vi.fn();
    render(
      <CandidateReviewCard
        name="Fictional Candidate"
        onSelect={onSelect}
        headerActions={<button onClick={onHeaderAction}>Header action</button>}
        facts={[{ label: "Location", value: "Example City" }]}
        insight={{ label: "Review note", value: "Explicitly fictional fixture." }}
        actions={<section data-testid="owned-actions">Owned actions</section>}
      />,
    );

    const card = document.querySelector('[data-slot="candidate-review-card"]');
    const trigger = screen.getByRole("button", {
      name: "Open candidate review Fictional Candidate",
    });
    const headerAction = screen.getByRole("button", { name: "Header action" });
    expect(card?.tagName).toBe("ARTICLE");
    expect(card).not.toHaveAttribute("role");
    expect(card).not.toHaveAttribute("tabindex");
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.contains(headerAction)).toBe(false);
    // The card clips its content, which would cut a ring drawn outside the
    // trigger: the ring is drawn inside it, so keyboard focus stays visible.
    expect(card).toHaveClass("overflow-hidden");
    expect(trigger).toHaveClass("focus-visible:ring-2", "focus-visible:ring-inset", "focus-visible:ring-offset-0");
    expect(trigger).not.toHaveClass("focus-visible:ring-offset-2");
    expect(card).toHaveClass("border");
    expect(card).not.toHaveClass("border-2");
    expect(screen.getByTestId("owned-actions").parentElement).not.toHaveClass("p-6");
    expect(document.querySelector('[data-slot="candidate-review-card-header-actions"]')).toHaveClass(
      "justify-self-start",
      "sm:justify-self-auto",
    );

    await user.click(headerAction);
    expect(onHeaderAction).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();

    await user.click(screen.getByText("Fictional Candidate"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("lays an inline card out as one dense row when compact", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { rerender } = render(
      <CandidateInlineCard
        name="Fictional Candidate"
        headline="Example Role · Fictional North"
        meta="Last touched two weeks ago"
        avatar={<span data-testid="avatar" />}
      />,
    );

    const card = document.querySelector('[data-slot="candidate-inline-card"]');
    const content = document.querySelector('[data-slot="candidate-inline-card-content"]');
    expect(card).toHaveAttribute("data-density", "comfortable");
    expect(content).toHaveClass("px-5", "py-4");
    expect(content).not.toHaveClass("h-full");
    expect(screen.getByRole("heading", { name: "Fictional Candidate" })).toHaveClass("font-semibold");

    rerender(
      <CandidateInlineCard
        density="compact"
        name="Fictional Candidate"
        headline="Example Role · Fictional North"
        meta="Last touched two weeks ago"
        avatar={<span data-testid="avatar" />}
        onSelect={onSelect}
        selectLabel="Open Fictional Candidate"
        actions={<button type="button">Profile</button>}
      />,
    );
    expect(card).toHaveAttribute("data-density", "compact");
    expect(content).toHaveClass("px-3", "py-2", "h-full");
    expect(content).not.toHaveClass("px-5");
    // Content centres in whatever height the host gives the row.
    expect(content?.firstElementChild).toHaveClass("h-full", "items-center");
    const heading = screen.getByRole("heading", { name: "Fictional Candidate" });
    expect(heading).toHaveClass("text-sm", "font-medium", "truncate");
    // Every line truncates and sits on snug leading, so the lines fit the row's height.
    expect(screen.getByText("Example Role · Fictional North")).toHaveClass("text-xs", "truncate", "leading-snug");
    expect(screen.getByText("Last touched two weeks ago")).toHaveClass("truncate", "leading-snug");
    expect(screen.getByText("Example Role · Fictional North")).not.toHaveClass("leading-relaxed");
    // The actions lay out as items of the row (the wrapper has no box), and on
    // a touchscreen every link and button among them is at least 44px square.
    const actions = document.querySelector('[data-slot="candidate-inline-card-actions"]');
    expect(actions).toHaveClass("contents");
    expect(actions?.className).toContain("pointer-coarse:[&_button]:min-h-[max(44px,2.75rem)]");
    expect(actions?.className).toContain("pointer-coarse:[&_button]:min-w-[max(44px,2.75rem)]");
    expect(actions?.className).toContain("pointer-coarse:[&_a]:min-h-[max(44px,2.75rem)]");
    expect(actions?.className).toContain("pointer-coarse:[&_a]:min-w-[max(44px,2.75rem)]");
    expect(actions).toContainElement(screen.getByRole("button", { name: "Profile" }));

    await user.click(screen.getByRole("button", { name: "Profile" }));
    expect(onSelect).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Open Fictional Candidate" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("keeps a leading glyph on the meta line's text line, in either density", () => {
    const meta = (
      <>
        <svg data-testid="meta-glyph" aria-hidden="true" />
        Example City
      </>
    );
    const { rerender } = render(<CandidateInlineCard name="Fictional Candidate" meta={meta} />);

    const line = document.querySelector('[data-slot="candidate-inline-card-meta"]');
    // The glyph is a direct child of the line, beside the text, not a block above it.
    expect(screen.getByTestId("meta-glyph").parentElement).toBe(line);
    expect(line).toHaveTextContent("Example City");
    expect(line).toHaveClass("[&>svg]:inline-block", "[&>svg]:align-[-0.125em]", "[&>svg]:me-1.5");
    // Still a text line: it wraps when comfortable...
    expect(line).not.toHaveClass("flex", "inline-flex", "truncate");

    // ...and truncates with an ellipsis when compact.
    rerender(<CandidateInlineCard density="compact" name="Fictional Candidate" meta={meta} />);
    const compactLine = document.querySelector('[data-slot="candidate-inline-card-meta"]');
    expect(compactLine).toHaveClass("truncate", "[&>svg]:inline-block");
    expect(screen.getByTestId("meta-glyph").parentElement).toBe(compactLine);
  });

  it("can set a comfortable card's name large, wrap its headline and centre its actions", () => {
    const headline = "Senior Account Executive · Fictional Northwind Example Co";
    const { rerender } = render(
      <CandidateInlineCard name="Fictional Candidate" headline={headline} actions={<svg data-testid="chevron" />} />,
    );
    const heading = screen.getByRole("heading", { name: "Fictional Candidate" });
    const line = () => document.querySelector('[data-slot="candidate-inline-card-headline"]');
    const actions = () => document.querySelector('[data-slot="candidate-inline-card-actions"]');
    // By default: an inline heading, a headline that ends in an ellipsis, actions level with the name.
    expect(heading).toHaveClass("text-sm", "font-semibold");
    expect(line()).toHaveClass("truncate");
    expect(actions()).not.toHaveClass("[&>*]:self-center");

    rerender(
      <CandidateInlineCard
        name="Fictional Candidate"
        headline={headline}
        nameSize="lg"
        headlineWrap
        actionsAlign="center"
        actions={<svg data-testid="chevron" />}
      />,
    );
    expect(heading.tagName).toBe("H5");
    expect(heading).toHaveClass("text-lg", "font-semibold");
    expect(heading).not.toHaveClass("text-sm");
    expect(line()).toHaveTextContent(headline);
    expect(line()).not.toHaveClass("truncate");
    // Still no box of its own: the chevron is centred as an item of the row.
    expect(actions()).toHaveClass("contents", "[&>*]:self-center");

    // A compact row keeps its height whatever the options say.
    rerender(
      <CandidateInlineCard
        density="compact"
        name="Fictional Candidate"
        headline={headline}
        nameSize="lg"
        headlineWrap
        actionsAlign="center"
        actions={<svg data-testid="chevron" />}
      />,
    );
    expect(heading).toHaveClass("text-sm", "font-medium");
    expect(line()).toHaveClass("truncate");
    expect(actions()).not.toHaveClass("[&>*]:self-center");
  });

  it("leaves a comfortable card's actions at their own size, and adds no wrapper without actions", () => {
    const { rerender } = render(
      <CandidateInlineCard name="Fictional Candidate" actions={<button type="button">Profile</button>} />,
    );
    const actions = document.querySelector('[data-slot="candidate-inline-card-actions"]');
    expect(actions).toHaveClass("contents");
    expect(actions?.className).not.toContain("pointer-coarse");

    rerender(<CandidateInlineCard density="compact" name="Fictional Candidate" />);
    expect(document.querySelector('[data-slot="candidate-inline-card-actions"]')).toBeNull();
  });
});
