import { validateUserForm } from "../modules/validateUserForm.js";

async function initAddUser() {
  const backendAPI = 'https://indiespot.test/api/';

  const form = document.getElementById('form');
  const rolSelect = document.getElementById('rol');
  const successMessage = document.getElementById('success-message');
  const loading = document.getElementById('loading');

  // Obtener token
  const authToken = localStorage.getItem('auth_token');
  if (!authToken) {
    window.location.href = '/login';
    return;
  }

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
    
    setupFileInput(
      'curriculum',
      'curriculum-name',
      'curriculum-label-text'
    );

  // Cargar planes dinámicamente
  try {
    const response = await fetch(backendAPI + 'rols', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const rolsData = await response.json();
    const rols = rolsData.rols;

    rols.forEach((rol) => {
      const option = document.createElement('option');
      option.value = rol.id;
      option.textContent = rol.name;
      rolSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar roles:', error);
  }

  // Manejar envío del formulario
  form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Validar antes de enviar
      if (!validateUserForm())  {
          // Mostrar mensaje de error general
          document.querySelector(".general-error-message").style.display =
              "block";
          setTimeout(() => {
              document.querySelector(".general-error-message").style.display =
                  "none";
          }, 5000);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
      }

      // Resetear mensajes de error
      document
          .querySelectorAll("#form .error-message")
          .forEach((el) => (el.textContent = ""));
      successMessage.style.display = "none";
      loading.style.display = "block";

      // Construir FormData
      const formData = new FormData();
      formData.append("name", document.getElementById("name").value);
      formData.append("surnames", document.getElementById("surnames").value);
      formData.append("email", document.getElementById("email").value);
      if (document.getElementById("curriculum").files[0]) {
          formData.append(
              "curriculum",
              document.getElementById("curriculum").files[0]
          );
      }
      formData.append("portfolio", document.getElementById("portfolio").value);
      formData.append("rol", document.getElementById("rol").value);
      formData.append("password", document.getElementById("password").value);
      formData.append(
          "password_confirmation",
          document.getElementById("password-confirmation").value
      );

      try {
          const response = await fetch(backendAPI + "register", {
              method: "POST",
              headers: {
                  Authorization: `Bearer ${authToken}`,
              },
              body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
              if (data.errors) {
                  for (let field in data.errors) {
                      const errorDiv = document.getElementById(
                          `${field}-error`
                      );
                      if (errorDiv)
                          errorDiv.textContent = data.errors[field][0];
                  }
              } else {
                  throw new Error(
                      data.message || "Error al registrar el usuario"
                  );
              }
              return;
          }

          // Mostrar éxito
          successMessage.style.display = "block";
          setTimeout(() => {
              successMessage.style.display = "none";
          }, 5000);
          form.reset();
      } catch (error) {
          console.error("Error:", error);
      } finally {
          loading.style.display = "none";
          window.scrollTo({ top: 0, behavior: "smooth" });
      }
  });
}

initAddUser();
