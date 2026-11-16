import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CallReconcileCard } from "./call-reconcile-card";
import { CandidateAssessment } from "./candidate-assessment";
import { CandidateDecisionSummary } from "./candidate-decision-summary";
import { JobSummaryCard } from "./job-summary-card";
import { MatchedCallCard } from "./matched-call-card";

/**
 * Text that sits one line under another shares a left edge. These hold the
 * places where two parts of one card were padded by different amounts, so a
 * heading, a list or a row started a few pixels to one side of its neighbour.
 */
const classes = (element: Element | null | undefined, pattern: RegExp) =>
  [...(element?.classList ?? [])].filter((name) => pattern.test(name)).sort();

// Fictional people only.
const MEI = { id: 7, name: "Mei Example" };
const OWEN = { id: 8, name: "Owen Sample" };

describe("shared left edges", () => {
  it("a job summary's facts start where its title does", () => {
    const { container } = render(
      <JobSummaryCard title="Fictional Platform Engineer" facts={[{ id: "place", label: "Location", value: "Fictional City" }]} onSelect={() => undefined} />,
    );

    const header = screen.getByRole("heading", { level: 3 }).closest("section");
    const facts = container.querySelector("dl");
    expect(classes(facts, /^px-/)).toEqual(["px-5.5"]);
    expect(classes(header, /^px-/)).toEqual(classes(facts, /^px-/));
  });

  it("a decision summary's two rows are padded and spaced alike", () => {
    render(
      <CandidateDecisionSummary
        decision={{ heading: "Your decision", verdict: "Yes", tone: "positive", stage: "Screened" }}
        assessment={{ letter: "A", tone: "success", heading: "Assessment", label: "Strong fit" }}
      />,
    );

    const row = (heading: string) => screen.getByText(heading).parentElement?.parentElement;
    const box = /^(p|px|gap)-/;
    expect(classes(row("Your decision"), box)).toEqual(["gap-2", "p-3"]);
    expect(classes(row("Assessment"), box)).toEqual(classes(row("Your decision"), box));
  });

  it("an assessment's grade keeps its own width", () => {
    const { container, rerender } = render(<CandidateAssessment grade={<span>Fictional grade</span>} summary="Fictional summary." />);

    // A row of its own: a column would stretch a badge across the panel.
    const slot = container.querySelector("[data-slot='candidate-assessment-grade']");
    expect(slot).toContainElement(screen.getByText("Fictional grade"));
    expect(slot).toHaveClass("flex-row");

    rerender(<CandidateAssessment summary="Fictional summary." />);
    expect(container.querySelector("[data-slot='candidate-assessment-grade']")).toBeNull();
  });

  it("a matched call's first name starts on the title's edge", () => {
    render(
      <MatchedCallCard
        people={[MEI, OWEN]}
        onOpenPerson={() => undefined}
        insights={{ status: "idle", generating: false, error: null, onGenerate: vi.fn() }}
      />,
    );

    // The name is a padded button: the first is pulled back by its padding.
    const first = screen.getByRole("button", { name: "Open Mei Example" });
    expect(classes(first, /^(-ml|px)-/)).toEqual(["-ml-2", "px-2"]);
    expect(classes(screen.getByRole("button", { name: "Open Owen Sample" }), /^-ml-/)).toEqual([]);
  });

  it("a call to reconcile adds no padding inside the card's action bar", () => {
    render(
      <CallReconcileCard
        title="Call with Mei"
        transcript="Mei: Exploring a move next year."
        searchPeople={vi.fn(async () => [OWEN])}
        onDismiss={vi.fn()}
        onAttach={vi.fn()}
        onCreateAttach={vi.fn()}
        renderPreview={() => null}
      />,
    );

    // The bar is padded by the card. A second padding set the heading 14px inside the summary above it.
    const bar = screen.getByText("Attach this call to a person").closest(".bg-muted\\/30");
    expect(bar).not.toBeNull();
    expect(classes(bar?.firstElementChild, /^p[xy]?-/)).toEqual([]);
  });
});
