import './style.css';
import { RecipeService } from './recipeService';
import { StorageService } from './storageService';
import { UI } from './ui';

const rootElement = document.querySelector<HTMLDivElement>('#app');

if (!rootElement) {
  throw new Error('Missing #app root element.');
}

const recipeService = new RecipeService();
const storageService = new StorageService();
const app = new UI(rootElement, recipeService, storageService);

app.init();
