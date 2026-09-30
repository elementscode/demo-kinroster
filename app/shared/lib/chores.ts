import type { Chore } from "#app/shared/services/chores";

/** Whether a chore is on the chart for a day of the week (0 = Monday). */
export function isDue(chore: Chore, weekday: number): boolean {
  return chore.frequency === "daily" || chore.weekday === weekday;
}

export function cadence(chore: Chore, weekdayNames: string[]): string {
  return chore.frequency === "daily" ? "Every day" : `${weekdayNames[chore.weekday]}s`;
}
