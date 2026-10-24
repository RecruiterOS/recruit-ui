export type CalendarDateValue = Date | string | number | null | undefined;

// Epoch seconds remain below this threshold until November 2286. Using 1e12
// would mistake ordinary pre-2001 millisecond dates for seconds.
const EPOCH_SECONDS_CUTOFF = 10_000_000_000;

/** Parse a calendar value without introducing relative-time or product policy. */
export function parseCalendarDate(value: CalendarDateValue): Date | null {
  if (value == null || value === "") return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    if (Number.isInteger(value) && value >= 1000 && value <= 9999) {
      return new Date(Date.UTC(value, 0, 1));
    }
    const parsed = new Date(Math.abs(value) < EPOCH_SECONDS_CUTOFF ? value * 1000 : value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
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

/** Format an absolute career date. This deliberately never says "ago". */
export function formatCalendarDate(
  value: CalendarDateValue,
  locale = "en",
): string | null {
  if (typeof value === "number" && Number.isInteger(value) && value >= 1000 && value <= 9999) {
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
    timeZone: "UTC",
  }).format(parsed);
}
