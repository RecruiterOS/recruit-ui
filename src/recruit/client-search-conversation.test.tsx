import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  ClientSearchConversation,
  clientSearchThread,
  type ClientSearchBriefVersion,
  type ClientSearchConversationProps,
  type ClientSearchDeliveryItem,
  type ClientSearchTurn,
} from "./client-search-conversation";

// A fictional search, with fictional people and files only.

const TURNS: ClientSearchTurn[] = [
  {
    id: "t1",
    from: "client",
    body: "We need a fictional account executive.",
    createdAt: "2026-01-01T10:00:00Z",
    files: ["fictional-job-description.pdf"],
  },
  { id: "t2", from: "agency", body: "Thanks. Where is the role based?", createdAt: "2026-01-01T10:01:00Z" },
  { id: "t3", from: "client", body: "Example City, two days a week.", createdAt: "2026-01-01T10:05:00Z" },
  { id: "t4", from: "agency", body: "Got it. The brief is updated.", createdAt: "2026-01-01T10:06:00Z" },
];

const BRIEFS: ClientSearchBriefVersion[] = [
  {
    revision: 1,
    brief: { roleTitle: "Account Executive", companyName: "Fernhill Example Co", mustHaves: ["Fictional sales experience"] },
    replyTurnId: "t2",
    createdAt: "2026-01-01T10:01:00Z",
  },
  {
    revision: 2,
    brief: {
      roleTitle: "Account Executive",
      companyName: "Fernhill Example Co",
      location: "Example City",
      mustHaves: ["Fictional sales experience"],
      redFlags: ["Fictional red flag"],
    },
    replyTurnId: "t4",
    createdAt: "2026-01-01T10:06:00Z",
  },
];

const DELIVERY: ClientSearchDeliveryItem = {
  id: "d1",
  title: "First shortlist",
  deliveredAt: "2026-01-02T09:00:00Z",
  people: [
    { id: "p1", name: "Mei Example", decision: "yes", reason: "Right level for us" },
    { id: "p2", name: "Tomas Example" },
  ],
};

const THREAD = clientSearchThread({ turns: TURNS, briefVersions: BRIEFS });

