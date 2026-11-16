import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CandidateSummaryBullets } from "./candidate-pipeline-list";

/**
 * A button's icon and label are the kit button's own gap apart. A narrower
 * gap asked for on one button sets its icon closer than on every button
 * beside it.
 */
describe("the gap between a button's icon and its label", () => {
  it("is the kit's own on Generate summary", () => {
    render(<CandidateSummaryBullets bullets={[{ text: "Fictional signal", sentiment: "positive" }]} onGenerate={() => undefined} />);

    const button = screen.getByRole("button", { name: "Generate summary" });
    expect([...button.classList].filter((name) => name.startsWith("gap-"))).toEqual(["gap-2"]);
  });
});
