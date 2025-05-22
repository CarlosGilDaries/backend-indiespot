import { formatDuration } from '../modules/formatDuration.js';
import { deleteForm } from '../modules/deleteForm.js';
import { setUpMenuActions } from '../modules/setUpMenuActions.js';
import { storageData } from '../modules/storageData.js';

async function listContent() {
  const listContent = document.getElementById('list-content');
  const backendAPI = 'https://indiespot.test/api/content';
  const backendDeleteApi = 'https://indiespot.test/api/delete-content';
  const backendURL = 'https://indiespot.test';
  const authToken = localStorage.getItem('auth_token');

  // Cargar los datos al iniciar
  loadContentList();

  // Función para cargar y mostrar los datos
  async function loadContentList() {
    try {
      const response = await fetch(backendAPI, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const { movies, genders } = data.data;
      console.log(data);

      // Crear mapeo de géneros para búsqueda rápida
      const genderMap = {};
      genders.forEach((gender) => {
        genderMap[gender.id] = gender.name;
      });

      // Generar HTML de la tabla
      let tableHTML = `
                    <div class="add-button-container">
                      <h1><i class="fas fa-film"></i> Lista de Contenido</h1>
                      <a href="/admin/add-content.html" class="add-button add-content">Crear Contenido</a>
                    </div>
                    <div id="delete-content-success-message" class="success-message" style="margin-bottom: 20px;">
                      ¡Contenido eliminado con éxito!
                  </div>    
                    <div class="table-responsive">
                        <table class="content-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Portada</th>
                                    <th>Género</th>
                                    <th>Votos</th>
                                    <th>Media</th>
                                    <th>Estreno</th>
                                    <th>Tipo</th>
                                    <th>Duración</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

      movies.forEach((movie) => {
        let type;
        const cover = backendURL + movie.cover;

        if (movie.type == 'application/vnd.apple.mpegurl') {
          type = 'HLS';
        } else {
          type = movie.type;
        }

        tableHTML += `
                        <tr>
                            <td>${movie.id}</td>
                            <td>${movie.title}</td>
                            <td><img src="${cover}" alt="${
          movie.title
        }" class="cover-image"></td>
                            <td>${genderMap[movie.gender_id] || 'N/A'}</td>
                            <td>${movie.vote_count}</td>
                            <td>${movie.vote_average}</td>
                            <td>${movie.release_date}</td>
                            <td>${movie.duration_type_name}</td>
                            <td>${formatDuration(movie.duration)}</td>
                            <td>
                                <div class="actions-container">
                                    <button class="actions-button content-button">Acciones</button>
                                    <div class="actions-menu">
                                        <a href="/${
                                          movie.slug
                                        }" class="">Ver</a>
                                        <a href="/admin/edit-content.html" class="action-item content-action edit-button" data-id="${
                                          movie.id
                                        }" data-slug="${movie.slug}">Editar</a>
                                        <a href="/admin/link-users-with-content.html" class="action-item content-action link-button" data-id="${
                                          movie.id
                                        }" data-title="${
          movie.title
        }" data-slug="${movie.slug}">Vincular</a>
                                        <form class="content-delete-form" data-id="${
                                          movie.id
                                        }">
                                        <input type="hidden" name="content_id" value="${
                                          movie.id
                                        }">
                                        <button class="action-item content-action delete-btn" data-movie-id="${
                                          movie.id
                                        }" type="submit">Eliminar</button>
                                        </form>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
      });

      tableHTML += `
                            </tbody>
                        </table>
                    </div>
                `;

      // Insertar la tabla en el DOM
      listContent.innerHTML = tableHTML;

      const links = document.querySelectorAll('.action-item');
      links.forEach((link) => {
        link.addEventListener('click', storageData);
      });

      // Configurar los menús de acciones
      setUpMenuActions();

      const message = document.getElementById('delete-content-success-message');
      deleteForm(authToken, '.content-delete-form', backendDeleteApi, message);
    } catch (error) {
      console.error('Error al cargar la lista de contenido:', error);
      listContent.innerHTML = `
                    <div class="error-message">
                        Error al cargar la lista de películas: ${error.message}
                    </div>
                `;
    }
  }
}

listContent();
