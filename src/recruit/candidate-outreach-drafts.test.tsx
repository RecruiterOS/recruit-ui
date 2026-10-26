import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mail, MessageCircle } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import {
  CandidateOutreachDraftList,
  defaultOutreachDraftActions,
  outreachDraftCopyText,
  type CandidateOutreachDraftItem,
} from "./candidate-outreach-drafts";

// Fictional people, organisations and roles only.

interface Draft extends CandidateOutreachDraftItem {
  ref: string;
}

const email: Draft = {
  id: 1,
  ref: "draft-email",
  channel: { label: "Email", icon: Mail },
  status: "draft",
  subject: "A platform role at Fernhill Example Co",
  body: "Hi Imogen,\n\nWould you be open to a short call next week?",
};

const chat: Draft = {
  id: 2,
  ref: "draft-chat",
  channel: { label: "Chat", icon: MessageCircle },
  status: "approved",
  body: "Hi Imogen, quick one about a platform role. Free for a call?",
};

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("outreachDraftCopyText", () => {
  it("puts the subject line above the message when there is one", () => {
    expect(outreachDraftCopyText({ subject: "Hello", body: "Body" })).toBe("Subject: Hello\n\nBody");
    expect(outreachDraftCopyText({ subject: null, body: "Body" })).toBe("Body");
  });
});

describe("candidate outreach draft list", () => {
  it("shows each draft with its channel, status, subject and message under a counted heading", () => {
    const { container } = render(
      <CandidateOutreachDraftList drafts={[email, chat]} onApprove={() => undefined} onDismiss={() => undefined} onMarkSent={() => undefined} />,
    );

    const section = container.firstElementChild as HTMLElement;
    expect(section).toHaveAttribute("data-slot", "candidate-outreach-draft-list");
    expect(screen.getByRole("region", { name: /Outreach drafts/ })).toBe(section);
    expect(screen.getByRole("heading", { name: /Outreach drafts/ })).toHaveTextContent("2");

    const rows = container.querySelectorAll('[data-slot="candidate-outreach-draft"]');
    expect(rows).toHaveLength(2);
    const first = within(rows[0] as HTMLElement);
    expect(first.getByText("Email")).toBeInTheDocument();
    expect(first.getByText("draft")).toHaveAttribute("data-slot", "badge");
    expect(first.getByText("A platform role at Fernhill Example Co")).toBeInTheDocument();
    expect(first.getByText(/Would you be open to a short call/)).toBeInTheDocument();
    expect(first.getAllByRole("button").map((button) => button.getAttribute("aria-label"))).toEqual([
      "Copy Email draft",
      "Approve Email draft",
      "Dismiss Email draft",
    ]);
    expect(first.getByRole("button", { name: "Approve Email draft" })).toHaveAttribute("title", "Approve");

    // An approved draft can only be copied or marked sent.
    const second = within(rows[1] as HTMLElement);
    expect(second.getByText("approved")).toBeInTheDocument();
    expect(second.getAllByRole("button").map((button) => button.getAttribute("aria-label"))).toEqual([
      "Copy Chat draft",
      "Mark Chat draft sent",
    ]);
  });

  it("offers only the actions it is given, and none on a sent or dismissed draft", () => {
    render(
      <CandidateOutreachDraftList
        drafts={[
          { ...email, id: 3 },
          { ...chat, id: 4, status: "sent" },
          { ...chat, id: 5, status: "dismissed" },
        ]}
        onDismiss={() => undefined}
      />,
    );

    expect(screen.queryByRole("button", { name: /Approve/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Dismiss Email draft" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sent$/ })).toBeNull();
    expect(screen.getAllByRole("button", { name: /^Copy/ })).toHaveLength(3);
  });

  it("offers the actions the host's workflow allows, in place of the approve-then-send default", () => {
    expect(defaultOutreachDraftActions({ status: "draft" })).toEqual(["approve", "dismiss"]);
    expect(defaultOutreachDraftActions({ status: "approved" })).toEqual(["markSent"]);
    expect(defaultOutreachDraftActions({ status: "sent" })).toEqual([]);

    // A workflow with no approval step: a draft can be marked sent or set
    // aside straight away, and an approved one set aside too.
    render(
      <CandidateOutreachDraftList
        drafts={[email, chat]}
        availableActions={(draft) => (draft.status === "draft" ? ["markSent", "dismiss"] : draft.status === "approved" ? ["dismiss"] : [])}
        onApprove={() => undefined}
        onDismiss={() => undefined}
        onMarkSent={() => undefined}
      />,
    );

    expect(screen.queryByRole("button", { name: /^Approve/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Mark Email draft sent" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dismiss Email draft" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Mark Chat draft sent" })).toBeNull();
    expect(screen.getByRole("button", { name: "Dismiss Chat draft" })).toBeInTheDocument();
  });

  it("hands the host its own draft, and holds the row while a returned promise settles", async () => {
    const user = userEvent.setup();
    const pending = deferred();
    const onApprove = vi.fn((_draft: Draft) => pending.promise);
    render(<CandidateOutreachDraftList drafts={[email]} onApprove={onApprove} onDismiss={() => undefined} />);

    const approve = screen.getByRole("button", { name: "Approve Email draft" });
    await user.click(approve);
    expect(onApprove).toHaveBeenCalledWith(email);
    expect(onApprove.mock.calls[0]?.[0]?.ref).toBe("draft-email");
    expect(approve).toBeDisabled();
    expect(screen.getByRole("button", { name: "Dismiss Email draft" })).toBeDisabled();

    pending.resolve();
    await waitFor(() => expect(approve).toBeEnabled());
  });

  it("uses the host's wording for statuses, actions and the copied text", () => {
    render(
      <CandidateOutreachDraftList
        drafts={[email]}
        title="Drafts"
        onApprove={() => undefined}
        copyText={(draft) => `${draft.ref}: ${draft.body}`}
        labels={{
          status: { draft: "To review", approved: "Ready", sent: "Sent", dismissed: "Set aside" },
          approve: "Ready to send",
          actionName: (action, channel) => `${action} ${channel}`,
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: /Drafts/ })).toBeInTheDocument();
    expect(screen.getByText("To review")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "approve Email" })).toHaveAttribute("title", "Ready to send");
    expect(screen.getByRole("button", { name: "copy Email" })).toBeInTheDocument();
  });

  it("shows a skeleton while loading, then the empty state with no count", () => {
    const { rerender } = render(<CandidateOutreachDraftList drafts={[]} loading />);
    expect(screen.queryByText("No outreach drafts yet")).toBeNull();
    expect(screen.getByRole("heading", { name: "Outreach drafts" })).toHaveTextContent(/^Outreach drafts$/);

    rerender(
      <CandidateOutreachDraftList
        drafts={[]}
        empty={{ title: "No outreach drafts yet", description: "Drafts appear here once they are written." }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Outreach drafts" })).toHaveTextContent(/^Outreach drafts$/);
    expect(screen.getByText("No outreach drafts yet")).toBeInTheDocument();
    expect(screen.getByText("Drafts appear here once they are written.")).toBeInTheDocument();
  });
});
