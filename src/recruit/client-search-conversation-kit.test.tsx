import { Chat, ChatThread, type ChatProps } from "@epicbagel/saas-kit/primitives/chat";
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ClientSearchConversation,
  clientSearchThread,
  type ClientSearchChatProps,
} from "./client-search-conversation";

// What the conversation hands the kit's Chat, read off a stand-in for it. A
// fictional search only.

vi.mock("@epicbagel/saas-kit/primitives/chat", () => ({
  Chat: vi.fn(() => null),
  ChatThread: vi.fn(() => null),
}));

afterEach(() => {
  vi.mocked(Chat).mockClear();
  vi.mocked(ChatThread).mockClear();
});

const THREAD = clientSearchThread({
  turns: [
    { id: "t1", from: "client" as const, body: "A fictional brief.", createdAt: "2026-01-01T10:00:00Z", files: ["fictional.pdf"] },
    { id: "t2", from: "agency" as const, body: "A fictional reply.", createdAt: "2026-01-01T10:01:00Z" },
  ],
  briefVersions: [{ revision: 1, brief: { roleTitle: "Fictional role" }, replyTurnId: "t2", createdAt: "2026-01-01T10:01:00Z" }],
  deliveries: [{ id: "d1", title: "First shortlist", people: [], deliveredAt: "2026-01-02T09:00:00Z" }],
});

/** The props of the latest render of the kit's Chat. */
const chatProps = () => vi.mocked(Chat).mock.calls.at(-1)![0] as ChatProps & Record<string, unknown>;

describe("client search conversation, as the kit's Chat sees it", () => {
  it("hands each turn over as a message, the reader's as the user's and the agency's named", () => {
    render(<ClientSearchConversation thread={THREAD} agentName="Scout" onReply={vi.fn()} />);

    const [reader, agency, brief, delivery] = chatProps().messages;
    expect(reader).toMatchObject({
      id: "t1",
      role: "user",
      text: "A fictional brief.",
      createdAt: "2026-01-01T10:00:00Z",
      attachments: [{ id: "t1-0", name: "fictional.pdf" }],
    });
    // A kit that names a turn's author names the agency's; the reader's own turns need no name.
    expect(reader).toHaveProperty("author", undefined);
    expect(agency).toMatchObject({ id: "t2", role: "assistant", text: "A fictional reply.", attachments: [] });
    expect(agency).toHaveProperty("author", { id: "agency", name: "Scout" });

    // A brief and a delivery are cards across the thread, not replies to act on.
    expect(brief).toMatchObject({ id: "brief-1", role: "assistant", width: "full", actions: false });
    expect(delivery).toMatchObject({ id: "delivery-d1", role: "assistant", width: "full", actions: false });
    expect(brief!.text).toBeUndefined();
    expect(brief!.content).toBeTruthy();
  });

  it("sets the conversation up as the whole surface, with the host's own settings beside its own", () => {
    // A newer kit's Chat takes settings this one doesn't know: they pass through all the same.
    const newer = { mobileCompactSuggestions: true } as ClientSearchChatProps;
    render(
      <ClientSearchConversation
        thread={THREAD}
        agentName="Scout"
        onReply={vi.fn()}
        awaitingReply
        suggestedReplies={["Example City"]}
        chat={{ voice: false, attachmentAccept: ".pdf", mobileCompactComposer: false, ...newer }}
      />,
    );

    expect(chatProps()).toMatchObject({
      layout: "workspace",
      pending: true,
      pendingLabel: "Reading what you sent…",
      error: null,
      placeholder: "Answer, give feedback, or add detail",
      activePlaceholder: "Answer, give feedback, or add detail",
      replySuggestions: ["Example City"],
      attachments: [],
      voice: false,
      attachmentAccept: ".pdf",
      mobileCompactComposer: false,
      mobileCompactSuggestions: true,
    });
    expect(chatProps().onFilesSelected).toBeTypeOf("function");
    // The failure shows under the composer, so the kit reports none of its own.
    expect(chatProps().onSendError).toBeTypeOf("function");
  });

  it("folds the composer on a phone unless the host says otherwise, and takes no files where it leaves them out", () => {
    render(<ClientSearchConversation thread={THREAD} agentName="Scout" onReply={vi.fn()} maxFiles={0} />);
    expect(chatProps()).toMatchObject({ mobileCompactComposer: true, pending: false });
    expect(chatProps().onFilesSelected).toBeUndefined();
  });

  it("hands a page that is only read the thread alone, in the same look", () => {
    const components = { a: "span" } as const;
    render(
      <ClientSearchConversation
        thread={THREAD}
        agentName="Scout"
        onReply={vi.fn()}
        readOnly
        awaitingReply
        markdownComponents={components}
      />,
    );

    expect(Chat).not.toHaveBeenCalled();
    const thread = vi.mocked(ChatThread).mock.calls.at(-1)![0];
    expect(thread).toMatchObject({
      appearance: "workspace",
      maxHeight: "none",
      pending: true,
      pendingLabel: "Reading what you sent…",
      markdownComponents: components,
    });
    expect(thread.messages.map((message) => message.id)).toEqual(["t1", "t2", "brief-1", "delivery-d1"]);
  });
});
