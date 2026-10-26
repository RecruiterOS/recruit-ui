import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { JobBriefCard, type JobBriefRuleKind, type JobBriefSection } from "./job-brief-card";

// A fictional role at a fictional company only.

const description = "Fernhill Example Co is hiring its second field engineer for a fictional rollout.";

const facts = [
  { id: "location", label: "Location", value: "Example City · hybrid" },
  { id: "salary", label: "Salary", value: "50,000–60,000" },
  { id: "bonus", label: "Bonus", value: "10%" },
  { id: "start", label: "Start", value: "Spring" },
];

const mustHaves = ["Fictional field work", "Example tooling", "Two years on call", "A driving licence", "Shift work"];
const niceToHaves = ["Example certification"];
const redFlags = ["Fictional red flag"];

const sections: JobBriefSection[] = [
  {
    id: "details",
    title: "Role details",
    facts: [
      { id: "team", label: "Team size", value: "6" },
      { id: "travel", label: "Travel", value: "Some" },
    ],
  },
  { id: "process", title: "Interview process", items: ["Intro call", "Site visit", "Final panel"], ordered: true },
  { id: "empty", title: "Nothing to show", items: [] },
];

function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

function listItems(kind: JobBriefRuleKind) {
  const list = document.querySelector(`[data-slot="job-brief-rule-list"][data-kind="${kind}"]`) as HTMLElement | null;
  return list ? within(list).queryAllByRole("listitem").map((item) => item.textContent) : null;
}

