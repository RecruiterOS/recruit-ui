"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/core/calendar-date.ts
var EPOCH_SECONDS_CUTOFF = 1e10;
function parseCalendarDate(value) {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    if (Number.isInteger(value) && value >= 1e3 && value <= 9999) {
      return new Date(Date.UTC(value, 0, 1));
    }
    const parsed2 = new Date(Math.abs(value) < EPOCH_SECONDS_CUTOFF ? value * 1e3 : value);
    return Number.isNaN(parsed2.getTime()) ? null : parsed2;
  }
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d{4}$/.test(trimmed)) {
    return new Date(Date.UTC(Number(trimmed), 0, 1));
  }
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    const [year, month] = trimmed.split("-").map(Number);
    if (year && month && month >= 1 && month <= 12) {
      return new Date(Date.UTC(year, month - 1, 1));
    }
  }
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
function formatCalendarDate(value, locale = "en") {
  if (typeof value === "number" && Number.isInteger(value) && value >= 1e3 && value <= 9999) {
    return String(value);
  }
  if (typeof value === "string" && /^\d{4}$/.test(value.trim())) {
    return value.trim();
  }
  const parsed = parseCalendarDate(value);
  if (!parsed) return null;
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(parsed);
}




exports.parseCalendarDate = parseCalendarDate; exports.formatCalendarDate = formatCalendarDate;
