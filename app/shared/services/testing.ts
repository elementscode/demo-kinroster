import { sql, session } from "@elements/app";

export interface Family {
  householdId: string;
  listId: string;
  parentId: string;
  kidId: string;
}

/** A household with a parent, a kid and one list, signed in as the parent. */
export function family(name: string = "The Testers"): Family {
  let householdId = sql<{ id: string }>(`insert into households (name) values (${name}) returning id`).firstOrThrow().id;
  let slug = householdId.slice(-8);

  let parentId = sql<{ id: string }>(
    `insert into users (householdId, email, name, color, passwordHash)
     values (${householdId}, ${`parent-${slug}@example.com`}, 'Pat Tester', 'green', crypt('password1', genSalt('bf', 4)))
     returning id`,
  ).firstOrThrow().id;

  let kidId = sql<{ id: string }>(
    `insert into users (householdId, email, name, color, passwordHash)
     values (${householdId}, ${`kid-${slug}@example.com`}, 'Kit Tester', 'blue', crypt('password1', genSalt('bf', 4)))
     returning id`,
  ).firstOrThrow().id;

  let listId = sql<{ id: string }>(
    `insert into groceryLists (householdId, name) values (${householdId}, 'Weekly shop') returning id`,
  ).firstOrThrow().id;

  session.login({ userId: parentId, userName: "Pat Tester", householdId });

  return { householdId, listId, parentId, kidId };
}
