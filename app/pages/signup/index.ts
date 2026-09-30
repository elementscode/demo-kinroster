import { Request, Response, redirect, session } from "@elements/app";
import { findInvite } from "#app/shared/services/auth";
import html from "./template";

export default function route(req: Request, res: Response) {
  if (session.isLoggedIn()) {
    redirect("/lists");
    return;
  }

  let token = typeof req.query.invite === "string" ? req.query.invite : "";

  return new html({ invite: findInvite(token) ?? null, expired: token !== "" && !findInvite(token) });
}
