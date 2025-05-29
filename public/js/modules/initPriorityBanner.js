export function initPriorityBanner(categoriesData) {
	try {
		// Encontrar la categoría con priority 1
		const priorityCategory = categoriesData.categories.find(cat => cat.priority === 1);
		if (!priorityCategory || !priorityCategory.contents || priorityCategory.contents.length === 0) {
			console.warn('No se encontraron películas en la categoría prioritaria');
			return;
		}

		const bannerSection = document.querySelector('.background-banner.priority-first');
		const videoElement = bannerSection.querySelector('video');
		const sourceElement = videoElement.querySelector('source');
		const titleElement = bannerSection.querySelector('.priority-first-movie-title');
		const playButton = bannerSection.querySelector('.play-button');
		const movieInfo = bannerSection.querySelector('.movie-info');

		let currentMovieIndex = 0;
		const movies = priorityCategory.contents;
		let isTransitioning = false; // Bandera para evitar interrupciones

		// Función para cargar una película con transición
		async function loadMovie(index) {
			if (isTransitioning) return;
			isTransitioning = true;

			const movie = movies[index];

			// Fade out del contenido actual
			movieInfo.classList.add('title-transition');
			titleElement.style.opacity = '0';
			videoElement.style.opacity = '0';

			// Esperar a que complete la transición de salida
			await new Promise(resolve => setTimeout(resolve, 200));

			// Actualizar contenido
			titleElement.textContent = movie.title;
			playButton.onclick = () => window.location.href = `/content/${movie.slug}`;

			if (movie.trailer) {
				videoElement.poster = "";
				sourceElement.src = movie.trailer;
				videoElement.load();

				// Manejar autoplay con mejor control de errores
				const playPromise = videoElement.play();

				if (playPromise !== undefined) {
					playPromise.catch(e => {
						console.log('Autoplay bloqueado:', e);
						videoElement.poster = movie.cover;
						videoElement.pause();
					}).finally(() => {
						videoElement.style.display = 'block';
					});
				}
			} else {
				videoElement.poster = movie.cover;
				videoElement.pause();
				sourceElement.removeAttribute('src');
				videoElement.load();
			}

			// Fade in del nuevo contenido
			await new Promise(resolve => setTimeout(resolve, 50)); // Pequeña pausa
			titleElement.style.opacity = '1';
			videoElement.style.opacity = '1';

			// Resetear estado de transición después de completar
			setTimeout(() => {
				movieInfo.classList.remove('title-transition');
				isTransitioning = false;
			}, 500);
		}

		// Configurar flechas de navegación
		const leftArrow = document.createElement('button');
		leftArrow.className = 'scroll-left-banner';
		leftArrow.innerHTML = '&lt;';

		const rightArrow = document.createElement('button');
		rightArrow.className = 'scroll-right-banner';
		rightArrow.innerHTML = '&gt;';

		// Añadir flechas al DOM
		bannerSection.appendChild(leftArrow);
		bannerSection.appendChild(rightArrow);

		// Eventos de flechas con manejo de transición
		leftArrow.addEventListener('click', () => {
			currentMovieIndex = (currentMovieIndex - 1 + movies.length) % movies.length;
			loadMovie(currentMovieIndex);
		});

		rightArrow.addEventListener('click', () => {
			currentMovieIndex = (currentMovieIndex + 1) % movies.length;
			loadMovie(currentMovieIndex);
		});

		// Estilos iniciales para la transición
		videoElement.style.transition = 'opacity 0.5s ease-in-out';
		titleElement.style.transition = 'opacity 0.2s ease-in-out';

		// Cargar la primera película
		loadMovie(0);
	} catch(error) {
		console.log(error);
	}
}