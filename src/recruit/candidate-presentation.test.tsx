import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { CandidateAssessment } from "./candidate-assessment";
import { CandidateCareerHistoryTimeline } from "./candidate-career-history-timeline";
import { CandidateCoverHeader, CandidateCoverImage } from "./candidate-cover-header";
import {
  CandidateProfile,
  CandidateProfileBody,
  CandidateProfileFooter,
  CandidateProfileHeader,
} from "./candidate-profile";
import {
  candidateGradeDisplay,
  candidateGradeLabel,
  CandidateGradeBadge,
} from "./candidate-grade";
import { CandidateQuote } from "./candidate-quote";

describe("candidate presentation", () => {
  it("keeps cover media optional and at a four-to-one ratio", () => {
    const { rerender } = render(<CandidateCoverImage />);
    expect(document.querySelector('[data-slot="candidate-cover-image"]')).not.toBeInTheDocument();

    rerender(
      <CandidateCoverImage>
        <img alt="Fictional landscape" />
      </CandidateCoverImage>,
    );
    const frame = document.querySelector('[data-slot="candidate-cover-image"]');
    expect(frame).toBeInTheDocument();
    expect(frame?.parentElement).toHaveStyle({ paddingBottom: "25%" });
  });

  it("sits a header flush without clipping it unless a cover needs the clip", () => {
    const { rerender } = render(<CandidateProfileHeader name="Mei Example" padding="none" />);
    const header = () => document.querySelector('[data-slot="candidate-profile-header"]');
    expect(header()).not.toHaveClass("overflow-hidden");
    const padded = /(^|\s)p[xytb]?-/;
    expect(header()?.firstElementChild?.className).not.toMatch(padded);

    rerender(<CandidateProfileHeader name="Mei Example" />);
    expect(header()).toHaveClass("overflow-hidden");
    expect(header()?.firstElementChild?.className).toMatch(padded);

    rerender(
      <CandidateCoverHeader padding="none" cover={<img alt="Fictional landscape" />}>
        Mei Example
      </CandidateCoverHeader>,
    );
    expect(document.querySelector('[data-slot="candidate-cover-header"]')).toHaveClass("overflow-hidden");
  });

  it("puts actions on the name line, or beside the whole identity on request", () => {
    const link = <a href="https://example.com/mei">Mei's profile</a>;
    const meta = <span>Fictional meta</span>;
    const { rerender } = render(<CandidateProfileHeader name="Mei Example" meta={meta} actions={link} />);
    const nameRow = () => screen.getByRole("heading", { level: 1, name: "Mei Example" }).parentElement;
    expect(nameRow()).toContainElement(screen.getByRole("link", { name: "Mei's profile" }));
    expect(document.querySelector('[data-slot="candidate-profile-header-actions"]')).not.toBeInTheDocument();

    rerender(<CandidateProfileHeader name="Mei Example" meta={meta} actions={link} actionsPlacement="aside" />);
    const actions = document.querySelector('[data-slot="candidate-profile-header-actions"]');
    expect(actions).toContainElement(screen.getByRole("link", { name: "Mei's profile" }));
    // Off the name line, so a tall control can't push the meta down...
    expect(nameRow()).not.toContainElement(screen.getByRole("link", { name: "Mei's profile" }));
    // ...and beside the identity, meta included, rather than under it.
    const identity = actions?.previousElementSibling;
    expect(identity).toContainElement(screen.getByText("Fictional meta"));
    expect(actions?.parentElement).toHaveClass("flex-row", "items-start");
    // A row of its own that keeps its width, so the identity wraps instead.
    expect(actions).toHaveClass("flex-row", "items-center", "shrink-0");

    // Nothing to place, nothing drawn.
    rerender(<CandidateProfileHeader name="Mei Example" actionsPlacement="aside" />);
    expect(document.querySelector('[data-slot="candidate-profile-header-actions"]')).not.toBeInTheDocument();
  });

  it("prints flat and centres a compact credit footer only when asked", () => {
    const profile = (props: { flat?: boolean; footer: ReactNode }) => (
      <CandidateProfile
        header={<CandidateProfileHeader name="Mei Example" />}
        footer={props.footer}
        printMode={props.flat ? "flat" : undefined}
      >
        <CandidateProfileBody>Fictional body</CandidateProfileBody>
      </CandidateProfile>
    );
    const root = () => document.querySelector('[data-slot="candidate-profile"]');
    const footer = () => document.querySelector('[data-slot="candidate-profile-footer"]');

    const { rerender } = render(profile({ footer: <CandidateProfileFooter>Fictional actions</CandidateProfileFooter> }));
    expect(root()?.className).not.toMatch(/print:/);
    expect(footer()).toHaveClass("px-[26px]", "py-[26px]", "flex", "gap-2");
    expect(footer()?.className).not.toMatch(/justify-|print:/);

    rerender(
      profile({
        flat: true,
        footer: (
          <CandidateProfileFooter justify="center" padding="compact" printVisibility="hidden">
            Shared via a fictional agency
          </CandidateProfileFooter>
        ),
      }),
    );
    expect(root()).toHaveClass("print:border-0");
    expect(footer()?.tagName).toBe("FOOTER");
    expect(footer()).toHaveClass("justify-center", "px-[22px]", "py-[18px]", "print:hidden");
    expect(footer()).not.toHaveClass("px-[26px]");
  });

  it("renders quiet quotes without nested card treatment", () => {
    render(
      <CandidateQuote attribution="Fictional note" lineClamp={2}>
        Example excerpt
      </CandidateQuote>,
    );
    const quote = document.querySelector('[data-slot="candidate-quote"]');
    expect(quote).not.toHaveClass("border", "bg-card");
    expect(screen.getByText(/Example excerpt/)).toHaveClass("italic", "line-clamp-2");
    expect(screen.getByText(/Fictional note/)).toHaveTextContent("— Fictional note");
  });

  it("shows recent companies in detail and accepts host-formatted dates", async () => {
    const user = userEvent.setup();
    render(
      <CandidateCareerHistoryTimeline
        items={[
          {
            title: "Lead Example Role",
            company: "Fictional North",
            dateRange: "Host-formatted recent date",
            description: "First point • Second point • Third point • Fourth point",
          },
          {
            title: "Example Role",
            company: "Fictional South",
            startDate: "2021-02",
            endDate: "2023-04",
          },
          {
            title: "Earlier Example Role",
            company: "Fictional West",
            startDate: 2019,
            endDate: 2021,
          },
        ]}
      />,
    );

    expect(
      screen.getByText((_, element) =>
        element?.textContent === "Fictional North · Host-formatted recent date",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Earlier")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(screen.getByRole("button", { name: "Show less" })).toBeInTheDocument();
  });

  it("draws evidence, caveats and signals from items in the package's own lists", () => {
    render(
      <CandidateAssessment
        facts={[{ label: "Company", value: "Fernhill Example Co" }]}
        summary="Fictional summary of why this person fits."
        evidenceItems={["Led a fictional platform migration", "Hired an example team of six"]}
        caveatItems={["Confirm the example notice period"]}
        signalItems={[
          { text: "Fictional promotion last spring", sentiment: "positive" },
          { text: "Example tenure under a year", sentiment: "warning" },
        ]}
        labels={{ summary: "Why they fit", caveats: "Open questions" }}
      />,
    );

    const assessment = document.querySelector('[data-slot="candidate-assessment"]') as HTMLElement;
    expect(assessment).toHaveClass("px-[26px]", "py-[26px]");
    expect([...assessment.querySelectorAll("h3")].map((heading) => heading.textContent)).toEqual([
      "Why they fit",
      "Evidence",
      "Open questions",
      "Signals",
    ]);

    const evidence = assessment.querySelector('[data-slot="candidate-assessment-evidence"]') as HTMLElement;
    expect(evidence.tagName).toBe("UL");
    const points = within(evidence).getAllByRole("listitem");
    expect(points.map((point) => point.textContent)).toEqual([
      "Led a fictional platform migration",
      "Hired an example team of six",
    ]);
    // Each point carries a decorative check mark.
    for (const point of points) expect(point.querySelector("svg")).toHaveAttribute("aria-hidden", "true");

    const caveats = assessment.querySelector('[data-slot="candidate-assessment-caveats"]') as HTMLElement;
    expect(caveats).toHaveClass("list-disc");
    expect(within(caveats).getByRole("listitem")).toHaveTextContent("Confirm the example notice period");

    const signals = assessment.querySelector('[data-slot="candidate-summary-bullets"]') as HTMLElement;
    expect(within(signals).getAllByRole("listitem").map((line) => line.textContent)).toEqual([
      "Positive: Fictional promotion last spring",
      "Caution: Example tenure under a year",
    ]);
  });

  it("prefers a slot over items, leaves out empty sections and sits flush on request", () => {
    render(
      <CandidateAssessment
        padding="none"
        evidence={<p>Fictional evidence written by the host</p>}
        evidenceItems={["Never shown"]}
        caveatItems={[]}
        signalItems={[]}
      />,
    );

    const assessment = document.querySelector('[data-slot="candidate-assessment"]') as HTMLElement;
    expect(assessment.className).not.toMatch(/(^|\s)p[xy]?-/);
    expect(screen.getByText("Fictional evidence written by the host")).toBeInTheDocument();
    expect(screen.queryByText("Never shown")).not.toBeInTheDocument();
    expect(assessment.querySelector('[data-slot="candidate-assessment-evidence"]')).toBeNull();
    expect(screen.queryByText("Caveats")).not.toBeInTheDocument();
    expect(screen.queryByText("Signals")).not.toBeInTheDocument();
    expect(assessment.querySelector('[data-slot="candidate-summary-bullets"]')).toBeNull();
  });

  it("keeps grade assignment separate from A-D presentation", () => {
    const hostLabels = {
      A: "Host-defined primary label",
      D: "Host-defined alternate label",
    };

    expect(candidateGradeLabel("A", hostLabels)).toBe("Host-defined primary label");
    expect(candidateGradeDisplay("D", hostLabels)).toBe("D — Host-defined alternate label");
    expect(candidateGradeDisplay("B", hostLabels)).toBe("B");
    expect(candidateGradeDisplay("private-state", hostLabels)).toBe("—");
    render(
      <CandidateGradeBadge
        grade="B"
        label="Host-defined badge label"
        tone="info"
      />,
    );
    expect(screen.getByText("Host-defined badge label")).toBeInTheDocument();
    const badge = document.querySelector('[data-grade="B"]');
    expect(badge).toHaveAttribute("data-variant", "info");
    // The kit's own slot stays on the root, so theme styles still apply.
    expect(badge).toHaveAttribute("data-slot", "badge");
  });
});
