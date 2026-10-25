// src/recruit/call-data.ts
function normalizeCallParticipants(raw) {
  const seen = /* @__PURE__ */ new Set();
  const output = [];
  for (const participant of raw) {
    let name;
    let email;
    if (typeof participant === "string") {
      if (participant.includes("@")) email = participant.trim();
      else name = participant.trim();
    } else if (participant && typeof participant === "object") {
      const value = participant;
      name = value.name?.trim() || void 0;
      email = value.email?.trim() || void 0;
    }
    if (!name && !email) continue;
    const key = (email || name || "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push({ name, email });
  }
  return output;
}
function normalizeCallSegments(raw) {
  return raw.filter(
    (segment) => segment != null && typeof segment === "object" && typeof segment.text === "string" && segment.text !== ""
  );
}

export {
  normalizeCallParticipants,
  normalizeCallSegments
};
