// Shared data models

export type Category = 'meat' | 'protein' | 'vegetable' | 'grain' | 'dairy' | 'spice';

export type RecipeKind = 'standard' | 'vegetarian';

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category: Category;
  nutritionPer100g: Nutrition;
}

export interface RecipeItem {
  ingredient: Ingredient;
  grams: number;
}

export interface StoredRecipe {
  id: string;
  name: string;
  kind: RecipeKind;
  items: RecipeItem[];
}
