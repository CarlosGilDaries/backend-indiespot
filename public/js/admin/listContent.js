import { formatDuration } from "../modules/formatDuration.js";
import { deleteForm } from "../modules/deleteForm.js";
import { setUpMenuActions } from "../modules/setUpMenuActions.js";
import { storageData } from "../modules/storageData.js";
import { datatableCallback } from "../modules/datatableCallback.js";

async function listContent() {
    const listContent = document.getElementById("list-content");
    const api = "https://indiespot.test/api/";
    const backendDeleteApi = "https://indiespot.test/api/delete-content";
    const backendURL = "https://indiespot.test";
    const authToken = localStorage.getItem("auth_token");

    // Cargar los datos al iniciar
    loadContentList();

    // Función para cargar y mostrar los datos
    async function loadContentList() {
        try {
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
                        <table class="content-table display datatable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Portada</th>
                                    <th>Género</th>
                                    <th>Votos</th>
                                    <th>Media</th>
                                    <th>Tipo</th>
                                    <th>Duración</th>
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
                    url: api + "content/datatable",
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
                    { data: "title", name: "title" },
                    {
                        data: "cover",
                        name: "cover",
                        render: function (data) {
                            return `<img src="${backendURL}${data}">`;
                        },
                    },
                    { data: "gender", name: "gender" },
                    {
                        data: "vote_count",
                        name: "vote_count",
                    },
                    {
                        data: "vote_average",
                        name: "vote_average",
                    },
                    {
                        data: "duration_type_name",
                        name: "duration_type_name",
                    },
                    {
                        data: "duration",
                        name: "duration",
                        render: function (data) {
                            return formatDuration(data);
                        },
                    },
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
                    datatableCallback({
                        onClick: storageData,
                        onMenuSetup: setUpMenuActions,
                        onDelete: deleteForm,
                        token: authToken,
                        messageId: "delete-content-success-message",
                        formClass: ".content-delete-form",
                        deleteApi: backendDeleteApi,
                    });
                },
            });
        } catch (error) {
            console.error("Error al cargar la lista de contenido:", error);
            listContent.innerHTML = `
                    <div class="error-message">
                        Error al cargar la lista de películas: ${error.message}
                    </div>
                `;
        }
    }
}

listContent();
