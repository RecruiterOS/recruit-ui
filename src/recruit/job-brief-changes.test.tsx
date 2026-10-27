import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { JobBriefChanges, jobBriefChangeText, type JobBriefChange } from "./job-brief-changes";

// A fictional brief's changes only.

const changes: JobBriefChange[] = [
  { kind: "set", field: "location", from: "Example City", to: "Example City or Example Town" },
  { kind: "added", field: "must-have", item: "Example tooling" },
  { kind: "removed", field: "nice-to-have", item: "Fictional buyers" },
  { kind: "moved", field: "must-have", item: "Example tooling", to: 1 },
  { kind: "replaced", field: "interview steps", to: [{}, {}, {}] },
  { kind: "reworded", field: "red flag", from: "Fictional flag", to: "A fictional flag" },
  { kind: "cleared", field: "location", from: "Example City" },
];

/** The shown lines, each as "kind: text". */
function lines(root: HTMLElement) {
  return [...root.querySelectorAll('[data-slot="trace-line"][data-change-kind]')].map(
    (line) => `${line.getAttribute("data-change-kind")}: ${line.textContent}`,
  );
}

describe("job brief changes", () => {
  it("is a group named for its version, marked as the brief's changes", () => {
    render(<JobBriefChanges version={4} changes={changes.slice(0, 2)} id="fictional-changes" />);
    const group = screen.getByRole("group", { name: "What changed in v4" });
    expect(group).toHaveAttribute("data-slot", "job-brief-changes");
    expect(group).toHaveAttribute("id", "fictional-changes");
    // The kit's trace lines inside keep their own slot.
    expect(group.querySelector('[data-slot="trace"]')).not.toBeNull();
  });

  it("is named without a version, and a host's own name wins", () => {
    const { rerender } = render(<JobBriefChanges changes={changes.slice(0, 1)} />);
    expect(screen.getByRole("group", { name: "What changed" })).toBeInTheDocument();
    rerender(<JobBriefChanges version={2} changes={changes.slice(0, 1)} aria-label="Fictional changes" />);
    expect(screen.getByRole("group", { name: "Fictional changes" })).toBeInTheDocument();
  });

  it("words each line as jobBriefChangeText does, leading with an icon a screen reader skips", () => {
    render(<JobBriefChanges version={2} changes={changes.slice(0, 3)} />);
    const group = screen.getByRole("group");
    expect(lines(group)).toEqual([
      "set: Location: Example City → Example City or Example Town",
      "added: Added must-have: Example tooling",
      "removed: Removed nice-to-have: Fictional buyers",
    ]);
    expect(lines(group).map((line) => line.slice(line.indexOf(": ") + 2))).toEqual(
      changes.slice(0, 3).map((change) => jobBriefChangeText(change)),
    );
    const icons = group.querySelectorAll('[data-slot="trace-icon"]');
    expect(icons).toHaveLength(3);
    for (const icon of icons) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon.querySelector("svg")).not.toBeNull();
    }
    // Nothing folded, so no toggle.
    expect(within(group).queryByRole("button")).toBeNull();
  });

  it("leads each kind with its own icon, and none with a sentiment colour", () => {
    const { container } = render(<JobBriefChanges changes={changes} previewCount={changes.length} />);
    const icon = (kind: string) =>
      container.querySelector(`[data-change-kind="${kind}"] svg`)!.getAttribute("class")!.match(/lucide-[a-z-]+/)![0];
    expect(icon("added")).toBe("lucide-plus");
    expect(icon("removed")).toBe("lucide-minus");
    expect(icon("cleared")).toBe("lucide-minus");
    expect(icon("set")).toBe("lucide-arrow-right");
    expect(icon("reworded")).toBe("lucide-arrow-right");
    expect(icon("moved")).toBe("lucide-arrow-up-down");
    expect(icon("replaced")).toBe("lucide-refresh-cw");
    // A removal isn't bad news: no line or icon takes a tone. (The kit's
    // trace line colours only an errored line, which these never are.)
    const classes = [...container.querySelectorAll("[class]")].flatMap((element) =>
      element.getAttribute("class")!.split(/\s+/),
    );
    expect(classes.filter((name) => /^text-(?:destructive|success|warning|error|info|primary)$/.test(name))).toEqual([]);
    expect(container.querySelector("[data-status]")).toBeNull();
    for (const svg of container.querySelectorAll("svg")) expect(svg).toHaveClass("text-current");
  });

  it("shows the first three and folds the rest under a toggle that opens them in place", async () => {
    const user = userEvent.setup();
    render(<JobBriefChanges version={3} changes={changes.slice(0, 5)} />);
    const group = screen.getByRole("group", { name: "What changed in v3" });
    expect(lines(group)).toHaveLength(3);
    expect(within(group).queryByText("Replaced the interview steps (3 entries)")).toBeNull();

    const toggle = within(group).getByRole("button", { name: "2 more changes" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(lines(group)).toEqual([
      "set: Location: Example City → Example City or Example Town",
      "added: Added must-have: Example tooling",
      "removed: Removed nice-to-have: Fictional buyers",
      'moved: Moved must-have "Example tooling" to position 1',
      "replaced: Replaced the interview steps (3 entries)",
    ]);
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("names a fold of one in the singular", () => {
    render(<JobBriefChanges changes={changes.slice(0, 4)} />);
    expect(screen.getByRole("button", { name: "1 more change" })).toBeInTheDocument();
  });

  it("shows as many as previewCount asks, and with 0 folds every change", () => {
    const { rerender } = render(<JobBriefChanges changes={changes} previewCount={1} />);
    expect(lines(screen.getByRole("group"))).toHaveLength(1);
    expect(screen.getByRole("button", { name: "6 more changes" })).toBeInTheDocument();

    rerender(<JobBriefChanges changes={changes} previewCount={0} />);
    expect(lines(screen.getByRole("group"))).toHaveLength(0);
    expect(screen.getByRole("button", { name: "7 more changes" })).toBeInTheDocument();

    rerender(<JobBriefChanges changes={changes} previewCount={10} />);
    expect(lines(screen.getByRole("group"))).toHaveLength(7);
    expect(screen.queryByRole("button")).toBeNull();

    // A count that isn't a number keeps the default.
    rerender(<JobBriefChanges changes={changes} previewCount={Number.NaN} />);
    expect(lines(screen.getByRole("group"))).toHaveLength(3);
    rerender(<JobBriefChanges changes={changes} previewCount={2.7} />);
    expect(lines(screen.getByRole("group"))).toHaveLength(2);
  });

  it("takes the host's words for the lines, the toggle and the group", () => {
    render(
      <JobBriefChanges
        version={5}
        changes={changes.slice(0, 4)}
        labels={{
          added: (field, item) => `New ${field}: ${item}`,
          more: (count) => `Show ${count} more`,
          groupName: (version) => `Fictional changes in ${version}`,
        }}
      />,
    );
    const group = screen.getByRole("group", { name: "Fictional changes in 5" });
    expect(within(group).getByText("New must-have: Example tooling")).toBeInTheDocument();
    expect(within(group).getByRole("button", { name: "Show 1 more" })).toBeInTheDocument();
  });

  it("keys each line by its id, so equal changes are each shown", () => {
    const repeated: JobBriefChange[] = [
      { id: "a", kind: "added", field: "document", item: "brief.pdf" },
      { id: "b", kind: "added", field: "document", item: "brief.pdf" },
    ];
    render(<JobBriefChanges changes={repeated} />);
    expect(screen.getAllByText("Added document: brief.pdf")).toHaveLength(2);
  });

  it("leads a kind it doesn't know with the icon for a new value", () => {
    const { container } = render(
      <JobBriefChanges changes={[{ kind: "renamed", field: "location", to: "Example Town" } as unknown as JobBriefChange]} />,
    );
    expect(container.querySelector('[data-change-kind="renamed"] svg')).toHaveClass("lucide-arrow-right");
    expect(screen.getByText("Location: Example Town")).toBeInTheDocument();
  });

  it("draws nothing for a version with no changes to list", () => {
    const { container } = render(<JobBriefChanges version={1} changes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
