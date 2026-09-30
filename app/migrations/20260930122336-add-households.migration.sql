-- add households, grocery lists, chores and the meal plan

-- Auto-update updatedAt on row changes.
create or replace function touchUpdatedAt()
returns trigger
language plpgsql
as $$
begin
  new.updatedAt = now();
  return new;
end;
$$;

create table households (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  name text not null
);

create trigger householdsTouchUpdatedAt
  before update on households
  for each row execute function touchUpdatedAt();

create table users (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  householdId uuid not null references households(id) on delete cascade,
  email text not null unique,
  name text not null,
  color text not null default 'blue',
  passwordHash text not null
);

create index usersHouseholdIdIdx on users (householdId);

create trigger usersTouchUpdatedAt
  before update on users
  for each row execute function touchUpdatedAt();

create table invites (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  householdId uuid not null references households(id) on delete cascade,
  email text not null,
  token text not null unique default encode(gen_random_bytes(18), 'hex'),
  invitedBy text not null,
  acceptedAt timestamptz
);

create index invitesHouseholdIdIdx on invites (householdId);

create trigger invitesTouchUpdatedAt
  before update on invites
  for each row execute function touchUpdatedAt();

create table groceryLists (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  householdId uuid not null references households(id) on delete cascade,
  name text not null
);

create index groceryListsHouseholdIdIdx on groceryLists (householdId);

create trigger groceryListsTouchUpdatedAt
  before update on groceryLists
  for each row execute function touchUpdatedAt();

create table groceryItems (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  listId uuid not null references groceryLists(id) on delete cascade,
  name text not null,
  quantity text not null default '',
  aisle text not null default 'other',
  done boolean not null default false,
  addedBy text not null default ''
);

create index groceryItemsListIdIdx on groceryItems (listId);

create trigger groceryItemsTouchUpdatedAt
  before update on groceryItems
  for each row execute function touchUpdatedAt();

create table chores (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  householdId uuid not null references households(id) on delete cascade,
  title text not null,
  frequency text not null default 'daily' check (frequency in ('daily', 'weekly')),
  weekday int not null default 0 check (weekday between 0 and 6),
  assigneeId uuid references users(id) on delete set null,
  points int not null default 1 check (points between 1 and 20)
);

create index choresHouseholdIdIdx on chores (householdId);

create trigger choresTouchUpdatedAt
  before update on chores
  for each row execute function touchUpdatedAt();

create table choreCompletions (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  householdId uuid not null references households(id) on delete cascade,
  choreId uuid not null references chores(id) on delete cascade,
  userId uuid references users(id) on delete set null,
  day text not null check (day ~ '^\d{4}-\d{2}-\d{2}$'),
  points int not null,
  unique (choreId, day)
);

create index choreCompletionsHouseholdIdDayIdx on choreCompletions (householdId, day);

create trigger choreCompletionsTouchUpdatedAt
  before update on choreCompletions
  for each row execute function touchUpdatedAt();

create table meals (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  householdId uuid not null references households(id) on delete cascade,
  day text not null check (day ~ '^\d{4}-\d{2}-\d{2}$'),
  title text not null,
  cookId uuid references users(id) on delete set null,
  ingredients text not null default '',
  addedToListAt timestamptz,
  unique (householdId, day)
);

create trigger mealsTouchUpdatedAt
  before update on meals
  for each row execute function touchUpdatedAt();
