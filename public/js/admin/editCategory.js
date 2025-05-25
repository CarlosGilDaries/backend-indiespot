async function editCategoryForm() {
    const id = localStorage.getItem('id');
  const token = localStorage.getItem('auth_token');
  const backendAPI = 'https://indiespot.test/api/';

    loadCategoryData(id);

  async function loadCategoryData(id) {
    try {

      const response = await fetch(`${backendAPI}category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success && data.category) {
        document.getElementById('edit-category-name').value =
          data.category.name;
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Manejar el envío del formulario
  document
    .getElementById('edit-category-form')
    .addEventListener('submit', async function (e) {
      e.preventDefault();

      const id = localStorage.getItem('id');

      document.getElementById('edit-category-loading').style.display = 'block';

      try {
        const formData = new FormData();
        formData.append(
          'name',
          document.getElementById('edit-category-name').value
        );

        const response = await fetch(`${backendAPI}edit-category/${id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          document.getElementById(
            'edit-category-success-message'
          ).style.display = 'block';
          setTimeout(() => {
            document.getElementById(
              'edit-category-success-message'
            ).style.display = 'none';
          }, 5000);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        document.getElementById('edit-category-loading').style.display = 'none';
      }
    });
}

editCategoryForm();
