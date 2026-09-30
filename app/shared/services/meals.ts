import { LiveTable, sql, session, ForbiddenError, ValidationError } from "@elements/app";
import { householdOrThrow } from "#app/shared/services/household";
import { groceryItems, listOrThrow } from "#app/shared/services/groceries";
import { guessAisle, ingredientLines, parseIngredient } from "#app/shared/lib/aisles";
import { isDay } from "#app/shared/lib/dates";

export interface Meal {
  id: string;
  createdAt: Date;
  householdId: string;
  day: string;
  title: string;
  cookId: string | null;
  /** One ingredient per line, quantity first: "2 lb chicken thighs". */
  ingredients: string;
  addedToListAt: Date | null;
}

function validMeal(item: Partial<Meal>) {
  if (!item.title?.trim()) {
    throw new ValidationError("name the dinner");
  }

  if (!isDay(item.day)) {
    throw new ValidationError("a meal needs a day");
  }

  if (item.cookId && sql(`select 1 from users where id = ${item.cookId} and householdId = ${item.householdId!}`).empty()) {
    throw new ForbiddenError("that cook is not in this household");
  }
}

export let meals: LiveTable<Meal> = new LiveTable<Meal>({
  insert: (item) => {
    householdOrThrow(item.householdId);
    validMeal(item);
    return meals.insert(item);
  },

  update: (item) => {
    householdOrThrow(item.householdId);
    validMeal(item);
    return meals.update(item);
  },

  delete: (item) => {
    householdOrThrow(item.householdId);
    return meals.delete(item);
  },
});

export interface AddResult {
  added: number;
  skipped: number;
  listName: string;
}

/**
 * Puts a dinner's ingredients on a grocery list in one go. An ingredient
 * already on the list and not yet in the cart is left alone, so tapping twice
 * does not double the shop. Writes go through the views, so every phone on
 * that list sees the items land.
 */
/** @rpc */
export function addMealToList(mealId: string, listId: string): AddResult {
  session.isLoggedInOrThrow();

  let householdId = session.getOrThrow("householdId");
  let list = listOrThrow(listId);
  let meal = sql<Meal>(`select * from meals where id = ${mealId} and householdId = ${householdId}`).first();

  if (!meal) {
    throw new ForbiddenError("that meal belongs to another household");
  }

  let onList = new Set(
    sql<{ name: string }>(`select name from groceryItems where listId = ${list.id} and not done`)
      .all()
      .map((i) => i.name.toLowerCase()),
  );

  let items = groceryItems.view({ listId: list.id });
  let added = 0;
  let skipped = 0;

  for (let line of ingredientLines(meal.ingredients)) {
    let { quantity, name } = parseIngredient(line);

    if (onList.has(name.toLowerCase())) {
      skipped++;
      continue;
    }

    items.insert({ name, quantity, aisle: guessAisle(name), done: false, createdAt: new Date() });
    onList.add(name.toLowerCase());
    added++;
  }

  meals.view({ householdId }).update({ ...meal, addedToListAt: new Date() });

  return { added, skipped, listName: list.name };
}
