type CalendarDateValue = Date | string | number | null | undefined;
/** Parse a calendar value without introducing relative-time or product policy. */
declare function parseCalendarDate(value: CalendarDateValue): Date | null;
/** Format an absolute career date. This deliberately never says "ago". */
declare function formatCalendarDate(value: CalendarDateValue, locale?: string): string | null;

export { type CalendarDateValue, formatCalendarDate, parseCalendarDate };
