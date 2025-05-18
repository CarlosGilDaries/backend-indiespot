import { deleteForm } from '../modules/deleteForm.js';
import { setUpMenuActions } from '../modules/setUpMenuActions.js';
import { storageData } from '../modules/storageData.js';

async function listRols() {
  const listContent = document.getElementById('list-rols');
  const backendAPI = 'https://indiespot.test/api/rols';
  const backendURL = 'https://indiespot.test';
  const authToken = localStorage.getItem('auth_token');
  const backendDeleteApi = 'https://indiespot.test/api/delete-rol';

  // Cargar los datos al iniciar
  loadRolsList();

  // Función para cargar y mostrar los datos
  async function loadRolsList() {
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

      const rols = data.rols;

      // Generar HTML de la tabla
      let tableHTML = `
                    <div class="add-button-container">
                        <h1><i class="fa-solid fa-clapperboard"></i> Lista de Roles</h1>
                        <a href="/admin/add-rol.html" class="add-button add-content">Crear Rol</a>
                    </div>
                    <div id="delete-rol-success-message" class="success-message" style="margin-bottom: 20px;">
                      ¡Rol eliminado con éxito!
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

      rols.forEach((rol) => {
        tableHTML += ` 
                    <tr>
                        <td>${rol.id}</td>
                        <td>${rol.name}</td>
                        <td>
                            <div class="actions-container">
                                <button class="actions-button rols-button">Acciones</button>
                                <div class="actions-menu">
                                     <a href="/admin/edit-rol.html" class="action-item edit-button rol-action" data-id="${rol.id}">Editar</a>
                                    <form class="rol-delete-form" data-id="${rol.id}">
                                    <input type="hidden" name="rol_id" value="${rol.id}">
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

      const message = document.getElementById('delete-rol-success-message');
      deleteForm(authToken, '.rol-delete-form', backendDeleteApi, message);
    } catch (error) {
      console.error('Error al cargar la lista de roles:', error);
      listContent.innerHTML = `
                    <div class="error-message">
                        Error al cargar la lista de roles: ${error.message}
                    </div>
                `;
    }
  }
}

listRols();