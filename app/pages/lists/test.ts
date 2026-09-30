import { test, equal, assert, session, sql } from "@elements/app";
import { groceryItems, groceryLists } from "#app/shared/services/groceries";
import { family } from "#app/shared/services/testing";

test("grocery lists", () => {
  test("an item lands on the list with who added it", () => {
    let f = family();
    let items = groceryItems.view({ listId: f.listId });

    items.insert({ name: "Oat milk", quantity: "2", aisle: "dairy", done: false });

    let row = sql<{ name: string; addedBy: string; aisle: string }>(`select name, addedBy, aisle from groceryItems where listId = ${f.listId}`).firstOrThrow();
    equal(row, { name: "Oat milk", addedBy: "Pat Tester", aisle: "dairy" });
  });

  test("checking an item off persists", () => {
    let f = family();
    let items = groceryItems.view({ listId: f.listId });
    let item = items.insert({ name: "Eggs", quantity: "", aisle: "dairy", done: false });

    items.update({ ...item, done: true });
    equal(sql<{ done: boolean }>(`select done from groceryItems where id = ${item.id}`).firstOrThrow().done, true);
  });

  test("another household cannot open or write a list", () => {
    let theirs = family("The Others");
    let mine = family("The Mines");

    let refused = false;

    try {
      groceryItems.view({ listId: theirs.listId }).insert({ name: "Snooping", quantity: "", aisle: "other", done: false });
    } catch {
      refused = true;
    }

    assert(refused, "writing to another household's list is refused");
    assert(session.get("householdId") === mine.householdId);
  });

  test("a new list belongs to the household", () => {
    let f = family();

    groceryLists.view({ householdId: f.householdId }).insert({ name: "Party" });
    equal(sql(`select 1 from groceryLists where householdId = ${f.householdId}`).all().length, 2);
  });
});
