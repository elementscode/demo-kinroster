![Kinroster, a family organizer built with Elements: the chores page with a weekly points leaderboard, a day strip and today's checklist.](https://elements.dev/demos/01a0f3d7-cb1c-79c6-8b96-13f89b0ef8e3/poster?v=bf1341f4bcd6)

# Kinroster

> A demo app built with [Elements](https://elements.dev).

Grocery lists sorted by aisle, chores with a weekly points tally, and a dinner plan that fills the list, live on every phone.

**Demo:** [Kinroster](https://elements.dev/demos/01a0f3d7-cb1c-79c6-8b96-13f89b0ef8e3)

## Agent specs

What one run of the prompt below took, from an empty Elements project to this
app.

- **Agent:** Claude Code, Opus 5.5 Medium
- **Time:** 16 min
- **Cost:** $5.30 at API rates, September 2026

## Get started

```bash
elements create kinroster -scaffold=elementscode/demo-kinroster
```

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

## The prompt

```text
Build a household organizer named kinroster for a family.

- Sign up and create a household, invite family members by email.
- Shared grocery lists: add items with a quantity, check them off in the
  store, items grouped by aisle (produce, dairy, pantry...).
- Chores: recurring tasks (daily, weekly) assigned to someone, marked done,
  with a weekly points tally.
- Meal plan: a week grid of dinners, and add a meal's ingredients to the
  grocery list in one tap.

Seed one household of four with two grocery lists, a chore chart with a week of
history, and a meal plan. Show the seeded logins on the sign-in page.

Lists, chores and the meal plan update in real time on every phone.
```

## License

MIT. See [LICENSE](LICENSE).
