import type { RecipeKind } from './models';
import { RecipeService } from './recipeService';
import { StorageService } from './storageService';
import { VegetarianRecipe } from './recipe';

export class UI {
  private readonly rootElement: HTMLDivElement;
  private readonly recipeService: RecipeService;
  private readonly storageService: StorageService;

  constructor(rootElement: HTMLDivElement, recipeService: RecipeService, storageService: StorageService) {
    this.rootElement = rootElement;
    this.recipeService = recipeService;
    this.storageService = storageService;
  }

  init(): void {
    this.renderLayout();
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

  private renderLayout(): void {
    this.rootElement.innerHTML = `
      <div class="container py-4">
        <h1 class="h3 mb-3">Recipe Builder</h1>

        <div class="row g-3 align-items-end mb-4">
          <div class="col-md-4">
            <label for="recipeName" class="form-label">Recipe Name</label>
            <input id="recipeName" class="form-control" type="text" placeholder="My Recipe" />
          </div>
          <div class="col-md-3">
            <label for="recipeType" class="form-label">Recipe Type</label>
            <select id="recipeType" class="form-select">
              <option value="standard">Standard</option>
              <option value="vegetarian">Vegetarian</option>
            </select>
          </div>
          <div class="col-md-3">
            <button id="createRecipeBtn" class="btn btn-primary w-100" type="button">Create Recipe</button>
          </div>
        </div>

        <div id="warning" class="alert alert-secondary py-2" role="status"></div>

        <div class="row g-4 mt-1">
          <div class="col-lg-6">
            <h2 class="h5">Pantry</h2>
            <table class="table table-sm table-striped">
              <thead>
                <tr><th>Ingredient</th><th>Category</th><th>Grams</th><th></th></tr>
              </thead>
              <tbody id="pantryBody"></tbody>
            </table>
          </div>

          <div class="col-lg-6">
            <h2 class="h5">Recipe Items</h2>
            <table class="table table-sm table-bordered">
              <thead>
                <tr><th>Ingredient</th><th>Grams</th><th></th></tr>
              </thead>
              <tbody id="recipeBody"></tbody>
            </table>

            <div class="card p-3">
              <div><strong>Calories:</strong> <span id="totalCalories">0</span></div>
              <div><strong>Protein:</strong> <span id="totalProtein">0</span> g</div>
              <div><strong>Carbs:</strong> <span id="totalCarbs">0</span> g</div>
              <div><strong>Fat:</strong> <span id="totalFat">0</span> g</div>
              <div class="mt-2"><strong>Recipe ID:</strong> <span id="recipeId">(none)</span></div>
            </div>

            <div class="row g-2 mt-2">
              <div class="col-md-4">
                <button id="saveRecipeBtn" class="btn btn-success w-100" type="button">Save</button>
              </div>
              <div class="col-md-4">
                <input id="loadRecipeId" class="form-control" type="text" placeholder="recipe id" />
              </div>
              <div class="col-md-4">
                <button id="loadRecipeBtn" class="btn btn-outline-primary w-100" type="button">Load</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
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
    const warningElement = this.rootElement.querySelector<HTMLDivElement>('#warning');

    if (!warningElement) {
      return;
    }

    warningElement.textContent = message;
  }
}
