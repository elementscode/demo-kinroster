import { test, equal, assert, sql } from "@elements/app";
import { meals, addMealToList } from "#app/shared/services/meals";
import { groceryItems } from "#app/shared/services/groceries";
import { family } from "#app/shared/services/testing";

test("meal plan", () => {
  test("one tap puts a dinner's ingredients on the list", () => {
    let f = family();
    let meal = meals.view({ householdId: f.householdId }).insert({
      day: "2026-09-30",
      title: "Tacos",
      cookId: f.parentId,
      ingredients: "1 lb ground beef\n1 box taco shells\n2 limes",
      addedToListAt: null,
    });

    let result = addMealToList(meal.id, f.listId);
    equal(result.added, 3);

    let rows = sql<{ name: string; quantity: string; aisle: string }>(`select name, quantity, aisle from groceryItems where listId = ${f.listId} order by name`).all();
    equal(rows, [
      { name: "ground beef", quantity: "1 lb", aisle: "meat" },
      { name: "limes", quantity: "2", aisle: "produce" },
      { name: "taco shells", quantity: "1 box", aisle: "pantry" },
    ]);

    assert(sql<{ addedToListAt: Date | null }>(`select addedToListAt from meals where id = ${meal.id}`).firstOrThrow().addedToListAt !== null);
  });

  test("tapping twice does not double the shop", () => {
    let f = family();
    groceryItems.view({ listId: f.listId }).insert({ name: "Limes", quantity: "", aisle: "produce", done: false });

    let meal = meals.view({ householdId: f.householdId }).insert({ day: "2026-10-01", title: "Fish", cookId: null, ingredients: "2 limes\n4 salmon fillets", addedToListAt: null });

    equal(addMealToList(meal.id, f.listId).added, 1);
    equal(addMealToList(meal.id, f.listId).added, 0);
    equal(sql(`select 1 from groceryItems where listId = ${f.listId}`).all().length, 2);
  });
});
