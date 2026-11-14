"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/recruit/client-search-thread.ts
function timeValue(time) {
  const value = time instanceof Date ? time.getTime() : typeof time === "number" ? time : Date.parse(time);
  return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value;
}
function clientSearchThread(search) {
  const turns = search.turns;
  const versions = _nullishCoalesce(search.briefVersions, () => ( []));
  const deliveries = _nullishCoalesce(search.deliveries, () => ( []));
  const latest = versions.reduce((highest, version) => version.revision > highest ? version.revision : highest, -Infinity);
  const brief = (version) => ({ kind: "brief", version, current: version.revision === latest });
  const turnIds = new Set(turns.map((turn) => turn.id));
  const written = /* @__PURE__ */ new Map();
  const timed = [];
  for (const turn of turns) timed.push({ at: timeValue(turn.createdAt), rank: 0, item: { kind: "turn", turn } });
  for (const version of versions) {
    const turnId = version.replyTurnId;
    if (turnId != null && turnIds.has(turnId)) {
      written.set(turnId, [..._nullishCoalesce(written.get(turnId), () => ( [])), version]);
    } else {
      timed.push({ at: timeValue(version.createdAt), rank: 1, item: brief(version) });
    }
  }
  for (const delivery of deliveries) {
    timed.push({ at: timeValue(delivery.deliveredAt), rank: 2, item: { kind: "delivery", delivery } });
  }
  timed.sort((a, b) => a.at < b.at ? -1 : a.at > b.at ? 1 : a.rank - b.rank);
  const placed = /* @__PURE__ */ new Set();
  return timed.flatMap(({ item }) => {
    if (item.kind !== "turn" || placed.has(item.turn.id)) return [item];
    placed.add(item.turn.id);
    return [item, ...(_nullishCoalesce(written.get(item.turn.id), () => ( []))).map(brief)];
  });
}



exports.clientSearchThread = clientSearchThread;
