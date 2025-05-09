document.addEventListener('DOMContentLoaded', async function () {
  const backendAPI = 'https://indiespot.test/api/';

  // Mostrar nombre de archivos seleccionados
  const setupFileInput = (inputId, nameId, labelId) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('change', function (e) {
        const fileName =
          e.target.files[0]?.name || 'Ningún archivo seleccionado';
        if (nameId) document.getElementById(nameId).textContent = fileName;
        if (labelId) document.getElementById(labelId).textContent = fileName;
      });
    }
  };

  setupFileInput('cover', 'cover-name', 'cover-label-text');
  setupFileInput('content', 'content-name', 'content-label-text');
  setupFileInput('m3u8', 'm3u8-name', 'm3u8-label-text');
  setupFileInput('ts1', 'ts1-name', 'ts1-label-text');
  setupFileInput('ts2', 'ts2-name', 'ts2-label-text');
  setupFileInput('ts3', 'ts3-name', 'ts3-label-text');
  setupFileInput('trailer', 'trailer-name', 'trailer-label-text');

  // Toggle campos Pay Per View
  document
    .getElementById('pay_per_view')
    .addEventListener('change', function () {
      const payPerViewFields = document.getElementById('pay_per_view_fields');
      if (this.checked) {
        payPerViewFields.classList.remove('hidden');
      } else {
        payPerViewFields.classList.add('hidden');
        document.getElementById('pay_per_view_price').value = '';
      }
    });

  // Mostrar/ocultar campos según tipo de contenido
  document.getElementById('type').addEventListener('change', function () {
    const type = this.value;
    const singleContent = document.getElementById('single-content');
    const hlsContent = document.getElementById('hls-content');
    const externalContent = document.getElementById('external-content');

    singleContent.classList.add('hidden');
    hlsContent.classList.add('hidden');
    externalContent.classList.add('hidden');

    document.getElementById('content').required = false;
    document.getElementById('m3u8').required = false;
    document.getElementById('external_url').required = false;

    if (type === 'application/vnd.apple.mpegurl') {
      hlsContent.classList.remove('hidden');
      document.getElementById('m3u8').required = true;
    } else if (type === 'iframe' || type === 'url') {
      externalContent.classList.remove('hidden');
      document.getElementById('external_url').required = true;
    } else {
      singleContent.classList.remove('hidden');
      document.getElementById('content').required = true;
    }
  });

  // Manejar envío del formulario
  document
    .getElementById('content-form')
    .addEventListener('submit', async function (e) {
      e.preventDefault();

      // Resetear mensajes de error
      document
        .querySelectorAll('.error-message')
        .forEach((el) => (el.textContent = ''));
      document.getElementById('success-message').style.display = 'none';

      // Mostrar loader
      document.getElementById('loading').style.display = 'block';

      // Obtener token de autenticación
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        window.location.href = '/login';
        return;
      }

      const formData = new FormData();
      formData.append('title', document.getElementById('title').value);
      formData.append('type', document.getElementById('type').value);
      formData.append('gender_id', document.getElementById('gender_id').value);
      formData.append('tagline', CKEDITOR.instances.tagline.getData());
      formData.append('overview', CKEDITOR.instances.overview.getData());
      formData.append(
        'pay_per_view',
        document.getElementById('pay_per_view').checked ? '1' : '0'
      );

      if (document.getElementById('pay_per_view').checked) {
        formData.append(
          'pay_per_view_price',
          document.getElementById('pay_per_view_price').value
        );
      }

      if (document.getElementById('start_time').value) {
        formData.append(
          'start_time',
          document.getElementById('start_time').value
        );
      }

      if (document.getElementById('end_time').value) {
        formData.append('end_time', document.getElementById('end_time').value);
      }

      if (document.getElementById('duration').value) {
        formData.append('duration', document.getElementById('duration').value);
      }

      if (document.getElementById('cover')) {
        formData.append('cover', document.getElementById('cover').files[0]);
      }

      if (
        document.getElementById('trailer') &&
        document.getElementById('trailer').files[0]
      ) {
        formData.append('trailer', document.getElementById('trailer').files[0]);
      }

      const type = document.getElementById('type').value;
      if (type === 'application/vnd.apple.mpegurl') {
        formData.append('m3u8', document.getElementById('m3u8').files[0]);
        formData.append('ts1', document.getElementById('ts1').files[0]);
        formData.append('ts2', document.getElementById('ts2').files[0]);
        formData.append('ts3', document.getElementById('ts3').files[0]);
      } else if (type === 'iframe' || type === 'url') {
        formData.append(
          'external_url',
          document.getElementById('external_url').value
        );
      } else {
        formData.append('content', document.getElementById('content').files[0]);
      }

      const checkboxes = document.querySelectorAll('.plan-checkbox');
      let atLeastOneChecked = false;

      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          formData.append('plans[]', checkbox.value);
          atLeastOneChecked = true;
        }
      });

      if (!atLeastOneChecked) {
        document.getElementById('loading').style.display = 'none';
        alert('Selecciona al menos un plan');
        return;
      }

      try {
        const response = await fetch(backendAPI + 'add-content', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          // Mostrar errores específicos si existen
          if (data.errors) {
            Object.entries(data.errors).forEach(([field, messages]) => {
              const errorElement = document.getElementById(`${field}-error`);
              if (errorElement) {
                errorElement.textContent = messages.join(', ');
              }
            });
          } else {
            throw new Error(data.error || 'Error al subir el contenido');
          }
          return;
        }

        // Mostrar mensaje de éxito
        document.getElementById('success-message').style.display = 'block';
        document.getElementById('success-message').textContent = `${
          data.message
        } - ${data.movie?.title || 'Contenido subido'}`;

        setTimeout(() => {
          document.getElementById('success-message').style.display = 'none';
        }, 5000);

        // Resetear formulario
        document.getElementById('content-form').reset();
        document
          .querySelectorAll('.file-name')
          .forEach((el) => (el.textContent = ''));
        document.querySelectorAll('.file-input-label span').forEach((el) => {
          el.textContent = 'Seleccionar archivo...';
        });
        CKEDITOR.instances.tagline.setData('');
        CKEDITOR.instances.overview.setData('');
        document.getElementById('pay_per_view_fields').classList.add('hidden');
      } catch (error) {
        console.error('Error:', error);
        alert('Error al subir el contenido: ' + error.message);
      } finally {
        document.getElementById('loading').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
});
