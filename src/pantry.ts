import type { Ingredient } from './models';

// Built-in pantry list (hardcoded)
export const pantry: Ingredient[] = [
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    category: 'meat',
    nPer100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  },
  { id: 'tofu', name: 'Tofu', category: 'protein', nPer100g: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8 } },
  { id: 'egg', name: 'Egg', category: 'protein', nPer100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11 } },
  {
    id: 'rice',
    name: 'Rice (Cooked)',
    category: 'grain',
    nPer100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  },
  { id: 'oats', name: 'Oats', category: 'grain', nPer100g: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 } },
  {
    id: 'broccoli',
    name: 'Broccoli',
    category: 'vegetable',
    nPer100g: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
  },
  {
    id: 'spinach',
    name: 'Spinach',
    category: 'vegetable',
    nPer100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  },
  { id: 'milk', name: 'Milk (2%)', category: 'dairy', nPer100g: { calories: 50, protein: 3.3, carbs: 4.8, fat: 2 } },
  {
    id: 'cheddar',
    name: 'Cheddar Cheese',
    category: 'dairy',
    nPer100g: { calories: 403, protein: 25, carbs: 1.3, fat: 33 },
  },
  {
    id: 'olive-oil',
    name: 'Olive Oil',
    category: 'spice',
    nPer100g: { calories: 884, protein: 0, carbs: 0, fat: 100 },
  },
];
