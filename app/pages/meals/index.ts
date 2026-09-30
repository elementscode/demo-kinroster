import { Request, Response, sql } from "@elements/app";
import { currentMember, pageContext } from "#app/shared/services/household";
import { meals } from "#app/shared/services/meals";
import { GroceryList } from "#app/shared/services/groceries";
import { parseWeek, today } from "#app/shared/lib/dates";
import html from "./template";

export default function route(req: Request, res: Response) {
  let me = currentMember();

  if (!me) {
    return;
  }

  let lists = sql<GroceryList>(
    `select id, createdAt, householdId, name from groceryLists
     where householdId = ${me.householdId}
     order by createdAt`,
  ).all();

  return new html({
    ...pageContext(me),
    meals: meals.view({ householdId: me.householdId }),
    lists,
    week: parseWeek(req.query.week),
    today: today(),
  });
}
