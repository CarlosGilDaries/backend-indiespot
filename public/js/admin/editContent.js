import { showFormErrors } from "../modules/showFormErrors.js";

async function editContentForm() {
  let id = localStorage.getItem('id');
  const token = localStorage.getItem('auth_token');
  const backendAPI = 'https://indiespot.test/api/';

  document.getElementById("type").value = "disabled";
  
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
    const zip1 = document.getElementById("ts1");
    const zip2 = document.getElementById("ts2");
    const zip3 = document.getElementById("ts3");

    singleContent.classList.add('hidden');
    hlsContent.classList.add('hidden');

    if (type === 'video/mp4') {
      singleContent.classList.remove('hidden');
      singleContent.style.display = 'block';
    } else if (type === 'application/vnd.apple.mpegurl') {
      hlsContent.classList.remove('hidden');
      hlsContent.style.display = 'block';
    } else if (type === 'disabled') {
      singleContent.classList.add("hidden");
      hlsContent.classList.add("hidden");
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

      const categoryResponse = await fetch(backendAPI + "categories", {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      const data = await response.json();
      const content = data.movie;
      const genderData = await genderResponse.json();
      const genders = genderData.genders;
      const categoryData = await categoryResponse.json();
      const categories = categoryData.categories;

      let currentCategoriesId = [];

      content.categories.forEach((category) => {
          currentCategoriesId.push(category.id);
      });

      const categoriesContainer = document.getElementById(
          "categories-container"
      );

      let categoriesContainerTextContent = "";

      categories.forEach((category) => {
          categoriesContainerTextContent += `
                                     <label class="checkbox-container">
                                       <input type="checkbox" name="categories[${category.id}][id]" value="${category.id}" id="edit-content-category-${category.id}" class="category-checkbox">
                                       <span class="checkmark"></span>
                                         <p>${category.name}</p>
                                     </label>
                                     `;
      });
      categoriesContainer.innerHTML = categoriesContainerTextContent;

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

      let checkboxCategories = document.querySelectorAll(
          "#content-form .category-checkbox"
      );
      checkboxCategories.forEach((chbox) => {
          chbox.checked = currentCategoriesId.includes(Number(chbox.value));
      });

      // Mostrar/ocultar secciones según el tipo de contenido
      toggleContentFiles(content.type);
    } catch (error) {
      console.error('Error cargando contenido:', error);
    }
  }

  // Validaciones específicas
  function validateForm() {
      let isValid = true;

      // Validar título (máximo 100 caracteres)
      const title = document.getElementById("title").value.trim();
      if (title.length > 100) {
          showFormErrors(
              "title",
              "El título no puede exceder los 100 caracteres"
          );
          isValid = false;
      }

      // Validar descripción corta (máximo 500 caracteres)
      let tagline = "";
      if (typeof CKEDITOR !== "undefined" && CKEDITOR.instances.tagline) {
          tagline = CKEDITOR.instances.tagline
              .getData()
              .replace(/<[^>]*>/g, "")
              .trim();
      } else {
          tagline = document.getElementById("tagline").value.trim();
      }
      if (tagline.length > 500) {
        showFormErrors(
            "tagline",
            "El resumen corto no puede exceder los 500 caracteres"
        );
          isValid = false;
      }

      // Validar descripción larga (máximo 1000 caracteres)
      let overview = "";
      if (typeof CKEDITOR !== "undefined" && CKEDITOR.instances.overview) {
          overview = CKEDITOR.instances.overview
              .getData()
              .replace(/<[^>]*>/g, "")
              .trim();
      } else {
          overview = document.getElementById("overview").value.trim();
      }
      if (overview.length > 1000) {
        showFormErrors(
            "overview",
            "La descripción no puede exceder los 1000 caracteres"
        );
          isValid = false;
      }

      // Validar imagen (JPG y dimensiones)
      const coverInput = document.getElementById("cover");
      if (coverInput.files.length > 0) {
          const coverFile = coverInput.files[0];
          const validImageTypes = ["image/jpeg", "image/jpg"];

          if (!validImageTypes.includes(coverFile.type)) {
            showFormErrors("cover", "La imagen debe ser un archivo JPG");
              isValid = false;
          } else {
              // Verificar dimensiones
              const img = new Image();
              img.onload = function () {
                  if (this.width !== 1024 || this.height !== 768) {
                    showFormErrors(
                        "cover",
                        "La imagen debe tener dimensiones de 1024x768px"
                    );
                      isValid = false;
                  }
              };
              img.src = URL.createObjectURL(coverFile);
          }
      }

      // Validar trailer (MP4)
      const trailerInput = document.getElementById("trailer");
      if (trailerInput.files.length > 0) {
          const trailerFile = trailerInput.files[0];
          if (trailerFile.type !== "video/mp4") {
            showFormErrors("trailer", "El trailer debe ser un archivo MP4");
              isValid = false;
          }
      }

      // Validar archivos de contenido si se cambian
      const shouldChangeContent = document.getElementById(
          "change-content-file"
      ).checked;
      if (shouldChangeContent) {
          const type = document.getElementById("type").value;

          if (type === "video/mp4") {
              const contentInput = document.getElementById("content");
              if (
                  contentInput.files.length > 0 &&
                  contentInput.files[0].type !== "video/mp4"
              ) {
                showFormErrors(
                    "content",
                    "El contenido debe ser un archivo MP4"
                );
                  isValid = false;
              }
          } else if (type === "application/vnd.apple.mpegurl") {
              // Validar archivo m3u8
              const m3u8Input = document.getElementById("m3u8");
              if (m3u8Input.files.length === 0) {
                showFormErrors("m3u8", "Debes seleccionar un archivo .m3u8");
                  isValid = false;
              } else if (!m3u8Input.files[0].name.endsWith(".m3u8")) {
                showFormErrors("m3u8", "El archivo debe ser .m3u8");
                  isValid = false;
              }

              // Validar archivos ts (deben ser ZIP)
              const tsInputs = ["ts1", "ts2", "ts3"];
              tsInputs.forEach((inputId) => {
                  const input = document.getElementById(inputId);

                  if (input.files.length === 0) {
                      showFormErrors(inputId, "Archivo obligatorio.");
                      isValid = false;
                  } else if (!input.files[0].name.endsWith(".zip")) {
                      showFormErrors(inputId, "El archivo debe ser .zip");
                      isValid = false;
                  }
              });
          }
      }

      // Validar fecha de estreno
      const releaseDate = document.getElementById("release-date").value;
      if (releaseDate) {
          const date = new Date(releaseDate);
          const today = new Date();
          if (date > today) {
            showFormErrors("release-date", "La fecha no puede ser futura");
              isValid = false;
          }
      } else {
        showFormErrors("release-date", "La fecha de estreno es obligatoria");
          isValid = false;
      }

      // Validar duración
      const duration = document.getElementById("duration").value;
      if (!duration) {
        showFormErrors("duration", "La duración es obligatoria");
          isValid = false;
      } else {
          const [hours, minutes, seconds] = duration.split(":").map(Number);
          if (hours > 12 || minutes > 59 || seconds > 59) {
            showFormErrors("duration", "Duración no válida");
              isValid = false;
          }
      }

      return isValid;
  }

  document
      .getElementById("content-form")
      .addEventListener("submit", async function (e) {
          e.preventDefault();

          // Validar antes de enviar
          if (!validateForm()) {
              return;
          }

          const shouldChangeContent = document.getElementById(
              "change-content-file"
          ).checked;
          document.getElementById("loading").style.display = "block";

          document.getElementById("loading").style.display = "block";

          const formData = new FormData();
          // Agregar campos básicos
          formData.append("title", document.getElementById("title").value);
          formData.append(
              "gender_id",
              document.getElementById("gender_id").value
          );
          formData.append("type", document.getElementById("type").value);
          formData.append(
              "release_date",
              document.getElementById("release-date").value
          );
          formData.append(
              "duration",
              document.getElementById("duration").value
          );
          formData.append(
              "duration_type_name",
              document.getElementById("duration-type-name").value
          );

          // Agregar campos de texto (CKEditor o textarea normal)
          if (typeof CKEDITOR !== "undefined" && CKEDITOR.instances.tagline) {
              formData.append("tagline", CKEDITOR.instances.tagline.getData());
          } else {
              formData.append(
                  "tagline",
                  document.getElementById("tagline").value
              );
          }

          if (typeof CKEDITOR !== "undefined" && CKEDITOR.instances.overview) {
              formData.append(
                  "overview",
                  CKEDITOR.instances.overview.getData()
              );
          } else {
              formData.append(
                  "overview",
                  document.getElementById("overview").value
              );
          }

          // Agregar archivos si se seleccionaron
          const coverInput = document.getElementById("cover");
          if (coverInput.files.length > 0) {
              formData.append("cover", coverInput.files[0]);
          }

          const trailerInput = document.getElementById("trailer");
          if (trailerInput.files.length > 0) {
              formData.append("trailer", trailerInput.files[0]);
          }

          // Solo procesar archivos de contenido si el checkbox está marcado
          if (shouldChangeContent) {
              const type = document.getElementById("type").value;
              if (type === "video/mp4") {
                  const contentInput = document.getElementById("content");
                  if (contentInput.files.length > 0) {
                      formData.append("content", contentInput.files[0]);
                  }
              } else if (type === "application/vnd.apple.mpegurl") {
                  const m3u8Input = document.getElementById("m3u8");
                  const ts1Input = document.getElementById("ts1");
                  const ts2Input = document.getElementById("ts2");
                  const ts3Input = document.getElementById("ts3");

                  if (m3u8Input.files.length > 0)
                      formData.append("m3u8", m3u8Input.files[0]);
                  if (ts1Input.files.length > 0)
                      formData.append("ts1", ts1Input.files[0]);
                  if (ts2Input.files.length > 0)
                      formData.append("ts2", ts2Input.files[0]);
                  if (ts3Input.files.length > 0)
                      formData.append("ts3", ts3Input.files[0]);
              }
          }

          const categoryCheckboxes = document.querySelectorAll(
              "#content-form .category-checkbox"
          );
          let atLeastOneCategoryChecked = false;

          categoryCheckboxes.forEach((checkbox) => {
              if (checkbox.checked) {
                  formData.append("categories[]", checkbox.value);
                  atLeastOneCategoryChecked = true;
              }
          });

          if (!atLeastOneCategoryChecked) {
              document.getElementById("loading").style.display = "none";
              alert("Selecciona al menos una categoría");
              return;
        }

          try {
              const editResponse = await fetch(
                  backendAPI + `update-content/${id}`,
                  {
                      method: "POST",
                      headers: {
                          Authorization: `Bearer ${token}`,
                      },
                      body: formData,
                  }
              );
              const data = await editResponse.json();

              if (data.success) {
                  // Mostrar mensaje de éxito
                  document.getElementById("success-message").style.display =
                      "block";
                  setTimeout(() => {
                      document.getElementById("success-message").style.display =
                          "none";
                  }, 5000);
                  window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                  // Mostrar errores si los hay
                  if (data.errors) {
                      Object.keys(data.errors).forEach((field) => {
                          const errorElement = document.getElementById(
                              `${field}-error`
                          );
                          if (errorElement) {
                              errorElement.textContent = data.errors[field][0];
                          }
                      });
                  }
              }
          } catch (error) {
              console.error("Error al editar contenido:", error);
          } finally {
              document.getElementById("loading").style.display = "none";
          }
      });
}

// Inicializar el formulario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  editContentForm();
});