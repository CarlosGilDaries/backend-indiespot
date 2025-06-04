import { formatDuration } from "./formatDuration.js";

export function setupSearch() {
    const searchIcon = document.querySelector(".search-icon");
    const searchInputContainer = document.querySelector(".search-input");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const mainGrid = document.querySelector(".main-grid");
    const gridTitle = document.querySelector(".grid-title");

    // Alternar visibilidad del input de búsqueda
    searchIcon.addEventListener("click", () => {
        searchInputContainer.classList.toggle("hidden");
    });

    // Función para buscar películas
    async function searchMovies(query) {
        try {
            const response = await fetch(
                `/api/search?query=${encodeURIComponent(query)}`
            );
            if (!response.ok) throw new Error("Error en la búsqueda");

            const data = await response.json();
            renderMovies(data.results);
        } catch (error) {
            console.error("Error:", error);
            mainGrid.innerHTML = "<p>Error al realizar la búsqueda</p>";
        }
    }

    // Función para renderizar películas
    function renderMovies(movies) {
        mainGrid.innerHTML = "";
        gridTitle.textContent = `Resultados para "${searchInput.value}"`;

        if (movies.length === 0) {
            mainGrid.innerHTML = "<p>No se encontraron películas</p>";
            return;
        }

        movies.forEach((movie) => {
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
            mainGrid.append(article);
        });
    }

    // Buscar al hacer click en el botón
    searchButton.addEventListener("click", () => {
        if (searchInput.value.trim()) {
            searchMovies(searchInput.value.trim());
        }
    });

    // Buscar al presionar Enter
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && searchInput.value.trim()) {
            searchMovies(searchInput.value.trim());
        }
    });
}
