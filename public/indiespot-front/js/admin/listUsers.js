import { deleteForm } from '../modules/deleteForm.js';
import { setUpMenuActions } from '../modules/setUpMenuActions.js';
import { storageData } from '../modules/storageData.js';

async function listUsers() {
  const listUsers = document.getElementById('list-users');
  const backendAPI = 'https://indiespot.test/api/users';
  const backendDeleteApi = 'https://indiespot.test/api/delete-user';
  const backendURL = 'https://indiespot.test';
  const authToken = localStorage.getItem('auth_token');

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

      const users = data.users;

      // Generar HTML de la tabla
      let tableHTML = `
    <div class="add-button-container">
		 		<h1><i class="fas fa-user"></i> Lista de Usuarios</h1>
				<a href="/admin/add-user.html" class="add-button add-user">Crear Usuario</a>
		</div>
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
          <a href="/admin/edit-user.html" class="action-item user-action edit-button" 
						data-id="${user.id}" >
						Editar
					  </a>
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

      const links = document.querySelectorAll('.action-item');
      links.forEach((link) => {
        link.addEventListener('click', storageData);
      });

      // Configurar los menús de acciones
      setUpMenuActions();;

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

listUsers();
