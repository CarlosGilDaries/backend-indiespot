async function editUserForm() {
  let id = localStorage.getItem('id');
  const token = localStorage.getItem('auth_token');
  const backendAPI = 'https://indiespot.test/api/';

  loadUserData(id);

  document
    .getElementById('edit-user-form')
    .addEventListener('submit', async function (e) {
      e.preventDefault();
      document.getElementById('edit-user-loading').style.display = 'block';

      const formData = new FormData();
      formData.append('name', document.getElementById('edit-user-name').value);
      formData.append(
        'surnames',
        document.getElementById('edit-user-surnames').value
      );
      formData.append(
        'email',
        document.getElementById('edit-user-email').value
        );
      formData.append('portfolio', document.getElementById('edit-user-portfolio').value);
      formData.append(
        'rol',
        document.getElementById('edit-user-rol').value
        );
      formData.append('curriculum', document.getElementById('edit-user-curriculum').files[0]);
      formData.append(
        'password',
        document.getElementById('edit-user-password').value
      );
      formData.append(
        'password_confirmation',
        document.getElementById('edit-user-password-confirmation').value
      );

      try {
        const editResponse = await fetch(backendAPI + `edit-user/${id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await editResponse.json();

        if (data.success) {
          document.getElementById('edit-user-success-message').style.display =
            'block';
          setTimeout(() => {
            document.getElementById('edit-user-success-message').style.display =
              'none';
          }, 5000);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          console.error('Error al editar:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        document.getElementById('edit-user-loading').style.display = 'none';
      }
    });

  async function loadUserData(id) {
    try {
      const response = await fetch(backendAPI + `users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rolsResponse = await fetch(backendAPI + `rols`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const rolsData = await rolsResponse.json();
      const user = data.data.user;
      const rols = rolsData.rols;

      const rolSelect = document.getElementById("edit-user-rol");
      rolSelect.innerHTML = "";
      rols.forEach((rol) => {
          const option = document.createElement("option");
          option.value = rol.id;
          option.text = rol.name;
          rolSelect.appendChild(option);
      });

      // Configurar input de archivo para mostrar nombre
      const setupFileInput = (inputId, nameId, labelId, currentPath = null) => {
        const input = document.getElementById(inputId);
        const nameElement = document.getElementById(nameId);
        const labelElement = document.getElementById(labelId);

        if (currentPath) {
          const fileName = currentPath.split('/').pop();
          if (nameElement) nameElement.textContent = fileName;
          if (labelElement) labelElement.textContent = fileName;
        }

        if (input) {
          input.addEventListener('change', function (e) {
            const fileName =
              e.target.files[0]?.name || 'Ningún archivo seleccionado';
            if (nameElement) nameElement.textContent = fileName;
            if (labelElement) labelElement.textContent = fileName;
          });
        }
      };

      setupFileInput(
        'edit-user-curriculum',
        'curriculum-name',
        'curriculum-label-text',
        user.curriculum
      );
      console.log(user);
      document.getElementById('edit-user-name').value = user.name || '';
      document.getElementById('edit-user-surnames').value = user.surnames || '';
      document.getElementById('edit-user-email').value = user.email || '';
      document.getElementById('edit-user-portfolio').value =
        user.portfolio || '';
      document.getElementById('edit-user-rol').value = user.rol_id;
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }
}

editUserForm();

