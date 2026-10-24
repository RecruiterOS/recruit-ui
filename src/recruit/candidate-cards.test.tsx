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
});
