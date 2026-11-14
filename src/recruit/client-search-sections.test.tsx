import { LazyMarkdown } from "@epicbagel/saas-kit/primitives/lazy-markdown";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ClientSearchBriefPanel,
  ClientSearchCallButton,
  ClientSearchCallPrompt,
  ClientSearchDelivery,
  ClientSearchLive,
  ClientSearchNextActions,
  ClientSearchProgressPanel,
  ClientSearchQuestion,
  clientSearchLabels,
  type ClientSearchAction,
  type ClientSearchDeliveryProps,
  type ClientSearchPerson,
} from "./client-search-sections";

// Fictional people, companies and searches only.

// The Markdown renderer loads lazily; a stand-in shows the source and records how it was asked to draw it.
vi.mock("@epicbagel/saas-kit/primitives/lazy-markdown", () => ({
  LazyMarkdown: vi.fn(({ children }: { children: string }) => <span data-testid="markdown">{children}</span>),
}));

afterEach(() => {
  vi.mocked(LazyMarkdown).mockClear();
});

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

const QUESTION = "Should we look outside Example City?";
const ANSWERS = ["Yes, anywhere", "No, keep it local"];

describe("client search question", () => {
  it("puts the question under a heading that names who asks, with each answer a tap away", () => {
    const { container } = render(
      <ClientSearchQuestion
        question={QUESTION}
        agentName="Scout"
        answers={ANSWERS}
        onAnswer={vi.fn()}
        id="fictional-question"
      />,
    );

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "client-search-question");
    expect(root).toHaveAttribute("id", "fictional-question");
    expect(root).not.toHaveAttribute("aria-busy");
    // A section named by its own heading, on the kit's card.
    expect(screen.getByRole("region", { name: "Scout has a question" })).toBe(root);
    expect(within(root as HTMLElement).getByRole("heading", { level: 2, name: "Scout has a question" })).toBeInTheDocument();
    expect(root.querySelector("[data-slot='card']")).not.toBeNull();

    expect(screen.getByTestId("markdown")).toHaveTextContent(QUESTION);
    const answers = screen.getByRole("group", { name: "Suggested answers" });
    expect(within(answers).getAllByRole("button").map((button) => button.textContent)).toEqual(ANSWERS);
  });

  it("sends the answer picked, and holds the answers until the host has it", async () => {
    const user = userEvent.setup();
    const saving = deferred();
    const onAnswer = vi.fn(() => saving.promise);
    const { container } = render(
      <ClientSearchQuestion question={QUESTION} agentName="Scout" answers={ANSWERS} onAnswer={onAnswer} />,
    );

    await user.click(screen.getByRole("button", { name: "No, keep it local" }));

    expect(onAnswer.mock.calls).toEqual([["No, keep it local"]]);
    expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
    for (const button of screen.getAllByRole("button")) expect(button).toBeDisabled();
    // A second tap while it saves sends nothing more.
    await user.click(screen.getByRole("button", { name: "Yes, anywhere" }));
    expect(onAnswer).toHaveBeenCalledTimes(1);

    await act(async () => saving.resolve());
    expect(container.firstElementChild).not.toHaveAttribute("aria-busy");
    for (const button of screen.getAllByRole("button")) expect(button).toBeEnabled();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("brings the answers back with an error line when the answer fails, and clears it on the next try", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(undefined);
    render(<ClientSearchQuestion question={QUESTION} agentName="Scout" answers={ANSWERS} onAnswer={onAnswer} />);

    await user.click(screen.getByRole("button", { name: "Yes, anywhere" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That didn't send. Please try again.");
    for (const button of screen.getAllByRole("button")) expect(button).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Yes, anywhere" }));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(onAnswer).toHaveBeenCalledTimes(2);
  });

  it("lets the host word a failure from what its promise rejected with", async () => {
    const user = userEvent.setup();
    const failed = vi.fn((cause: unknown) =>
      cause instanceof Error && cause.message === "closed" ? "This search has closed." : "Fictional failure.",
    );
    const onAnswer = vi.fn().mockRejectedValue(new Error("closed"));
    render(
      <ClientSearchQuestion
        question={QUESTION}
        agentName="Scout"
        answers={ANSWERS}
        onAnswer={onAnswer}
        labels={{ failed }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Yes, anywhere" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("This search has closed.");
    expect(failed.mock.calls[0]![0]).toBeInstanceOf(Error);
  });

  it("treats a callback that throws at once as a failure, and one that returns nothing as done", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn((answer: string) => {
      if (answer === "Yes, anywhere") throw new Error("offline");
    });
    const { container } = render(
      <ClientSearchQuestion question={QUESTION} agentName="Scout" answers={ANSWERS} onAnswer={onAnswer} />,
    );

    await user.click(screen.getByRole("button", { name: "Yes, anywhere" }));
    expect(screen.getByRole("alert")).toHaveTextContent("That didn't send. Please try again.");

    await user.click(screen.getByRole("button", { name: "No, keep it local" }));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(container.firstElementChild).not.toHaveAttribute("aria-busy");
    for (const button of screen.getAllByRole("button")) expect(button).toBeEnabled();
  });

  it("holds the answers while the host says another request is on its way", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<ClientSearchQuestion question={QUESTION} agentName="Scout" answers={ANSWERS} onAnswer={onAnswer} disabled />);

    for (const button of screen.getAllByRole("button")) expect(button).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Yes, anywhere" }));
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it("lists the answers as text, with nothing to press, where the page is only read", () => {
    const onAnswer = vi.fn();
    render(<ClientSearchQuestion question={QUESTION} agentName="Scout" answers={ANSWERS} onAnswer={onAnswer} readOnly />);

    expect(screen.queryByRole("button")).toBeNull();
    const answers = screen.getByRole("list", { name: "Suggested answers" });
    expect(within(answers).getAllByRole("listitem").map((item) => item.textContent)).toEqual(ANSWERS);
    expect(screen.getByTestId("markdown")).toHaveTextContent(QUESTION);
  });

  it("lists the answers as text when there is nothing to call with one", () => {
    render(<ClientSearchQuestion question={QUESTION} agentName="Scout" answers={ANSWERS} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("draws an answer given twice once, and no group for a question with none", () => {
    const { rerender } = render(
      <ClientSearchQuestion question={QUESTION} agentName="Scout" answers={["Yes", "Yes", "No"]} onAnswer={vi.fn()} />,
    );
    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual(["Yes", "No"]);

    rerender(<ClientSearchQuestion question={QUESTION} agentName="Scout" onAnswer={vi.fn()} />);
    expect(screen.queryByRole("group")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("takes the host's wording, heading level and Markdown overrides", () => {
    const components = { a: "span" } as const;
    render(
      <ClientSearchQuestion
        question={QUESTION}
        agentName="Scout"
        answers={ANSWERS}
        onAnswer={vi.fn()}
        titleLevel={3}
        markdownComponents={components}
        labels={{ questionTitle: (name) => `A question from ${name}`, answers: "Pick an answer" }}
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "A question from Scout" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Pick an answer" })).toBeInTheDocument();
    expect(vi.mocked(LazyMarkdown).mock.calls.at(-1)![0].components).toBe(components);
  });
});

describe("client search live", () => {
  const steps = [
    { key: "map", title: "Mapped fictional companies", status: "done" as const, description: "40 companies" },
    { key: "search", title: "Searching public profiles", status: "running" as const, detail: "Fictional detail" },
    { key: "rank", title: "Ranking people", status: "pending" as const },
  ];

  it("says who is searching and what to expect, over the run under way", () => {
    const { container } = render(<ClientSearchLive agentName="Scout" steps={steps} id="fictional-live" />);

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "client-search-live");
    expect(root).toHaveAttribute("id", "fictional-live");
    expect(screen.getByRole("region", { name: "Scout is searching" })).toBe(root);
    expect(screen.getByRole("heading", { level: 2, name: "Scout is searching" })).toBeInTheDocument();
    expect(screen.getByText(clientSearchLabels.searchingFirst as string)).toBeInTheDocument();

    // The live run: every step shows, the running one's detail open.
    const run = screen.getByRole("group", { name: "How Scout is sourcing" });
    expect(within(run).getByText("Mapped fictional companies")).toBeInTheDocument();
    expect(within(run).getByText("Ranking people")).toBeInTheDocument();
    expect(within(run).getByRole("img", { name: "In progress" })).toBeInTheDocument();
    expect(within(run).getByText("Fictional detail")).toBeInTheDocument();
  });

  it("says it is looking for more once there are people to review, or what the host says", () => {
    const { rerender } = render(<ClientSearchLive agentName="Scout" more />);
    expect(screen.getByText(clientSearchLabels.searchingMore as string)).toBeInTheDocument();
    // No run has reported yet: the words stand alone.
    expect(screen.queryByRole("group")).toBeNull();

    rerender(<ClientSearchLive agentName="Scout" more steps={[]} description="A fictional line." />);
    expect(screen.getByText("A fictional line.")).toBeInTheDocument();
    expect(screen.queryByText(clientSearchLabels.searchingMore as string)).toBeNull();
    expect(screen.queryByRole("group")).toBeNull();
  });

  it("takes the host's wording for the section and the run, and its heading level", () => {
    render(
      <ClientSearchLive
        agentName="Scout"
        steps={steps}
        titleLevel={4}
        labels={{ searchingTitle: (name) => `${name} is on it`, searchingFirst: "First people soon." }}
        traceLabels={{ live: (name) => `What ${name} is doing`, running: "Working" }}
      />,
    );

    expect(screen.getByRole("heading", { level: 4, name: "Scout is on it" })).toBeInTheDocument();
    expect(screen.getByText("First people soon.")).toBeInTheDocument();
    const run = screen.getByRole("group", { name: "What Scout is doing" });
    expect(within(run).getByRole("img", { name: "Working" })).toBeInTheDocument();
  });
});

describe("client search next actions", () => {
  const ACTIONS: ClientSearchAction[] = [
    { id: "more-like-mei", label: "Find more people like Mei Example" },
    { id: "wider", label: "Look in more cities" },
  ];

  it("offers each action under its heading, and asks the host for the one picked", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const { container } = render(<ClientSearchNextActions actions={ACTIONS} onAction={onAction} id="fictional-next" />);

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "client-search-next-actions");
    expect(root).toHaveAttribute("id", "fictional-next");
    expect(screen.getByRole("region", { name: "What next" })).toBe(root);
    expect(screen.getByRole("heading", { level: 2, name: "What next" })).toBeInTheDocument();
    // The actions are named by the heading over them.
    const group = screen.getByRole("group", { name: "What next" });
    expect(within(group).getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Find more people like Mei Example",
      "Look in more cities",
    ]);

    await user.click(screen.getByRole("button", { name: "Look in more cities" }));
    expect(onAction.mock.calls).toEqual([[ACTIONS[1]]]);
  });

  it("holds the actions while a request is on its way, and says so when it fails", async () => {
    const user = userEvent.setup();
    const asking = deferred();
    const onAction = vi.fn(() => asking.promise);
    const { container } = render(<ClientSearchNextActions actions={ACTIONS} onAction={onAction} />);

    await user.click(screen.getByRole("button", { name: "Find more people like Mei Example" }));
    expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
    for (const button of screen.getAllByRole("button")) expect(button).toBeDisabled();

    await act(async () => asking.reject(new Error("offline")));
    expect(screen.getByRole("alert")).toHaveTextContent("That didn't send. Please try again.");
    expect(container.firstElementChild).not.toHaveAttribute("aria-busy");
    for (const button of screen.getAllByRole("button")) expect(button).toBeEnabled();
  });

  it("holds the actions while the host says so", () => {
    render(<ClientSearchNextActions actions={ACTIONS} onAction={vi.fn()} disabled />);
    for (const button of screen.getAllByRole("button")) expect(button).toBeDisabled();
  });

  it("lists what can be asked for as text where the page is only read, or nothing can be asked", () => {
    const { rerender } = render(<ClientSearchNextActions actions={ACTIONS} onAction={vi.fn()} readOnly />);
    expect(screen.queryByRole("button")).toBeNull();
    const list = screen.getByRole("list", { name: "What next" });
    expect(within(list).getAllByRole("listitem").map((item) => item.textContent)).toEqual(ACTIONS.map((action) => action.label));

    rerender(<ClientSearchNextActions actions={ACTIONS} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("draws nothing with nothing to ask for", () => {
    const { container } = render(<ClientSearchNextActions actions={[]} onAction={vi.fn()} />);
    expect(container.innerHTML).toBe("");
  });

  it("takes the host's heading and its level", () => {
    render(<ClientSearchNextActions actions={ACTIONS} onAction={vi.fn()} titleLevel={3} labels={{ nextTitle: "Ask for more" }} />);
    expect(screen.getByRole("heading", { level: 3, name: "Ask for more" })).toBeInTheDocument();
  });
});

describe("client search delivery", () => {
  const PEOPLE: ClientSearchPerson[] = [
    {
      id: "p1",
      name: "Mei Example",
      avatar: <span data-testid="avatar-p1" />,
      headline: "Account Executive · Example Labs",
      headerActions: <a href="#profile-p1">Profile</a>,
      facts: [{ label: "Location", value: "Example City" }],
      evidence: ["Sold to fictional retailers", "Ask about: notice period"],
      decision: "yes",
      reason: "Right level for us",
    },
    { id: "p2", name: "Tomas Example", headline: "Sales Lead · Fictional Robotics" },
  ];
  const RUN = [
    { key: "map", title: "Mapped fictional companies", status: "done" as const },
    { key: "search", title: "Searched public profiles", status: "done" as const },
  ];

  function delivery(overrides: Partial<ClientSearchDeliveryProps> = {}) {
    return (
      <ClientSearchDelivery
        title="First shortlist"
        people={PEOPLE}
        runSteps={RUN}
        agentName="Scout"
        onDecide={vi.fn().mockResolvedValue(undefined)}
        {...overrides}
      />
    );
  }

  const card = (name: string) =>
    screen.getByRole("heading", { level: 3, name }).closest<HTMLElement>("[data-slot='candidate-review-card']")!;

  it("draws the delivery's name, a card for each person with what the host passed, and how the run searched", () => {
    const { container } = render(delivery({ id: "fictional-delivery" }));

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "client-search-delivery");
    expect(root).toHaveAttribute("id", "fictional-delivery");
    const shortlist = screen.getByRole("region", { name: "First shortlist" });
    expect(shortlist).toHaveAttribute("data-slot", "candidate-shortlist");
    expect(screen.getByRole("heading", { level: 2, name: "First shortlist" })).toBeInTheDocument();
    expect(screen.getByText(clientSearchLabels.deliveryDescription as string)).toBeInTheDocument();

    const mei = card("Mei Example");
    expect(within(mei).getByTestId("avatar-p1")).toBeInTheDocument();
    expect(within(mei).getByText("Account Executive · Example Labs")).toBeInTheDocument();
    expect(within(mei).getByRole("link", { name: "Profile" })).toHaveAttribute("href", "#profile-p1");
    expect(within(mei).getByText("Location")).toBeInTheDocument();
    expect(within(mei).getByText("Example City")).toBeInTheDocument();
    // Why they were picked, a line each, under the one label.
    expect(within(mei).getByText("Why we picked them")).toBeInTheDocument();
    const lines = within(mei).getByText("Sold to fictional retailers").parentElement!;
    expect([...lines.children].map((line) => line.textContent)).toEqual([
      "Sold to fictional retailers",
      "Ask about: notice period",
    ]);
    // Their answer, in words, with their own reason.
    expect(within(mei).getByText("You said Yes")).toBeInTheDocument();
    expect(within(mei).getByText("Right level for us")).toBeInTheDocument();

    const tomas = card("Tomas Example");
    expect(within(tomas).queryByText("Why we picked them")).toBeNull();
    expect(within(tomas).getByRole("button", { name: "Yes" })).toBeInTheDocument();
    expect(within(tomas).getByRole("button", { name: "No" })).toBeInTheDocument();

    // People in the delivery's order, then the run, folded to one line.
    expect(screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual([
      "Mei Example",
      "Tomas Example",
    ]);
    const run = screen.getByRole("group", { name: "How Scout searched" });
    expect(shortlist.compareDocumentPosition(run) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(run).getByRole("button")).toHaveAttribute("aria-expanded", "false");
    expect(within(run).getByRole("button")).toHaveTextContent("2 steps");
  });

  it("shows no more about a person than the host passed", () => {
    render(delivery({ people: [{ id: "p9", name: "Imogen Example", decision: "no", reason: "Too senior for this role" }], runSteps: undefined }));
    const imogen = card("Imogen Example");
    // The name, the answer, the reason and the control to change it: nothing else.
    expect(imogen.textContent).toBe("Imogen ExampleYou said NoToo senior for this roleChange");
    expect(screen.queryByRole("group", { name: "How Scout searched" })).toBeNull();
  });

  it("asks why, then hands the host the person, the answer and the reason", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(delivery({ onDecide, decisionLabels: { yesPlaceholder: "What makes them worth meeting?" } }));

    await user.click(within(card("Tomas Example")).getByRole("button", { name: "Yes" }));
    const dialog = screen.getByRole("dialog", { name: "Yes to Tomas Example" });
    expect(onDecide).not.toHaveBeenCalled();
    // A reason is required unless the host says otherwise.
    expect(within(dialog).getByRole("button", { name: "Save Yes" })).toBeDisabled();
    await user.type(within(dialog).getByPlaceholderText("What makes them worth meeting?"), "Fictional reason");
    await user.click(within(dialog).getByRole("button", { name: "Save Yes" }));

    expect(onDecide.mock.calls).toEqual([[PEOPLE[1], "yes", "Fictional reason"]]);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("offers the host's one-tap reasons, and takes an answer with no reason where the host allows it", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    render(delivery({ onDecide, reasonOptional: true, reasonSuggestions: { no: ["Too junior"] } }));

    await user.click(within(card("Tomas Example")).getByRole("button", { name: "No" }));
    const dialog = screen.getByRole("dialog", { name: "No to Tomas Example" });
    expect(within(dialog).getByText("Too junior")).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Why? (optional)")).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Save No" }));

    expect(onDecide.mock.calls).toEqual([[PEOPLE[1], "no", ""]]);
  });

  it("brings the buttons back with an error when the host can't save the answer", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockRejectedValue(new Error("offline"));
    render(delivery({ onDecide }));

    await user.click(within(card("Tomas Example")).getByRole("button", { name: "No" }));
    await user.type(within(screen.getByRole("dialog")).getByRole("textbox"), "Fictional reason");
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Save No" }));

    expect(await within(card("Tomas Example")).findByRole("alert")).toHaveTextContent("That didn't save. Try again.");
    expect(within(card("Tomas Example")).getByRole("button", { name: "No" })).toBeInTheDocument();
  });

  it("shows each answer and takes none where the page is only read", () => {
    const onDecide = vi.fn();
    render(delivery({ onDecide, readOnly: true }));

    const mei = card("Mei Example");
    expect(within(mei).getByText("Said Yes")).toBeInTheDocument();
    expect(within(mei).getByText("Right level for us")).toBeInTheDocument();
    expect(within(mei).queryByText("You said Yes")).toBeNull();
    expect(within(mei).queryByRole("button")).toBeNull();

    const tomas = card("Tomas Example");
    expect(within(tomas).getByText("No answer yet")).toBeInTheDocument();
    expect(within(tomas).queryByRole("button")).toBeNull();
    expect(tomas.querySelector("[data-slot='candidate-client-decision']")).toHaveAttribute("data-read-only", "true");

    // The run still opens: reading it sends nothing.
    expect(screen.getAllByRole("button")).toEqual([within(screen.getByRole("group", { name: "How Scout searched" })).getByRole("button")]);
  });

  it("only shows the answers when the host takes none", () => {
    render(delivery({ onDecide: undefined, runSteps: [] }));
    expect(screen.queryByRole("button")).toBeNull();
    expect(within(card("Tomas Example")).getByText("No answer yet")).toBeInTheDocument();
  });

  it("uses the delivery's own description, and the kit's empty state when it holds nobody", () => {
    const { rerender } = render(delivery({ description: "Three fictional people from the first pass." }));
    expect(screen.getByText("Three fictional people from the first pass.")).toBeInTheDocument();
    expect(screen.queryByText(clientSearchLabels.deliveryDescription as string)).toBeNull();

    rerender(delivery({ people: [] }));
    expect(screen.getByText("No candidates shortlisted yet")).toBeInTheDocument();
    expect(screen.queryByRole("article")).toBeNull();

    rerender(delivery({ people: [], labels: { deliveryEmpty: { title: "Nobody in this one", description: "A fictional reason." } } }));
    expect(screen.getByText("Nobody in this one")).toBeInTheDocument();
    expect(screen.getByText("A fictional reason.")).toBeInTheDocument();
  });

  it("takes the host's wording for the cards, the answers and the run", () => {
    render(
      delivery({
        readOnly: true,
        labels: { deliveryDescription: "Say Yes or No on each.", evidence: "Why them" },
        decisionLabels: { readOnlyYes: "The client said Yes", unanswered: "Waiting on the client" },
        traceLabels: { settled: (name) => `What ${name} did` },
      }),
    );

    expect(screen.getByText("Say Yes or No on each.")).toBeInTheDocument();
    expect(screen.getByText("Why them")).toBeInTheDocument();
    expect(screen.getByText("The client said Yes")).toBeInTheDocument();
    expect(screen.getByText("Waiting on the client")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "What Scout did" })).toBeInTheDocument();
  });
});

describe("client search call button", () => {
  it("is a link where the host has somewhere to send the reader, in a new tab when asked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const { rerender } = render(
      <ClientSearchCallButton call={{ href: "https://example.com/book", onSelect }}>Book a call</ClientSearchCallButton>,
    );

    const link = screen.getByRole("link", { name: "Book a call" });
    expect(link).toHaveAttribute("href", "https://example.com/book");
    expect(link).not.toHaveAttribute("target");
    // The kit's button, drawn as the link itself.
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link).toHaveAttribute("data-variant", "default");
    // The host hears of it before the link is followed.
    await user.click(link);
    expect(onSelect).toHaveBeenCalledTimes(1);

    rerender(
      <ClientSearchCallButton call={{ href: "https://example.com/book", external: true }} variant="outline" size="sm">
        Book a call
      </ClientSearchCallButton>,
    );
    const external = screen.getByRole("link", { name: "Book a call" });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noreferrer noopener");
    expect(external).toHaveAttribute("data-variant", "outline");
    expect(external).toHaveAttribute("data-size", "sm");
  });

  it("is a button that calls the host where there is no link", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ClientSearchCallButton call={{ onSelect }}>Talk to us</ClientSearchCallButton>);

    expect(screen.queryByRole("link")).toBeNull();
    const button = screen.getByRole("button", { name: "Talk to us" });
    expect(button).toHaveAttribute("type", "button");
    await user.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

describe("client search call prompt", () => {
  function Prompt({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
    const [open, setOpen] = useState(true);
    return (
      <ClientSearchCallPrompt
        open={open}
        onOpenChange={(next) => {
          onOpenChange?.(next);
          setOpen(next);
        }}
        call={{ href: "https://example.com/book" }}
      />
    );
  }

  it("says a call comes first and offers one, named and described for a screen reader", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Prompt onOpenChange={onOpenChange} />);

    const dialog = screen.getByRole("dialog", { name: "Book a call to keep the search going" });
    expect(dialog).toHaveAccessibleDescription(clientSearchLabels.callPromptDescription as string);
    // The kit's dialog keeps its slot; the prompt marks its own layout.
    expect(dialog).toHaveAttribute("data-slot", "dialog-content");
    const root = dialog.querySelector<HTMLElement>("[data-slot='client-search-call-prompt']")!;
    expect(within(root).getByRole("link", { name: "Book a call" })).toHaveAttribute("href", "https://example.com/book");

    await user.keyboard("{Escape}");
    expect(onOpenChange.mock.calls).toEqual([[false]]);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("draws nothing while closed, and only the words where the host has no way to book", () => {
    const { rerender } = render(<ClientSearchCallPrompt open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByRole("dialog")).toBeNull();

    rerender(
      <ClientSearchCallPrompt
        open
        onOpenChange={vi.fn()}
        labels={{ callPromptTitle: "Talk to us first", callPromptDescription: "A fictional reason to talk." }}
      />,
    );
    const dialog = screen.getByRole("dialog", { name: "Talk to us first" });
    expect(dialog).toHaveAccessibleDescription("A fictional reason to talk.");
    expect(within(dialog).queryByRole("link")).toBeNull();
    expect(within(dialog).getAllByRole("button").map((button) => button.textContent)).toEqual(["Close"]);
  });

  it("points at no description when the host words none", () => {
    render(<ClientSearchCallPrompt open onOpenChange={vi.fn()} labels={{ callPromptDescription: "" }} />);
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-describedby");
  });
});

describe("client search brief panel", () => {
  const brief = {
    roleTitle: "Account Executive",
    companyName: "Fernhill Example Co",
    roleDescription: "A fictional first sales hire.",
    location: "Example City",
    mustHaves: ["Fictional sales experience"],
    redFlags: ["Fictional red flag"],
  };

  it("opens the brief in full from its button", async () => {
    const user = userEvent.setup();
    render(<ClientSearchBriefPanel brief={brief} />);

    expect(screen.queryByRole("dialog")).toBeNull();
    const button = screen.getByRole("button", { name: "Brief" });
    expect(button).toHaveAttribute("data-slot", "button");
    await user.click(button);

    const dialog = screen.getByRole("dialog", { name: "Your brief" });
    const body = dialog.querySelector<HTMLElement>("[data-slot='client-search-brief-panel']")!;
    // The brief's own title sits under the panel's.
    expect(within(dialog).getByRole("heading", { level: 2, name: "Your brief" })).toBeInTheDocument();
    expect(within(body).getByRole("heading", { level: 3, name: "Account Executive · Fernhill Example Co" })).toBeInTheDocument();
    expect(within(body).getByText("A fictional first sales hire.")).toBeInTheDocument();
    expect(within(body).getByText("Fictional sales experience")).toBeInTheDocument();
    expect(within(body).getByText("Fictional red flag")).toBeInTheDocument();
    // Read only: nothing to add or edit.
    expect(within(body).queryByRole("textbox")).toBeNull();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(button).toHaveFocus();
  });

  it("reads the brief as the host asks, under the host's words", async () => {
    const user = userEvent.setup();
    render(
      <ClientSearchBriefPanel
        brief={brief}
        briefOptions={{ audience: "public", title: "generic" }}
        labels={{ brief: "The brief", briefTitle: "What we agreed" }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "The brief" }));
    const dialog = screen.getByRole("dialog", { name: "What we agreed" });
    expect(within(dialog).getByRole("heading", { level: 3, name: "Job brief" })).toBeInTheDocument();
    expect(within(dialog).queryByText("Fictional red flag")).toBeNull();
  });
});

describe("client search progress panel", () => {
  const steps = [
    { id: "brief", title: "Agreeing the brief", state: "done" as const },
    {
      id: "shortlist",
      title: "Shortlist to review",
      state: "current" as const,
      description: "Two fictional people are waiting.",
      action: <a href="#review">Review them</a>,
    },
    { id: "meetings", title: "First meetings", state: "upcoming" as const },
  ];

  it("opens where the search stands from its button", async () => {
    const user = userEvent.setup();
    render(<ClientSearchProgressPanel steps={steps} />);

    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Progress" }));

    const dialog = screen.getByRole("dialog", { name: "Where your search stands" });
    const body = dialog.querySelector<HTMLElement>("[data-slot='client-search-progress-panel']")!;
    const items = within(body).getAllByRole("listitem");
    expect(items.map((item) => item.getAttribute("data-state"))).toEqual(["done", "current", "upcoming"]);
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[1]).toHaveTextContent("In progress: Shortlist to review");
    expect(within(items[1]!).getByRole("link", { name: "Review them" })).toBeInTheDocument();
  });

  it("takes the host's words for the panel and for each state", async () => {
    const user = userEvent.setup();
    render(
      <ClientSearchProgressPanel
        steps={steps}
        labels={{ progress: "Where we are", progressTitle: "Your search so far" }}
        progressLabels={{ current: "Now" }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Where we are" }));
    const dialog = screen.getByRole("dialog", { name: "Your search so far" });
    expect(within(dialog).getAllByRole("listitem")[1]).toHaveTextContent("Now: Shortlist to review");
  });
});
