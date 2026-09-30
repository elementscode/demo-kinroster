import { test, equal } from "@elements/app";
import { guessAisle, parseIngredient, ingredientLines } from "#app/shared/lib/aisles";
import { weekStart, addDays, weekDays, weekdayIndex, inWeek, isDay } from "#app/shared/lib/dates";
import { initials } from "#app/shared/lib/members";

test("aisles", () => {
  test("guesses the aisle from the name", () => {
    equal(guessAisle("Whole milk"), "dairy");
    equal(guessAisle("Bananas"), "produce");
    equal(guessAisle("chicken thighs"), "meat");
    equal(guessAisle("jasmine rice"), "pantry");
    equal(guessAisle("birthday candles"), "other");
  });

  test("splits quantity from name", () => {
    equal(parseIngredient("2 lb chicken thighs"), { quantity: "2 lb", name: "chicken thighs" });
    equal(parseIngredient("3 bell peppers"), { quantity: "3", name: "bell peppers" });
    equal(parseIngredient("1 bunch basil"), { quantity: "1 bunch", name: "basil" });
    equal(parseIngredient("salt"), { quantity: "", name: "salt" });
  });

  test("reads one ingredient per non-blank line", () => {
    equal(ingredientLines(" a \n\n b\n"), ["a", "b"]);
  });
});

test("dates", () => {
  test("weeks start on Monday", () => {
    equal(weekStart("2026-09-30"), "2026-09-28");
    equal(weekStart("2026-10-04"), "2026-09-28");
    equal(weekStart("2026-09-28"), "2026-09-28");
  });

  test("walks across months", () => {
    equal(addDays("2026-09-28", 6), "2026-10-04");
    equal(weekDays("2026-09-28").length, 7);
    equal(weekdayIndex("2026-10-04"), 6);
    equal(inWeek("2026-10-04", "2026-09-28"), true);
    equal(inWeek("2026-10-05", "2026-09-28"), false);
  });

  test("rejects a bad week param", () => {
    equal(isDay("2026-13-45x"), false);
    equal(isDay("2026-09-30"), true);
  });
});

test("initials", () => {
  equal(initials("Maya Park"), "MP");
  equal(initials("ivy"), "I");
});
