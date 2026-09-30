/** Store aisles in the order a shop walks them. */
export const AISLES = [
  { key: "produce", label: "Produce" },
  { key: "bakery", label: "Bakery" },
  { key: "dairy", label: "Dairy & eggs" },
  { key: "meat", label: "Meat & fish" },
  { key: "frozen", label: "Frozen" },
  { key: "pantry", label: "Pantry" },
  { key: "snacks", label: "Snacks" },
  { key: "drinks", label: "Drinks" },
  { key: "household", label: "Household" },
  { key: "other", label: "Other" },
];

const KEYWORDS: Record<string, string[]> = {
  produce: [
    "apple", "banana", "berry", "berries", "watermelon", "lemon", "lime", "orange", "grape", "pear", "peach", "melon", "avocado",
    "tomato", "potato", "onion", "garlic", "ginger", "carrot", "celery", "lettuce", "spinach", "kale",
    "cucumber", "pepper", "zucchini", "broccoli", "cauliflower", "mushroom", "herb", "basil", "cilantro",
    "parsley", "scallion", "leek", "squash", "corn", "bean sprout", "salad", "fruit", "cabbage", "mint",
  ],
  bakery: ["bread", "bagel", "bun", "roll", "tortilla", "pita", "croissant", "muffin", "loaf", "loaves", "naan", "baguette", "dough"],
  dairy: ["milk", "cheese", "yogurt", "yoghurt", "butter", "cream", "egg", "parmesan", "mozzarella", "feta", "cheddar"],
  meat: ["chicken", "beef", "pork", "bacon", "sausage", "turkey", "ham", "salmon", "fish", "shrimp", "tuna", "steak", "mince", "lamb", "cod", "pepperoni", "meatball"],
  frozen: ["frozen", "ice cream", "peas", "waffle"],
  pantry: [
    "rice", "pasta", "spaghetti", "noodle", "flour", "sugar", "salt", "oil", "vinegar", "sauce", "stock",
    "broth", "can", "canned", "lentil", "chickpea", "bean", "oat", "cereal", "honey", "jam", "peanut",
    "spice", "cumin", "paprika", "curry", "soy", "coconut", "taco", "salsa", "ketchup", "mustard", "mayo",
  ],
  snacks: ["chip", "crisp", "cracker", "cookie", "popcorn", "pretzel", "chocolate", "granola", "bar"],
  drinks: ["juice", "coffee", "tea", "soda", "water", "sparkling", "wine", "beer", "kombucha"],
  household: ["paper", "towel", "tissue", "soap", "detergent", "dish", "sponge", "bag", "foil", "wrap", "battery", "batteries", "toothpaste", "shampoo"],
};

/**
 * A best guess at the aisle from an item's name, by whole word so "candles"
 * is not a can. The shopper can change it.
 */
export function guessAisle(name: string): string {
  let text = name.toLowerCase();

  for (let aisle of AISLES) {
    let words = KEYWORDS[aisle.key] ?? [];

    if (words.some((w) => new RegExp(`\\b${w}(s|es)?\\b`).test(text))) {
      return aisle.key;
    }
  }

  return "other";
}

export function aisleLabel(key: string): string {
  return AISLES.find((a) => a.key === key)?.label ?? "Other";
}

const UNITS = "lb|lbs|oz|g|kg|ml|l|cup|cups|tbsp|tsp|can|cans|jar|jars|bunch|bunches|head|heads|clove|cloves|pack|packs|dozen|bag|bags|box|boxes|loaf|loaves|bottle|bottles";

/**
 * Splits an ingredient line into quantity and name: "2 lb chicken thighs"
 * becomes { quantity: "2 lb", name: "chicken thighs" }.
 */
export function parseIngredient(line: string): { quantity: string; name: string } {
  let text = line.trim().replace(/\s+/g, " ");
  let match = text.match(new RegExp(`^((?:\\d+(?:[./]\\d+)?|[½¼¾⅓⅔])(?:\\s*(?:${UNITS})\\b)?)\\s+(.+)$`, "i"));

  if (!match) {
    return { quantity: "", name: text };
  }

  return { quantity: match[1], name: match[2] };
}

export function ingredientLines(ingredients: string): string[] {
  return ingredients.split("\n").map((l) => l.trim()).filter(Boolean);
}
