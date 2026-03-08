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

  async listRecipes(): Promise<StoredRecipe[]> {
    const allRecipes = await this.readAllRecipes();
    return Object.values(allRecipes);
  }

  async deleteRecipe(recipeId: string): Promise<boolean> {
    const allRecipes = await this.readAllRecipes();

    if (!(recipeId in allRecipes)) {
      return false;
    }

    delete allRecipes[recipeId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allRecipes));
    return true;
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
