import { test, equal, assert, session, sql } from "@elements/app";
import { signin, signup, SignupForm } from "#app/shared/services/auth";

function form(fields: Partial<SignupForm>): SignupForm {
  return { name: "", email: "", password: "", householdName: "", invite: "", error: "", ...fields };
}

test("auth", () => {
  test("signup starts a household with a first list", () => {
    signup(form({ name: "Ada Lovelace", email: "Ada@Example.com", password: "password1", householdName: "The Lovelaces" }));

    let user = sql<{ householdId: string; email: string }>(`select householdId, email from users where email = 'ada@example.com'`).firstOrThrow();
    equal(session.get("householdId"), user.householdId);

    let lists = sql<{ name: string }>(`select name from groceryLists where householdId = ${user.householdId}`).all();
    equal(lists.map((l) => l.name), ["Weekly shop"]);
  });

  test("an invite joins the existing household, once", () => {
    let household = sql<{ id: string }>(`insert into households (name) values ('The Parks') returning id`).firstOrThrow();
    let invite = sql<{ token: string }>(`insert into invites (householdId, email, invitedBy) values (${household.id}, 'nana@example.com', 'Maya') returning token`).firstOrThrow();

    signup(form({ name: "Nana", email: "nana@example.com", password: "password1", invite: invite.token }));
    equal(session.get("householdId"), household.id);

    session.logout();

    let failed = false;

    try {
      signup(form({ name: "Someone", email: "other@example.com", password: "password1", invite: invite.token }));
    } catch {
      failed = true;
    }

    assert(failed, "a used invite is refused");
  });

  test("signin checks the password", () => {
    signup(form({ name: "Bo", email: "bo@example.com", password: "password1", householdName: "Bo's" }));
    session.logout();

    let refused = false;

    try {
      signin("bo@example.com", "wrong-password");
    } catch {
      refused = true;
    }

    assert(refused, "a wrong password is refused");

    signin("BO@example.com", "password1");
    equal(session.get("userName"), "Bo");
  });
});
