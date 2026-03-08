import type { Category, Ingredient, Nutrition, RecipeItem, RecipeKind, StoredRecipe } from './models';

export interface AddIngredientResult {
  ok: boolean;
  message?: string;
}

export class Recipe {
  public readonly id: string;
  public readonly name: string;
  public readonly kind: RecipeKind;
  protected items: RecipeItem[] = [];

  constructor(id: string, name: string, kind: RecipeKind = 'standard') {
    this.id = id;
    this.name = name;
    this.kind = kind;
  }

  addIngredient(ingredient: Ingredient, grams: number): AddIngredientResult {
    if (grams <= 0) {
      return { ok: false, message: 'Grams must be greater than 0.' };
    }

    const ruleMessage = this.getRuleMessage(ingredient);
    if (ruleMessage) {
      return { ok: false, message: ruleMessage };
    }

    const existing = this.items.find((item) => item.ingredient.id === ingredient.id);
    if (existing) {
      existing.grams += grams;
    } else {
      this.items.push({ ingredient, grams });
    }

    return { ok: true };
  }

  updateIngredientGrams(ingredientId: string, grams: number): boolean {
    const existing = this.items.find((item) => item.ingredient.id === ingredientId);
    if (!existing) {
      return false;
    }

    if (grams <= 0) {
      this.removeIngredient(ingredientId);
      return true;
    }

    existing.grams = grams;
    return true;
  }

  removeIngredient(ingredientId: string): void {
    this.items = this.items.filter((item) => item.ingredient.id !== ingredientId);
  }

  getItems(): RecipeItem[] {
    return [...this.items];
  }

  getTotals(): Nutrition {
    const totals: Nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };

    for (const item of this.items) {
      const factor = item.grams / 100;
      totals.calories += item.ingredient.nutritionPer100g.calories * factor;
      totals.protein += item.ingredient.nutritionPer100g.protein * factor;
      totals.carbs += item.ingredient.nutritionPer100g.carbs * factor;
      totals.fat += item.ingredient.nutritionPer100g.fat * factor;
    }

    return totals;
  }

  toStoredRecipe(): StoredRecipe {
    return { id: this.id, name: this.name, kind: this.kind, items: this.getItems() };
  }

  protected getRuleMessage(ingredient: Ingredient): string | null {
    if (this.kind !== 'standard') {
      return null;
    }

    if (ingredient.name.trim() === '') {
      return 'Ingredient name is required.';
    }

    return null;
  }
}

export class VegetarianRecipe extends Recipe {
  private readonly blockedCategories: Category[] = ['meat'];

  constructor(id: string, name: string) {
    super(id, name, 'vegetarian');
  }

  getRuleDescription(): string {
    return `Vegetarian rule: ${this.blockedCategories.join(', ')} ingredients are not allowed.`;
  }

  protected getRuleMessage(ingredient: Ingredient): string | null {
    if (this.blockedCategories.includes(ingredient.category)) {
      return `Cannot add ${ingredient.name}: category "${ingredient.category}" is blocked.`;
    }
    return null;
  }
}

export const recipeFromStored = (stored: StoredRecipe): Recipe => {
  let recipe: Recipe;

  if (stored.kind === 'vegetarian') {
    recipe = new VegetarianRecipe(stored.id, stored.name);
  } else {
    recipe = new Recipe(stored.id, stored.name, 'standard');
  }

  for (const item of stored.items) {
    recipe.addIngredient(item.ingredient, item.grams);
  }

  return recipe;
};
