![Shared grocery lists, chores and dinners, built by Claude Code on Elements: the chores page with a weekly points leaderboard, a day strip and today's checklist.](https://elements.dev/demos/01a0f3d7-cb1c-79c6-8b96-13f89b0ef8e3/poster?v=bf1341f4bcd6)

# Shared grocery lists, chores and dinners, built by Claude Code on Elements

> Kinroster is a full-stack app built with Claude Code on Elements.

Grocery lists sorted by aisle, chores with a weekly points tally, and a dinner plan that fills the list, live on every phone.

[Run this app on your machine](https://elements.dev/demos/01a0f3d7-cb1c-79c6-8b96-13f89b0ef8e3). Use this demo as inspiration, or as the starting point for your own app. Your agent creates a new app with this one as the scaffold, and you prompt it to add whatever features you want.

## How it's built

Kinroster needed lists, chores and a meal plan that every phone in the house sees change at once, a household that stays private to its members, and invitations by email. Each of those is a part of Elements, so the agent spent its 16 minutes on the family organizer itself.

- **Live data on every phone.** Grocery lists and items, chores, completed chores, meals and invites are LiveTables the pages write to directly. An item checked off in the store shows as checked on every other phone the moment it is tapped, and each phone hears only the list it has open.

- **One household per family.** Every write passes one session guard, so each family reads and writes only its own lists, chores and meals.

- **Chores and points.** Marking a chore done records the points it was worth at that moment, so the weekly tally stays fair when someone changes a chore later.

- **Invites by email.** Adding an invite checks the address and emails a join link, and signing up through it puts the new member in the household.

- **A meal to the list in one tap.** An `@rpc` server function reads a dinner's ingredients, guesses each aisle, skips anything already on the list and adds the rest through the live list, so every phone on it sees the items land.

- **Data from SQL files.** Migrations define the household and seed the Parks: four logins, two grocery lists, ten chores with about ten days of history, six dinners this week and a pending invite, all dated from the day the seed runs.

## Why Elements

Elements is an integrated full-stack app framework and a project server. The project server checks the agent's work as it builds: it type-checks the server and browser code, analyzes the program, applies migrations and runs the tests, then reports the results to the agent. A security mistake, such as calling a server-only function from the browser, is a compile error. The agent reads the report and fixes its own mistakes before it tells you a feature is done. The same checks run on every feature you ask for next.
