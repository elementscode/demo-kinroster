import { LiveTable, sql, ForbiddenError, ValidationError } from "@elements/app";
import { householdOrThrow } from "#app/shared/services/household";

export type Frequency = "daily" | "weekly";

export interface Chore {
  id: string;
  createdAt: Date;
  householdId: string;
  title: string;
  frequency: Frequency;
  /** 0 = Monday through 6 = Sunday; the day a weekly chore is due. */
  weekday: number;
  assigneeId: string | null;
  points: number;
}

/** One chore done on one day; the points are frozen at the time it was done. */
export interface Completion {
  id: string;
  createdAt: Date;
  householdId: string;
  choreId: string;
  userId: string | null;
  day: string;
  points: number;
}

function validChore(item: Partial<Chore>) {
  if (!item.title?.trim()) {
    throw new ValidationError("give the chore a name");
  }

  if (item.frequency !== "daily" && item.frequency !== "weekly") {
    throw new ValidationError("a chore is daily or weekly");
  }

  if (!Number.isInteger(item.points) || item.points! < 1 || item.points! > 20) {
    throw new ValidationError("points run from 1 to 20");
  }
}

function memberOrNull(householdId: string, userId: string | null | undefined) {
  if (userId && sql(`select 1 from users where id = ${userId} and householdId = ${householdId}`).empty()) {
    throw new ForbiddenError("that person is not in this household");
  }
}

export let chores: LiveTable<Chore> = new LiveTable<Chore>({
  insert: (item) => {
    householdOrThrow(item.householdId);
    validChore(item);
    memberOrNull(item.householdId!, item.assigneeId);
    return chores.insert({ ...item, title: item.title!.trim() });
  },

  update: (item) => {
    householdOrThrow(item.householdId);
    validChore(item);
    memberOrNull(item.householdId, item.assigneeId);
    return chores.update(item);
  },

  delete: (item) => {
    householdOrThrow(item.householdId);
    return chores.delete(item);
  },
});

export let choreCompletions: LiveTable<Completion> = new LiveTable<Completion>({
  insert: (item) => {
    householdOrThrow(item.householdId);

    let chore = sql<Chore>(`select * from chores where id = ${item.choreId ?? null} and householdId = ${item.householdId!}`).first();

    if (!chore) {
      throw new ForbiddenError("that chore belongs to another household");
    }

    return choreCompletions.insert({ ...item, points: chore.points });
  },

  update: () => {
    throw new ForbiddenError("completions are ticked or unticked, not edited");
  },

  delete: (item) => {
    householdOrThrow(item.householdId);
    return choreCompletions.delete(item);
  },
});
