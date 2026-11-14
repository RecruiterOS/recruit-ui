import { describe, expect, it } from "vitest";

import { clientSearchThread, type ClientSearchThreadItem } from "./client-search-thread";

// A fictional search only.

interface Turn {
  id: string;
  from: "client" | "agency";
  createdAt: string;
}

const turn = (id: string, from: Turn["from"], createdAt: string): Turn => ({ id, from, createdAt });

/** Each item as one word: a turn's id, a brief's version, a delivery's id. */
const names = (thread: ClientSearchThreadItem<{ id: string }, { revision: number }, object>[]) =>
  thread.map((item) => {
    if (item.kind === "turn") return item.turn.id;
    if (item.kind === "brief") return `v${item.version.revision}`;
    return "id" in item.delivery ? String(item.delivery.id) : "delivery";
  });

describe("clientSearchThread", () => {
  it("puts each brief under the turn that wrote it and each delivery where it landed", () => {
    const thread = clientSearchThread({
      turns: [
        turn("t1", "client", "2026-01-01T10:00:00Z"),
        turn("t2", "agency", "2026-01-01T10:01:00Z"),
        turn("t3", "client", "2026-01-01T10:05:00Z"),
        turn("t4", "agency", "2026-01-01T10:06:00Z"),
        turn("t5", "agency", "2026-01-02T09:00:00Z"),
      ],
      briefVersions: [
        { revision: 1, replyTurnId: "t2", createdAt: "2026-01-01T10:01:00Z" },
        { revision: 2, replyTurnId: "t4", createdAt: "2026-01-01T10:06:00Z" },
      ],
      deliveries: [{ id: "d1", deliveredAt: "2026-01-02T09:00:00Z" }],
    });

    expect(names(thread)).toEqual(["t1", "t2", "v1", "t3", "t4", "v2", "t5", "d1"]);
    // Only the latest version is the brief in force now.
    expect(thread.flatMap((item) => (item.kind === "brief" ? [item.current] : []))).toEqual([false, true]);
  });

  it("gives a brief no turn wrote its own place by time", () => {
    const thread = clientSearchThread({
      turns: [turn("t1", "client", "2026-01-01T10:00:00Z"), turn("t2", "client", "2026-01-03T10:00:00Z")],
      briefVersions: [{ revision: 1, replyTurnId: null, createdAt: "2026-01-02T10:00:00Z" }],
      deliveries: [],
    });
    expect(thread.map((item) => item.kind)).toEqual(["turn", "brief", "turn"]);
  });

  it("places a brief by time when the turn it names isn't in the search", () => {
    const thread = clientSearchThread({
      turns: [turn("t1", "client", "2026-01-01T10:00:00Z"), turn("t2", "agency", "2026-01-03T10:00:00Z")],
      briefVersions: [{ revision: 1, replyTurnId: "gone", createdAt: "2026-01-02T10:00:00Z" }],
    });
    expect(names(thread)).toEqual(["t1", "v1", "t2"]);
  });

  it("keeps a brief under its turn whatever its own time, and several in the order given", () => {
    const thread = clientSearchThread({
      turns: [turn("t1", "client", "2026-01-01T10:00:00Z"), turn("t2", "agency", "2026-01-01T10:01:00Z")],
      briefVersions: [
        // Written a moment after the turn that carried it, and after a later delivery.
        { revision: 1, replyTurnId: "t1", createdAt: "2026-01-05T00:00:00Z" },
        { revision: 3, replyTurnId: "t1", createdAt: "2026-01-01T00:00:00Z" },
        { revision: 2, replyTurnId: "t1", createdAt: "2026-01-03T00:00:00Z" },
      ],
      deliveries: [{ id: "d1", deliveredAt: "2026-01-02T00:00:00Z" }],
    });
    expect(names(thread)).toEqual(["t1", "v1", "v3", "v2", "t2", "d1"]);
    expect(thread.flatMap((item) => (item.kind === "brief" ? [item.current] : []))).toEqual([false, true, false]);
  });

  it("orders by time, and at one instant puts a turn first, then a brief, then a delivery", () => {
    const at = "2026-02-01T12:00:00Z";
    const thread = clientSearchThread({
      turns: [turn("late", "agency", "2026-02-02T12:00:00Z"), turn("same", "agency", at), turn("early", "client", "2026-01-31T12:00:00Z")],
      briefVersions: [{ revision: 1, createdAt: at }],
      deliveries: [{ id: "d1", deliveredAt: at }],
    });
    expect(names(thread)).toEqual(["early", "same", "v1", "d1", "late"]);
  });

  it("keeps the order given among turns said at the same instant", () => {
    const at = "2026-02-01T12:00:00Z";
    const thread = clientSearchThread({ turns: [turn("b", "client", at), turn("a", "agency", at), turn("c", "client", at)] });
    expect(names(thread)).toEqual(["b", "a", "c"]);
  });

  it("reads a time as an instant: a string in any precision or offset, a number or a Date", () => {
    const thread = clientSearchThread({
      turns: [
        // The same instants written three ways; as text alone they would sort wrongly.
        { id: "third", createdAt: "2026-03-01T10:00:02Z" },
        { id: "second", createdAt: new Date("2026-03-01T10:00:01.500Z") },
        { id: "first", createdAt: Date.parse("2026-03-01T10:00:01Z") },
        { id: "zeroth", createdAt: "2026-03-01T11:00:00.250+01:00" },
      ],
    });
    expect(names(thread)).toEqual(["zeroth", "first", "second", "third"]);
  });

  it("puts what has no readable time last, in the order given", () => {
    const thread = clientSearchThread({
      turns: [{ id: "undated", createdAt: "soon" }, { id: "dated", createdAt: "2026-03-01T10:00:00Z" }, { id: "blank", createdAt: "" }],
      deliveries: [{ id: "d1", deliveredAt: "2026-03-02T10:00:00Z" }],
    });
    expect(names(thread)).toEqual(["dated", "d1", "undated", "blank"]);
  });

  it("hands back the host's own records, untouched, and leaves its input as it was", () => {
    const turns = [
      { id: "t1", from: "client", createdAt: "2026-01-01T10:00:00Z", body: "Fictional brief" },
      { id: "t2", from: "agency", createdAt: "2026-01-01T10:01:00Z", body: "Fictional reply" },
    ] as const;
    const briefVersions = [{ revision: 1, replyTurnId: "t2", createdAt: "2026-01-01T10:01:00Z", brief: { roleTitle: "Fictional role" } }] as const;
    const deliveries = [{ id: "d1", deliveredAt: "2026-01-02T09:00:00Z", people: ["Fictional Person"] }] as const;
    const before = JSON.stringify({ turns, briefVersions, deliveries });

    const thread = clientSearchThread({ turns, briefVersions, deliveries });

    expect(thread[0]).toEqual({ kind: "turn", turn: turns[0] });
    expect(thread[1]?.kind === "turn" && thread[1].turn).toBe(turns[1]);
    expect(thread[2]?.kind === "brief" && thread[2].version).toBe(briefVersions[0]);
    expect(thread[3]?.kind === "delivery" && thread[3].delivery).toBe(deliveries[0]);
    // The records keep their own fields in the thread's type too.
    const words = thread.flatMap((item) => (item.kind === "turn" ? [item.turn.body] : []));
    expect(words).toEqual(["Fictional brief", "Fictional reply"]);
    expect(JSON.stringify({ turns, briefVersions, deliveries })).toBe(before);
  });

  it("takes a search with no briefs or deliveries, or with nothing in it", () => {
    expect(names(clientSearchThread({ turns: [turn("t1", "client", "2026-01-01T10:00:00Z")] }))).toEqual(["t1"]);
    expect(clientSearchThread({ turns: [], briefVersions: null, deliveries: null })).toEqual([]);
    // A brief and a delivery stand without a turn.
    const thread = clientSearchThread({
      turns: [],
      briefVersions: [{ revision: 4, createdAt: "2026-01-01T10:00:00Z" }],
      deliveries: [{ id: "d1", deliveredAt: "2026-01-01T09:00:00Z" }],
    });
    expect(names(thread)).toEqual(["d1", "v4"]);
    expect(thread[1]).toMatchObject({ kind: "brief", current: true });
  });

  it("puts a turn's briefs under it once when two turns share an id", () => {
    const thread = clientSearchThread({
      turns: [turn("t1", "agency", "2026-01-01T10:00:00Z"), turn("t1", "agency", "2026-01-01T10:01:00Z")],
      briefVersions: [{ revision: 1, replyTurnId: "t1", createdAt: "2026-01-01T10:00:00Z" }],
    });
    expect(names(thread)).toEqual(["t1", "v1", "t1"]);
  });
});
