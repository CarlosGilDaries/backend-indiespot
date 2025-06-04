import { renderGridFilms } from "./renderRelatedFilms.js";

export async function renderSimilars(content, token) {
    const response = await fetch(`/api/gender/${content.gender_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    const similars = document.getElementById("similar");

    // Filtrar las películas para excluir la película actual
    const filteredContents = data.gender.contents.filter(
        (movie) => movie.id !== content.id
    );

    renderGridFilms(filteredContents, similars);
}