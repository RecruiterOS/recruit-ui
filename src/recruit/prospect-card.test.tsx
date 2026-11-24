import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ClientProspectCard, ShortlistPreviewCard } from "./prospect-card";

it("shows the reason for approaching a company and the people to introduce", () => {
  render(<ClientProspectCard company="Example Agency" role="Sales lead" facts={[]} signal="Opening a second office" matches={[{id:"a",name:"Example Person",evidence:"Built a team"}]} />);
  expect(screen.getByText("Opening a second office")).toBeTruthy();
  expect(screen.getByText("Built a team")).toBeTruthy();
});
it("opens the supplied public profile", () => {
  render(<ShortlistPreviewCard name="Example Person" preview="Approved for public review" />);
  fireEvent.click(screen.getByRole("button", {name:"View profile: Example Person"}));
  expect(screen.getByRole("dialog").textContent).toContain("Approved for public review");
});
