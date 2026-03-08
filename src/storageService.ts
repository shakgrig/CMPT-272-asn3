import { recipeFromStored } from './recipe';
import type { Recipe } from './recipe';
import type { StoredRecipe } from './models';

const STORAGE_KEY = 'saved_recipes';

export class StorageService {
  async saveRecipe(recipe: Recipe): Promise<void> {
    const allRecipes = await this.readAllRecipes();
    allRecipes[recipe.id] = recipe.toStoredRecipe();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allRecipes));
  }

  async loadRecipe(recipeId: string): Promise<Recipe> {
    const allRecipes = await this.readAllRecipes();
    const storedRecipe = allRecipes[recipeId];

    if (!storedRecipe) {
      throw new Error(`Recipe with id "${recipeId}" was not found.`);
    }

    return recipeFromStored(storedRecipe);
  }

  private async readAllRecipes(): Promise<Record<string, StoredRecipe>> {
    return this.getAllRecipes();
  }

  private getAllRecipes(): Record<string, StoredRecipe> {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw) as Record<string, StoredRecipe>;
    } catch {
      return {};
    }
  }
}
