

export async function renderSimilars(content, token) {
	const response = await fetch(`/api/gender/${content.gender_id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await response.json();
	const similars = document.getElementById('similar');

	data.gender.contents.forEach((movie) => {
		if (movie.id != content.id) {
			const article = document.createElement('article');
			article.classList.add('content');

			const link = document.createElement('a');
			link.href = `/content/${movie.slug}`;

			const img = document.createElement('img');
			img.src = movie.cover;

			link.append(img);
			article.append(link);
			similars.append(article);
		}
	});
}