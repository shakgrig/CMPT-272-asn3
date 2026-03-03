## Overview

In this assignment, you will build a small TypeScript application that lets a user create recipes from a pantry of ingredients and automatically calculates nutrition totals (calories, protein, carbs, fat). Users can add and remove ingredients from a recipe, adjust quantities, and see totals update immediately.

Your application must also support saving and loading recipes asynchronously using a Promise-based service.

We will be using the TypeScript language features (types, interfaces, classes, inheritance, and modules) and a clean program structure as discussed in the lecture.

## Learning Objectives

At the end of this assignment, you will be able to:

- Model structured data using TypeScript **interfaces** and **type aliases**
- Implement application logic with **classes**
- Use **inheritance** to share behaviour between related classes
- Apply union types and type narrowing for safe logic
- Use **Promise** to handle asynchronous save/load operations
- Organize a TypeScript project using modules (`import` / `export`)

## Language/Library Constraints

### Allowed

- HTML5
- CSS3
- Bootstrap
- TypeScript (compiled to JavaScript for web)

### Not Allowed

- CSS frameworks (e.g., Tailwind) or preprocessors (e.g., SASS)
- Frontend JavaScript libraries or Frameworks (e.g., React, Vue, Angular)

## Site Requirements

### 1. Pantry (Ingredient Catalog)

Your application must include a built-in pantry list of at least **10 ingredients** (and can be hardcoded). Each ingredient includes the following properties:

- id
- name
- nutrition per 100g (calories, protein, carbs, fat)
- category (e.g., protein, vegetable, grain, dairy, spice)

The pantry is the source ingredients that users can add to recipes.

### 2. Recipe Builder

Users can:

- Create a new recipe (name required)
- Add an ingredient from the pantry to the recipe
- Set the amount (in grams) for each ingredient
- Remove an ingredient from the recipe
- See nutrition totals update whenever the recipe changes

**Nutrition totals** must include:

- Total calories
- Total protein
- Total carbs
- Total fat

