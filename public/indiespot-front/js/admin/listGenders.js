import { deleteForm } from '../modules/deleteForm.js';
import { activeItems } from '../modules/activeItems.js';

async function listGenders() {
  const listContent = document.getElementById('list-genders');
  const backendAPI = 'https://indiespot.test/api/genders';
  const backendURL = 'https://indiespot.test';
  const authToken = localStorage.getItem('auth_token');
  const backendDeleteApi = 'https://indiespot.test/api/delete-gender';

  // Cargar los datos al iniciar
  loadGendersList();

  // Escuchar cuando se muestra este contenido
  document.getElementById('list-genders').addEventListener('show', function () {
    loadGendersList();
  });

  // Función para mostrar/ocultar menús de acciones
  function setupActionMenus() {
    document.querySelectorAll('.genders-button').forEach((button) => {
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
						<button class="add-button add-genders" data-content="add-gender" data-script="/js/admin/addGender.js">Añadir Género</button>
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
                                    <button class="action-item edit-button gender-action" data-content="edit-gender" data-id="${gender.id}" data-script="/js/admin/editGenderForm.js">Editar</button>
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
        .querySelector('.add-genders')
        .addEventListener('click', function () {
          activeItems.call(this, menuItems, contentContainers);
        });

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
