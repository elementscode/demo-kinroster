/**
 * The keys kinroster stores in the session. `householdId` rides along so every
 * route and LiveTable handler can gate on it without a lookup.
 */
declare module "@elements/app" {
  interface SessionData {
    userId: string;
    userName: string;
    householdId: string;
  }
}

export {};
