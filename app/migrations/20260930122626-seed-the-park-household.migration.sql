-- the Park household (Maya, Sam, Leo, Ivy): four logins, two grocery lists, a chore chart with
-- history, and this week's dinners. Dates are relative to the day it applies.
/** @env development */

insert into households (id, name) values
  ('0192f000-0000-7000-8000-000000000001', 'The Parks');

insert into users (id, householdId, email, name, color, passwordHash) values
  ('0192f000-0000-7000-8000-0000000000a1', '0192f000-0000-7000-8000-000000000001', 'maya@example.com', 'Maya Park', 'green', crypt('kinroster', gen_salt('bf', 12))),
  ('0192f000-0000-7000-8000-0000000000a2', '0192f000-0000-7000-8000-000000000001', 'sam@example.com', 'Sam Park', 'blue', crypt('kinroster', gen_salt('bf', 12))),
  ('0192f000-0000-7000-8000-0000000000a3', '0192f000-0000-7000-8000-000000000001', 'leo@example.com', 'Leo Park', 'amber', crypt('kinroster', gen_salt('bf', 12))),
  ('0192f000-0000-7000-8000-0000000000a4', '0192f000-0000-7000-8000-000000000001', 'ivy@example.com', 'Ivy Park', 'rose', crypt('kinroster', gen_salt('bf', 12)));

insert into invites (householdId, email, invitedBy) values
  ('0192f000-0000-7000-8000-000000000001', 'nana@example.com', 'Maya Park');

-- grocery lists

insert into groceryLists (id, householdId, name, createdAt) values
  ('0192f000-0000-7000-8000-0000000000b1', '0192f000-0000-7000-8000-000000000001', 'Weekly shop', now() - interval '2 days'),
  ('0192f000-0000-7000-8000-0000000000b2', '0192f000-0000-7000-8000-000000000001', 'Costco run', now() - interval '1 day');

insert into groceryItems (listId, name, quantity, aisle, done, addedBy) values
  ('0192f000-0000-7000-8000-0000000000b1', 'Bananas', '1 bunch', 'produce', false, 'Ivy Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Baby spinach', '1 bag', 'produce', true, 'Maya Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Avocados', '3', 'produce', false, 'Sam Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Lemons', '4', 'produce', false, 'Maya Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Sourdough loaf', '1', 'bakery', false, 'Sam Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Whole milk', '1 gal', 'dairy', true, 'Maya Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Greek yogurt', '2 tubs', 'dairy', false, 'Leo Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Eggs', '1 dozen', 'dairy', false, 'Maya Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Shredded cheddar', '1 bag', 'dairy', false, 'Sam Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Ground beef', '1 lb', 'meat', false, 'Sam Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Frozen peas', '1 bag', 'frozen', false, 'Maya Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Taco shells', '1 box', 'pantry', false, 'Leo Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Jasmine rice', '1 bag', 'pantry', true, 'Maya Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Goldfish crackers', '2', 'snacks', false, 'Ivy Park'),
  ('0192f000-0000-7000-8000-0000000000b1', 'Dish soap', '1', 'household', false, 'Maya Park'),
  ('0192f000-0000-7000-8000-0000000000b2', 'Paper towels', '1 pack', 'household', false, 'Sam Park'),
  ('0192f000-0000-7000-8000-0000000000b2', 'Toilet paper', '1 pack', 'household', false, 'Sam Park'),
  ('0192f000-0000-7000-8000-0000000000b2', 'Olive oil', '2 bottles', 'pantry', false, 'Maya Park'),
  ('0192f000-0000-7000-8000-0000000000b2', 'Coffee beans', '2 bags', 'drinks', false, 'Sam Park'),
  ('0192f000-0000-7000-8000-0000000000b2', 'Frozen berries', '1 bag', 'frozen', false, 'Ivy Park'),
  ('0192f000-0000-7000-8000-0000000000b2', 'Sparkling water', '2 cases', 'drinks', true, 'Leo Park');

-- chores: weekday is 0 = Monday through 6 = Sunday

