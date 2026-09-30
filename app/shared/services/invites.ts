import { LiveTable, sql, session, email, getAppUrl, ValidationError } from "@elements/app";
import { householdOrThrow, household } from "#app/shared/services/household";
import InviteEmail from "#app/emails/invite";

export interface Invite {
  id: string;
  createdAt: Date;
  householdId: string;
  email: string;
  token: string;
  invitedBy: string;
  acceptedAt: Date | null;
}

export function inviteLink(token: string): string {
  return `${getAppUrl()}/join/${token}`;
}

/**
 * Pending invitations for a household. Inserting one mails the link; the
 * token comes from the database default and goes out on the returned row.
 */
export let invites: LiveTable<Invite> = new LiveTable<Invite>({
  insert: (item) => {
    householdOrThrow(item.householdId);

    let address = (item.email ?? "").trim().toLowerCase();

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address)) {
      throw new ValidationError("enter a valid email address");
    }

    if (!sql(`select 1 from users where email = ${address}`).empty()) {
      throw new ValidationError("that person already has a kinroster account");
    }

    if (!sql(`select 1 from invites where householdId = ${item.householdId!} and email = ${address} and acceptedAt is null`).empty()) {
      throw new ValidationError("already invited");
    }

    let invitedBy = session.getOrThrow("userName");
    let row = sql<Invite>(
      `insert into invites (id, householdId, email, invitedBy)
       values (${item.id!}, ${item.householdId!}, ${address}, ${invitedBy})
       returning *`,
    ).firstOrThrow("invite insert returned no row");

    email({
      to: address,
      subject: `${invitedBy} invited you to ${household(row.householdId).name} on kinroster`,
      body: new InviteEmail({ invitedBy, householdName: household(row.householdId).name, link: inviteLink(row.token) }),
    });

    return row;
  },

  update: () => {
    throw new ValidationError("invitations are sent or revoked, not edited");
  },

  delete: (item) => {
    householdOrThrow(item.householdId);
    return invites.delete(item);
  },
});
