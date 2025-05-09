import { deleteForm } from '../modules/deleteForm.js';
import { activeItems } from '../modules/activeItems.js';

async function listRols() {
  const listContent = document.getElementById('list-rols');
  const backendAPI = 'https://indiespot.test/api/rols';
  const backendURL = 'https://indiespot.test';
  const authToken = localStorage.getItem('auth_token');
  const backendDeleteApi = 'https://indiespot.test/api/delete-rol';

  // Cargar los datos al iniciar
  loadRolsList();

  // Escuchar cuando se muestra este contenido
  document.getElementById('list-rols').addEventListener('show', function () {
    loadRolsList();
  });

  // Función para mostrar/ocultar menús de acciones
  function setupActionMenus() {
    document.querySelectorAll('.rols-button').forEach((button) => {
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        const menu = this.nextElementSibling;
        const allMenus = document.querySelectorAll('.actions-menu');

        // Cerrar otros menús abiertos
        allMenus.forEach((m) => {
          if (m !== menu) m.style.display = 'none';
        });

        // Alternar el menú actual
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      });
    });

    // Cerrar menús al hacer clic en cualquier parte del documento
    document.addEventListener('click', function () {
      document.querySelectorAll('.actions-menu').forEach((menu) => {
        menu.style.display = 'none';
      });
    });
  }

  const menuItems = document.querySelectorAll('.admin-menu li');
  const contentContainers = document.querySelectorAll('.container');

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
                        <h1><i class="fas fa-rocket"></i> Lista de Roles</h1>
                        <button class="add-button add-rols" data-content="add-rol" data-script="/js/admin/addRol.js">Añadir Rol</button>
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
                                    <button class="action-item edit-button rol-action" data-content="edit-rol" data-id="${rol.id}" data-script="/js/admin/editRolForm.js">Editar</button>
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

      // Configurar los menús de acciones
      setupActionMenus();

      // Añadir event listeners para los botones de acción
      document.querySelectorAll('.edit-button').forEach((btn) => {
        btn.addEventListener(
          'click',
          activeItems.bind(btn, menuItems, contentContainers)
        );
      });

      document
        .querySelector('.add-rols')
        .addEventListener('click', function () {
          activeItems.call(this, menuItems, contentContainers);
        });

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