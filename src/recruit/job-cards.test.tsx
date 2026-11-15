import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { coverBannerVariant } from "@epicbagel/saas-kit/primitives/cover-banner";
import { describe, expect, it, vi } from "vitest";

import { CandidatePipelineCard } from "./candidate-pipeline-card";
import { CandidateReviewCard } from "./candidate-review-card";
import { JobClientBadge } from "./job-client-badge";
import { JobSummaryCard } from "./job-summary-card";

// Fictional jobs, organisations and people only.
const facts = [
  { id: "location", label: "Location", value: "Example City · hybrid" },
  { id: "review", label: "To review", value: "3" },
];

describe("job summary card", () => {
  it("opens the job from its header and facts, never from its footer", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onFooterAction = vi.fn();
    const { container } = render(
      <JobSummaryCard
        title="Fictional Platform Engineer"
        subtitle="Job 42"
        logo={<span data-testid="logo">FO</span>}
        facts={facts}
        onSelect={onOpen}
        footer={<button type="button" onClick={onFooterAction}>Run a fictional search</button>}
        footerAlign="end"
        id="fictional-job"
      />,
    );

    const root = container.firstElementChild;
    expect(root).toHaveAttribute("data-slot", "job-summary-card");
    expect(root).toHaveAttribute("id", "fictional-job");

    const heading = screen.getByRole("heading", { level: 3, name: "Fictional Platform Engineer" });
    const open = heading.closest("button");
    expect(open).not.toBeNull();
    expect(within(open!).getByText("Job 42")).toBeInTheDocument();
    expect(within(open!).getByTestId("logo")).toBeInTheDocument();
    expect(within(open!).getByText("Example City · hybrid")).toBeInTheDocument();
    expect(within(open!).getByText("To review")).toBeInTheDocument();

    const footerAction = screen.getByRole("button", { name: "Run a fictional search" });
    expect(open!.contains(footerAction)).toBe(false);

    await user.click(footerAction);
    expect(onFooterAction).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();

    await user.click(screen.getByText("Example City · hybrid"));
    expect(onOpen).toHaveBeenCalledTimes(1);

    open!.focus();
    await user.keyboard("{Enter}");
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it("draws no badge, subtitle or footer row for empty slots", () => {
    const { container } = render(
      <JobSummaryCard title="Fictional Data Analyst" subtitle="" badge={null} facts={[]} onSelect={() => undefined} />,
    );

    const open = screen.getByRole("button");
    // The heading is the only text; no empty subtitle paragraph is drawn.
    expect(open.querySelectorAll("p")).toHaveLength(0);
    expect(container.querySelectorAll("button")).toHaveLength(1);
    expect(container.querySelector('[data-slot="badge"]')).toBeNull();
    // Without a footer the button keeps the card's own rounded corners.
    expect(open.className).not.toContain("rounded-b-none");
  });

  it("shows the badge slot at the end of the header", () => {
    render(
      <JobSummaryCard
        title="Fictional Platform Engineer"
        badge={<JobClientBadge name="Fernhill Example Co" title="Client: Fernhill Example Co" />}
        facts={facts}
        onSelect={() => undefined}
      />,
    );

    const badge = screen.getByTitle("Client: Fernhill Example Co");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveTextContent("Fernhill Example Co");
  });

  it("uses the same card-title size as the candidate review card", () => {
    render(
      <>
        <JobSummaryCard title="Fictional Platform Engineer" facts={[]} onSelect={() => undefined} />
        <CandidateReviewCard name="Fictional Candidate" facts={[]} />
      </>,
    );

    const jobTitle = screen.getByRole("heading", { name: "Fictional Platform Engineer" });
    const candidateName = screen.getByRole("heading", { name: "Fictional Candidate" });
    expect(jobTitle.className).toBe(candidateName.className);
  });
});

describe("candidate review card", () => {
  it("draws their cover, and the kit's stock banner for someone who has none", () => {
    const { container, rerender } = render(<CandidateReviewCard name="Mei Example" />);
    const frame = () => container.querySelector('[data-slot="candidate-cover-image"]');
    const banner = () => container.querySelector('[data-slot="candidate-cover-image"] [data-slot="cover-banner"]');

    // The same 4:1 frame either way, so a list of cards is one height.
    expect(banner()).toHaveAttribute("data-variant", coverBannerVariant("Mei Example"));
    expect(frame()?.parentElement).toHaveStyle({ paddingBottom: "25%" });

    // One person keeps one banner wherever the host names the same seed.
    rerender(<CandidateReviewCard name={<a href="https://example.com/mei">Mei Example</a>} coverSeed="person-7" />);
    expect(banner()).toHaveAttribute("data-variant", coverBannerVariant("person-7"));
    expect(coverBannerVariant("person-7")).not.toBe(coverBannerVariant("Mei Example"));

    rerender(<CandidateReviewCard name="Mei Example" cover={<img alt="Fictional landscape" />} />);
    expect(banner()).toBeNull();
    expect(frame()).toContainElement(screen.getByAltText("Fictional landscape"));

    rerender(<CandidateReviewCard name="Mei Example" cover={null} />);
    expect(frame()).toBeNull();
  });
});

describe("job client badge", () => {
  it("keeps the kit badge slot, one line of text and the name in its tooltip", () => {
    render(<JobClientBadge name="Saltmarsh Example Robotics" data-testid="client" />);

    const badge = screen.getByTestId("client");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveAttribute("title", "Saltmarsh Example Robotics");
    expect(within(badge).getByText("Saltmarsh Example Robotics").className).toContain("truncate");
  });

  it("takes the host's wording for the tooltip", () => {
    render(<JobClientBadge name={<em>Tidewater Example Freight</em>} title="Hiring for Tidewater Example Freight" />);
    expect(screen.getByTitle("Hiring for Tidewater Example Freight")).toHaveTextContent("Tidewater Example Freight");
  });
});

describe("candidate pipeline card", () => {
  it("selects the candidate from the card but not from a nested control", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onAction = vi.fn();
    render(
      <CandidatePipelineCard
        name="Imogen Example"
        headline="Staff Engineer"
        company={<span>Fernhill Example Co</span>}
        badges={<span>A</span>}
        // A host link that forgets to stop propagation still doesn't select.
        actions={
          <a
            href="https://profiles.example.com/imogen-example"
            onClick={(event) => {
              event.preventDefault();
              onAction();
            }}
          >
            Preview
          </a>
        }
        onSelect={onSelect}
      />,
    );

    const card = document.querySelector('[data-slot="candidate-pipeline-card"]') as HTMLElement;
    expect(card.tagName).toBe("BUTTON");
    expect(card).toHaveAttribute("type", "button");
    expect(within(card).getByText("Staff Engineer")).toBeInTheDocument();
    expect(within(card).getByText("Fernhill Example Co")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Preview" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();

    await user.click(within(card).getByText("Imogen Example"));
    expect(onSelect).toHaveBeenCalledTimes(1);

    card.focus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it("draws their cover, the kit's stock banner without one, and no empty headline or badge row", () => {
    const { container, rerender } = render(
      <CandidatePipelineCard name="Mei Example" headline="" onSelect={() => undefined} />,
    );

    const card = container.firstElementChild as HTMLElement;
    const banner = () => card.querySelector('[data-slot="candidate-cover-image"] [data-slot="cover-banner"]');
    expect(banner()).toHaveAttribute("data-variant", coverBannerVariant("Mei Example"));
    // Only the name line.
    expect(card.querySelectorAll("p")).toHaveLength(1);

    rerender(<CandidatePipelineCard name="Mei Example" coverSeed="person-7" onSelect={() => undefined} />);
    expect(banner()).toHaveAttribute("data-variant", coverBannerVariant("person-7"));

    rerender(<CandidatePipelineCard name="Mei Example" cover={null} onSelect={() => undefined} />);
    expect(card.querySelector('[data-slot="candidate-cover-image"]')).toBeNull();

    rerender(
      <CandidatePipelineCard
        name="Mei Example"
        cover={<div data-testid="cover" />}
        onSelect={() => undefined}
      />,
    );
    expect(card.querySelector('[data-slot="candidate-cover-image"]')).not.toBeNull();
    expect(screen.getByTestId("cover")).toBeInTheDocument();
    expect(banner()).toBeNull();
  });
});
