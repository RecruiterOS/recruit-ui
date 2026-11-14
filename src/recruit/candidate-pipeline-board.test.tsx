import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CandidatePipelineBoard,
  type CandidatePipelineBoardColumn,
  type CandidatePipelineBoardProps,
} from "./candidate-pipeline-board";
import { CandidatePipelineCard } from "./candidate-pipeline-card";

// Fictional people and stages only.
interface Person {
  id: string | number;
  name: string;
  stage: string;
}

const COLUMNS: CandidatePipelineBoardColumn[] = [
  { id: "screened", title: "Screened" },
  { id: "interview", title: "Interview" },
  { id: "offer", title: "Offer" },
];

const PEOPLE: Person[] = [
  { id: "p1", name: "Imogen Example", stage: "screened" },
  { id: "p2", name: "Mei Example", stage: "screened" },
  { id: "p3", name: "Tomas Example", stage: "interview" },
];

type BoardProps = CandidatePipelineBoardProps<Person>;

function board(overrides: Partial<BoardProps> = {}) {
  return (
    <CandidatePipelineBoard<Person>
      columns={COLUMNS}
      items={PEOPLE}
      getId={(person) => person.id}
      getStage={(person) => person.stage}
      getName={(person) => person.name}
      {...overrides}
    />
  );
}

/** A host that keeps the people itself, and moves one when the board says so. */
function Host({
  onMove,
  people: initial = PEOPLE,
  ...overrides
}: Partial<BoardProps> & { people?: Person[] }) {
  const [people, setPeople] = useState(initial);
  return board({
    ...overrides,
    items: people,
    onMove: (person, to) => {
      onMove?.(person, to);
      setPeople((current) => current.map((each) => (each.id === person.id ? { ...each, stage: to } : each)));
    },
  });
}

const heading = (stage: string) =>
  document.querySelector<HTMLElement>(`[data-slot='candidate-pipeline-board-column'][data-stage='${stage}']`)!;
/** The kit's column: the element a card is dropped on. */
const column = (stage: string) => heading(stage).parentElement!;
const namesIn = (stage: string) =>
  [...column(stage).querySelectorAll("[data-slot='candidate-pipeline-board-card']")].map(
    (card) => card.querySelector("p")!.textContent,
  );
const cardOf = (name: string) =>
  screen.getByText(name).closest<HTMLElement>("[data-slot='candidate-pipeline-board-card']")!;
const moveButton = (name: string) => screen.getByRole("button", { name: `Move ${name} to another stage` });
const announced = () => screen.getByRole("status").textContent;

/** Drags a card onto a column, as the kit's board reads a drag. */
function drag(name: string, toStage: string) {
  const data = new Map<string, string>();
  const dataTransfer = {
    effectAllowed: "none",
    setData: (type: string, value: string) => void data.set(type, value),
    getData: (type: string) => data.get(type) ?? "",
  };
  const handle = cardOf(name).closest<HTMLElement>("[draggable='true']")!;
  fireEvent.dragStart(handle, { dataTransfer });
  fireEvent.dragOver(column(toStage), { dataTransfer });
  fireEvent.drop(column(toStage), { dataTransfer });
  fireEvent.dragEnd(handle, { dataTransfer });
}

