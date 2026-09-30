import { test, equal, assert, sql } from "@elements/app";
import { chores, choreCompletions } from "#app/shared/services/chores";
import { family } from "#app/shared/services/testing";

test("chores", () => {
  test("a completion credits the assignee with the chore's points", () => {
    let f = family();
    let chore = chores.view({ householdId: f.householdId }).insert({ title: "Feed the cat", frequency: "daily", weekday: 0, assigneeId: f.kidId, points: 3 });

    /* Points come from the chore, not from what the browser claims. */
    choreCompletions.view({ householdId: f.householdId }).insert({ choreId: chore.id, userId: f.kidId, day: "2026-09-30", points: 99 });

    let tally = sql<{ total: number }>(`select sum(points)::int as total from choreCompletions where userId = ${f.kidId}`).firstOrThrow();
    equal(tally.total, 3);
  });

  test("a chore can only be done once a day", () => {
    let f = family();
    let chore = chores.view({ householdId: f.householdId }).insert({ title: "Make bed", frequency: "daily", weekday: 0, assigneeId: f.kidId, points: 1 });
    let done = choreCompletions.view({ householdId: f.householdId });

    done.insert({ choreId: chore.id, userId: f.kidId, day: "2026-09-30", points: 1 });

    let refused = false;

    try {
      done.insert({ choreId: chore.id, userId: f.kidId, day: "2026-09-30", points: 1 });
    } catch {
      refused = true;
    }

    assert(refused, "the second tick on the same day is refused");
  });

  test("points stay between 1 and 20", () => {
    let f = family();
    let refused = false;

    try {
      chores.view({ householdId: f.householdId }).insert({ title: "Everything", frequency: "weekly", weekday: 5, assigneeId: null, points: 500 });
    } catch {
      refused = true;
    }

    assert(refused);
  });
});