describe("job brief card, collapsible", () => {
  it("is a section named by its title, folding the whole brief under its trigger", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <JobBriefCard
        title="Fictional brief"
        description={description}
        facts={facts.slice(0, 2)}
        mustHaves={mustHaves.slice(0, 2)}
        niceToHaves={niceToHaves}
        redFlags={redFlags}
        sections={sections}
        footer={<button type="button">Fictional footer action</button>}
        id="fictional-brief"
      />,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe("SECTION");
    expect(root).toHaveAttribute("data-slot", "job-brief-card");
    expect(root).toHaveAttribute("data-presentation", "collapsible");
    expect(root).toHaveAttribute("id", "fictional-brief");
    expect(screen.getByRole("region", { name: "Fictional brief" })).toBe(root);
    // The root keeps no surface of its own; the kit Card inside keeps its slot.
    expect(root.firstElementChild).toHaveAttribute("data-slot", "card");

    const trigger = screen.getByRole("button", { name: "Fictional brief" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(description)).toBeNull();
    expect(screen.queryByRole("button", { name: "Fictional footer action" })).toBeNull();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText("Example City · hybrid")).toBeInTheDocument();
    // The title is the trigger, not a heading, so each list and section is a
    // heading at the title's level and the outline skips none.
    expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Must haves",
      "Nice to haves",
      "Red flags",
      "Role details",
      "Interview process",
    ]);
    expect(listItems("mustHaves")).toEqual(mustHaves.slice(0, 2));
    expect(screen.getByText("Team size")).toBeInTheDocument();
    const steps = screen.getByText("Intro call").closest("ol");
    expect(steps).not.toBeNull();
    expect(within(steps!).getAllByRole("listitem")).toHaveLength(3);
    // A section with nothing in it isn't drawn.
    expect(screen.queryByText("Nothing to show")).toBeNull();
    expect(container.querySelectorAll('[data-slot="job-brief-section"]')).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Fictional footer action" })).toBeInTheDocument();
    // Read-only: no add, edit or remove controls.
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("follows a controlled open state and reports each change", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <JobBriefCard description={description} open={false} onOpenChange={onOpenChange} />,
    );

    const trigger = screen.getByRole("button", { name: "Job brief" });
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    // The host hasn't opened it, so it stays shut.
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    rerender(<JobBriefCard description={description} open onOpenChange={onOpenChange} />);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("shows only the lists the host names, in its order", () => {
    render(
      <JobBriefCard
        defaultOpen
        mustHaves={mustHaves.slice(0, 1)}
        niceToHaves={niceToHaves}
        redFlags={redFlags}
        rules={["niceToHaves", "mustHaves"]}
        titleLevel={3}
      />,
    );

    // Deeper in a page's outline, the lists take the title's level there too.
    expect(screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual([
      "Nice to haves",
      "Must haves",
    ]);
    expect(screen.queryByText("Fictional red flag")).toBeNull();
  });

  it("draws nothing for a read-only empty list, and keeps an editable one with its add field", () => {
    const { rerender } = render(
      <JobBriefCard defaultOpen mustHaves={mustHaves.slice(0, 1)} niceToHaves={[]} redFlags={[]} />,
    );
    expect(screen.queryByText("Nice to haves")).toBeNull();
    expect(document.querySelectorAll('[data-slot="job-brief-rule-list"]')).toHaveLength(1);

    rerender(
      <JobBriefCard
        defaultOpen
        mustHaves={mustHaves.slice(0, 1)}
        niceToHaves={[]}
        redFlags={[]}
        onRulesChange={() => undefined}
      />,
    );
    expect(document.querySelectorAll('[data-slot="job-brief-rule-list"]')).toHaveLength(3);
    expect(screen.getAllByText("None set")).toHaveLength(2);
    expect(screen.getByRole("textbox", { name: "New nice to have" })).toBeInTheDocument();
  });

  it("hands the whole new list to the host with which list it is", async () => {
    const user = userEvent.setup();
    const onRulesChange = vi.fn();
    function Host() {
      const [lists, setLists] = useState({ mustHaves: ["Fictional field work"], niceToHaves: [] as string[], redFlags: [] as string[] });
      return (
        <JobBriefCard
          defaultOpen
          {...lists}
          onRulesChange={(kind, items) => {
            onRulesChange(kind, items);
            setLists((current) => ({ ...current, [kind]: items }));
          }}
          labels={{ niceToHaveItem: "bonus skill" }}
        />
      );
    }
    render(<Host />);

    await user.type(screen.getByRole("textbox", { name: "New must have" }), "Example tooling{Enter}");
    expect(onRulesChange).toHaveBeenLastCalledWith("mustHaves", ["Fictional field work", "Example tooling"]);
    expect(listItems("mustHaves")).toEqual(["Fictional field work", "Example tooling"]);

    // The host's wording names the controls.
    await user.type(screen.getByRole("textbox", { name: "New bonus skill" }), "Example certification{Enter}");
    expect(onRulesChange).toHaveBeenLastCalledWith("niceToHaves", ["Example certification"]);

    const redFlagList = document.querySelector('[data-kind="redFlags"]') as HTMLElement;
    expect(within(redFlagList).getByText("None set")).toBeInTheDocument();
    await user.click(within(document.querySelector('[data-kind="mustHaves"]') as HTMLElement).getAllByRole("button", { name: "Remove must have" })[0]!);
    expect(onRulesChange).toHaveBeenLastCalledWith("mustHaves", ["Example tooling"]);
    expect(listItems("mustHaves")).toEqual(["Example tooling"]);
  });

  it("shows what it sent while the host saves, then the host's lists again, so a failed save reverts", async () => {
    const user = userEvent.setup();
    let pending = deferred();
    const onRulesChange = vi.fn(() => pending.promise);
    render(<JobBriefCard defaultOpen mustHaves={["Fictional field work"]} onRulesChange={onRulesChange} />);
    const list = () => document.querySelector('[data-kind="mustHaves"]') as HTMLElement;

    await user.type(screen.getByRole("textbox", { name: "New must have" }), "Example tooling{Enter}");
    expect(onRulesChange).toHaveBeenCalledWith("mustHaves", ["Fictional field work", "Example tooling"]);
    expect(list()).toHaveAttribute("aria-busy", "true");
    expect(listItems("mustHaves")).toEqual(["Fictional field work", "Example tooling"]);

    // The save fails: the host's list never changed, so the card goes back to it.
    await act(async () => {
      pending.reject(new Error("fictional failure"));
      await pending.promise.catch(() => undefined);
    });
    await waitFor(() => expect(list()).not.toHaveAttribute("aria-busy"));
    expect(listItems("mustHaves")).toEqual(["Fictional field work"]);

    // A second edit while one is saving builds on what was sent, and only the
    // latest save settles the list.
    const first = deferred();
    const second = deferred();
    pending = first;
    await user.type(screen.getByRole("textbox", { name: "New must have" }), "Shift work{Enter}");
    pending = second;
    await user.type(screen.getByRole("textbox", { name: "New must have" }), "On call{Enter}");
    expect(onRulesChange).toHaveBeenLastCalledWith("mustHaves", ["Fictional field work", "Shift work", "On call"]);
    await act(async () => {
      first.resolve();
      await first.promise;
    });
    expect(list()).toHaveAttribute("aria-busy", "true");
    expect(listItems("mustHaves")).toEqual(["Fictional field work", "Shift work", "On call"]);
    await act(async () => {
      second.resolve();
      await second.promise;
    });
    await waitFor(() => expect(list()).not.toHaveAttribute("aria-busy"));
  });

  it("keeps an editable list's row controls visible and finger-sized on a touchscreen", () => {
    render(<JobBriefCard defaultOpen mustHaves={["Fictional field work"]} onRulesChange={() => undefined} />);
    const list = document.querySelector('[data-kind="mustHaves"] > section');
    expect(list?.className).toContain("pointer-coarse:[&_button]:opacity-100");
    expect(list?.className).toContain("pointer-coarse:[&_button]:min-h-[max(44px,2.75rem)]");
  });

  it("is the kit's empty state with nothing to show or edit", () => {
    const { rerender } = render(<JobBriefCard defaultOpen redFlags={redFlags} rules={["mustHaves"]} />);
    // A red flag the page doesn't show is nothing to show.
    expect(screen.getByRole("heading", { level: 3, name: "No brief yet" })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="empty-state"]')).toBeInTheDocument();

    rerender(<JobBriefCard defaultOpen empty={{ title: "No fictional brief yet", description: "Upload a spec." }} />);
    expect(screen.getByText("No fictional brief yet")).toBeInTheDocument();
    expect(screen.getByText("Upload a spec.")).toBeInTheDocument();
  });

  it("keeps an editable brief's lists and add fields under a notice while a document is still being read", async () => {
    const user = userEvent.setup();
    const onRulesChange = vi.fn();
    render(
      <JobBriefCard
        defaultOpen
        processing
        onRulesChange={onRulesChange}
        labels={{ processing: "Still reading the fictional spec." }}
      />,
    );
    // Reading may never finish, so the host's only way to add rules stays.
    expect(screen.getByRole("alert")).toHaveTextContent("Still reading the fictional spec.");
    expect(document.querySelector('[data-slot="empty-state"]')).toBeNull();
    expect(screen.getAllByText("None set")).toHaveLength(3);
    await user.type(screen.getByRole("textbox", { name: "New must have" }), "Example tooling{Enter}");
    expect(onRulesChange).toHaveBeenLastCalledWith("mustHaves", ["Example tooling"]);
  });

  it("stands an in-progress state in for a read-only empty brief that is still being read, and a notice over one with content", () => {
    const footer = <button type="button">Fictional examples</button>;
    const { rerender } = render(<JobBriefCard defaultOpen processing footer={footer} />);
    expect(screen.getByText("Reading your document")).toBeInTheDocument();
    expect(screen.getByText("The brief will fill in shortly.")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="empty-state"] svg')).toHaveClass("animate-spin");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("button", { name: "Fictional examples" })).toBeInTheDocument();

    // The host words the blank slate too.
    rerender(
      <JobBriefCard
        defaultOpen
        processing
        labels={{ processingTitle: "Reading the fictional spec", processingDescription: "Its rules land here soon." }}
      />,
    );
    expect(screen.getByText("Reading the fictional spec")).toBeInTheDocument();
    expect(screen.getByText("Its rules land here soon.")).toBeInTheDocument();

    rerender(
      <JobBriefCard
        defaultOpen
        processing
        description={description}
        mustHaves={mustHaves.slice(0, 1)}
        labels={{ processing: "Still reading the fictional spec." }}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Still reading the fictional spec.");
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(listItems("mustHaves")).toEqual(mustHaves.slice(0, 1));
    expect(document.querySelector('[data-slot="empty-state"]')).toBeNull();
  });

  it("shows skeleton rows while loading with nothing yet, and no footer", () => {
    const { rerender } = render(
      <JobBriefCard defaultOpen loading footer={<button type="button">Fictional examples</button>} />,
    );
    expect(document.querySelector('[data-slot="job-brief-loading"]')).toHaveAttribute("aria-busy", "true");
    expect(document.querySelector('[data-slot="empty-state"]')).toBeNull();
    expect(screen.queryByRole("button", { name: "Fictional examples" })).toBeNull();

    // A refetch keeps what is already shown.
    rerender(<JobBriefCard defaultOpen loading description={description} />);
    expect(document.querySelector('[data-slot="job-brief-loading"]')).toBeNull();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("puts a status at the title's end, inside the trigger", () => {
    render(<JobBriefCard title="Fictional brief" status={<span>Updated</span>} description={description} />);
    const trigger = screen.getByRole("button", { name: /Fictional brief/ });
    expect(trigger).toContainElement(screen.getByText("Updated"));
    expect(screen.getByRole("region", { name: "Fictional brief" })).toBeInTheDocument();
  });
});

describe("job brief card, preview", () => {
  const full = {
    presentation: "preview" as const,
    title: "Working brief",
    description,
    facts,
    mustHaves,
    niceToHaves,
    redFlags,
    sections,
  };
  // 1 fact + 2 must-haves past the first three, 1 + 1 in the other lists, and
  // 2 + 3 section rows.
  const hiddenByDefault = 1 + 2 + 1 + 1 + 2 + 3;

  it("is a section under an h2 showing the start of the brief, with a toggle for the rest", async () => {
    const user = userEvent.setup();
    const { container } = render(<JobBriefCard {...full} status={<span>Updated</span>} />);

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-presentation", "preview");
    expect(screen.getByRole("region", { name: "Working brief" })).toBe(root);
    const heading = screen.getByRole("heading", { level: 2, name: "Working brief" });
    expect(heading.closest("section")).toBe(root);
    expect(screen.getByText("Updated")).toBeInTheDocument();

    // Closed: the description in two lines, three facts, three must-haves.
    expect(screen.getByText(description)).toHaveClass("line-clamp-2");
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Bonus")).toBeInTheDocument();
    expect(screen.queryByText("Start")).toBeNull();
    expect(listItems("mustHaves")).toEqual(mustHaves.slice(0, 3));
    expect(screen.queryByText("Nice to haves")).toBeNull();
    expect(screen.queryByText("Role details")).toBeNull();

    const toggle = screen.getByRole("button", { name: `Show full brief (${hiddenByDefault} more)` });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).not.toHaveAttribute("aria-controls");
    expect(toggle.className).toContain("pointer-coarse:min-h-[max(44px,2.75rem)]");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveTextContent("Show less");
    const body = document.getElementById(toggle.getAttribute("aria-controls")!);
    expect(body).not.toBeNull();
    expect(within(body!).getByText("Start")).toBeInTheDocument();
    expect(within(body!).getByText(description)).not.toHaveClass("line-clamp-2");
    expect(listItems("mustHaves")).toEqual(mustHaves);
    expect(listItems("redFlags")).toEqual(redFlags);
    expect(within(body!).getByText("Role details")).toBeInTheDocument();
    // The toggle sits after the content.
    expect(body!.compareDocumentPosition(toggle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    await user.click(toggle);
    expect(screen.queryByText("Start")).toBeNull();
  });

  it("shows as many facts and entries as previewCount asks, and with 0 only the title, description and toggle", () => {
    const { rerender } = render(<JobBriefCard {...full} previewCount={1} />);
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.queryByText("Salary")).toBeNull();
    expect(listItems("mustHaves")).toEqual(mustHaves.slice(0, 1));

    rerender(<JobBriefCard {...full} previewCount={0} />);
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.queryByText("Location")).toBeNull();
    expect(document.querySelector('[data-slot="job-brief-rule-list"]')).toBeNull();
    const all = facts.length + mustHaves.length + niceToHaves.length + redFlags.length + 2 + 3;
    expect(screen.getByRole("button", { name: `Show full brief (${all} more)` })).toBeInTheDocument();
  });

  it("previews the first shown list with entries when the first is empty", () => {
    const extra = ["Example certification", "Fictional language", "Example award", "Fictional licence"];
    render(
      <JobBriefCard
        presentation="preview"
        mustHaves={[]}
        niceToHaves={extra}
        redFlags={redFlags}
      />,
    );
    // Closed: the nice-to-haves stand in for the empty must-haves.
    expect(listItems("niceToHaves")).toEqual(extra.slice(0, 3));
    expect(listItems("mustHaves")).toBeNull();
    // Hidden: one more nice-to-have and the red flag.
    expect(screen.getByRole("button", { name: "Show full brief (2 more)" })).toBeInTheDocument();
  });

  it("brings the card back into view when closed from its toggle", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = scrollIntoView;
    try {
      const { container } = render(<JobBriefCard {...full} />);
      const toggle = screen.getByRole("button", { name: /Show full brief/ });
      await user.click(toggle);
      // Opening stays where the reader is.
      expect(scrollIntoView).not.toHaveBeenCalled();

      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
      expect(scrollIntoView.mock.contexts[0]).toBe(container.firstElementChild);
    } finally {
      Element.prototype.scrollIntoView = original;
    }
  });

  it("shows a short brief in full, with no toggle", () => {
    render(
      <JobBriefCard
        presentation="preview"
        description={description}
        facts={facts.slice(0, 2)}
        mustHaves={mustHaves.slice(0, 2)}
        rules={["mustHaves"]}
        redFlags={redFlags}
      />,
    );
    expect(screen.getByText(description)).not.toHaveClass("line-clamp-2");
    expect(listItems("mustHaves")).toEqual(mustHaves.slice(0, 2));
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("follows a controlled open state, at the heading level asked for", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<JobBriefCard {...full} titleLevel={3} open={false} onOpenChange={onOpenChange} />);
    expect(screen.getByRole("heading", { level: 3, name: "Working brief" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Show full brief/ }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.queryByText("Start")).toBeNull();

    rerender(<JobBriefCard {...full} titleLevel={3} open onOpenChange={onOpenChange} />);
    expect(screen.getByText("Start")).toBeInTheDocument();
    // The lists and sections sit one level under the title.
    expect(screen.getAllByRole("heading", { level: 4 }).map((heading) => heading.textContent)).toEqual([
      "Must haves",
      "Nice to haves",
      "Red flags",
      "Role details",
      "Interview process",
    ]);
  });

  it("edits only in the full brief, so an editable preview always offers it", async () => {
    const user = userEvent.setup();
    render(
      <JobBriefCard
        presentation="preview"
        mustHaves={mustHaves.slice(0, 2)}
        rules={["mustHaves"]}
        onRulesChange={() => undefined}
      />,
    );
    // Closed, the shown entries are read-only: a slice is never handed back.
    expect(screen.queryByRole("textbox")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Show full brief" }));
    expect(screen.getByRole("textbox", { name: "New must have" })).toBeInTheDocument();
  });

  it("keeps its footer under the toggle in both states", async () => {
    const user = userEvent.setup();
    render(<JobBriefCard {...full} footer={<button type="button">Open the fictional search</button>} />);
    const footer = screen.getByRole("button", { name: "Open the fictional search" });
    const toggle = screen.getByRole("button", { name: /Show full brief/ });
    expect(toggle.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Open the fictional search" })).toBeInTheDocument();
  });

  it("uses the same blank slates as the page section", () => {
    const { rerender } = render(<JobBriefCard presentation="preview" />);
    expect(screen.getByText("No brief yet")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();

    rerender(<JobBriefCard presentation="preview" processing />);
    expect(screen.getByText("Reading your document")).toBeInTheDocument();

    // Editable, it keeps its lists in the full brief instead.
    rerender(<JobBriefCard presentation="preview" processing onRulesChange={() => undefined} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="empty-state"]')).toBeNull();
    expect(screen.getByRole("button", { name: "Show full brief" })).toBeInTheDocument();

    rerender(<JobBriefCard {...full} processing />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });
});
