import { deleteForm } from "../modules/deleteForm.js";
import { setUpMenuActions } from "../modules/setUpMenuActions.js";
import { storageData } from "../modules/storageData.js";
import { datatableCallback } from "../modules/datatableCallback.js";

async function listGenders() {
    const listContent = document.getElementById("list-genders");
    const api = "https://indiespot.test/api/";
    const backendURL = "https://indiespot.test";
    const authToken = localStorage.getItem("auth_token");
    const backendDeleteApi = "https://indiespot.test/api/delete-gender";

    // Cargar los datos al iniciar
    loadGendersList();

    // Función para cargar y mostrar los datos
    async function loadGendersList() {
        try {
            // Generar HTML de la tabla
            let tableHTML = `
            <div class="add-button-container">
              <h1><i class="fas fa-rocket"></i> Lista de Géneros</h1>
              <a href="/admin/add-gender.html" class="add-button add-content">Crear Género</a>
            </div>
                      <div id="delete-gender-success-message" class="success-message" style="margin-bottom: 20px;">
                        ¡Género eliminado con éxito!
                      </div>    
                      <div class="table-responsive" id="genders-table">
                          <table class="content-table display datatable">
                              <thead>
                                  <tr>
                                      <th>ID</th>
                                      <th>Nombre</th>
                                      <th>Acciones</th>
                                  </tr>
                              </thead>
                              <tbody></tbody>
                          </table>
                      </div>
                  `;

            // Insertar la tabla en el DOM
            listContent.innerHTML = tableHTML;

            // Iniciando Datatable con Server-Side Processing
            const table = $(".datatable").DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    url: api + "genders/datatable",
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
                    { data: "name", name: "name" },
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
                        messageId: "delete-gender-success-message",
                        formClass: ".gender-delete-form",
                        deleteApi: backendDeleteApi,
                    });
                },
            });
        } catch (error) {
            console.error("Error al cargar la lista de géneros:", error);
            listContent.innerHTML = `
                      <div class="error-message">
                          Error al cargar la lista de géneros: ${error.message}
                      </div>
                  `;
        }
    }
}

listGenders();
