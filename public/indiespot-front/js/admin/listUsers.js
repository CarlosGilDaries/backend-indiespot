import { deleteForm } from '../modules/deleteForm.js';
import { activeItems } from '../modules/activeItems.js';

(function () {
  async function listUsers() {
    const listUsers = document.getElementById('list-users');
    const backendAPI = 'https://indiespot.test/api/users';
    const backendDeleteApi = 'https://indiespot.test/api/delete-user';
    const backendURL = 'https://indiespot.test';
    const authToken = localStorage.getItem('auth_token');

    // Función para mostrar/ocultar menús de acciones
    function setupActionMenus() {
      document.querySelectorAll('.users-button').forEach((button) => {
        button.addEventListener('click', function (e) {
          e.stopPropagation();
          const menu = this.nextElementSibling;
          const allMenus = document.querySelectorAll('.actions-menu');

          // Cerrar otros menús abiertos
          allMenus.forEach((m) => {
            if (m !== menu) m.style.display = 'none';
          });

          // Alternar el menú actual
          menu.style.display =
            menu.style.display === 'block' ? 'none' : 'block';
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

          console.log(data);
        const users = data.users;

        // Generar HTML de la tabla
        let tableHTML = `
		  <h1><i class="fas fa-user"></i> Lista de Usuarios</h1>
		  <div id="delete-user-success-message" class="success-message" style="margin-bottom: 20px;">
			¡Usuario eliminado con éxito!
		  </div>    
		  <div class="table-responsive">
			<table class="content-table">
			  <thead>
				<tr>
				  <th>ID</th>
				  <th>Nombre Completo</th>
				  <th>Email</th>
				  <th>Rol</th>
				  <th>Acciones</th>
				</tr>
			  </thead>
			  <tbody>
		`;

        users.forEach((user) => {
          tableHTML += `
			<tr>
			  <td>${user.id}</td>
			  <td>${user.name} ${user.surnames}</td>
			  <td>${user.email}</td>
			  <td>${user.rol.name}</td>
			  <td>
				<div class="actions-container">
				  <button class="actions-button users-button">Acciones</button>
				  <div class="actions-menu">
					  <button class="action-item user-action edit-button" 
						data-content="edit-user" 
						data-id="${user.id}" 
						data-script="/js/admin/editUserForm.js">
						Editar
					  </button>
					  <form class="user-delete-form" data-id="${user.id}">
						<input type="hidden" name="user_id" value="${user.id}">
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
        listUsers.innerHTML = tableHTML;

        // Configurar los menús de acciones
        setupActionMenus();

        // Añadir event listeners para los botones de acción
        document.querySelectorAll('.edit-button').forEach((btn) => {
          btn.addEventListener(
            'click',
            activeItems.bind(btn, menuItems, contentContainers)
          );
        });

        const message = document.getElementById('delete-user-success-message');
        deleteForm(authToken, '.user-delete-form', backendDeleteApi, message);
      } catch (error) {
        console.error('Error al cargar la lista de usuarios:', error);
        listContent.innerHTML = `
                    <div class="error-message">
                        Error al cargar la lista de usuarios: ${error.message}
                    </div>
                `;
      }
    }

    // Cargar los datos al iniciar
    loadContentList();
  }

  // Verificar si el DOM está listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', listUsers);
  } else {
    listUsers();
  }
})();
