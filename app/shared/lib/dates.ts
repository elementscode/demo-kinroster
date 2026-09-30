/**
 * Calendar days as `YYYY-MM-DD` strings in local time. A day is a date on the
 * fridge, not an instant, so it never goes through a timezone conversion.
 */

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function isoDay(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDay(day: string): Date {
  let [y, m, d] = day.split("-").map(Number);

  return new Date(y, m - 1, d);
}

export function isDay(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(parseDay(value).getTime());
}

export function today(): string {
  return isoDay(new Date());
}

export function addDays(day: string, n: number): string {
  let date = parseDay(day);
  date.setDate(date.getDate() + n);

  return isoDay(date);
}

/** Monday = 0 through Sunday = 6. */
export function weekdayIndex(day: string): number {
  return (parseDay(day).getDay() + 6) % 7;
}

/** The Monday that starts the week holding `day`. */
export function weekStart(day: string): string {
  return addDays(day, -weekdayIndex(day));
}

export function weekDays(start: string): string[] {
  return [0, 1, 2, 3, 4, 5, 6].map((n) => addDays(start, n));
}

export function inWeek(day: string, start: string): boolean {
  return day >= start && day <= addDays(start, 6);
}

export function dayOfMonth(day: string): number {
  return parseDay(day).getDate();
}

export function shortDate(day: string): string {
  let date = parseDay(day);

  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function weekLabel(start: string): string {
  let end = addDays(start, 6);

  if (start === weekStart(today())) {
    return "This week";
  }

  if (start === addDays(weekStart(today()), -7)) {
    return "Last week";
  }

  if (start === addDays(weekStart(today()), 7)) {
    return "Next week";
  }

  return `${shortDate(start)} – ${shortDate(end)}`;
}

/** The week a `?week=` param names, or this week. */
export function parseWeek(param: unknown): string {
  return isDay(param) ? weekStart(param) : weekStart(today());
}
