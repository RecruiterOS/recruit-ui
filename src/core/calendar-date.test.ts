import { describe, expect, it } from "vitest";

import { formatCalendarDate, parseCalendarDate } from "./calendar-date";

describe("calendar date helpers", () => {
  it("formats stable absolute career dates", () => {
    expect(formatCalendarDate("2024-03")).toBe("Mar 2024");
    expect(formatCalendarDate(2021)).toBe("2021");
  });

  it("accepts epoch seconds and milliseconds without shifting seconds into 1970", () => {
    const epochSeconds = 1_711_929_600;
    const epochMilliseconds = 1_711_929_600_000;

    expect(parseCalendarDate(epochSeconds)?.toISOString()).toBe("2024-04-01T00:00:00.000Z");
    expect(parseCalendarDate(epochMilliseconds)?.toISOString()).toBe("2024-04-01T00:00:00.000Z");
  });

  it("does not reinterpret pre-2001 millisecond career dates as seconds", () => {
    const epochMilliseconds = Date.UTC(1995, 0, 1);
    const epochSeconds = epochMilliseconds / 1000;

    expect(parseCalendarDate(epochMilliseconds)?.toISOString()).toBe("1995-01-01T00:00:00.000Z");
    expect(parseCalendarDate(epochSeconds)?.toISOString()).toBe("1995-01-01T00:00:00.000Z");
    expect(formatCalendarDate(epochMilliseconds)).toBe("Jan 1995");
  });

  it("returns null for unusable values", () => {
    expect(parseCalendarDate("not-a-date")).toBeNull();
    expect(formatCalendarDate(undefined)).toBeNull();
  });
});
