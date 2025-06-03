import { dropDownTypeMenu } from "./modules/dropDownTypeMenu.js";
import { setupLoginSignupButtons } from "./modules/loginSignupButtons.js";
import { formatDuration } from "./modules/formatDuration.js";

const categoriesDropDown = document.getElementById("categories");
const gendersDropDown = document.getElementById("genders");
const title = document.querySelector(".grid-title");
const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get("id");

dropDownTypeMenu(categoriesDropDown, "categories", "category");
dropDownTypeMenu(gendersDropDown, "genders", "gender");

try {
    const response = await fetch(`/api/category/${categoryId}`);
    const data = await response.json();
    title.innerHTML = data.category.name;
    document.title = data.category.name;
    const node = document.querySelector(".main-grid");

    data.category.contents.forEach((movie) => {
        const article = document.createElement("article");
        article.classList.add("content");

        const link = document.createElement("a");
        link.href = `/content/${movie.slug}`;

        const img = document.createElement("img");
        img.src = movie.cover;
        link.append(img);

        const info = document.createElement("a");
        info.href = `/content/${movie.slug}`;
        info.classList.add("info");

        const title = document.createElement("h3");
        title.textContent = movie.title;

        const gender = document.createElement("p");
        gender.textContent = `${movie.gender.name}`;

        const duration = document.createElement("p");
        const formatedDuration = formatDuration(movie.duration);
        duration.textContent = `${formatedDuration}`;

        info.append(title, gender, duration);
        article.append(link, info);
        node.append(article);
    });

    setupLoginSignupButtons();
} catch (error) {
    console.log(error);
}
