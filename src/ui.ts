import type { RecipeKind, StoredRecipe } from './models';
import { RecipeService } from './recipeService';
import { StorageService } from './storageService';

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
    const openSavedRecipesButton = document.getElementById('openSavedRecipesBtn') as HTMLButtonElement;
    const pantryBody = document.getElementById('pantryBody') as HTMLTableSectionElement;
    const recipeBody = document.getElementById('recipeBody') as HTMLTableSectionElement;
    const savedRecipesList = document.getElementById('savedRecipesList') as HTMLUListElement;

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

    openSavedRecipesButton.addEventListener('click', () => {
      this.renderSavedRecipes();
    });

    savedRecipesList.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const recipeId = target.dataset.recipeId;
      const action = target.dataset.action;

      if (!recipeId || !action) {
        return;
      }

      if (action === 'load') {
        this.handleLoadRecipe(recipeId);
      }

      if (action === 'delete') {
        this.handleDeleteRecipe(recipeId);
      }

      if (action === 'info') {
        this.handleRecipeInfo(recipeId);
      }
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
        this.renderSavedRecipes();
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          this.showWarning(error.message);
          return;
        }

        this.showWarning('Unable to save recipe.');
      });
  }

  private handleLoadRecipe(recipeId: string): void {
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

  private handleDeleteRecipe(recipeId: string): void {
    this.storageService
      .deleteRecipe(recipeId)
      .then((deleted) => {
        if (!deleted) {
          this.showWarning(`Recipe ${recipeId} was not found.`);
          return;
        }

        this.showWarning(`Deleted recipe: ${recipeId}`);
        this.renderSavedRecipes();
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          this.showWarning(error.message);
          return;
        }

        this.showWarning('Unable to delete recipe.');
      });
  }

  private handleRecipeInfo(recipeId: string): void {
    const modalTitle = document.getElementById('recipeInfoModalLabel') as HTMLHeadingElement | null;
    const modalBody = document.getElementById('recipeInfoBody') as HTMLDivElement | null;

    if (!modalTitle || !modalBody) {
      this.showWarning('Recipe info modal is not available.');
      return;
    }

    this.storageService
      .listRecipes()
      .then((recipes: StoredRecipe[]) => {
        const recipe = recipes.find((item) => item.id === recipeId);

        if (!recipe) {
          modalTitle.textContent = 'Recipe Nutrition Facts';
          modalBody.textContent = 'Recipe not found.';
          return;
        }

        let calories = 0;
        let protein = 0;
        let carbs = 0;
        let fat = 0;
        let totalGrams = 0;

        for (const item of recipe.items) {
          const factor = item.grams / 100;
          calories += item.ingredient.nPer100g.calories * factor;
          protein += item.ingredient.nPer100g.protein * factor;
          carbs += item.ingredient.nPer100g.carbs * factor;
          fat += item.ingredient.nPer100g.fat * factor;
          totalGrams += item.grams;
        }

        const roundedCalories = Math.round(calories);
        const roundedProtein = Math.round(protein * 10) / 10;
        const roundedCarbs = Math.round(carbs * 10) / 10;
        const roundedFat = Math.round(fat * 10) / 10;
        const fatPercent = Math.round((fat / 78) * 100);
        const carbsPercent = Math.round((carbs / 275) * 100);
        const proteinPercent = Math.round((protein / 50) * 100);

        modalTitle.textContent = `${recipe.name} Nutrition Facts`;
        modalBody.innerHTML = `
          <div class="nutrition-label">
            <div class="nf-title">Nutrition Facts</div>
            <div class="nf-serving">Recipe: ${recipe.name}</div>
            <div class="nf-serving">Total recipe weight: ${totalGrams.toFixed(0)} g</div>
            <div class="nf-serving nf-thick-line">Servings per recipe: 1</div>

            <div class="nf-amount">Amount Per Serving</div>
            <div class="nf-calories-row">
              <span>Calories</span>
              <span>${roundedCalories}</span>
            </div>

            <div class="nf-dv-header">% Daily Value*</div>
            <div class="nf-row"><span><strong>Total Fat</strong> ${roundedFat}g</span><span><strong>${fatPercent}%</strong></span></div>
            <div class="nf-row"><span><strong>Total Carbohydrate</strong> ${roundedCarbs}g</span><span><strong>${carbsPercent}%</strong></span></div>
            <div class="nf-row nf-thin-line"><span><strong>Protein</strong> ${roundedProtein}g</span><span><strong>${proteinPercent}%</strong></span></div>

            <div class="nf-footnote">* Percent Daily Values are based on a 2,000 calorie diet.</div>
          </div>
        `;
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          this.showWarning(error.message);
          return;
        }

        this.showWarning('Unable to load recipe info.');
      });
  }

  private renderSavedRecipes(): void {
    const savedRecipesList = document.getElementById('savedRecipesList') as HTMLUListElement;

    this.storageService
      .listRecipes()
      .then((recipes) => {
        savedRecipesList.innerHTML = '';

        if (recipes.length === 0) {
          const empty = document.createElement('li');
          empty.className = 'list-group-item text-muted';
          empty.textContent = 'No saved recipes yet.';
          savedRecipesList.appendChild(empty);
          return;
        }

        for (const recipe of recipes) {
          const row = document.createElement('li');
          row.className = 'list-group-item d-flex justify-content-between align-items-start gap-2';
          row.innerHTML = `
            <div>
              <div><strong>${recipe.name}</strong></div>
              <small class="text-muted">${recipe.kind} • ${recipe.items.length} item(s)</small><br>
              <small class="text-muted">${recipe.id}</small>
            </div>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-primary" type="button" data-action="load" data-recipe-id="${recipe.id}">Load</button>
              <button
                class="btn btn-sm btn-outline-secondary"
                type="button"
                data-action="info"
                data-recipe-id="${recipe.id}"
                data-bs-toggle="modal"
                data-bs-target="#recipeInfoModal"
              >
                Info
              </button>
              <button class="btn btn-sm btn-outline-danger" type="button" data-action="delete" data-recipe-id="${recipe.id}">Delete</button>
            </div>
          `;
          savedRecipesList.appendChild(row);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          this.showWarning(error.message);
          return;
        }

        this.showWarning('Unable to read saved recipes.');
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
        <td>${ingredient.nPer100g.calories}</td>
        <td>${ingredient.nPer100g.protein}</td>
        <td>${ingredient.nPer100g.carbs}</td>
        <td>${ingredient.nPer100g.fat}</td>
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
