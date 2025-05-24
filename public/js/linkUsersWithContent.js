async function listUsers() {
    const listUsers = document.getElementById("users-list");
    const selectedUsersList = document.getElementById("selected-users-list");
    const linkedUsersList = document.getElementById("linked-users-list");
    const linkUsersBtn = document.getElementById("link-users-btn");
    const successMessage = document.getElementById("success-message");
    const api = "https://indiespot.test/api/";
    const backendURL = "https://indiespot.test";
    const authToken = localStorage.getItem("auth_token");
    const movieId = localStorage.getItem("id");
    const movieSlug = localStorage.getItem("slug");
    const title = document.querySelector('h1');
    let movieTitleAdded = false;

    let selectedUsers = [];
    let linkedUsers = [];

    // Función para cargar usuarios vinculados
    async function loadLinkedUsers() {
        try {
            const response = await fetch(`${api}content/${movieSlug}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok)
                throw new Error("Error al cargar usuarios vinculados");

            const data = await response.json();
            if (!movieTitleAdded) {
                title.innerHTML += data.movie.title;
                movieTitleAdded = true;
            }
            linkedUsers = data.movie.users || [];
            renderLinkedUsers();
        } catch (error) {
            console.error("Error al cargar usuarios vinculados:", error);
        }
    }

    // Renderizar usuarios vinculados
    function renderLinkedUsers() {
        linkedUsersList.innerHTML = linkedUsers
            .map(
                (user) => `
            <div class="user-card linked">
                <div class="user-info">
                    <div class="user-name">${user.name} ${user.surnames}</div>
                    <div class="user-role">${user.rol.name}</div>
                </div>
                <div class="user-actions">
                    <button class="unlink-buttons" data-user-id="${user.id}">Desvincular</button>
                </div>
            </div>
        `
            )
            .join("");

        // Agregar event listeners a los botones de desvincular
        document.querySelectorAll(".unlink-buttons").forEach((button) => {
            button.addEventListener("click", async (e) => {
                const userId = e.target.getAttribute("data-user-id");
                await unlinkUser(userId);
            });
        });
    }

    // Renderizar usuarios seleccionados
    function renderSelectedUsers() {
        selectedUsersList.innerHTML = selectedUsers
            .map(
                (user) => `
            <div class="user-card selected">
                <div class="user-info">
                    <div class="user-name">${user.name} ${user.surnames}</div>
                    <div class="user-role">${user.rol}</div>
                </div>
            </div>
        `
            )
            .join("");

        // Habilitar/deshabilitar botón de vincular según haya seleccionados
        linkUsersBtn.disabled = selectedUsers.length === 0;
    }

    // Función para desvincular usuario
    async function unlinkUser(userId) {
        if (!confirm("¿Estás segur@ de que deseas desvincular est@ usuari@?"))
            return;

        try {
            const response = await fetch(`${api}unlink-user`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content_id: movieId,
                    user_id: userId,
                }),
            });

            if (!response.ok) throw new Error("Error al desvincular usuario");

            // Recargar datos
            await loadLinkedUsers();
            $(".datatable").DataTable().ajax.reload();

            showSuccessMessage("Usuari@ desvinculad@ correctamente");
        } catch (error) {
            console.error("Error al desvincular usuario:", error);
            alert("Error al desvincular usuario");
        }
    }

    // Función para vincular usuarios
    async function linkUsers() {
        if (selectedUsers.length === 0) return;

        try {
            const response = await fetch(`${api}link-users-with-content`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content_id: movieId,
                    users: selectedUsers.map((user) => ({ id: user.id })),
                }),
            });

            if (!response.ok) throw new Error("Error al vincular usuari@s");

            // Limpiar selección y recargar datos
            selectedUsers = [];
            renderSelectedUsers();
            await loadLinkedUsers();
            $(".datatable").DataTable().ajax.reload();

            showSuccessMessage("Usuari@s vinculad@s correctamente");
        } catch (error) {
            console.error("Error al vincular usuarios:", error);
            alert("Error al vincular usuarios");
        }
    }

    // Mostrar mensaje de éxito
    function showSuccessMessage(message) {
        successMessage.textContent = message;
        successMessage.style.display = "block";
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    }

    // Función para cargar y mostrar los datos
    async function loadContentList() {
        try {
            // Generar HTML de la tabla
            let tableHTML = `  
              <div class="table-responsive">
              <table class="content-table display datatable">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Email</th>
                  <th>Curriculum</th>
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
                    url: api + `unlinked-users/${movieId}/datatable`,
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
                    { data: "rol", name: "rol" },
                    { data: "email", name: "email" },
                    {
                        data: "curriculum",
                        name: "curriculum",
                        render: function (data) {
                            if (data != null) {
                                return `<a href="${backendURL}${data}" target="_blank" class="cv-links">Ver CV</a>`;
                            } else {
                                return "N/A";
                            }
                        },
                    },
                    {
                        data: "actions",
                        name: "actions",
                        orderable: false,
                        searchable: false,
                        render: function (data, type, row) {
                            return `<button class="actions-button" data-user-id="${row.id}" data-user-name="${row.complete_name}" data-user-rol="${row.rol}">Añadir</button>`;
                        },
                    },
                ],
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json",
                },
                responsive: true,
                drawCallback: function () {
                    // Configurar eventos después de que se dibuja la tabla
                    document
                        .querySelectorAll(".actions-button")
                        .forEach((button) => {
                            button.addEventListener("click", (e) => {
                                const userId =
                                    e.target.getAttribute("data-user-id");
                                const userName =
                                    e.target.getAttribute("data-user-name");
                                const userRol =
                                    e.target.getAttribute("data-user-rol");

                                // Verificar si el usuario ya está seleccionado
                                if (
                                    !selectedUsers.some(
                                        (user) => user.id == userId
                                    )
                                ) {
                                    selectedUsers.push({
                                        id: userId,
                                        name: userName.split(" ")[0],
                                        surnames: userName
                                            .split(" ")
                                            .slice(1)
                                            .join(" "),
                                        rol: userRol,
                                    });
                                    renderSelectedUsers();
                                }
                            });
                        });
                },
            });

            // Cargar usuarios vinculados
            await loadLinkedUsers();
        } catch (error) {
            console.error("Error al cargar la lista de usuarios:", error);
            listUsers.innerHTML = `
                  <div class="error-message">
                      Error al cargar la lista de usuarios: ${error.message}
                  </div>
              `;
        }
    }

    // Configurar evento para el botón de vincular
    linkUsersBtn.addEventListener("click", linkUsers);

    // Cargar los datos al iniciar
    loadContentList();
}

listUsers();
