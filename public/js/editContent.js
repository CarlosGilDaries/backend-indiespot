async function editContentForm() {
  let id = localStorage.getItem('id');
  const token = localStorage.getItem('auth_token');
  const backendAPI = 'https://indiespot.test/api/';

  loadContentData(id);

  // Manejar el checkbox para cambiar archivo de contenido
  const changeContentCheckbox = document.getElementById('change-content-file');
  changeContentCheckbox.addEventListener('change', function () {
    const shouldChange = this.checked;
    document
      .getElementById('type-content')
      .classList.toggle('hidden', !shouldChange);

    // Ocultar todos los campos de archivos si el checkbox no está marcado
    if (!shouldChange) {
      document.getElementById('single-content').classList.add('hidden');
      document.getElementById('hls-content').classList.add('hidden');
    } else {
      // Mostrar los campos según el tipo seleccionado
      const type = document.getElementById('type').value;
      toggleContentFiles(type);
    }
  });

  // Manejar cambio de tipo de contenido
  document.getElementById('type').addEventListener('change', function () {
    if (changeContentCheckbox.checked) {
      toggleContentFiles(this.value);
    }
  });

  // Función para mostrar/ocultar campos de archivos según el tipo
  function toggleContentFiles(type) {
    const singleContent = document.getElementById('single-content');
    const hlsContent = document.getElementById('hls-content');

    singleContent.classList.add('hidden');
    hlsContent.classList.add('hidden');

    if (type === 'video/mp4') {
      singleContent.classList.remove('hidden');
    } else if (type === 'application/vnd.apple.mpegurl') {
      hlsContent.classList.remove('hidden');
    }
  }

  async function loadContentData(id) {
    try {
      const response = await fetch(backendAPI + `edit-view-content/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const genderResponse = await fetch(backendAPI + 'genders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const content = data.movie;
      const genderData = await genderResponse.json();
      const genders = genderData.genders;

      // Llenar el select de géneros
      const selectGender = document.getElementById('gender_id');
      genders.forEach((gender) => {
        let option = document.createElement('option');
        option.value = gender.id;
        option.innerHTML = gender.name;
        selectGender.appendChild(option);
      });

      // Configurar inputs de archivo para mostrar nombre
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

      // Configurar inputs de archivo (mostrar solo para cover y trailer)
      setupFileInput('cover', 'cover-name', 'cover-label-text', content.cover);
      setupFileInput(
        'trailer',
        'trailer-name',
        'trailer-label-text',
        content.trailer
      );

      // No mostrar el archivo de contenido actual
      setupFileInput('content', 'content-name', 'content-label-text');
      setupFileInput('m3u8', 'm3u8-name', 'm3u8-label-text');
      setupFileInput('ts1', 'ts1-name', 'ts1-label-text');
      setupFileInput('ts2', 'ts2-name', 'ts2-label-text');
      setupFileInput('ts3', 'ts3-name', 'ts3-label-text');

      // Llenar campos del formulario
      document.getElementById('title').value = content.title;
      document.getElementById('gender_id').value = content.gender_id;
      document.getElementById('type').value = content.type;
      document.getElementById('release-date').value = content.release_date;
      document.getElementById('duration').value = content.duration;
      document.getElementById('duration-type-name').value =
        content.duration_type_name;
        document.getElementById('type').value = content.type;
        changeContentCheckbox.checked = false;

      // Inicializar CKEditor si está disponible
      if (typeof CKEDITOR !== 'undefined') {
        if (CKEDITOR.instances.tagline) {
          CKEDITOR.instances.tagline.setData(content.tagline);
        }
        if (CKEDITOR.instances.overview) {
          CKEDITOR.instances.overview.setData(content.overview);
        }
      } else {
        document.getElementById('tagline').value = content.tagline;
        document.getElementById('overview').value = content.overview;
      }

      // Mostrar/ocultar secciones según el tipo de contenido
      toggleContentFiles(content.type);
    } catch (error) {
      console.error('Error cargando contenido:', error);
    }
  }

  // Manejar envío del formulario
  document
    .getElementById('content-form')
    .addEventListener('submit', async function (e) {
      e.preventDefault();

      const shouldChangeContent = document.getElementById(
        'change-content-file'
      ).checked;

      document.getElementById('loading').style.display = 'block';

      const formData = new FormData();
      // Agregar campos básicos
      formData.append('title', document.getElementById('title').value);
      formData.append('gender_id', document.getElementById('gender_id').value);
      formData.append('type', document.getElementById('type').value);
      formData.append(
        'release_date',
        document.getElementById('release-date').value
      );
      formData.append('duration', document.getElementById('duration').value);
      formData.append(
        'duration_type_name',
        document.getElementById('duration-type-name').value
      );

      // Agregar campos de texto (CKEditor o textarea normal)
      if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances.tagline) {
        formData.append('tagline', CKEDITOR.instances.tagline.getData());
      } else {
        formData.append('tagline', document.getElementById('tagline').value);
      }

      if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances.overview) {
        formData.append('overview', CKEDITOR.instances.overview.getData());
      } else {
        formData.append('overview', document.getElementById('overview').value);
      }

      // Agregar archivos si se seleccionaron
      const coverInput = document.getElementById('cover');
      if (coverInput.files.length > 0) {
        formData.append('cover', coverInput.files[0]);
      }

      const trailerInput = document.getElementById('trailer');
      if (trailerInput.files.length > 0) {
        formData.append('trailer', trailerInput.files[0]);
      }

      // Solo procesar archivos de contenido si el checkbox está marcado
      if (shouldChangeContent) {
        const type = document.getElementById('type').value;
        if (type === 'video/mp4') {
          const contentInput = document.getElementById('content');
          if (contentInput.files.length > 0) {
            formData.append('content', contentInput.files[0]);
          }
        } else if (type === 'application/vnd.apple.mpegurl') {
          const m3u8Input = document.getElementById('m3u8');
          const ts1Input = document.getElementById('ts1');
          const ts2Input = document.getElementById('ts2');
          const ts3Input = document.getElementById('ts3');

          if (m3u8Input.files.length > 0)
            formData.append('m3u8', m3u8Input.files[0]);
          if (ts1Input.files.length > 0)
            formData.append('ts1', ts1Input.files[0]);
          if (ts2Input.files.length > 0)
            formData.append('ts2', ts2Input.files[0]);
          if (ts3Input.files.length > 0)
            formData.append('ts3', ts3Input.files[0]);
        }
      }

      try {
        const editResponse = await fetch(backendAPI + `update-content/${id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await editResponse.json();

        if (data.success) {
          // Mostrar mensaje de éxito
          document.getElementById('success-message').style.display = 'block';
          setTimeout(() => {
            document.getElementById('success-message').style.display = 'none';
          }, 5000);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Mostrar errores si los hay
          if (data.errors) {
            Object.keys(data.errors).forEach((field) => {
              const errorElement = document.getElementById(`${field}-error`);
              if (errorElement) {
                errorElement.textContent = data.errors[field][0];
              }
            });
          }
        }
      } catch (error) {
        console.error('Error al editar contenido:', error);
      } finally {
        document.getElementById('loading').style.display = 'none';
      }
    });
}

// Inicializar el formulario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  editContentForm();
});
