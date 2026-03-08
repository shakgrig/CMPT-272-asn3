import type { Ingredient, RecipeKind } from './models';
import { pantry } from './pantry';
import { Recipe, VegetarianRecipe } from './recipe';

export class RecipeService {
  private currentRecipe: Recipe | null = null;
  private readonly pantryItems: Ingredient[] = pantry;

  createRecipe(name: string, kind: RecipeKind): Recipe {
    const id = `recipe-${Date.now()}`;

    if (kind === 'vegetarian') {
      this.currentRecipe = new VegetarianRecipe(id, name);
    } else {
      this.currentRecipe = new Recipe(id, name, 'standard');
    }

    return this.currentRecipe;
  }

  getCurrentRecipe(): Recipe | null {
    return this.currentRecipe;
  }

  setCurrentRecipe(recipe: Recipe): void {
    this.currentRecipe = recipe;
  }

  getPantry(): Ingredient[] {
    return [...this.pantryItems];
  }

  addIngredient(ingredientId: string, grams: number): { ok: boolean; message?: string } {
    if (!this.currentRecipe) {
      return { ok: false, message: 'Create a recipe first.' };
    }

    const ingredient = this.pantryItems.find((item) => item.id === ingredientId);
    if (!ingredient) {
      return { ok: false, message: 'Ingredient not found in pantry.' };
    }

    return this.currentRecipe.addIngredient(ingredient, grams);
  }

  updateIngredient(ingredientId: string, grams: number): boolean {
    if (!this.currentRecipe) {
      return false;
    }

    return this.currentRecipe.updateIngredientGrams(ingredientId, grams);
  }

  removeIngredient(ingredientId: string): void {
    if (!this.currentRecipe) {
      return;
    }

    this.currentRecipe.removeIngredient(ingredientId);
  }
}
