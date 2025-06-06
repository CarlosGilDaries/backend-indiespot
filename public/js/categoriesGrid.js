import { renderTypeGrid } from './modules/renderTypeGrid.js';
import { dropDownTypeMenu } from './modules/dropDownTypeMenu.js';
import { fixMenuWhenScrollling } from "./modules/fixMenuWhenScrolling.js";
import { setupLoginSignupButtons } from './modules/loginSignupButtons.js';

const categoriesDropDown = document.getElementById('categories');
const gendersDropDown = document.getElementById('genders');

dropDownTypeMenu(categoriesDropDown, 'categories', 'category');
dropDownTypeMenu(gendersDropDown, 'genders', 'gender');

const categoriesResponse = await fetch('/api/categories');
const categoriesData = await categoriesResponse.json();

renderTypeGrid('/api/categories', 'categories', 'category');

fixMenuWhenScrollling();
setupLoginSignupButtons();
