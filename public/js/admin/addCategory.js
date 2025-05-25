async function initAddCategory() {
  const backendAPI = 'https://indiespot.test/api/';

  // Manejar envío del formulario
  document
    .getElementById('add-category-form')
    .addEventListener('submit', async function (e) {
      e.preventDefault();

      // Resetear mensajes de error
      document
        .querySelectorAll('#add-category-form .error-message')
        .forEach((el) => (el.textContent = ''));
      document.getElementById('add-category-success-message').style.display =
        'none';

      // Mostrar loader
      document.getElementById('add-category-loading').style.display = 'block';

      // Obtener token de autenticación
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        window.location.href = '/login';
        return;
      }

      // Crear FormData
      const formAdData = new FormData();
      formAdData.append(
        'name',
        document.getElementById('add-category-name').value
      );

      try {
        const response = await fetch(backendAPI + 'add-category', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formAdData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al subir la categoría');
        }

        // Mostrar mensaje de éxito
        document.getElementById('add-category-success-message').style.display =
          'block';
        setTimeout(() => {
          document.getElementById(
            'add-category-success-message'
          ).style.display = 'none';
        }, 5000);

        // Resetear formulario
        document.getElementById('add-category-form').reset();
      } catch (error) {
        console.error('Error:', error);
      } finally {
        document.getElementById('add-category-loading').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
}

initAddCategory();
