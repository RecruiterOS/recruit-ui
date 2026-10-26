import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CandidateShortlistNote } from "./candidate-shortlist-note";

const follows = (later: Node, earlier: Node) =>
  Boolean(earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING);

describe("candidate shortlist note", () => {
  it("sets the sender, the message, the media and the sign-off line in order on one card", () => {
    const { container } = render(
      <CandidateShortlistNote
        id="example-note"
        avatar={<span>JA</span>}
        title="A note from Jordan"
        meta="Principal, Example Talent"
        message={<p>Three fictional people worth your time.</p>}
        media={<figure>Fictional video</figure>}
        signature="— Jordan"
        action={<a href="#book">Book 15 minutes with Jordan</a>}
      />,
    );

    const card = container.firstElementChild!;
    // The root is the kit's Card, which keeps its own data-slot.
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toHaveAttribute("id", "example-note");

    // The title is an h2 by default, so the note never adds an h1 to the page.
    const heading = within(card as HTMLElement).getByRole("heading", { level: 2, name: "A note from Jordan" });
    expect(card.querySelector("h1")).toBeNull();
    const meta = screen.getByText("Principal, Example Talent");
    const message = screen.getByText("Three fictional people worth your time.");
    const media = screen.getByText("Fictional video");
    const signature = screen.getByText("— Jordan");
    const action = screen.getByRole("link", { name: "Book 15 minutes with Jordan" });

    expect(follows(heading, screen.getByText("JA"))).toBe(true);
    expect(follows(meta, heading)).toBe(true);
    expect(follows(message, meta)).toBe(true);
    // The message is set as rich text; the note parses nothing itself.
    expect(message.closest("[data-slot='rich-text']")).not.toBeNull();
    expect(follows(media, message)).toBe(true);
    expect(follows(signature, media)).toBe(true);
    // The sign-off and the action share the last line.
    expect(signature.parentElement).toBe(action.parentElement);
  });

  it("draws only what it is given", () => {
    const { container, rerender } = render(<CandidateShortlistNote title="A note from the recruiter" />);

    const heading = screen.getByRole("heading", { level: 2, name: "A note from the recruiter" });
    expect(container.querySelector("[data-slot='rich-text']")).toBeNull();
    // No sign-off and no action: no empty last line.
    const stack = container.firstElementChild!.firstElementChild!;
    expect(stack.children).toHaveLength(1);
    // No avatar: the sender's row holds only the title's column. No meta: the
    // column holds only the title.
    const row = stack.firstElementChild!;
    expect(row.children).toHaveLength(1);
    expect(row.firstElementChild!.children).toHaveLength(1);
    expect(row.firstElementChild!.firstElementChild).toBe(heading);

    rerender(
      <CandidateShortlistNote
        title="A note from the recruiter"
        message=""
        signature={false}
        action={<a href="#book">Book a call</a>}
      />,
    );
    expect(container.querySelector("[data-slot='rich-text']")).toBeNull();
    const link = screen.getByRole("link", { name: "Book a call" });
    // The action alone still gets its line.
    expect(link.parentElement!.children).toHaveLength(1);
  });

  it("sets the title at the level the host gives, looking the same at every level", () => {
    const { rerender } = render(<CandidateShortlistNote title="A note from Jordan" meta="Principal" />);

    const h2 = screen.getByRole("heading", { level: 2, name: "A note from Jordan" });
    // The kit's level-2 heading at its size's own line height (no
    // leading-tight), as the kit's ContactHeader set the title.
    expect(h2).toHaveClass("text-xl", "md:text-2xl", "font-semibold", "tracking-tight");
    expect(h2).not.toHaveClass("leading-tight");
    const look = h2.className;

    for (const level of [3, 4] as const) {
      rerender(<CandidateShortlistNote title="A note from Jordan" meta="Principal" titleLevel={level} />);
      const heading = screen.getByRole("heading", { name: "A note from Jordan" });
      expect(heading.tagName).toBe(`H${level}`);
      expect(screen.getByRole("heading", { level, name: "A note from Jordan" })).toBe(heading);
      expect(heading.className).toBe(look);
      expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
    }
  });
});