/** A promise a test settles when it chooses. */
function deferred() {
  let resolve: () => void = () => undefined;
  let reject: (cause: Error) => void = () => undefined;
  const promise = new Promise<void>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

describe("candidate pipeline board", () => {
  it("draws a column for each stage, with its heading, its count and its people in order", () => {
    const { container } = render(
      board({
        columns: [
          { id: "screened", title: "Screened" },
          { id: "interview", title: "Interview", count: 12, tone: "success" },
          { id: "offer", title: "Offer" },
        ],
        id: "fictional-pipeline",
      }),
    );

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "candidate-pipeline-board");
    expect(root).toHaveAttribute("id", "fictional-pipeline");

    const headings = [...container.querySelectorAll("[data-slot='candidate-pipeline-board-column']")];
    expect(headings.map((each) => each.getAttribute("data-stage"))).toEqual(["screened", "interview", "offer"]);
    // A heading names its stage and how many people are in it.
    expect(headings.map((each) => each.tagName)).toEqual(["H3", "H3", "H3"]);
    expect(headings.map((each) => each.textContent)).toEqual(["Screened2", "Interview12", "Offer0"]);
    expect(screen.getByRole("heading", { level: 3, name: /^Interview\s*12$/ })).toBe(headings[1]);
    expect(heading("screened").querySelector("[data-count-badge]")).toHaveAttribute("data-variant", "secondary");
    expect(heading("interview").querySelector("[data-count-badge]")).toHaveAttribute("data-variant", "success");

    expect(namesIn("screened")).toEqual(["Imogen Example", "Mei Example"]);
    expect(namesIn("interview")).toEqual(["Tomas Example"]);
    expect(namesIn("offer")).toEqual([]);
  });

  it("takes the page's heading level for its columns", () => {
    render(board({ columnHeadingLevel: 2 }));
    expect(screen.getAllByRole("heading", { level: 2 }).map((each) => each.getAttribute("data-stage"))).toEqual([
      "screened",
      "interview",
      "offer",
    ]);
    // What is left at level 3 is the kit's own blank slate, under its column.
    expect(screen.getAllByRole("heading", { level: 3 }).map((each) => each.textContent)).toEqual([
      "No candidates in Offer",
    ]);
  });

  it("draws a pipeline card that opens the person, or the host's own card for the stage it is in", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { rerender } = render(board({ onSelect }));

    const card = within(cardOf("Imogen Example")).getByRole("button");
    expect(card).toHaveAttribute("data-slot", "candidate-pipeline-card");
    await user.click(card);
    expect(onSelect.mock.calls).toEqual([[PEOPLE[0]]]);

    rerender(
      board({
        renderCard: (person, stage) => (
          <CandidatePipelineCard
            name={person.name}
            headline={`Fictional engineer, in ${stage}`}
            onSelect={() => onSelect(person.name)}
          />
        ),
      }),
    );
    expect(within(cardOf("Tomas Example")).getByText("Fictional engineer, in interview")).toBeInTheDocument();
    await user.click(screen.getByText("Tomas Example"));
    expect(onSelect).toHaveBeenLastCalledWith("Tomas Example");
  });

  it("moves a card dragged onto another column, and tells the host who and where", () => {
    const onMove = vi.fn();
    render(<Host onMove={onMove} />);

    drag("Imogen Example", "interview");

    expect(onMove.mock.calls).toEqual([[PEOPLE[0], "interview"]]);
    expect(namesIn("screened")).toEqual(["Mei Example"]);
    expect(namesIn("interview")).toEqual(["Imogen Example", "Tomas Example"]);
    expect(announced()).toBe("Moved Imogen Example to Interview.");

    // Dropped where it already is, nothing moves.
    drag("Mei Example", "screened");
    expect(onMove).toHaveBeenCalledTimes(1);
  });

  it("finds a dragged card whose id is a number, or only reads as one", () => {
    // The kit reads a dropped id back as a number where it can: "007" as 7.
    const people: Person[] = [
      { id: 7, name: "Imogen Example", stage: "screened" },
      { id: "007", name: "Mei Example", stage: "screened" },
    ];
    const onMove = vi.fn();
    render(<Host onMove={onMove} people={people} />);

    drag("Imogen Example", "offer");
    drag("Mei Example", "interview");

    expect(onMove.mock.calls).toEqual([
      [people[0], "offer"],
      [people[1], "interview"],
    ]);
  });

  it("moves a card from its move menu with the keyboard, and keeps focus on the card", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    render(<Host onMove={onMove} />);

    const trigger = moveButton("Imogen Example");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("title", "Move Imogen Example to another stage");
    // Hidden, over the card's corner, only where a mouse can hover: there it
    // shows on hover, on focus and while open. Anywhere else it is always
    // shown, and a finger's size on a touchscreen.
    const classes = trigger.className.split(" ");
    expect(classes).toContain("[@media(hover:hover)]:opacity-0");
    expect(classes).toContain("[@media(hover:hover)]:absolute");
    expect(classes).not.toContain("opacity-0");
    expect(classes).not.toContain("absolute");
    expect(classes).toContain("group-hover/pipeline-card:opacity-100");
    expect(classes).toContain("focus-visible:opacity-100");
    expect(classes).toContain("data-[state=open]:opacity-100");
    expect(classes).toContain("pointer-coarse:min-h-[max(44px,2.75rem)]");
    expect(classes).toContain("pointer-coarse:min-w-[max(44px,2.75rem)]");
    expect(cardOf("Imogen Example").className.split(" ")).toContain("group/pipeline-card");

    // The card, then its move menu, in the tab order.
    await user.tab();
    expect(within(cardOf("Imogen Example")).getByRole("button", { name: "Imogen Example" })).toHaveFocus();
    await user.tab();
    expect(trigger).toHaveFocus();

    await user.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    expect(menu).toHaveAttribute("data-slot", "candidate-pipeline-board-menu");
    // Every other stage, never the one the card is in.
    expect(within(menu).getAllByRole("menuitem").map((item) => item.textContent)).toEqual([
      "Move to Interview",
      "Move to Offer",
    ]);

    await user.keyboard("{ArrowDown}{Enter}");

    expect(onMove.mock.calls).toEqual([[PEOPLE[0], "offer"]]);
    expect(namesIn("offer")).toEqual(["Imogen Example"]);
    expect(announced()).toBe("Moved Imogen Example to Offer.");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(moveButton("Imogen Example")).toHaveFocus());
    expect(column("offer")).toContainElement(moveButton("Imogen Example"));
  });

  it("shows a card in its new stage while the host saves, and puts it back when the save fails", async () => {
    const user = userEvent.setup();
    const save = deferred();
    const onMove = vi.fn(() => save.promise);
    // The host's own people never change: it is still saving.
    render(board({ onMove }));

    await user.click(moveButton("Mei Example"));
    await user.click(await screen.findByRole("menuitem", { name: "Move to Interview" }));

    expect(onMove.mock.calls).toEqual([[PEOPLE[1], "interview"]]);
    expect(namesIn("screened")).toEqual(["Imogen Example"]);
    expect(namesIn("interview")).toEqual(["Mei Example", "Tomas Example"]);
    expect(cardOf("Mei Example")).toHaveAttribute("data-moving", "true");
    expect(cardOf("Mei Example")).toHaveAttribute("aria-busy", "true");
    expect(cardOf("Tomas Example")).not.toHaveAttribute("data-moving");
    expect(announced()).toBe("Moved Mei Example to Interview.");
    await waitFor(() => expect(moveButton("Mei Example")).toHaveFocus());

    await act(async () => save.reject(new Error("offline")));

    expect(namesIn("screened")).toEqual(["Imogen Example", "Mei Example"]);
    expect(namesIn("interview")).toEqual(["Tomas Example"]);
    expect(cardOf("Mei Example")).not.toHaveAttribute("data-moving");
    expect(announced()).toBe("Mei Example could not be moved to Interview.");
    // Focus went back with the card.
    expect(moveButton("Mei Example")).toHaveFocus();
    expect(column("screened")).toContainElement(moveButton("Mei Example"));
  });

  it("keeps a saved card where it was moved until the host's own people catch up", async () => {
    const save = deferred();
    const onMove = () => save.promise;
    const { rerender } = render(board({ onMove }));

    drag("Imogen Example", "offer");
    await act(async () => save.resolve());

    // Saved, and the host has yet to load the change: the card stays put,
    // also when the host passes the same people in a list made anew.
    expect(namesIn("offer")).toEqual(["Imogen Example"]);
    expect(cardOf("Imogen Example")).not.toHaveAttribute("data-moving");
    rerender(board({ items: [...PEOPLE], onMove }));
    expect(namesIn("offer")).toEqual(["Imogen Example"]);

    const caughtUp = PEOPLE.map((person) => (person.id === "p1" ? { ...person, stage: "offer" } : person));
    rerender(board({ items: caughtUp, onMove }));
    expect(namesIn("offer")).toEqual(["Imogen Example"]);

    // From here the host's people are the whole truth again.
    rerender(board({ items: PEOPLE, onMove }));
    expect(namesIn("screened")).toEqual(["Imogen Example", "Mei Example"]);
    expect(namesIn("offer")).toEqual([]);
  });

  it("goes by what the host loads after a save, even where that isn't where the card was moved", async () => {
    const save = deferred();
    const onMove = () => save.promise;
    const { rerender } = render(board({ onMove }));

    drag("Imogen Example", "offer");
    await act(async () => save.resolve());
    expect(namesIn("offer")).toEqual(["Imogen Example"]);

    // Fresh from the host, and still in the stage the card was moved from:
    // the board never keeps showing a move the host's own data doesn't.
    const reloaded = PEOPLE.map((person) => ({ ...person }));
    rerender(board({ items: reloaded, onMove }));
    expect(namesIn("screened")).toEqual(["Imogen Example", "Mei Example"]);
    expect(namesIn("offer")).toEqual([]);
  });

  it("holds nothing once a save lands on people the host has already moved", async () => {
    const save = deferred();
    const onMove = () => save.promise;
    const { rerender } = render(board({ onMove }));

    drag("Imogen Example", "offer");
    // The host moves the person itself while it saves.
    const moved = PEOPLE.map((person) => (person.id === "p1" ? { ...person, stage: "offer" } : person));
    rerender(board({ items: moved, onMove }));
    await act(async () => save.resolve());
    expect(namesIn("offer")).toEqual(["Imogen Example"]);

    // And takes them back: there is no saved move left to say otherwise.
    rerender(board({ items: PEOPLE, onMove }));
    expect(namesIn("screened")).toEqual(["Imogen Example", "Mei Example"]);
  });

  it("lets a card's latest move decide where it shows", async () => {
    const first = deferred();
    const second = deferred();
    const onMove = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    render(board({ onMove }));

    drag("Imogen Example", "interview");
    drag("Imogen Example", "offer");
    expect(namesIn("offer")).toEqual(["Imogen Example"]);

    // The earlier move failing late changes nothing.
    await act(async () => first.reject(new Error("offline")));
    expect(namesIn("offer")).toEqual(["Imogen Example"]);
    expect(announced()).toBe("Moved Imogen Example to Offer.");

    await act(async () => second.reject(new Error("offline")));
    expect(namesIn("screened")).toEqual(["Imogen Example", "Mei Example"]);
    expect(announced()).toBe("Imogen Example could not be moved to Offer.");
  });

  it("is read only without onMove: nothing drags and no card has a move menu", () => {
    render(board({ items: PEOPLE.slice(0, 1) }));

    expect(cardOf("Imogen Example").closest("[draggable='true']")).toBeNull();
    expect(screen.queryByRole("button", { name: /^Move / })).toBeNull();
    // An empty stage doesn't invite a move nobody can make.
    expect(within(column("offer")).getByRole("heading", { name: "No candidates in Offer" })).toBeInTheDocument();
    expect(within(column("offer")).queryByText("Move a card here when they reach this stage.")).toBeNull();
  });

  it("says why a column is empty, in the host's words if it has any", () => {
    const { rerender } = render(board({ onMove: vi.fn() }));

    const offer = column("offer").querySelector<HTMLElement>("[data-slot='empty-state']")!;
    expect(within(offer).getByRole("heading", { name: "No candidates in Offer" })).toBeInTheDocument();
    expect(within(offer).getByText("Move a card here when they reach this stage.")).toBeInTheDocument();
    expect(column("screened").querySelector("[data-slot='empty-state']")).toBeNull();

    // A search or a filter in force never passes for an empty stage.
    for (const narrowing of [{ searchTerm: " mei " }, { filters: { verified: true } }, { narrowed: true }]) {
      rerender(board({ onMove: vi.fn(), ...narrowing }));
      expect(within(column("offer")).getByRole("heading", { name: "No matches" })).toBeInTheDocument();
      expect(within(column("offer")).getByText("Nobody in Offer matches this view.")).toBeInTheDocument();
    }
    // Nothing a filter holds by default narrows the board, and the host can say so itself.
    for (const open of [{ filters: { verified: false, kinds: [], owner: "" } }, { searchTerm: "mei", narrowed: false }]) {
      rerender(board({ onMove: vi.fn(), ...open }));
      expect(within(column("offer")).getByRole("heading", { name: "No candidates in Offer" })).toBeInTheDocument();
    }

    rerender(
      board({
        labels: {
          columnEmpty: (stage) => `Nobody at ${stage}`,
          columnEmptyDescription: "Drag someone here.",
        },
        onMove: vi.fn(),
      }),
    );
    expect(within(column("offer")).getByRole("heading", { name: "Nobody at Offer" })).toBeInTheDocument();
    expect(within(column("offer")).getByText("Drag someone here.")).toBeInTheDocument();
  });

  it("shows one blank slate in place of its columns when it holds nobody", () => {
    const { rerender } = render(board({ items: [] }));

    expect(screen.getByRole("heading", { name: "No candidates yet" })).toBeInTheDocument();
    expect(document.querySelector("[data-slot='candidate-pipeline-board-column']")).toBeNull();
    expect(document.querySelectorAll("[data-slot='empty-state']")).toHaveLength(1);

    rerender(board({ items: undefined, empty: { title: "Nobody on this fictional job yet", description: "Add someone to start." } }));
    expect(screen.getByRole("heading", { name: "Nobody on this fictional job yet" })).toBeInTheDocument();
    expect(screen.getByText("Add someone to start.")).toBeInTheDocument();

    rerender(board({ items: [], searchTerm: "nobody", onSearchChange: vi.fn() }));
    expect(screen.getByRole("heading", { name: "No candidates match this view" })).toBeInTheDocument();
    expect(screen.getByText("Clear the search or filters to see the whole pipeline.")).toBeInTheDocument();
    // The search stays, so it can be cleared.
    expect(screen.getByRole("textbox")).toHaveValue("nobody");
  });

  it("draws skeleton cards while it loads, and the host's error in place of the columns", () => {
    const { rerender } = render(board({ items: [], loading: true }));

    // The stages are already there; no blank slate yet.
    expect(document.querySelectorAll("[data-slot='candidate-pipeline-board-column']")).toHaveLength(3);
    expect(document.querySelector("[data-slot='empty-state']")).toBeNull();
    expect(column("screened").querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);

    // People already on the board stay while more load.
    rerender(board({ loading: true }));
    expect(namesIn("screened")).toEqual(["Imogen Example", "Mei Example"]);
    expect(column("screened").querySelector(".animate-pulse")).toBeNull();

    rerender(board({ error: "The fictional pipeline didn't load." }));
    expect(screen.getByRole("alert")).toHaveTextContent("The fictional pipeline didn't load.");
    expect(document.querySelector("[data-slot='candidate-pipeline-board-column']")).toBeNull();
  });

  it("shows the kit's toolbar only where the host wires it, and narrows nothing itself", async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(board());

    expect(screen.queryByRole("textbox")).toBeNull();
    // No toolbar, so no gap is kept for one.
    expect(container.querySelector("[data-slot='candidate-pipeline-board'] > div > div")!.className).toContain(
      "[&>:empty]:hidden",
    );

    const onSearchChange = vi.fn();
    rerender(
      board({
        searchTerm: "",
        onSearchChange,
        searchPlaceholder: "Search fictional people",
        actions: <button type="button">Fictional action</button>,
      }),
    );
    await user.type(screen.getByPlaceholderText("Search fictional people"), "m");
    expect(onSearchChange).toHaveBeenCalledWith("m");
    expect(screen.getByRole("button", { name: "Fictional action" })).toBeInTheDocument();

    // The host passes the people that match; a term alone hides nobody.
    rerender(board({ searchTerm: "mei", onSearchChange }));
    expect(namesIn("screened")).toEqual(["Imogen Example", "Mei Example"]);
  });

  it("keeps a long name from widening its column", () => {
    render(board());
    // The kit's column grows to its longest unbroken line; a card that asks
    // for no width and takes all there is leaves the column as it was sized.
    const card = cardOf("Imogen Example");
    expect(card.className).toContain("w-0");
    expect(card.className).toContain("min-w-full");
    expect(card.firstElementChild!.className).toContain("min-w-0");
  });

  it("sizes its columns, and fills the screen's height or grows with its people", () => {
    const { rerender } = render(board());
    const grid = () => column("screened").parentElement!;

    expect(grid().style.gridAutoColumns).toBe("min(400px, calc(100vw - 4rem))");
    expect(grid().className).toContain("h-[calc(100dvh-270px)]");

    rerender(board({ columnWidth: "narrow", height: "content" }));
    expect(grid().style.gridAutoColumns).toBe("280px");
    expect(grid().className).not.toContain("h-[calc(100dvh-270px)]");
    expect(grid().style.minHeight).toBe("300px");
  });

  it("takes the host's wording for the move menu and what it announces", async () => {
    const user = userEvent.setup();
    render(
      <Host
        labels={{
          move: (name) => `Change ${name}'s stage`,
          moveTo: (stage) => `To ${stage}`,
          moved: (name, stage) => `${name} is now in ${stage}.`,
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Change Tomas Example's stage" }));
    await user.click(await screen.findByRole("menuitem", { name: "To Screened" }));

    expect(namesIn("screened")).toEqual(["Imogen Example", "Mei Example", "Tomas Example"]);
    expect(announced()).toBe("Tomas Example is now in Screened.");
  });
});

describe("candidate pipeline board on a phone", () => {
  const width = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: width });
  });

  it("shows one stage at a time, and moves a card from the same menu", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 390 });
    const user = userEvent.setup();
    const onMove = vi.fn();
    const { container } = render(<Host onMove={onMove} />);

    // The kit's stage tabs, the first stage open.
    const tab = (stage: string) => screen.getByRole("button", { name: new RegExp(`^${stage}`) });
    expect(tab("Screened")).toBeInTheDocument();
    expect(screen.getByText("Imogen Example")).toBeInTheDocument();
    expect(screen.queryByText("Tomas Example")).toBeNull();
    // One move control on each card: the board's menu, not the kit's select as well.
    expect(screen.queryByRole("combobox")).toBeNull();

    await user.click(moveButton("Imogen Example"));
    await user.click(await screen.findByRole("menuitem", { name: "Move to Interview" }));

    expect(onMove.mock.calls).toEqual([[PEOPLE[0], "interview"]]);
    expect(announced()).toBe("Moved Imogen Example to Interview.");
    // The card left the stage on screen, so focus rests on the board, not nowhere.
    expect(screen.queryByText("Imogen Example")).toBeNull();
    await waitFor(() => expect(container.querySelector("[data-slot='candidate-pipeline-board']")).toHaveFocus());

    await user.click(tab("Interview"));
    expect(screen.getByText("Imogen Example")).toBeInTheDocument();
    expect(screen.getByText("Tomas Example")).toBeInTheDocument();
  });
});
