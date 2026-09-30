import { Request, Response, redirect } from "@elements/app";
import { currentMember, pageContext } from "#app/shared/services/household";
import { groceryLists, groceryItems, listOrThrow, firstListId } from "#app/shared/services/groceries";
import html from "./template";

export default function route(req: Request, res: Response) {
  let me = currentMember();

  if (!me) {
    return;
  }

  let lists = groceryLists.view({ householdId: me.householdId });
  let listId = req.params.id ?? firstListId(me.householdId);

  if (!listId) {
    listId = lists.insert({ name: "Weekly shop", createdAt: new Date() }).id;
  }

  let list = listOrThrow(listId);

  if (!req.params.id) {
    redirect(`/lists/${list.id}`);
    return;
  }

  let { householdName, color } = pageContext(me);

  return new html({
    householdName,
    color,
    lists,
    listId: list.id,
    items: groceryItems.view({ listId: list.id }),
  });
}
