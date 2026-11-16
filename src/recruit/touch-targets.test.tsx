import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CandidateSelectableAvatar } from "./candidate-selectable-avatar";
import { CandidateSharedProfileButton } from "./candidate-shared-profile-button";
import { DocumentListItem } from "./document-list";

// Fictional people and files only.

/**
 * A control drawn smaller than the kit's standard height must still be
 * tappable on a touchscreen. The library grows most of its compact controls
 * there (`touch-targets.ts`). The ones it keeps dense rely on the kit: its
 * compact icon sizes and its avatar toggle carry a taller tap area under
 * `pointer-coarse`, which changes nothing about how they are drawn. These
 * tests fail if a kit below 1.38.0 is installed, or if one of these controls
 * moves to a size that has no tap area.
 */
const tapArea = (element: Element) =>
  [...element.classList].filter((name) => name.startsWith("pointer-coarse:after:"));

describe("small controls the library keeps dense", () => {
  it.each(["default", "compact"] as const)("a document row's icon actions have a tap area in %s density", (density) => {
    render(
      <DocumentListItem
        name="cv.pdf"
        density={density}
        onPreview={() => undefined}
        onDownload={() => undefined}
        onDelete={() => undefined}
      />,
    );

    for (const name of ["Preview cv.pdf", "Download cv.pdf", "Delete cv.pdf"]) {
      expect(tapArea(screen.getByRole("button", { name }))).toEqual(
        expect.arrayContaining(["pointer-coarse:after:absolute", "pointer-coarse:after:h-11"]),
      );
    }
  });

  it("a compact shared-profile preview has a tap area", () => {
    render(<CandidateSharedProfileButton href="https://example.com/p/abc" label="Preview Mei Tanaka's shared profile" size="compact" />);

    expect(tapArea(screen.getByRole("link", { name: "Preview Mei Tanaka's shared profile" }))).toEqual(
      expect.arrayContaining(["pointer-coarse:after:absolute", "pointer-coarse:after:h-11"]),
    );
  });

  it("a selectable avatar has a tap area", () => {
    render(
      <CandidateSelectableAvatar selected={false} onToggle={() => undefined} label="Select Mei Tanaka">
        <span>MT</span>
      </CandidateSelectableAvatar>,
    );

    expect(tapArea(screen.getByRole("button", { name: "Select Mei Tanaka" }))).toEqual(
      expect.arrayContaining(["pointer-coarse:after:absolute"]),
    );
  });
});

describe("a role match's title on a touchscreen", () => {
  it("is a link that stands alone, so it takes the kit's tap area", async () => {
    const { CandidateRoleMatchList } = await import("./candidate-role-matches");
    render(
      <CandidateRoleMatchList
        heading="Suggested roles"
        matches={[{ id: 1, title: "Fictional Platform Engineer", href: "https://example.com/roles/1", reason: "A fictional reason." }]}
      />,
    );

    expect(screen.getByRole("link", { name: "Fictional Platform Engineer" })).toHaveClass("inline-flex");
  });
});
