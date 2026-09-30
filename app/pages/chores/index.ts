import { Request, Response } from "@elements/app";
import { currentMember, pageContext } from "#app/shared/services/household";
import { chores, choreCompletions } from "#app/shared/services/chores";
import { parseWeek, today } from "#app/shared/lib/dates";
import html from "./template";

export default function route(req: Request, res: Response) {
  let me = currentMember();

  if (!me) {
    return;
  }

  return new html({
    ...pageContext(me),
    chores: chores.view({ householdId: me.householdId }),
    completions: choreCompletions.view({ householdId: me.householdId }),
    week: parseWeek(req.query.week),
    today: today(),
  });
}
