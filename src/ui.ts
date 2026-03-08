import type { RecipeKind } from './models';
import { RecipeService } from './recipeService';
import { StorageService } from './storageService';
import { VegetarianRecipe } from './recipe';

export class UI {
  private readonly rootElement: HTMLElement;
  private readonly recipeService: RecipeService;
  private readonly storageService: StorageService;

  constructor(rootElement: HTMLElement, recipeService: RecipeService, storageService: StorageService) {
    this.rootElement = rootElement;
    this.recipeService = recipeService;
    this.storageService = storageService;
  }

  init(): void {
    this.renderPantry();
    this.renderRecipe();
    this.bindEvents();
  }

  private bindEvents(): void {
    const createButton = document.getElementById('createRecipeBtn') as HTMLButtonElement;
    const saveButton = document.getElementById('saveRecipeBtn') as HTMLButtonElement;
    const loadButton = document.getElementById('loadRecipeBtn') as HTMLButtonElement;
    const pantryBody = document.getElementById('pantryBody') as HTMLTableSectionElement;
    const recipeBody = document.getElementById('recipeBody') as HTMLTableSectionElement;

    createButton.addEventListener('click', () => {
      const nameInput = document.getElementById('recipeName') as HTMLInputElement;
      const typeInput = document.getElementById('recipeType') as HTMLSelectElement;
      const name = nameInput.value.trim();

      if (!name) {
        this.showWarning('Recipe name is required.');
        return;
      }

      const kind = typeInput.value as RecipeKind;
      const recipe = this.recipeService.createRecipe(name, kind);

      nameInput.value = '';
      this.showWarning(`Created recipe: ${recipe.name} (${recipe.id})`);
      this.renderRecipe();
    });

    pantryBody.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const ingredientId = target.dataset.ingredientId;
      if (!ingredientId) {
        return;
      }

      const gramsInput = document.getElementById(`grams-${ingredientId}`) as HTMLInputElement | null;
      let grams = 100;

      if (gramsInput) {
        grams = Number(gramsInput.value);
      }

      const result = this.recipeService.addIngredient(ingredientId, grams);

      if (result.ok) {
        this.showWarning('');
      } else {
        this.showWarning(result.message ?? 'Could not add ingredient.');
      }

      this.renderRecipe();
    });

    recipeBody.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const ingredientId = target.dataset.removeId;
      if (!ingredientId) {
        return;
      }

      this.recipeService.removeIngredient(ingredientId);
      this.renderRecipe();
    });

    recipeBody.addEventListener('change', (event) => {
      const target = event.target as HTMLElement;

      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      const ingredientId = target.dataset.ingredientId;
      if (!ingredientId) {
        return;
      }

      this.recipeService.updateIngredient(ingredientId, Number(target.value));
      this.renderRecipe();
    });

    saveButton.addEventListener('click', () => {
      this.handleSaveRecipe();
    });

    loadButton.addEventListener('click', () => {
      this.handleLoadRecipe();
    });
  }

  private handleSaveRecipe(): void {
    const recipe = this.recipeService.getCurrentRecipe();

    if (!recipe) {
      this.showWarning('Create a recipe before saving.');
      return;
    }

    this.storageService
      .saveRecipe(recipe)
      .then(() => {
        this.showWarning(`Saved recipe id: ${recipe.id}`);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          this.showWarning(error.message);
          return;
        }

        this.showWarning('Unable to save recipe.');
      });
  }

  private handleLoadRecipe(): void {
    const recipeIdInput = document.getElementById('loadRecipeId') as HTMLInputElement;
    const recipeId = recipeIdInput.value.trim();

    if (!recipeId) {
      this.showWarning('Enter a recipe id to load.');
      return;
    }

    this.storageService
      .loadRecipe(recipeId)
      .then((loaded) => {
        this.recipeService.setCurrentRecipe(loaded);
        this.showWarning(`Loaded recipe: ${loaded.name}`);
        this.renderRecipe();
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          this.showWarning(error.message);
          return;
        }

        this.showWarning('Unable to load recipe.');
      });
  }

  private renderPantry(): void {
    const pantryBody = document.getElementById('pantryBody') as HTMLTableSectionElement;
    pantryBody.innerHTML = '';

    const pantry = this.recipeService.getPantry();

    for (const ingredient of pantry) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ingredient.name}</td>
        <td>${ingredient.category}</td>
        <td>
          <input id="grams-${ingredient.id}" class="form-control form-control-sm" type="number" min="1" value="100" />
        </td>
        <td>
          <button class="btn btn-sm btn-primary" type="button" data-ingredient-id="${ingredient.id}">Add</button>
        </td>
      `;
      pantryBody.appendChild(row);
    }
  }

  private renderRecipe(): void {
    const recipeBody = document.getElementById('recipeBody') as HTMLTableSectionElement;
    const recipeId = document.getElementById('recipeId') as HTMLSpanElement;
    const totalCalories = document.getElementById('totalCalories') as HTMLSpanElement;
    const totalProtein = document.getElementById('totalProtein') as HTMLSpanElement;
    const totalCarbs = document.getElementById('totalCarbs') as HTMLSpanElement;
    const totalFat = document.getElementById('totalFat') as HTMLSpanElement;

    recipeBody.innerHTML = '';

    const recipe = this.recipeService.getCurrentRecipe();

    if (!recipe) {
      recipeId.textContent = '(none)';
      totalCalories.textContent = '0';
      totalProtein.textContent = '0';
      totalCarbs.textContent = '0';
      totalFat.textContent = '0';
      return;
    }

    recipeId.textContent = recipe.id;

    if (recipe instanceof VegetarianRecipe) {
      this.showWarning(recipe.getRuleDescription());
    }

    for (const item of recipe.getItems()) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.ingredient.name}</td>
        <td>
          <input
            class="form-control form-control-sm"
            data-ingredient-id="${item.ingredient.id}"
            type="number"
            min="0"
            value="${item.grams}"
          />
        </td>
        <td>
          <button class="btn btn-sm btn-danger" type="button" data-remove-id="${item.ingredient.id}">Remove</button>
        </td>
      `;
      recipeBody.appendChild(row);
    }

    const totals = recipe.getTotals();
    totalCalories.textContent = totals.calories.toFixed(1);
    totalProtein.textContent = totals.protein.toFixed(1);
    totalCarbs.textContent = totals.carbs.toFixed(1);
    totalFat.textContent = totals.fat.toFixed(1);
  }

  private showWarning(message: string): void {
    const warningElement = this.rootElement.querySelector<HTMLOutputElement>('#warning');

    if (!warningElement) {
      return;
    }

    warningElement.textContent = message;
  }
}
