import { deleteForm } from '../modules/deleteForm.js';
import { setUpMenuActions } from '../modules/setUpMenuActions.js';
import { storageData } from '../modules/storageData.js';

async function listGenders() {
  const listContent = document.getElementById('list-genders');
  const backendAPI = 'https://indiespot.test/api/genders';
  const backendURL = 'https://indiespot.test';
  const authToken = localStorage.getItem('auth_token');
  const backendDeleteApi = 'https://indiespot.test/api/delete-gender';

  // Cargar los datos al iniciar
  loadGendersList();

  // Función para cargar y mostrar los datos
  async function loadGendersList() {
    try {
      const response = await fetch(backendAPI, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const genders = data.genders;

      // Generar HTML de la tabla
      let tableHTML = `
					<div class="add-button-container">
						<h1><i class="fas fa-rocket"></i> Lista de Géneros</h1>
						<a href="/admin/add-gender.html" class="add-button add-content">Crear Género</a>
					</div>
                    <div id="delete-gender-success-message" class="success-message" style="margin-bottom: 20px;">
                      ¡Género eliminado con éxito!
                    </div>    
                    <div class="table-responsive">
                        <table class="content-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

      genders.forEach((gender) => {
        tableHTML += ` 
                    <tr>
                        <td>${gender.id}</td>
                        <td>${gender.name}</td>
                        <td>
                            <div class="actions-container">
                                <button class="actions-button genders-button">Acciones</button>
                                <div class="actions-menu">
                                  <a href="/admin/edit-gender.html" class="action-item edit-button gender-action" data-id="${gender.id}">Editar</a>
                                    <form class="gender-delete-form" data-id="${gender.id}">
                                    <input type="hidden" name="gender_id" value="${gender.id}">
                                    <button class="action-item content-action delete-btn" type="submit">Eliminar</button>
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

      const message = document.getElementById('delete-gender-success-message');
      deleteForm(authToken, '.gender-delete-form', backendDeleteApi, message);
    } catch (error) {
      console.error('Error al cargar la lista de géneros:', error);
      listContent.innerHTML = `
                    <div class="error-message">
                        Error al cargar la lista de géneros: ${error.message}
                    </div>
                `;
    }
  }
}

listGenders();
