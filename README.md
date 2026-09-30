![Kinroster, a family organizer built with Elements: the chores page with a weekly points leaderboard, a day strip and today's checklist.](https://elements.dev/demos/01a0f3d7-cb1c-79c6-8b96-13f89b0ef8e3/poster?v=bf1341f4bcd6)

# Kinroster

> A demo app built with [Elements](https://elements.dev).

Grocery lists sorted by aisle, chores with a weekly points tally, and a dinner plan that fills the list, live on every phone.

**Demo:** [Kinroster](https://elements.dev/demos/01a0f3d7-cb1c-79c6-8b96-13f89b0ef8e3)

## Agent specs

- **Agent:** Claude Code, Opus 5.5 Medium
- **Time:** 16 min
- **Cost:** $5.30 at API rates, September 2026

## Get started

```bash
elements create kinroster -scaffold=elementscode/demo-kinroster
```

## How it's built

Kinroster needed lists, chores and a meal plan that every phone in the house sees change at once, a household that stays private to its members, and invitations by email. Each of those is a part of Elements, so the agent spent its 16 minutes on the family organizer itself.

### What Elements gave the app

- **Live data on every phone.** Grocery lists and items, chores, completed chores, meals and invites are LiveTables the pages write to directly. An item checked off in the store shows as checked on every other phone the moment it is tapped, and each phone hears only the list it has open.

- **One household per family.** Every write passes one session guard, so each family reads and writes only its own lists, chores and meals.

- **Chores and points.** Marking a chore done records the points it was worth at that moment, so the weekly tally stays fair when someone changes a chore later.

- **Invites by email.** Adding an invite checks the address and emails a join link, and signing up through it puts the new member in the household.

- **A meal to the list in one tap.** An `@rpc` server function reads a dinner's ingredients, guesses each aisle, skips anything already on the list and adds the rest through the live list, so every phone on it sees the items land.

- **Data from SQL files.** Migrations define the household and seed the Parks: four logins, two grocery lists, ten chores with about ten days of history, six dinners this week and a pending invite, all dated from the day the seed runs.

### What the project server gave the agent

The project server runs alongside the agent and answers as soon as a file is saved: it type-checks the templates, TypeScript and SQL, applies migrations and reruns the tests, so every question came back right away and the agent kept building.

### What shipped

The app type-checks with zero errors and all 28 tests pass. Every page works on desktop and phone.

## Seed data and demo accounts

The seed creates one household, the Parks, with two grocery lists (Weekly shop
and Costco run), ten daily and weekly chores with about ten days of history, six
dinners planned this week (Saturday left open) and a pending invite for Nana.
Dates are relative to the day the seed runs, so the data doesn't go stale.

Every account's password is `kinroster`, and the sign-in page lists them.

| Email            | Who         |
| ---------------- | ----------- |
| maya@example.com | Parent      |
| sam@example.com  | Parent      |
| leo@example.com  | Kid, 12     |
| ivy@example.com  | Kid, 9      |

In development, invite emails go to `.elements/logs/program.log` instead of
being sent.

**Demo:** [Kinroster](https://elements.dev/demos/01a0f3d7-cb1c-79c6-8b96-13f89b0ef8e3)

## License

MIT. See [LICENSE](LICENSE).