function conversation(overrides: Partial<ClientSearchConversationProps> = {}) {
  return (
    <ClientSearchConversation
      thread={THREAD}
      agentName="Scout"
      onReply={vi.fn().mockResolvedValue(undefined)}
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

const composer = () => screen.getByRole<HTMLTextAreaElement>("textbox");
const fileInput = (container: HTMLElement) => container.querySelector<HTMLInputElement>("input[type='file']");
const file = (name: string) => new File(["fictional"], name, { type: "text/plain" });
/** Each row of the thread, in order: its message id, as the kit marks it. */
const rows = (container: HTMLElement) =>
  [...container.querySelectorAll("[data-slot='message-scroller-item'][data-message-id]")].map((row) =>
    row.getAttribute("data-message-id"),
  );

describe("client search conversation", () => {
  it("draws each turn, each version of the brief under the turn that wrote it, and a composer", () => {
    const { container } = render(conversation({ id: "fictional-conversation" }));

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "client-search-conversation");
    expect(root).toHaveAttribute("id", "fictional-conversation");
    expect(root).not.toHaveAttribute("data-read-only");
    // The kit's conversation, as the whole surface.
    const chat = root.querySelector("[data-slot='chat']")!;
    expect(chat).toHaveAttribute("data-layout", "workspace");

    expect(rows(container)).toEqual(["t1", "t2", "brief-1", "t3", "t4", "brief-2"]);
    const log = screen.getByRole("log");
    // The reader's turns sit at the end of the line, the agency's at the start.
    const turn = (words: string) => within(log).getByText(words).closest("[data-slot='message']")!;
    expect(turn("We need a fictional account executive.")).toHaveAttribute("data-align", "end");
    expect(turn("Thanks. Where is the role based?")).toHaveAttribute("data-align", "start");
    // A turn's files are listed with it.
    expect(within(turn("We need a fictional account executive.") as HTMLElement).getByText("fictional-job-description.pdf")).toBeInTheDocument();

    // Each brief says which version it is; only the latest is in force.
    const briefs = [...container.querySelectorAll<HTMLElement>("[data-slot='job-brief-card']")];
    expect(briefs.map((brief) => brief.getAttribute("data-presentation"))).toEqual(["preview", "preview"]);
    expect(within(briefs[0]!).getByText("v1 · Earlier")).toBeInTheDocument();
    expect(within(briefs[1]!).getByText("v2 · Current")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2, name: /Account Executive · Fernhill Example Co/ })).toHaveLength(2);
    // An earlier brief previews only its title; the one in force previews its start.
    expect(within(briefs[0]!).queryByText("Fictional sales experience")).toBeNull();
    expect(within(briefs[1]!).getByText("Fictional sales experience")).toBeInTheDocument();

    expect(composer()).toHaveAttribute("placeholder", "Answer, give feedback, or add detail");
    expect(composer()).toBeEnabled();
  });

  it("sends the reader's words to the host", async () => {
    const user = userEvent.setup();
    const onReply = vi.fn().mockResolvedValue(undefined);
    render(conversation({ onReply }));

    await user.type(composer(), "  Up to 90k base.  {Enter}");

    expect(onReply.mock.calls).toEqual([["Up to 90k base.", []]]);
    await waitFor(() => expect(composer()).toBeEnabled());
    expect(composer()).toHaveValue("");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("holds the composer under a running line while the reply is on its way", async () => {
    const user = userEvent.setup();
    const sending = deferred();
    const onReply = vi.fn(() => sending.promise);
    render(conversation({ onReply, suggestedReplies: ["Remote is fine"] }));

    await user.type(composer(), "Up to 90k base.{Enter}");

    expect(composer()).toBeDisabled();
    expect(composer()).toHaveValue("");
    expect(within(screen.getByRole("log")).getByText("Sending…")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remote is fine" })).toBeDisabled();

    await act(async () => sending.resolve());
    expect(composer()).toBeEnabled();
    expect(screen.queryByText("Sending…")).toBeNull();
  });

  it("stages the reader's files, sends them with the reply, and clears them once it is sent", async () => {
    const user = userEvent.setup();
    const sending = deferred();
    const onReply = vi.fn((_words: string, _files: File[]) => sending.promise);
    const { container } = render(conversation({ onReply }));

    const first = file("fictional-org-chart.txt");
    const second = file("fictional-comp-plan.txt");
    await user.upload(fileInput(container)!, [first, second]);
    expect(screen.getByText("fictional-org-chart.txt")).toBeInTheDocument();
    expect(screen.getByText("fictional-comp-plan.txt")).toBeInTheDocument();

    // One comes off again before sending.
    await user.click(screen.getByRole("button", { name: "Remove fictional-org-chart.txt" }));
    expect(screen.queryByText("fictional-org-chart.txt")).toBeNull();

    await user.type(composer(), "The comp plan is attached.{Enter}");
    expect(onReply).toHaveBeenCalledTimes(1);
    expect(onReply.mock.calls[0]![0]).toBe("The comp plan is attached.");
    // The file itself, as the reader picked it.
    expect(onReply.mock.calls[0]![1]).toEqual([second]);
    expect(onReply.mock.calls[0]![1][0]).toBe(second);
    // It stays staged until the host has it.
    expect(screen.getByText("fictional-comp-plan.txt")).toBeInTheDocument();

    await act(async () => sending.resolve());
    expect(screen.queryByText("fictional-comp-plan.txt")).toBeNull();
  });

  it("sends files alone, with no words", async () => {
    const user = userEvent.setup();
    const onReply = vi.fn().mockResolvedValue(undefined);
    const { container } = render(conversation({ onReply }));

    const only = file("fictional-org-chart.txt");
    await user.upload(fileInput(container)!, [only]);
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(onReply.mock.calls).toEqual([["", [only]]]);
  });

  it("puts the words back, keeps the files and says what went wrong when a reply fails", async () => {
    const user = userEvent.setup();
    const failed = vi.fn((cause: unknown) =>
      cause instanceof Error && cause.message === "too-large" ? "Those files are too large. Send smaller ones." : "Fictional failure.",
    );
    const onReply = vi.fn().mockRejectedValueOnce(new Error("too-large")).mockResolvedValue(undefined);
    const { container } = render(conversation({ onReply, labels: { failed } }));

    await user.upload(fileInput(container)!, [file("fictional-org-chart.txt")]);
    await user.type(composer(), "Here is the org chart.{Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent("Those files are too large. Send smaller ones.");
    expect(failed.mock.calls[0]![0]).toBeInstanceOf(Error);
    // Nothing is lost: the words, the file, and the place to try again.
    await waitFor(() => expect(composer()).toHaveValue("Here is the org chart."));
    expect(composer()).toBeEnabled();
    await waitFor(() => expect(composer()).toHaveFocus());
    expect(screen.getByText("fictional-org-chart.txt")).toBeInTheDocument();

    // The next try clears the error.
    await user.type(composer(), "{Enter}");
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
    expect(onReply).toHaveBeenCalledTimes(2);
    expect(onReply.mock.calls[1]![1]).toHaveLength(1);
    await waitFor(() => expect(screen.queryByText("fictional-org-chart.txt")).toBeNull());
  });

  it("words a failed reply plainly when the host words none", async () => {
    const user = userEvent.setup();
    render(conversation({ onReply: vi.fn().mockRejectedValue(new Error("offline")) }));

    await user.type(composer(), "Up to 90k base.{Enter}");
    expect(await screen.findByRole("alert")).toHaveTextContent("That didn't send. Please try again.");
  });

  it("sends a suggested reply on its own, leaving the draft and the staged files where they are", async () => {
    const user = userEvent.setup();
    const onReply = vi.fn().mockResolvedValue(undefined);
    const { container } = render(conversation({ onReply, suggestedReplies: ["Example City", "Remote is fine"] }));

    const replies = screen.getByRole("group", { name: "Suggested replies" });
    expect(within(replies).getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Example City",
      "Remote is fine",
    ]);
    await user.upload(fileInput(container)!, [file("fictional-org-chart.txt")]);
    await user.type(composer(), "A half-written thought");
    await user.click(within(replies).getByRole("button", { name: "Remote is fine" }));

    expect(onReply.mock.calls).toEqual([["Remote is fine", []]]);
    await waitFor(() => expect(composer()).toBeEnabled());
    expect(composer()).toHaveValue("A half-written thought");
    expect(screen.getByText("fictional-org-chart.txt")).toBeInTheDocument();
  });

  it("says a reply is being written, and holds the composer, while the host awaits one", () => {
    render(conversation({ awaitingReply: true, suggestedReplies: ["Example City"] }));

    expect(within(screen.getByRole("log")).getByText("Reading what you sent…")).toBeInTheDocument();
    expect(composer()).toBeDisabled();
    expect(screen.getByRole("button", { name: "Example City" })).toBeDisabled();
  });

  it("takes as many files as one reply holds, keeps the first picked and says so", async () => {
    const user = userEvent.setup();
    const { container } = render(conversation({ maxFiles: 2 }));

    await user.upload(fileInput(container)!, [file("one.txt"), file("two.txt"), file("three.txt")]);
    expect(screen.getByText("one.txt")).toBeInTheDocument();
    expect(screen.getByText("two.txt")).toBeInTheDocument();
    expect(screen.queryByText("three.txt")).toBeNull();
    expect(screen.getByRole("alert")).toHaveTextContent("You can send up to 2 files at a time.");

    // Making room clears the notice, and the next file fits.
    await user.click(screen.getByRole("button", { name: "Remove one.txt" }));
    expect(screen.queryByRole("alert")).toBeNull();
    await user.upload(fileInput(container)!, [file("three.txt")]);
    expect(screen.getByText("three.txt")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("takes five files by default, and none where the host leaves files out", async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(conversation());

    await user.upload(
      fileInput(container)!,
      ["a", "b", "c", "d", "e", "f"].map((name) => file(`${name}.txt`)),
    );
    expect(container.querySelectorAll("[data-slot='chat-input'] [data-slot='attachment']")).toHaveLength(5);
    expect(screen.getByRole("alert")).toHaveTextContent("You can send up to 5 files at a time.");

    rerender(conversation({ maxFiles: 0 }));
    expect(fileInput(container)).toBeNull();
    expect(screen.queryByRole("button", { name: "Add to conversation" })).toBeNull();
  });

  it("shows a delivery where it landed, with a Yes or No on each person", async () => {
    const user = userEvent.setup();
    const onDecide = vi.fn().mockResolvedValue(undefined);
    const { container } = render(
      conversation({
        thread: clientSearchThread({ turns: TURNS, briefVersions: BRIEFS, deliveries: [DELIVERY] }),
        onDecide,
        reasonOptional: true,
      }),
    );

    expect(rows(container).at(-1)).toBe("delivery-d1");
    const delivery = container.querySelector<HTMLElement>("[data-slot='client-search-delivery']")!;
    expect(within(delivery).getByRole("heading", { level: 2, name: "First shortlist" })).toBeInTheDocument();
    expect(within(delivery).getByText("You said Yes")).toBeInTheDocument();

    const tomas = within(delivery).getByRole("heading", { level: 3, name: "Tomas Example" }).closest<HTMLElement>("article")!;
    await user.click(within(tomas).getByRole("button", { name: "No" }));
    await user.click(within(screen.getByRole("dialog", { name: "No to Tomas Example" })).getByRole("button", { name: "Save No" }));
    expect(onDecide.mock.calls).toEqual([[DELIVERY.people[1], "no", ""]]);
  });

  it("shows the thread alone where the page is only read: nothing to write, pick, attach or decide", () => {
    const onReply = vi.fn();
    const { container } = render(
      conversation({
        thread: clientSearchThread({ turns: TURNS, briefVersions: BRIEFS, deliveries: [DELIVERY] }),
        onReply,
        onDecide: vi.fn(),
        suggestedReplies: ["Example City"],
        readOnly: true,
      }),
    );

    expect(container.firstElementChild).toHaveAttribute("data-read-only", "true");
    expect(rows(container)).toEqual(["t1", "t2", "brief-1", "t3", "t4", "brief-2", "delivery-d1"]);
    expect(screen.getByText("Example City, two days a week.")).toBeInTheDocument();

    expect(screen.queryByRole("textbox")).toBeNull();
    expect(container.querySelector("input, textarea, select, form")).toBeNull();
    expect(screen.queryByRole("button", { name: "Example City" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Send" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Yes" })).toBeNull();
    expect(screen.getByText("Said Yes")).toBeInTheDocument();
    expect(screen.getByText("No answer yet")).toBeInTheDocument();
    // What is left only opens or scrolls: each brief's toggle, and the way back to the latest turn.
    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Show full brief (1 more)",
      "Show full brief (1 more)",
      "Scroll to latest message",
    ]);
  });

  it("still says a reply is being written on a page that is only read", () => {
    render(conversation({ readOnly: true, awaitingReply: true }));
    expect(within(screen.getByRole("log")).getByText("Reading what you sent…")).toBeInTheDocument();
  });

  it("shows the thread alone when the host takes no replies", () => {
    const { container } = render(conversation({ onReply: undefined, suggestedReplies: ["Example City"] }));
    expect(container.firstElementChild).toHaveAttribute("data-read-only", "true");
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("button", { name: "Example City" })).toBeNull();
  });

  it("says a conversation nobody can write in is empty, in the host's words if it has some", () => {
    const { rerender } = render(conversation({ thread: [], readOnly: true }));
    expect(screen.getByText("No messages yet")).toBeInTheDocument();
    expect(screen.queryByRole("log")).toBeNull();

    rerender(
      conversation({
        thread: [],
        readOnly: true,
        labels: { conversationEmpty: { title: "Nothing said so far", description: "A fictional line." } },
      }),
    );
    expect(screen.getByText("Nothing said so far")).toBeInTheDocument();
    expect(screen.getByText("A fictional line.")).toBeInTheDocument();
  });

  it("passes the kit conversation's own settings straight through, and words the composer as the host asks", () => {
    const { container } = render(
      conversation({
        labels: { replyPlaceholder: "Write to us" },
        chat: {
          attachmentAccept: ".pdf,.txt",
          composerHelperText: "Fictional helper line",
          replySuggestionsLabel: "Quick answers",
        },
        suggestedReplies: ["Example City"],
      }),
    );

    expect(composer()).toHaveAttribute("placeholder", "Write to us");
    expect(fileInput(container)).toHaveAttribute("accept", ".pdf,.txt");
    expect(screen.getByText("Fictional helper line")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Quick answers" })).toBeInTheDocument();
    // The conversation's own layout isn't the host's to change.
    expect(container.querySelector("[data-slot='chat']")).toHaveAttribute("data-layout", "workspace");
  });

  it("reads each brief as the host asks", () => {
    const { container } = render(conversation({ briefOptions: { audience: "public", title: "generic" } }));
    const briefs = [...container.querySelectorAll<HTMLElement>("[data-slot='job-brief-card']")];
    expect(within(briefs[1]!).getByRole("heading", { level: 2, name: /Job brief/ })).toBeInTheDocument();
    // An earlier version stays an earlier version, whatever the host passed.
    expect(within(briefs[0]!).getByText("v1 · Earlier")).toBeInTheDocument();
    expect(within(briefs[0]!).queryByText("Fictional sales experience")).toBeNull();
  });
});
