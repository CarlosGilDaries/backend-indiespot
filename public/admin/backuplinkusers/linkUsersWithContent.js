document.addEventListener('DOMContentLoaded', function () {
  const authToken = localStorage.getItem('auth_token');
  const movieId = localStorage.getItem('id');
  const movieSlug = localStorage.getItem('slug');
  const usersList = document.getElementById('users-list');
  const selectedUsersList = document.getElementById('selected-users-list');
  const linkedUsersList = document.getElementById('linked-users-list');
  const userSearch = document.getElementById('user-search');
  const linkUsersBtn = document.getElementById('link-users-btn');
  const title = document.querySelector('h1');

  let allUsers = [];
  let selectedUsers = [];
  let linkedUsers = [];

  // Cargar datos de la película
  async function loadMovieData() {
    try {
      const response = await fetch(
        `https://indiespot.test/api/content/${movieSlug}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar los datos de la película');
      }

      const data = await response.json();

      title.innerHTML += data.movie.title;

      // Normalizar usuarios vinculados
      linkedUsers = (data.movie.users || []).map((user) => ({
        ...user,
        rol: user.rol || { name: 'Rol no especificado' },
      }));

      renderLinkedUsers();

      // Cargar todos los usuarios (excluyendo los ya vinculados)
      await loadAllUsers();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  }

  // Cargar todos los usuarios (excluyendo los ya vinculados)
  async function loadAllUsers() {
    try {
      const response = await fetch('https://indiespot.test/api/users', {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar l@s usuari@s');
      }

      const data = await response.json();

      // Filtrar usuarios que no están vinculados
      allUsers = data.users.filter(
        (user) => !linkedUsers.some((linkedUser) => linkedUser.id === user.id)
      );

      renderAvailableUsers(allUsers);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  }

  // Renderizar usuarios disponibles
  function renderAvailableUsers(users) {
    usersList.innerHTML = '';

    if (users.length === 0) {
      usersList.innerHTML =
        '<p class="no-users">No hay usuari@s disponibles</p>';
      return;
    }

    users.forEach((user) => {
      const userCard = document.createElement('div');
      userCard.className = 'user-card';
      userCard.dataset.userId = user.id;

      userCard.innerHTML = `
                <div class="user-info">
                    <div class="user-name">${user.name} ${user.surnames}</div>
                    <div class="user-role">${user.rol.name}</div>
                </div>
                <div class="user-actions">
                    <button class="btn-icon add-user-btn" title="Añadir">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;

      usersList.appendChild(userCard);
    });

    // Agregar event listeners a los botones de añadir
    document.querySelectorAll('.add-user-btn').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const userId = parseInt(this.closest('.user-card').dataset.userId);
        addUserToSelection(userId);
      });
    });
  }

  // Renderizar usuarios seleccionados
  function renderSelectedUsers() {
    selectedUsersList.innerHTML = '';

    if (selectedUsers.length === 0) {
      selectedUsersList.innerHTML =
        '<p class="no-users">No hay usuari@s seleccionados</p>';
      linkUsersBtn.disabled = true;
      return;
    }

    linkUsersBtn.disabled = false;

    selectedUsers.forEach((user) => {
      const userCard = document.createElement('div');
      userCard.className = 'user-card selected';
      userCard.dataset.userId = user.id;

      userCard.innerHTML = `
                <div class="user-info">
                    <div class="user-name">${user.name} ${user.surnames}</div>
                    <div class="user-role">${user.rol.name}</div>
                </div>
                <div class="user-actions">
                    <button class="btn-icon remove-user-btn" title="Quitar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

      selectedUsersList.appendChild(userCard);
    });

    // Agregar event listeners a los botones de quitar
    document.querySelectorAll('.remove-user-btn').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const userId = parseInt(this.closest('.user-card').dataset.userId);
        removeUserFromSelection(userId);
      });
    });
  }

  // Renderizar usuarios ya vinculados
  function renderLinkedUsers() {
    linkedUsersList.innerHTML = '';

    if (linkedUsers.length === 0) {
      linkedUsersList.innerHTML =
        '<p class="no-users">No hay usuari@s vinculad@s</p>';
      return;
    }

    linkedUsers.forEach((user) => {
      const userCard = document.createElement('div');
      userCard.className = 'user-card linked';
      userCard.dataset.userId = user.id;

      userCard.innerHTML = `
            <div class="user-info">
                <div class="user-name">${user.name} ${user.surnames}</div>
                <div class="user-role">${user.rol.name}</div>
            </div>
            <div class="user-actions">
                <button class="btn-icon unlink-buttons" title="Desvincular">
                    <i class="fas fa-unlink"></i> Desvincular
                </button>
            </div>
        `;

      linkedUsersList.appendChild(userCard);
    });

    // Agregar event listeners a los botones de desvincular
    document.querySelectorAll('.unlink-buttons').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const userId = parseInt(this.closest('.user-card').dataset.userId);
        unlinkUser(userId);
      });
    });
  }

  // Función para desvincular un usuario
  async function unlinkUser(userId) {
    if (confirm('¿Estás segur@ de que deseas desvincular est@ usuari@?')) {
      try {
        const response = await fetch('https://indiespot.test/api/unlink-user', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content_id: movieId,
            user_id: userId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al desvincular usuari@');
        }

        // Mover usuario de vinculados a disponibles
        const userToUnlink = linkedUsers.find((user) => user.id === userId);
        if (userToUnlink) {
          // Eliminar de vinculados
          linkedUsers = linkedUsers.filter((user) => user.id !== userId);

          // Añadir a disponibles (si no está ya)
          if (!allUsers.some((user) => user.id === userId)) {
            allUsers.push(userToUnlink);
          }

          // Eliminar de seleccionados por si acaso
          selectedUsers = selectedUsers.filter((user) => user.id !== userId);
        }

        // Actualizar las listas
        renderLinkedUsers();
        renderAvailableUsers(allUsers);
        renderSelectedUsers();

        document.getElementById('success-message').innerHTML =
          '¡Usuari@ desvinculado con éxito!';
        document.getElementById('success-message').style.display = 'block';
        setTimeout(() => {
          document.getElementById('success-message').style.display = 'none';
        }, 5000);
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      }
    }
  }

  // Añadir usuario a la selección
  function addUserToSelection(userId) {
    const user = allUsers.find((u) => u.id === userId);
    if (user && !selectedUsers.some((u) => u.id === userId)) {
      selectedUsers.push(user);

      // Eliminar de la lista de disponibles
      allUsers = allUsers.filter((u) => u.id !== userId);

      renderAvailableUsers(allUsers);
      renderSelectedUsers();
    }
  }

  // Quitar usuario de la selección
  function removeUserFromSelection(userId) {
    const user = selectedUsers.find((u) => u.id === userId);
    if (user) {
      selectedUsers = selectedUsers.filter((u) => u.id !== userId);

      // Volver a añadir a disponibles
      allUsers.push(user);

      renderAvailableUsers(allUsers);
      renderSelectedUsers();
    }
  }

  // Buscar usuarios
  userSearch.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filteredUsers = allUsers.filter(
      (user) =>
        `${user.name} ${user.surnames}`.toLowerCase().includes(searchTerm) ||
        user.rol.name.toLowerCase().includes(searchTerm)
    );
    renderAvailableUsers(filteredUsers);
  });

  // Vincular usuarios
  linkUsersBtn.addEventListener('click', async function () {
    if (selectedUsers.length === 0) return;

    try {
      const response = await fetch(
        'https://indiespot.test/api/link-users-with-content',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content_id: movieId,
            users: selectedUsers.map((user) => ({ id: user.id })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al vincular usuari@s');
      }

      // Actualizar listas después de vincular
      linkedUsers = [...linkedUsers, ...selectedUsers];
      selectedUsers = [];

      renderSelectedUsers();
      renderLinkedUsers();

      // Volver a cargar usuarios disponibles (excluyendo los recién vinculados)
      await loadAllUsers();

      document.getElementById('success-message').innerHTML =
        '¡Usuari@s vinculad@s con éxito!';
      document.getElementById('success-message').style.display = 'block';
      setTimeout(() => {
        document.getElementById('success-message').style.display = 'none';
      }, 5000);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  });

  // Inicializar
  loadMovieData();
});
