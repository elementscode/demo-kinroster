/** A household member as every page draws them: a name and a colour chip. */
export interface Member {
  id: string;
  name: string;
  email: string;
  color: string;
}

/** The chip colours, handed out in order as people join a household. */
export const MEMBER_COLORS = ["green", "blue", "amber", "rose", "violet", "teal"];

export function initials(name: string): string {
  let parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function memberById(members: Member[], id: string | null | undefined): Member | undefined {
  return members.find((m) => m.id === id);
}
