import { test, equal, assert, sql } from "@elements/app";
import { invites } from "#app/shared/services/invites";
import { family } from "#app/shared/services/testing";

test("invites", () => {
  test("an invite is stored with a token and who sent it", () => {
    let f = family();
    let invite = invites.view({ householdId: f.householdId }).insert({ email: "Grandpa@Example.com", token: "", invitedBy: "", acceptedAt: null });

    let row = sql<{ email: string; invitedBy: string; token: string }>(`select email, invitedBy, token from invites where id = ${invite.id}`).firstOrThrow();
    equal(row.email, "grandpa@example.com");
    equal(row.invitedBy, "Pat Tester");
    assert(row.token.length > 20, "the token is long enough to be unguessable");
  });

  test("someone with an account cannot be invited again", () => {
    let f = family();
    let email = sql<{ email: string }>(`select email from users where id = ${f.kidId}`).firstOrThrow().email;
    let refused = false;

    try {
      invites.view({ householdId: f.householdId }).insert({ email, token: "", invitedBy: "", acceptedAt: null });
    } catch {
      refused = true;
    }

    assert(refused);
  });
});
