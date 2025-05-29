import { addScrollFunctionality } from "./addScrollFunctionality.js";

export function getVideoContent(data, node, backendURL) {
    const videos = new Set();

    data.forEach((video) => {
        const article = document.createElement("article");
        article.classList.add("content");

        const link = document.createElement("a");
        link.href = `/content/${video.slug}`;

        const img = document.createElement("img");
        img.src = backendURL + video.cover;

        link.append(img);
        article.append(link);
        node.append(article);
    });

    const exampleImg = node.querySelector("img");
    const scrollWidth = parseFloat(getComputedStyle(exampleImg).width) * 1.06;

    addScrollFunctionality(node, scrollWidth);
}
