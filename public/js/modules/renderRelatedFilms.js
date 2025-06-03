import { formatDuration } from "./formatDuration.js";

export async function renderGridFilms(data, node) {
    data.forEach((movie) => {
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

}