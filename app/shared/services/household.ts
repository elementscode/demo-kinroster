import { sql, session, redirect, ForbiddenError } from "@elements/app";
import { Member, MEMBER_COLORS } from "#app/shared/lib/members";

export interface Household {
  id: string;
  name: string;
}

export interface Me {
  userId: string;
  householdId: string;
}

/**
 * The signed-in member for a page route, or undefined after sending a visitor
 * to the sign-in page. Every household page starts here.
 */
export function currentMember(): Me | undefined {
  if (!session.isLoggedIn()) {
    redirect("/signin");
    return;
  }

  return { userId: session.getOrThrow("userId"), householdId: session.getOrThrow("householdId") };
}

/** The guard every LiveTable handler and rpc runs before it touches a row. */
export function householdOrThrow(householdId: string | undefined) {
  session.isLoggedInOrThrow();

  if (!householdId || householdId !== session.getOrThrow("householdId")) {
    throw new ForbiddenError("that belongs to another household");
  }
}

export function household(householdId: string): Household {
  return sql<Household>(`select id, name from households where id = ${householdId}`).firstOrThrow("household not found");
}

export function members(householdId: string): Member[] {
  return sql<Member>(
    `select id, name, email, color from users
     where householdId = ${householdId}
     order by createdAt`,
  ).all();
}

/** The next unused chip colour in a household, so two people never match. */
export function nextColor(householdId: string): string {
  let taken = members(householdId).map((m) => m.color);

  return MEMBER_COLORS.find((c) => !taken.includes(c)) ?? MEMBER_COLORS[taken.length % MEMBER_COLORS.length];
}

/** What the layout needs on every household page, plus the member list. */
export function pageContext(me: Me): { householdName: string; color: string; members: Member[] } {
  let everyone = members(me.householdId);

  return {
    householdName: household(me.householdId).name,
    color: everyone.find((m) => m.id === me.userId)?.color ?? "green",
    members: everyone,
  };
}
