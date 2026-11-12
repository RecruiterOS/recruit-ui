// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LazyMarkdown } from "@epicbagel/saas-kit/primitives/lazy-markdown";
import { SourcingTrace, type SourcingTraceStep } from "./sourcing-trace";

type SourcingStep = SourcingTraceStep;
type SourcingRun = { steps: SourcingStep[] };
/** A host's own Markdown overrides, such as its heading face. */
const hostMarkdownComponents = { h1: "h2" } as const;

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// The renderer loads lazily; a stand-in shows the source and records how it was asked to draw it.
vi.mock("@epicbagel/saas-kit/primitives/lazy-markdown", () => ({
  LazyMarkdown: vi.fn(({ children }: { children: string }) => <span data-testid="markdown">{children}</span>),
}));

let root: Root | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  root = undefined;
  host = undefined;
  vi.mocked(LazyMarkdown).mockClear();
});

function render(element: ReactNode) {
  if (!root) {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  }
  act(() => root!.render(element));
  return host!;
}


function step(key: string, status: SourcingStep["status"], overrides: Partial<SourcingStep> = {}): SourcingStep {
  return { key, title: key, status, description: null, detail: null, ...overrides };
}

const run = (steps: SourcingStep[], _stale = false): SourcingRun => ({ steps });
const working = run([
  step("map", "done", { title: "Mapped the market", description: "133 companies", detail: "Seeded from **Encord**'s peers." }),
  step("search", "running", { title: "Searching LinkedIn", description: "42 profiles", detail: "Queries: *AE London*" }),
  step("verify", "pending", { title: "Verifying emails" }),
  step("enrich", "error", { title: "Enriching with Apollo", description: "rate limited" }),
  step("phone", "skipped", { title: "Finding phone numbers" }),
]);

/** A step's timeline row by its title, with its visible and accessible status. */
function line(view: Element, title: string) {
  const found = [...view.querySelectorAll('[data-step-status]')]
    .find((item) => item.querySelector('[data-slot="chain-of-thought-title"]')?.textContent === title);
  if (!found) throw new Error(`No line for ${title}`);
  const icon = found.querySelector('[role="img"]')!;
  return {
    element: found,
    /** How the thread shows the step: as reported, or stopped. */
    shown: found.getAttribute("data-step-status"),
    /** The component's state: `running` shimmers the title, `error` is red, `pending` is dimmed. */
    status: found.getAttribute("data-status"),
    label: icon.getAttribute("role") === "img" && icon.getAttribute("aria-hidden") === "false" ? icon.getAttribute("aria-label") : null,
    glyph: icon.getAttribute("class") ?? "",
    description: found.querySelector('[data-slot="chain-of-thought-description"]')?.textContent ?? null,
    toggle: found.closest("button"),
  };
}

const openAll = (view: Element) => act(() => view.querySelector("button")!.click());