Assume nutrition values are provided _per 100g_, and scale accordingly. A list of common ingredients and their nutrition can be found at: [https://natureclaim.com/nutrition/ <svg viewbox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" style="width:1em; height:1em; vertical-align:middle; fill:currentColor"><path d="M1226.667 267c88.213 0 160 71.787 160 160v426.667H1280v-160H106.667v800C106.667 1523 130.56 1547 160 1547h1066.667c29.44 0 53.333-24 53.333-53.333v-213.334h106.667v213.334c0 88.213-71.787 160-160 160H160c-88.213 0-160-71.787-160-160V427c0-88.213 71.787-160 160-160Zm357.706 442.293 320 320c20.8 20.8 20.8 54.614 0 75.414l-320 320-75.413-75.414 228.907-228.906H906.613V1013.72h831.254L1508.96 784.707l75.413-75.414Zm-357.706-335.626H160c-29.44 0-53.333 24-53.333 53.333v160H1280V427c0-29.333-23.893-53.333-53.333-53.333Z" fill-rule="evenodd"></path></svg>](https://natureclaim.com/nutrition/).

### 3. Categories using Inheritance

Your design must include **inheritance**. As an example (and only as an example), you may create a base class `Recipe`. Then, create subclasses that extend `Recipe` for specific categories of recipes, such as:

- `VegetarianRecipe`
- `HighProteinRecipe`
- `LowCarbRecipe`
- etc.

The subclass must add at least one rule or behaviour, for example:

- VegetarianRecipe: cannot add ingredients from category `"meat"`
- HighProteinRecipe: cannot contain a protein ratio below a certain threshold
- LowCarbRecipe: caps total carbs or raises a warning when above threshold

You may choose any rule, but it must be implemented in the subclasses. There must be extra attributes and methods in the subclasses. For an extra challenge, how would you implement _multiple inheritance_ (e.g., a recipe that is both vegetarian and low-carb)?

### 4. Asynchronous Save/Load (Promise Requirement)

You must support saving and loading recipes through an asynchronous API. You may implement this using local storage. The minimum required functions:

- `saveRecipe(recipe): Promise<void>`
- `loadRecipe(recipeId): Promise<Recipe>`

The functions must return Promises and be used with `async/await`.

## TypeScript Requirements

In addition to the described featurs, your project must use ALL of the following:

### A. Interfaces

Use interfaces to define the shape of data objects, such as:

- `Ingredient`
- `Nutrition`
- `RecipeItem` (ingredient + grams)

### B. Type Aliases

Define at least one **type alias**, such as:

- `type IngredientId = string;`
- or a union type:
  - `type Category = "meat" | "vegetable" | "grain" | "dairy" | "spice";`

### C. Classes and Inheritance

Use classes for your application logic, such as:

- `Recipe`
- `RecipeService`
- `StorageService`

At least one class must **extend** another class and override or restrict behavior.

### D. Modules and Imports

Organize your code into multiple files and use `import` / `export` to share code between them. Use a modern TypeScript application structure (e.g., `src/` folder with separate files for models, services, and main application logic). See slide 55 and the sample code from lecture for examples of how to structure a TypeScript project with modules.

### E. Promises

Use `Promise<T>` for asynchronous operations (e.g., saving/loading recipes). Use `async/await` syntax to handle these operations in your code.

### F. Strict TypeScript

Your project must compile under:

- `"strict": true`
- No implicit `any`

## Suggested UI

You may implement a simple web UI using:

- basic HTML/CSS (or Bootstrap optional)
- TypeScript

Suggested layout, but please be as creative as you'd like:

- Pantry table (ingredient list + “Add” button)
- Recipe table (current ingredients + grams), might be a good idea to be able to delete an ingredient.
- Totals panel (calories, protein, carbs, fat)
- Save / Load buttons
- warning section (e.g., “Vegetarian recipe cannot contain meat”)

## Deliverables

Submit:

1. All `.ts` source files
2. `tsconfig.json`
3. `package.json`
4. `index.html` (if web-based)
5. A short `README.md` including:
   - Features implemented
   - Any assumptions
   - AI usage
6. A ZIP file containing all of the above. **Do not include `node_modules` or compiled JavaScript files.**

## Marking Rubric

### Functionality (10 marks)

- Pantry loads and displays correctly
- Add/remove ingredient works
- Gram updates work
- Totals are correct

### TypeScript Modelling (3 marks)

- Proper interfaces and type aliases
- Minimal use of type assertions (`as`)
- No implicit `any`
- Uses union types/narrowing appropriately

### OOP Design (4 marks)

- Classes used appropriately
- Inheritance is meaningful (not cosmetic)
- Clear separation of responsibilities (e.g., services vs UI)

### Async / Promises (3 marks)

- Save/load uses Promise-based API
- Used with async/await correctly
- Handles failure (e.g., missing recipe id)

### Code Organization (3 marks)

- Modules (`import/export`) used
- Clear file structure and naming as discussed in lecture
- Code is well-commented and readable

### Effort and Creativity (2 Marks)

- No broken Workflows, make sure the app is usable and learnable.
- You are free to add other small features that you, as a user, may want.

### Total: 25 marks

## Marking TA

| Last Name |  | Marking TA |
|-----------|--|------------|
| A - L     |  | Mariia     |
| M - Z     |  | Mansi      |

## Demo

You are free to use any layout you'd like. Here's **one possible **UI (try to come up with another):

<video id="videoPlayer" controlslist="nofullscreen nodownload" controls>
  <source src="assets/as3.mp4" type="video/mp4"></source>
</video>

[](https://github.com/user-attachments/assets/d46a7840-cca8-46d4-83d2-43548914acbc)

<!-- [mp4-alt-backup](https://github.com/user-attachments/assets/7f319ec5-0230-41df-9181-cb3fdcb32385) -->

## Academic Integrity

You may discuss ideas, but all code/design must be your own. You are allowed to use AI tools (e.g., ChatGPT, GitHub Copilot) to help with coding, debugging, or generating ideas. However, **you must clearly document any AI assistance in your README**, specifying what parts were influenced or generated by AI. Failure to do so may be considered a violation of academic integrity policies.

<details open>
<summary>View Rubric</summary>

| **Asn3**                                                                                                                                                                                                     |                                               |                 |
|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|----------------:|
| **Criteria**                                                                                                                                                                                                 | Ratings                                       |             Pts |
| Proper implementation of each of the functionality requirements<ul><li>Pantry loads and displays correctly</li><li>Add/remove ingredient works</li><li>Gram updates work</li><li>Totals are correct</li><ul> | 10 pts<br>Full Marks<br><hr>0 pts<br>No Marks |        / 10 pts |
| TypeScript Modelling<ul><li>Proper interfaces and type aliases</li><li>Minimal use of type assertions (as)</li><li>No implicit any</li><li>Uses union types/narrowing appropriately</li><ul>                 | 3 pts<br>Full Marks<br><hr>0 pts<br>No Marks  |         / 3 pts |
| Code Organization<ul><li>Modules (import/export) used</li><li>Clear file structure and naming as discussed in lecture</li><li>Code is well-commented and readable</li><ul>                                   | 3 pts<br>Full Marks<br><hr>0 pts<br>No Marks  |         / 3 pts |
| Async / Promises<ul><li>Save/load uses Promise-based API</li><li>Used with async/await correctly</li><li>Handles failure (e.g., missing recipe id)</li><ul>                                                  | 3 pts<br>Full Marks<br><hr>0 pts<br>No Marks  |         / 3 pts |
| OOP Design<ul><li>Classes used appropriately</li><li>Inheritance is meaningful (not cosmetic)</li><li>Clear separation of responsibilities (e.g., services vs UI)</li><ul>                                   | 4 pts<br>Full Marks<br><hr>0 pts<br>No Marks  |         / 4 pts |
| Effort and Creativity<ul><li>No broken Workflows, make sure the app is usable and learnable.</li><li>You are free to add other small features that you, as a user, may want.</li><ul>                        | 2 pts<br>Full Marks<br><hr>0 pts<br>No Marks  |         / 2 pts |
|                                                                                                                                                                                                              |                                               | Total Points: 0 |

</details>

## Non-Instructional Notes Section

I acknowledge that I used AI for X.

## Author

[Peter Iliopoulos, 301660766](https://github.sfu.ca/pai)

<!-- Best I can do to hide on GitHub, but still apply locally -->

<details hidden><summary></summary><style>code:not(:has(span)){color:red;}</style></details>

![Static Badge](https://img.shields.io/badge/temp-for_later-purple?colorA=white)
