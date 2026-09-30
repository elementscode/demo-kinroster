import { Request, Response, redirect, session, sql } from "@elements/app";
import html, { DEMO_EMAILS, DemoLogin } from "./template";

export default function route(req: Request, res: Response) {
  if (session.isLoggedIn()) {
    redirect("/lists");
    return;
  }

  /* Only the seeded accounts that exist here: none on a deploy machine. */
  let demo = sql<DemoLogin>(
    `select u.name, u.email, u.color, h.name as householdName
     from users u join households h on h.id = u.householdId
     where u.email = any(${DEMO_EMAILS})
     order by array_position(${DEMO_EMAILS}, u.email)`,
  ).all();

  return new html({ demo });
}
