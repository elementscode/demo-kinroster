import { LiveTable, sql, session, ForbiddenError } from "@elements/app";
import { householdOrThrow } from "#app/shared/services/household";

export interface GroceryList {
  id: string;
  createdAt: Date;
  householdId: string;
  name: string;
}

export interface GroceryItem {
  id: string;
  createdAt: Date;
  listId: string;
  name: string;
  quantity: string;
  aisle: string;
  done: boolean;
  addedBy: string;
}

/** Throws unless the list belongs to the signed-in member's household. */
export function listOrThrow(listId: string | undefined): GroceryList {
  session.isLoggedInOrThrow();

  let list = sql<GroceryList>(
    `select id, createdAt, householdId, name from groceryLists where id = ${listId ?? null}`,
  ).first();

  if (!list || list.householdId !== session.getOrThrow("householdId")) {
    throw new ForbiddenError("that list belongs to another household");
  }

  return list;
}

export let groceryLists: LiveTable<GroceryList> = new LiveTable<GroceryList>({
  insert: (item) => {
    householdOrThrow(item.householdId);
    return groceryLists.insert(item);
  },

  update: (item) => {
    householdOrThrow(item.householdId);
    return groceryLists.update(item);
  },

  delete: (item) => {
    householdOrThrow(item.householdId);
    return groceryLists.delete(item);
  },
});

/** Items are partitioned by list, so a phone on one list hears only that list. */
export let groceryItems: LiveTable<GroceryItem> = new LiveTable<GroceryItem>({
  insert: (item) => {
    listOrThrow(item.listId);
    return groceryItems.insert({ ...item, addedBy: session.getOrThrow("userName") });
  },

  update: (item) => {
    listOrThrow(item.listId);
    return groceryItems.update(item);
  },

  delete: (item) => {
    listOrThrow(item.listId);
    return groceryItems.delete(item);
  },
});

export function firstListId(householdId: string): string | undefined {
  return sql<{ id: string }>(
    `select id from groceryLists where householdId = ${householdId} order by createdAt limit 1`,
  ).first()?.id;
}
