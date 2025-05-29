import { dropDownTypeMenu } from './modules/dropDownTypeMenu.js';
import { fixMenuWhenScrollling } from "./modules/fixMenuWhenScrolling.js";

const categoriesDropDown = document.getElementById('categories');
const gendersDropDown = document.getElementById('genders');
const title = document.querySelector('.grid-title');
const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('id');

dropDownTypeMenu(categoriesDropDown, 'categories', 'category');
dropDownTypeMenu(gendersDropDown, 'genders', 'gender');


try {
    const response = await fetch(`/api/category/${categoryId}`);
    const data = await response.json();
    title.innerHTML = data.category.name;
    document.title = data.category.name;
    const node = document.querySelector('.main-grid');

    data.category.contents.forEach((movie) => {
        const article = document.createElement('article');
        article.classList.add('content');

        const link = document.createElement('a');
        link.href = `/content/${movie.slug}`;

        const img = document.createElement('img');
        img.src = movie.cover;

        link.append(img);
        article.append(link);
        node.append(article);
    });

    fixMenuWhenScrollling();


} catch(error) {
    console.log(error);
}