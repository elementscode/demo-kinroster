import { sql, tx, session, AuthError, ValidationError } from "@elements/app";
import { nextColor } from "#app/shared/services/household";

export const MIN_PASSWORD = 8;

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  householdName: string;
  invite: string;
  error: string;
}

/** An open invitation, as the sign-up page shows it. */
export interface InviteInfo {
  token: string;
  email: string;
  householdName: string;
  invitedBy: string;
}

interface Account {
  id: string;
  name: string;
  householdId: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function login(account: Account) {
  session.login({ userId: account.id, userName: account.name, householdId: account.householdId });
}

export function findInvite(token: string): InviteInfo | undefined {
  if (!token) {
    return;
  }

  return sql<InviteInfo>(
    `select i.token, i.email, h.name as householdName, i.invitedBy
     from invites i
     join households h on h.id = i.householdId
     where i.token = ${token} and i.acceptedAt is null`,
  ).first();
}

/** @rpc */
export function signin(email: string, password: string) {
  let address = normalizeEmail(email);

  if (!address || !password) {
    throw new AuthError("enter your email and password");
  }

  let account = sql<Account>(
    `select id, name, householdId from users
     where email = ${address}
       and passwordHash = crypt(${password}, passwordHash)`,
  ).first();

  if (!account) {
    throw new AuthError("invalid email or password");
  }

  login(account);
}

/**
 * Creates the account and either joins the household an invite names or
 * starts a new one, in one transaction.
 */
/** @rpc */
export function signup(form: SignupForm) {
  let name = form.name.trim();
  let address = normalizeEmail(form.email);

  if (!name) {
    throw new ValidationError("enter your name");
  }

  if (!isEmail(address)) {
    throw new ValidationError("enter a valid email address");
  }

  if (form.password.length < MIN_PASSWORD) {
    throw new ValidationError(`password must be at least ${MIN_PASSWORD} characters`);
  }

  if (!sql(`select 1 from users where email = ${address}`).empty()) {
    throw new ValidationError("that email is already registered");
  }

  let account = tx(() => {
    let householdId = "";

    if (form.invite) {
      let invite = sql<{ id: string; householdId: string }>(
        `update invites set acceptedAt = now()
         where token = ${form.invite} and acceptedAt is null
         returning id, householdId`,
      ).first();

      if (!invite) {
        throw new ValidationError("that invitation has already been used");
      }

      householdId = invite.householdId;
    } else {
      let householdName = form.householdName.trim();

      if (!householdName) {
        throw new ValidationError("name your household");
      }

      householdId = sql<{ id: string }>(
        `insert into households (name) values (${householdName}) returning id`,
      ).firstOrThrow("household insert returned no row").id;

      sql(`insert into groceryLists (householdId, name) values (${householdId}, 'Weekly shop')`);
    }

    return sql<Account>(
      `insert into users (householdId, email, name, color, passwordHash)
       values (${householdId}, ${address}, ${name}, ${nextColor(householdId)}, crypt(${form.password}, genSalt('bf', 12)))
       returning id, name, householdId`,
    ).firstOrThrow("user insert returned no row");
  });

  login(account);
}

/** @rpc */
export function signout() {
  session.logout();
}