insert into chores (householdId, title, frequency, weekday, assigneeId, points, createdAt) values
  ('0192f000-0000-7000-8000-000000000001', 'Make your bed', 'daily', 0, '0192f000-0000-7000-8000-0000000000a4', 1, now() - interval '30 days'),
  ('0192f000-0000-7000-8000-000000000001', 'Feed Biscuit', 'daily', 0, '0192f000-0000-7000-8000-0000000000a3', 1, now() - interval '30 days'),
  ('0192f000-0000-7000-8000-000000000001', 'Unload the dishwasher', 'daily', 0, '0192f000-0000-7000-8000-0000000000a3', 2, now() - interval '30 days'),
  ('0192f000-0000-7000-8000-000000000001', 'Set the table', 'daily', 0, '0192f000-0000-7000-8000-0000000000a4', 1, now() - interval '30 days'),
  ('0192f000-0000-7000-8000-000000000001', 'Pack lunches', 'daily', 0, '0192f000-0000-7000-8000-0000000000a1', 2, now() - interval '30 days'),
  ('0192f000-0000-7000-8000-000000000001', 'Trash & recycling out', 'weekly', 1, '0192f000-0000-7000-8000-0000000000a2', 3, now() - interval '30 days'),
  ('0192f000-0000-7000-8000-000000000001', 'Laundry', 'weekly', 3, '0192f000-0000-7000-8000-0000000000a1', 3, now() - interval '30 days'),
  ('0192f000-0000-7000-8000-000000000001', 'Clean the bathroom', 'weekly', 4, '0192f000-0000-7000-8000-0000000000a2', 4, now() - interval '30 days'),
  ('0192f000-0000-7000-8000-000000000001', 'Vacuum the living room', 'weekly', 5, '0192f000-0000-7000-8000-0000000000a3', 4, now() - interval '30 days'),
  ('0192f000-0000-7000-8000-000000000001', 'Water the plants', 'weekly', 6, '0192f000-0000-7000-8000-0000000000a4', 2, now() - interval '30 days');

-- ten days of history: most daily chores done most days, weekly ones on their day
insert into choreCompletions (householdId, choreId, userId, day, points)
select c.householdId, c.id, c.assigneeId, to_char(d, 'YYYY-MM-DD'), c.points
from chores c
cross join generate_series(current_date - 10, current_date - 1, interval '1 day') d
where c.frequency = 'daily'
  and abs(hashtext(c.title || d::text)) % 10 < 8;

insert into choreCompletions (householdId, choreId, userId, day, points)
select c.householdId, c.id, c.assigneeId, to_char(d, 'YYYY-MM-DD'), c.points
from chores c
cross join generate_series(current_date - 10, current_date - 1, interval '1 day') d
where c.frequency = 'weekly'
  and extract(isodow from d) - 1 = c.weekday
  and abs(hashtext(c.title || d::text)) % 10 < 9;

-- today, the morning ones are already ticked
insert into choreCompletions (householdId, choreId, userId, day, points)
select c.householdId, c.id, c.assigneeId, to_char(current_date, 'YYYY-MM-DD'), c.points
from chores c
where c.title in ('Make your bed', 'Feed Biscuit', 'Pack lunches');

-- this week's dinners; Saturday is left open

insert into meals (householdId, day, title, cookId, ingredients, addedToListAt)
select '0192f000-0000-7000-8000-000000000001',
       to_char(date_trunc('week', current_date)::date + m.dayOffset, 'YYYY-MM-DD'),
       m.title, m.cookId::uuid, m.ingredients,
       case when m.dayOffset < 2 then now() - interval '3 days' end
from (values
  (0, 'Sheet-pan chicken fajitas', '0192f000-0000-7000-8000-0000000000a1', E'2 lb chicken thighs\n3 bell peppers\n1 red onion\n8 flour tortillas\n1 sour cream\n2 limes'),
  (1, 'Spaghetti & meatballs', '0192f000-0000-7000-8000-0000000000a2', E'1 lb spaghetti\n1 lb ground beef\n1 jar marinara sauce\n1 parmesan\n1 bunch basil'),
  (2, 'Salmon, rice & broccoli', '0192f000-0000-7000-8000-0000000000a1', E'4 salmon fillets\n1 bag jasmine rice\n2 heads broccoli\n1 lemon\n1 soy sauce'),
  (3, 'Taco night', '0192f000-0000-7000-8000-0000000000a3', E'1 lb ground beef\n1 box taco shells\n1 bag shredded cheddar\n1 head lettuce\n2 tomatoes\n1 jar salsa'),
  (4, 'Homemade pizza', '0192f000-0000-7000-8000-0000000000a2', E'2 pizza dough\n1 jar pizza sauce\n2 mozzarella\n1 pepperoni\n1 bag mushrooms'),
  (6, 'Roast chicken & potatoes', '0192f000-0000-7000-8000-0000000000a1', E'1 whole chicken\n3 lb potatoes\n1 head garlic\n1 bunch rosemary\n1 bag carrots')
) as m(dayOffset, title, cookId, ingredients);
