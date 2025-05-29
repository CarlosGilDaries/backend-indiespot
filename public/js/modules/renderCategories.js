import { getVideoContent } from './getVideoContent.js';

export function renderCategories(main, categoriesData, backendURL) {
	categoriesData.categories.forEach((category) => {
		if (category.priority != 1) {
			const content = category.contents;
			const section = document.createElement('section');
			section.setAttribute('data-index', category.priority);
			section.classList.add('category', 'content-type');
			section.innerHTML = `
                            <h2 class="category-title" id="title-${category.priority}">${category.name}</h2>
                            <div class="content-wrapper">
                                <button class="scroll-left">&lt;</button>
                                <div id="video-content-${category.priority}" class="content-container"></div>
                                <button class="scroll-right">&gt;</button>
                            </div>
                            `;
			main.appendChild(section);
			const node = document.getElementById(
				`video-content-${category.priority}`
			);

			getVideoContent(content, node, backendURL);
		}
	});
}
