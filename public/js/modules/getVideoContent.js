import { addScrollFunctionality } from "./addScrollFunctionality.js";
import { formatDuration } from "./formatDuration.js";

export function getVideoContent(data, node) {
    data.forEach((video) => {
        const article = document.createElement("article");
        article.classList.add("content");

        const link = document.createElement("a");
        link.href = `/content/${video.slug}`;

        const img = document.createElement("img");
        img.src = video.cover;
        link.append(img);

        const info = document.createElement("a");
        info.href = `/content/${video.slug}`;
        info.classList.add("info");

        const title = document.createElement("h3");
        title.textContent = video.title;

        const gender = document.createElement("p");
        gender.textContent = `${video.gender.name}`;

        const duration = document.createElement("p");
        const formatedDuration = formatDuration(video.duration);
        duration.textContent = `${formatedDuration}`;

        info.append(title, gender, duration);

        article.append(link, info);
        node.append(article);
    });

    const exampleImg = node.querySelector("img");
    const scrollWidth = parseFloat(getComputedStyle(exampleImg).width) * 1.06;
    addScrollFunctionality(node, scrollWidth);
}

