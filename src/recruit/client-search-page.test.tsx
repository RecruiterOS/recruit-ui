import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  clientSearchThread,
  type ClientSearchDeliveryItem,
  type ClientSearchTurn,
} from "./client-search-conversation";
import { ClientSearchPage, type ClientSearchPageProps } from "./client-search-page";
import type { ClientSearchAction } from "./client-search-sections";
import type { JobBriefContent } from "./job-brief-view";
import type { JobSearchStep } from "./job-search-progress";

// A fictional search for a fictional company, with fictional people only.

// The Markdown renderer loads lazily; a stand-in shows the source at once.
vi.mock("@epicbagel/saas-kit/primitives/lazy-markdown", () => ({
  LazyMarkdown: ({ children }: { children: string }) => <span data-testid="markdown">{children}</span>,
}));

const BRIEF: JobBriefContent = {
  roleTitle: "Account Executive",
  companyName: "Fernhill Example Co",
  location: "Example City",
  mustHaves: ["Fictional sales experience"],
};

const DRAFT_STEPS: JobSearchStep[] = [
  { id: "received", title: "Brief received", state: "done" },
  { id: "brief", title: "Agreeing the brief", state: "current", description: "We ask for what we still need." },
  { id: "search", title: "Search open", state: "upcoming" },
];

const OPEN_STEPS: JobSearchStep[] = [
  { id: "received", title: "Brief received", state: "done" },
  { id: "brief", title: "Agreeing the brief", state: "done" },
  { id: "shortlist", title: "Shortlist to review", state: "current", action: <a href="#people">Jump to the people</a> },
];

const TURNS: ClientSearchTurn[] = [
  { id: "t1", from: "client", body: "We need a fictional account executive.", createdAt: "2026-01-01T10:00:00Z" },
  { id: "t2", from: "agency", body: "Thanks. Where is the role based?", createdAt: "2026-01-01T10:01:00Z" },
];

const DELIVERIES: ClientSearchDeliveryItem[] = [
  {
    id: "d1",
    title: "First shortlist",
    deliveredAt: "2026-01-02T09:00:00Z",
    people: [
      { id: "p1", name: "Mei Example", decision: "yes", reason: "Right level for us" },
      { id: "p2", name: "Tomas Example" },
    ],
    runSteps: [{ key: "map", title: "Mapped fictional companies", status: "done" }],
  },
  {
    id: "d2",
    title: "Second shortlist",
    deliveredAt: "2026-01-05T09:00:00Z",
    people: [{ id: "p3", name: "Imogen Example" }],
  },
];

const ACTIONS: ClientSearchAction[] = [{ id: "more-like-mei", label: "Find more people like Mei Example" }];

const BOOKING = "https://example.com/book";

function draftPage(overrides: Partial<ClientSearchPageProps> = {}) {
  return (
    <ClientSearchPage
      draft
      title="Account Executive"
      eyebrow={<a href="#searches">All searches</a>}
      subtitle="Example City"
      agentName="Scout"
      steps={DRAFT_STEPS}
      brief={BRIEF}
      thread={clientSearchThread({ turns: TURNS })}
      suggestedReplies={["Example City", "Remote is fine"]}
      onReply={vi.fn().mockResolvedValue(undefined)}
      call={{ href: BOOKING }}
      {...overrides}
    />
  );
}

function openPage(overrides: Partial<ClientSearchPageProps> = {}) {
  return (
    <ClientSearchPage
      title="Account Executive"
      eyebrow={<a href="#searches">All searches</a>}
      subtitle="Example City"
      agentName="Scout"
      steps={OPEN_STEPS}
      brief={BRIEF}
      question="Should we look outside Example City?"
      suggestedReplies={["Yes, anywhere", "No, keep it local"]}
      onAnswer={vi.fn().mockResolvedValue(undefined)}
      searching
      liveSteps={[{ key: "search", title: "Searching public profiles", status: "running" }]}
      actions={ACTIONS}
      onAction={vi.fn().mockResolvedValue(undefined)}
      deliveries={DELIVERIES}
      otherRuns={[{ id: "r9", steps: [{ key: "a", title: "Searched again", status: "done" }, { key: "b", title: "Ranked", status: "pending" }] }]}
      onDecide={vi.fn().mockResolvedValue(undefined)}
      call={{ href: BOOKING }}
      {...overrides}
    />
  );
}

