async function editRolForm() {
  let id;
  const token = localStorage.getItem('auth_token');
  const backendAPI = 'https://indiespot.test/api/';

  if (document.getElementById('edit-rol-name').value == '') {
    id = localStorage.getItem('id');
    loadRolData(id);
  }

  // Función para cargar datos del género
  async function loadRolData(id) {
    try {
      const response = await fetch(`${backendAPI}rol/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success && data.rol) {
        document.getElementById('edit-rol-name').value = data.rol.name;
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Manejar el envío del formulario
  document
    .getElementById('edit-rol-form')
    .addEventListener('submit', async function (e) {
      e.preventDefault();

      const id = localStorage.getItem('id');

      document.getElementById('edit-rol-loading').style.display = 'block';

      try {
        const formData = new FormData();
        formData.append(
          'name',
          document.getElementById('edit-rol-name').value
        );

        const response = await fetch(`${backendAPI}edit-rol/${id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          document.getElementById('edit-rol-success-message').style.display =
            'block';
          setTimeout(() => {
            document.getElementById(
              'edit-rol-success-message'
            ).style.display = 'none';
          }, 5000);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        document.getElementById('edit-rol-loading').style.display = 'none';
      }
    });
}

editRolForm();
