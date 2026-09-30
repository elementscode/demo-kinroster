import { Request, Response } from "@elements/app";
import { currentMember, pageContext } from "#app/shared/services/household";
import { invites } from "#app/shared/services/invites";
import html from "./template";

export default function route(req: Request, res: Response) {
  let me = currentMember();

  if (!me) {
    return;
  }

  return new html({
    ...pageContext(me),
    me: me.userId,
    invites: invites.view({ householdId: me.householdId }),
  });
}