/** A promise a test settles when it chooses. */
function deferred() {
  let resolve: () => void = () => undefined;
  let reject: (cause: unknown) => void = () => undefined;
  const promise = new Promise<void>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

const page = (container: HTMLElement) => container.querySelector<HTMLElement>("[data-slot='client-search-page']")!;
/** The page's own sections, in the order they are drawn. */
const sections = (container: HTMLElement) =>
  [
    ...container.querySelectorAll(
      [
        "[data-slot='client-search-question']",
        "[data-slot='client-search-live']",
        "[data-slot='client-search-next-actions']",
        "[data-slot='client-search-delivery']",
        "[data-slot='job-brief-card']",
        "[data-slot='client-search-conversation']",
      ].join(","),
    ),
  ].map((section) => section.getAttribute("data-slot"));
const header = () => screen.getByRole("heading", { level: 1 }).parentElement!.parentElement!;
const personCard = (name: string) => screen.getByRole("heading", { level: 3, name }).closest<HTMLElement>("article")!;

describe("client search page, while the search is a draft", () => {
  it("is the conversation that gets the brief ready, under the search's header", () => {
    const { container } = render(draftPage({ id: "fictional-search", "aria-label": "Fictional search" }));

    const root = container.firstElementChild!;
    expect(root).toBe(page(container));
    expect(root).toHaveAttribute("data-view", "conversation");
    expect(root).toHaveAttribute("id", "fictional-search");
    expect(root).toHaveAttribute("aria-label", "Fictional search");
    expect(root).not.toHaveAttribute("data-read-only");

    // One h1, with where the search stands beside where the role is.
    expect(screen.getByRole("heading", { level: 1, name: "Account Executive" })).toBeInTheDocument();
    expect(within(header()).getByRole("link", { name: "All searches" })).toHaveAttribute("href", "#searches");
    expect(within(header()).getByText("Example City · Now: Agreeing the brief")).toBeInTheDocument();
    // The brief and the progress open from the header; a call isn't offered there yet.
    expect(within(header()).getAllByRole("button").map((button) => button.textContent)).toEqual(["Brief", "Progress"]);
    expect(within(header()).queryByRole("link", { name: "Book a call" })).toBeNull();

    expect(sections(container)).toEqual(["client-search-conversation"]);
    expect(screen.getByText("Thanks. Where is the role based?")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Answer, give feedback, or add detail");
    expect(screen.getByRole("group", { name: "Suggested replies" })).toBeInTheDocument();
  });

  it("hands the host the reader's reply", async () => {
    const user = userEvent.setup();
    const onReply = vi.fn().mockResolvedValue(undefined);
    render(draftPage({ onReply }));

    await user.type(screen.getByRole("textbox"), "Two days a week in the office.{Enter}");
    expect(onReply.mock.calls).toEqual([["Two days a week in the office.", []]]);

    await user.click(screen.getByRole("button", { name: "Remote is fine" }));
    expect(onReply.mock.calls[1]).toEqual(["Remote is fine", []]);
  });

  it("offers a call as the next action of the step the search is on", async () => {
    const user = userEvent.setup();
    render(draftPage());

    await user.click(screen.getByRole("button", { name: "Progress" }));
    const dialog = screen.getByRole("dialog", { name: "Where your search stands" });
    const steps = within(dialog).getAllByRole("listitem");
    expect(steps[1]).toHaveAttribute("aria-current", "step");
    expect(within(steps[1]!).getByRole("link", { name: "Or talk it through on a call" })).toHaveAttribute("href", BOOKING);
    // Only on the step in progress.
    expect(within(dialog).getAllByRole("link")).toHaveLength(1);
  });

  it("leaves a step its own action, and offers no call where the host has none", async () => {
    const user = userEvent.setup();
    const steps: JobSearchStep[] = [
      { id: "brief", title: "Agreeing the brief", state: "current", action: <a href="#guide">Read the guide</a> },
    ];
    const { rerender } = render(draftPage({ steps }));

    await user.click(screen.getByRole("button", { name: "Progress" }));
    expect(within(screen.getByRole("dialog")).getAllByRole("link").map((link) => link.textContent)).toEqual(["Read the guide"]);
    await user.keyboard("{Escape}");

    rerender(draftPage({ call: undefined }));
    await user.click(screen.getByRole("button", { name: "Progress" }));
    expect(within(screen.getByRole("dialog")).queryByRole("link")).toBeNull();
  });

  it("shows the conversation alone where the page is only read", async () => {
    const user = userEvent.setup();
    const { container } = render(draftPage({ readOnly: true }));

    expect(page(container)).toHaveAttribute("data-read-only", "true");
    expect(screen.getByText("Thanks. Where is the role based?")).toBeInTheDocument();
    expect(container.querySelector("input, textarea, select, form")).toBeNull();
    expect(screen.queryByRole("button", { name: "Example City" })).toBeNull();
    // What opens the brief and the progress still does: reading them sends nothing.
    expect(within(header()).getAllByRole("button").map((button) => button.textContent)).toEqual(["Brief", "Progress"]);

    await user.click(screen.getByRole("button", { name: "Progress" }));
    expect(within(screen.getByRole("dialog")).queryByRole("link")).toBeNull();
  });
});

describe("client search page, once the search is open", () => {
  it("shows its sections in order, with no reply box", () => {
    const { container } = render(openPage());

    expect(page(container)).toHaveAttribute("data-view", "open");
    expect(sections(container)).toEqual([
      "client-search-question",
      "client-search-live",
      "client-search-next-actions",
      "client-search-delivery",
      "client-search-delivery",
      "job-brief-card",
    ]);
    // The page is managed: nothing to type into.
    expect(container.querySelector("input, textarea, select, form")).toBeNull();
    // Its sections scroll under the header, in a region the keyboard can reach to scroll.
    const region = screen.getByRole("region", { name: "Search details" });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).not.toContainElement(screen.getByRole("heading", { level: 1 }));
    for (const section of container.querySelectorAll("[data-slot='client-search-delivery']")) {
      expect(region).toContainElement(section as HTMLElement);
    }

    expect(screen.getByRole("heading", { level: 1, name: "Account Executive" })).toBeInTheDocument();
    expect(within(header()).getByText("Example City · Now: Shortlist to review")).toBeInTheDocument();
    // In the header: the brief, a call, the progress.
    expect(
      [...header().querySelectorAll("[data-slot='button']")].map((control) => control.textContent),
    ).toEqual(["Brief", "Book a call", "Progress"]);
    expect(within(header()).getByRole("link", { name: "Book a call" })).toHaveAttribute("href", BOOKING);

    // Every section is an h2 under the page's own h1.
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Scout has a question",
      "Scout is searching",
      "What next",
      "Second shortlist",
      "First shortlist",
      "Account Executive · Fernhill Example Co",
    ]);
  });

  it("shows the newest delivery first, each with its people and how its run searched, then the runs that delivered nobody", () => {
    const { container } = render(openPage());

    const deliveries = [...container.querySelectorAll<HTMLElement>("[data-slot='client-search-delivery']")];
    expect(deliveries.map((delivery) => within(delivery).getByRole("heading", { level: 2 }).textContent)).toEqual([
      "Second shortlist",
      "First shortlist",
    ]);
    expect(within(deliveries[0]!).getByRole("heading", { level: 3, name: "Imogen Example" })).toBeInTheDocument();
    expect(within(deliveries[1]!).getAllByRole("heading", { level: 3 }).map((name) => name.textContent)).toEqual([
      "Mei Example",
      "Tomas Example",
    ]);
    // The first delivery's own run sits inside it; the one that delivered nobody follows them all.
    const runs = screen.getAllByRole("group", { name: "How Scout searched" });
    expect(runs).toHaveLength(2);
    expect(deliveries[1]).toContainElement(runs[0]!);
    expect(deliveries[1]).not.toContainElement(runs[1]!);
    expect(runs[1]).toHaveTextContent("1 of 2 steps done · stopped");
    expect(deliveries[1]!.compareDocumentPosition(runs[1]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // The search under way says there is more to come.
    expect(screen.getByText("We are looking for more people. Review the ones below while we do.")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "How Scout is sourcing" })).toBeInTheDocument();
  });

  it("answers the question through the host, and through its reply callback when it has no other", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn().mockResolvedValue(undefined);
    const onReply = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(openPage({ onAnswer, onReply }));

    const answers = screen.getByRole("group", { name: "Suggested answers" });
    expect(within(answers).getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Yes, anywhere",
      "No, keep it local",
    ]);
    await user.click(within(answers).getByRole("button", { name: "Yes, anywhere" }));
    expect(onAnswer.mock.calls).toEqual([["Yes, anywhere"]]);
    expect(onReply).not.toHaveBeenCalled();

    rerender(openPage({ onAnswer: undefined, onReply }));
    await user.click(screen.getByRole("button", { name: "No, keep it local" }));
    expect(onReply.mock.calls).toEqual([["No, keep it local", []]]);
  });

  it("holds every answer and request while one is on its way, and says so when it fails", async () => {
    const user = userEvent.setup();
    const answering = deferred();
    const onAnswer = vi.fn(() => answering.promise);
    const onAction = vi.fn().mockResolvedValue(undefined);
    render(openPage({ onAnswer, onAction }));

    await user.click(screen.getByRole("button", { name: "Yes, anywhere" }));
    // The request beside it waits too, so the two never cross.
    expect(screen.getByRole("button", { name: "No, keep it local" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Find more people like Mei Example" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Find more people like Mei Example" }));
    expect(onAction).not.toHaveBeenCalled();
    // A Yes or No on a person is its own save.
    expect(within(personCard("Tomas Example")).getByRole("button", { name: "Yes" })).toBeEnabled();

    await act(async () => answering.reject(new Error("offline")));
    const question = screen.getByRole("region", { name: "Scout has a question" });
    expect(within(question).getByRole("alert")).toHaveTextContent("That didn't send. Please try again.");
    expect(screen.getByRole("button", { name: "Find more people like Mei Example" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Find more people like Mei Example" }));
    expect(onAction.mock.calls).toEqual([[ACTIONS[0]]]);
  });

  it("holds the answers while a request is on its way", async () => {
    const user = userEvent.setup();
    const asking = deferred();
    const onAction = vi.fn(() => asking.promise);
    render(openPage({ onAction }));

    await user.click(screen.getByRole("button", { name: "Find more people like Mei Example" }));
    expect(screen.getByRole("button", { name: "Yes, anywhere" })).toBeDisabled();

    await act(async () => asking.resolve());
    expect(screen.getByRole("button", { name: "Yes, anywhere" })).toBeEnabled();
  });

  it("says the reader's reply is being read where the question would be", () => {
    const { rerender } = render(openPage({ question: null, awaitingReply: true }));
    expect(screen.getByRole("status")).toHaveTextContent("Reading what you sent…");
    expect(screen.queryByRole("region", { name: "Scout has a question" })).toBeNull();

    // A question to answer comes before a line to wait on.
    rerender(openPage({ awaitingReply: true }));
    expect(screen.queryByText("Reading what you sent…")).toBeNull();
    expect(screen.getByRole("region", { name: "Scout has a question" })).toBeInTheDocument();
  });

  it("hands the host a Yes or No on a person, with the reader's reason", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(openPage({ onDecide, reasonSuggestions: { yes: ["Right level"] } }));

    await user.click(within(personCard("Tomas Example")).getByRole("button", { name: "Yes" }));
    const dialog = screen.getByRole("dialog", { name: "Yes to Tomas Example" });
    await user.click(within(dialog).getByText("Right level"));
    await user.click(within(dialog).getByRole("button", { name: "Save Yes" }));

    expect(onDecide.mock.calls).toEqual([[DELIVERIES[0]!.people[1], "yes", "Right level"]]);
  });

  it("opens the call prompt, and leaves the host unasked, where asking for more needs a call first", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onCallPromptOpenChange = vi.fn();
    render(openPage({ onAction, actionsNeedCall: true, onCallPromptOpenChange }));

    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Find more people like Mei Example" }));

    const prompt = screen.getByRole("dialog", { name: "Book a call to keep the search going" });
    expect(within(prompt).getByRole("link", { name: "Book a call" })).toHaveAttribute("href", BOOKING);
    expect(onAction).not.toHaveBeenCalled();
    expect(onCallPromptOpenChange.mock.calls).toEqual([[true]]);
    // Nothing was sent, so nothing is held.
    expect(screen.getByRole("button", { name: "Yes, anywhere", hidden: true })).toBeEnabled();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onCallPromptOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it("lets the host open the call prompt itself, such as when its server turns a request down", async () => {
    const user = userEvent.setup();
    function Host() {
      const [open, setOpen] = useState(false);
      return openPage({
        // The host finds out only once it has asked.
        onAction: async () => setOpen(true),
        callPromptOpen: open,
        onCallPromptOpenChange: setOpen,
      });
    }
    render(<Host />);

    await user.click(screen.getByRole("button", { name: "Find more people like Mei Example" }));
    expect(await screen.findByRole("dialog", { name: "Book a call to keep the search going" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("books a call through the host where it has no link, in its own words", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(openPage({ call: { onSelect }, labels: { call: "Talk to us" } }));

    expect(within(header()).queryByRole("link", { name: "Talk to us" })).toBeNull();
    await user.click(within(header()).getByRole("button", { name: "Talk to us" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("shows the same page with nothing to send where it is only read", async () => {
    const user = userEvent.setup();
    const callbacks = { onAnswer: vi.fn(), onAction: vi.fn(), onDecide: vi.fn(), onReply: vi.fn() };
    const { container } = render(openPage({ ...callbacks, readOnly: true, actionsNeedCall: true }));

    expect(page(container)).toHaveAttribute("data-read-only", "true");
    // The same sections, in the same order.
    expect(sections(container)).toEqual([
      "client-search-question",
      "client-search-live",
      "client-search-next-actions",
      "client-search-delivery",
      "client-search-delivery",
      "job-brief-card",
    ]);
    expect(container.querySelector("input, textarea, select, form")).toBeNull();

    // What was asked and what is offered show as words.
    const answers = screen.getByRole("list", { name: "Suggested answers" });
    expect(within(answers).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Yes, anywhere",
      "No, keep it local",
    ]);
    expect(within(screen.getByRole("list", { name: "What next" })).getByText("Find more people like Mei Example")).toBeInTheDocument();
    // Each answer on a person shows, and none can be given.
    expect(within(personCard("Mei Example")).getByText("Said Yes")).toBeInTheDocument();
    expect(within(personCard("Mei Example")).getByText("Right level for us")).toBeInTheDocument();
    expect(within(personCard("Tomas Example")).getByText("No answer yet")).toBeInTheDocument();
    for (const name of ["Yes", "No", "Change", "Yes, anywhere", "Find more people like Mei Example"]) {
      expect(screen.queryByRole("button", { name })).toBeNull();
    }
    // No call to book, in the header or anywhere else.
    expect(screen.queryByRole("link", { name: "Book a call" })).toBeNull();
    expect(screen.queryByRole("link")).toBe(within(header()).getByRole("link", { name: "All searches" }));

    // Every control left only opens or folds something to read.
    const controls = screen.getAllByRole("button");
    expect(controls.map((control) => control.textContent)).toEqual([
      "Brief",
      "Progress",
      "How Scout searched1 step",
      "How Scout searched1 of 2 steps done · stopped",
    ]);
    for (const control of controls) expect(control).toHaveAttribute("aria-expanded", "false");

    // A step's own action is something to do, so it goes too.
    await user.click(screen.getByRole("button", { name: "Progress" }));
    const progress = screen.getByRole("dialog", { name: "Where your search stands" });
    expect(within(progress).getAllByRole("listitem")).toHaveLength(3);
    expect(within(progress).queryByRole("link")).toBeNull();
    for (const callback of Object.values(callbacks)) expect(callback).not.toHaveBeenCalled();
  });

  it("keeps a step's own action for its reader", async () => {
    const user = userEvent.setup();
    render(openPage());

    await user.click(screen.getByRole("button", { name: "Progress" }));
    const progress = screen.getByRole("dialog", { name: "Where your search stands" });
    // An open search offers the call in the header, not on a step.
    expect(within(progress).getAllByRole("link").map((link) => link.textContent)).toEqual(["Jump to the people"]);
  });

  it("opens the brief from the header, and shows it under the deliveries", async () => {
    const user = userEvent.setup();
    const { container } = render(openPage());

    const inline = container.querySelector<HTMLElement>("[data-slot='job-brief-card']")!;
    expect(inline).toHaveAttribute("data-presentation", "preview");
    expect(within(inline).getByText("Fictional sales experience")).toBeInTheDocument();
    expect(within(inline).queryByRole("textbox")).toBeNull();

    await user.click(within(header()).getByRole("button", { name: "Brief" }));
    const dialog = screen.getByRole("dialog", { name: "Your brief" });
    expect(within(dialog).getByText("Fictional sales experience")).toBeInTheDocument();
  });

  it("draws only what it is given", () => {
    const { container } = render(<ClientSearchPage title="Account Executive" agentName="Scout" />);

    expect(page(container)).toHaveAttribute("data-view", "open");
    expect(screen.getByRole("heading", { level: 1, name: "Account Executive" })).toBeInTheDocument();
    expect(sections(container)).toEqual([]);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("says a search is on before any run has reported, and that the first people are on their way", () => {
    render(<ClientSearchPage title="Account Executive" agentName="Scout" searching />);
    expect(screen.getByRole("heading", { level: 2, name: "Scout is searching" })).toBeInTheDocument();
    expect(screen.getByText("We are looking for people who fit your brief. They appear here as we find them.")).toBeInTheDocument();
    expect(screen.queryByRole("group")).toBeNull();
  });

  it("takes the host's wording throughout", async () => {
    const user = userEvent.setup();
    render(
      openPage({
        subtitle: undefined,
        actionsNeedCall: true,
        labels: {
          now: (step) => <>At: {step}</>,
          brief: "The brief",
          progress: "Where we are",
          call: "Email us",
          questionTitle: (name) => `A question from ${name}`,
          searchingTitle: (name) => `${name} is on it`,
          nextTitle: "Ask for more",
          callPromptTitle: "Talk to us first",
        },
        decisionLabels: { saidYes: "Your answer: Yes" },
        traceLabels: { settled: (name) => `What ${name} did` },
        progressLabels: { current: "Now" },
        briefOptions: { title: "generic" },
      }),
    );

    expect(within(header()).getByText("At: Shortlist to review")).toBeInTheDocument();
    expect([...header().querySelectorAll("[data-slot='button']")].map((control) => control.textContent)).toEqual([
      "The brief",
      "Email us",
      "Where we are",
    ]);
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "A question from Scout",
      "Scout is on it",
      "Ask for more",
      "Second shortlist",
      "First shortlist",
      "Job brief",
    ]);
    expect(screen.getByText("Your answer: Yes")).toBeInTheDocument();
    expect(screen.getAllByRole("group", { name: "What Scout did" })).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Find more people like Mei Example" }));
    const prompt = screen.getByRole("dialog", { name: "Talk to us first" });
    expect(within(prompt).getByRole("link", { name: "Email us" })).toBeInTheDocument();
    await user.keyboard("{Escape}");

    await user.click(screen.getByRole("button", { name: "Where we are" }));
    expect(within(screen.getByRole("dialog")).getAllByRole("listitem")[2]).toHaveTextContent("Now: Shortlist to review");
  });
});
