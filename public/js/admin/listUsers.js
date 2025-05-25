import { deleteForm } from "../modules/deleteForm.js";
import { setUpMenuActions } from "../modules/setUpMenuActions.js";
import { storageData } from "../modules/storageData.js";
import { datatableCallback } from "../modules/datatableCallback.js";

async function listUsers() {
    const listUsers = document.getElementById("list-users");
    const api = "https://indiespot.test/api/";
    const backendDeleteApi = "https://indiespot.test/api/delete-user";
    const backendURL = "https://indiespot.test";
    const authToken = localStorage.getItem("auth_token");

    // Función para cargar y mostrar los datos
    async function loadContentList() {
        try {
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
              <table class="content-table display datatable">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
                </thead>
                <tbody></tbody>
              </table>
              </div>
            `;

            // Insertar la tabla en el DOM
            listUsers.innerHTML = tableHTML;

            // Iniciando Datatable con Server-Side Processing
            const table = $(".datatable").DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    url: api + "users/datatable",
                    type: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    error: function (xhr) {
                        if (xhr.status === 401) {
                            alert(
                                "Sesión expirada. Por favor, inicie sesión nuevamente."
                            );
                            window.location.href = "/login";
                        }
                    },
                },
                columns: [
                    { data: "id", name: "id" },
                    { data: "complete_name", name: "complete_name" },
                    { data: "email", name: "email" },
                    { data: "rol", name: "rol" },
                    {
                        data: "actions",
                        name: "actions",
                        orderable: false,
                        searchable: false,
                    },
                ],
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json",
                    paginate: {
                        first: `<span class="icon-pagination">«</span>`,
                        previous: `<span class="icon-pagination">‹</span>`,
                        next: `<span class="icon-pagination">›</span>`,
                        last: `<span class="icon-pagination">»</span>`,
                    },
                },
                responsive: true,
                drawCallback: function () {
                    // Configurar eventos después de que se dibuja la tabla
                    datatableCallback({
                        onClick: storageData,
                        onMenuSetup: setUpMenuActions,
                        onDelete: deleteForm,
                        token: authToken,
                        messageId: "delete-user-success-message",
                        formClass: ".user-delete-form",
                        deleteApi: backendDeleteApi,
                    });
                },
            });
        } catch (error) {
            console.error("Error al cargar la lista de usuarios:", error);
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
