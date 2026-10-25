"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/call-data.ts
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
      name = _optionalChain([value, 'access', _ => _.name, 'optionalAccess', _2 => _2.trim, 'call', _3 => _3()]) || void 0;
      email = _optionalChain([value, 'access', _4 => _4.email, 'optionalAccess', _5 => _5.trim, 'call', _6 => _6()]) || void 0;
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




exports.normalizeCallParticipants = normalizeCallParticipants; exports.normalizeCallSegments = normalizeCallSegments;