describe("SourcingTrace", () => {
  it("shows a run under way step by step: done ticked, the running one shimmering, one still to come dimmed, an error in red, a skip", () => {
    const view = render(<SourcingTrace steps={(working).steps} agentName="Scout" live />);
    expect(view.querySelector('[role="group"]')?.getAttribute("aria-label")).toBe("How Scout is sourcing");
    expect(view.querySelector('[data-slot="chain-of-thought"]')).not.toBeNull();

    const done = line(view, "Mapped the market");
    expect(done).toMatchObject({ status: null, label: "Done", description: "133 companies" });
    expect(done.glyph).toContain("lucide-circle-check");

    const running = line(view, "Searching LinkedIn");
    expect(running).toMatchObject({ status: "running", label: "In progress", description: "42 profiles" });
    expect(running.element.querySelector('[data-slot="chain-of-thought-title"]')?.classList.contains("shimmer")).toBe(true);

    expect(line(view, "Verifying emails")).toMatchObject({ status: "pending", label: "Up next", toggle: null });
    const failed = line(view, "Enriching with Apollo");
    expect(failed).toMatchObject({ status: "error", label: "Failed", description: "rate limited" });
    expect(failed.glyph).toContain("lucide-circle-x");
    const skipped = line(view, "Finding phone numbers");
    expect(skipped).toMatchObject({ shown: "skipped", status: "pending", label: "Skipped" });
    expect(skipped.glyph).toContain("lucide-circle-minus");
  });

  it("opens the running step's detail, folds a finished step's until it is opened, and gives a step with none no toggle", () => {
    const view = render(<SourcingTrace steps={(working).steps} agentName="Scout" live />);
    const running = line(view, "Searching LinkedIn").toggle!;
    expect(running.getAttribute("aria-expanded")).toBe("true");
    expect(view.textContent).toContain("Queries: *AE London*");

    const done = line(view, "Mapped the market").toggle!;
    expect(done.getAttribute("aria-expanded")).toBe("false");
    expect(view.textContent).not.toContain("Seeded from");
    act(() => done.click());
    expect(done.getAttribute("aria-expanded")).toBe("true");
    expect(view.textContent).toContain("Seeded from");

    expect(line(view, "Enriching with Apollo").toggle).toBeNull();
  });

  it("draws a step's detail with the host's Markdown overrides", () => {
    render(<SourcingTrace steps={(working).steps} agentName="Scout" live markdownComponents={hostMarkdownComponents} />);
    expect(vi.mocked(LazyMarkdown)).toHaveBeenCalled();
    for (const [props] of vi.mocked(LazyMarkdown).mock.calls) {
      expect(props.components).toBe(hostMarkdownComponents);
    }
  });

  it("folds a running step's detail as the step finishes, unless the reader has chosen", () => {
    const searching = (status: SourcingStep["status"]) => run([
      step("search", status, { title: "Searching LinkedIn", detail: "Queries: *AE London*" }),
      step("verify", status, { title: "Verifying emails", detail: "Apollo, then NeverBounce" }),
    ]);
    const view = render(<SourcingTrace steps={(searching("running")).steps} agentName="Scout" live />);
    const expanded = (title: string) => line(view, title).toggle!.getAttribute("aria-expanded");
    // The reader closes one while it runs, and it stays closed while it runs.
    act(() => line(view, "Verifying emails").toggle!.click());
    render(<SourcingTrace steps={(searching("running")).steps} agentName="Scout" live />);
    expect([expanded("Searching LinkedIn"), expanded("Verifying emails")]).toEqual(["true", "false"]);
    // Then opens it again: theirs now, it stays open once the step is done.
    act(() => line(view, "Verifying emails").toggle!.click());

    render(<SourcingTrace steps={(searching("done")).steps} agentName="Scout" live />);
    expect([expanded("Searching LinkedIn"), expanded("Verifying emails")]).toEqual(["false", "true"]);
    expect(view.textContent).not.toContain("Queries");
    expect(view.textContent).toContain("Apollo, then NeverBounce");
  });

  it("folds a finished run into one line that opens to its steps", () => {
    const view = render(<SourcingTrace steps={(run(working.steps.map((item) => ({ ...item, status: "done" })))).steps} agentName="Scout" />);
    expect(view.querySelector('[role="group"]')?.getAttribute("aria-label")).toBe("How Scout searched");
    const toggle = view.querySelector("button")!;
    expect(toggle.textContent).toBe("How Scout searched5 steps");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(toggle.getAttribute("data-status")).toBeNull();
    expect(view.querySelectorAll("[data-step-status]")).toHaveLength(0);
    openAll(view);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect([...view.querySelectorAll("[data-step-status]")].map((item) => item.getAttribute("data-step-status")))
      .toEqual(["done", "done", "done", "done", "done"]);
  });

  it("folds a stale run, its unfinished steps stopped rather than shimmering, their detail closed", () => {
    const view = render(<SourcingTrace steps={(run(working.steps, true)).steps} agentName="Scout" />);
    expect(view.querySelector("button")!.textContent).toBe("How Scout searched1 of 5 steps done · 1 failed · 1 skipped · stopped");
    openAll(view);
    for (const title of ["Searching LinkedIn", "Verifying emails"]) {
      const stopped = line(view, title);
      expect(stopped).toMatchObject({ shown: "stopped", status: "pending", label: "Stopped" });
      expect(stopped.glyph).toContain("lucide-circle-stop");
    }
    expect(view.querySelector('[data-status="running"]')).toBeNull();
    expect(line(view, "Searching LinkedIn").toggle!.getAttribute("aria-expanded")).toBe("false");
    // What finished shows as it finished.
    expect(line(view, "Mapped the market").shown).toBe("done");
    expect(line(view, "Finding phone numbers").shown).toBe("skipped");
  });

  it("reddens a folded run's line when one of its steps failed, and says how far it got", () => {
    const view = render(<SourcingTrace steps={(run([step("a", "done"), step("b", "error")])).steps} agentName="Scout" />);
    const summary = view.querySelector("button")!;
    expect(summary.textContent).toBe("How Scout searched1 of 2 steps done · 1 failed");
    expect(summary.getAttribute("data-status")).toBe("error");
  });

  it("keeps the reader's expanded step and its DOM identity when an update inserts or reorders steps", () => {
    const first = step("first", "done", { title: "Mapped companies", detail: "Company notes" });
    const second = step("second", "done", { title: "Checked profiles", detail: "Profile notes" });
    const added = step("added", "pending", { title: "Check locations", detail: "Location notes" });
    const view = render(<SourcingTrace steps={(run([first, second])).steps} agentName="Scout" live />);
    const opened = line(view, second.title).toggle!;
    act(() => opened.click());
    expect(opened.getAttribute("aria-expanded")).toBe("true");

    render(<SourcingTrace steps={(run([second, added, first])).steps} agentName="Scout" live />);
    expect(line(view, second.title).toggle).toBe(opened);
    expect(opened.getAttribute("aria-expanded")).toBe("true");
    expect(line(view, added.title).toggle!.getAttribute("aria-expanded")).toBe("false");
    expect(line(view, first.title).toggle!.getAttribute("aria-expanded")).toBe("false");
    expect([...view.querySelectorAll('[data-slot="chain-of-thought-step"]')].map((item) => item.getAttribute("data-last")))
      .toEqual(["false", "false", "true"]);
    expect(view.textContent).toContain("Profile notes");
    expect(view.textContent).not.toContain("Company notes");
  });

  it("draws nothing for a run with no steps", () => {
    expect(render(<SourcingTrace steps={(run([])).steps} agentName="Scout" live />).innerHTML).toBe("");
  });
});
