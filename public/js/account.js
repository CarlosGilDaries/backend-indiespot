import { logOut } from "./modules/logOut.js";
import { checkDeviceID } from "./modules/checkDeviceId.js";
import { dropDownTypeMenu } from "./modules/dropDownTypeMenu.js";
import { fixMenuWhenScrollling } from "./modules/fixMenuWhenScrolling.js";
import { renderGridFilms } from "./modules/renderRelatedFilms.js";

const token = localStorage.getItem('auth_token');
const email = localStorage.getItem('current_user_email');
const device_id = localStorage.getItem('device_id_' + email);
const api = 'https://indiespot.test/api/';
const backendURL = 'https://indiespot.test';
const relatedFilms = document.querySelector(".related-films-container");
const noFilmsMessage = document.querySelector('.no-films-message');

if (token == null) {
    window.location.href = '/login';
}

if (device_id == null) {
  logOut(token);
}

checkDeviceID(api, token);

document.addEventListener('DOMContentLoaded', function () {
  const categoriesDropDown = document.getElementById("categories");
  const gendersDropDown = document.getElementById("genders");
  dropDownTypeMenu(categoriesDropDown, "categories", "category");
  dropDownTypeMenu(gendersDropDown, "genders", "gender");
  fetch('/api/current-user', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const user = data.user;
        const rol = data.rol;

        if (user.contents.length != 0) {
            noFilmsMessage.style.display = "none";
            renderGridFilms(user.contents, relatedFilms);
        }

        if (user) {
          const tableBody = document
            .getElementById('user-table')
            .getElementsByTagName('tbody')[0];

          // Definir los campos que quieres mostrar
          const fieldsToDisplay = {
            name: 'Nombre',
            surnames: 'Apellidos',
            email: 'Email',
            curriculum: 'CV',
            portfolio: 'Portfolio',
          };

          // Filtrar los datos para que solo se muestren los campos relevantes
          for (const [key, value] of Object.entries(user)) {
            // Excluir los campos no deseados
            if (
              !['email_verified_at', 'created_at', 'updated_at'].includes(key)
            ) {
              if (fieldsToDisplay[key]) {
                // Solo mostrar los campos que están en fieldsToDisplay
                const row = tableBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);

                // Asignar el nombre de la columna en español
                cell1.textContent = fieldsToDisplay[key];

                if (fieldsToDisplay[key] == 'CV') {
                  const href = backendURL + value;
                  if (value != null && value != "") {
                    const link = document.createElement('a');
                    link.href = href;
                    link.textContent = 'Curriculum de ' + user.name;
                    link.target = '_blank'; // Para que se abra en nueva pestaña
                      cell2.appendChild(link);
                  } else {
                    const text = document.createElement("p");
                    text.textContent = "N/A";
                    cell2.appendChild(text);
                  }
                }
                else if (fieldsToDisplay[key] == 'Portfolio') {
                  if (value != null && value != "") {
                      const href = value;
                      const link = document.createElement("a");
                      link.href = href;
                      link.textContent = value;
                      link.target = "_blank";
                      cell2.appendChild(link);
                  } else {
                      const text = document.createElement("p");
                      text.textContent = "N/A";
                      cell2.appendChild(text);
                  }
                } else {
                  cell2.textContent = value;
                }
              }
            }
          }

          const tr = tableBody.insertRow();
          const td1 = tr.insertCell();
          td1.innerHTML = 'Rol';
          const td2 = tr.insertCell();
          td2.innerHTML = rol.name;

          if (user.type == 'admin') {
            const btn = document.createElement('button');
            btn.innerHTML = 'Panel de Admin';
            btn.classList = 'admin-btn';
            const div = document.querySelector('.btn-container');
            div.appendChild(btn);

            btn.addEventListener('click', function () {
              window.location.href = '/admin/list-content.html';
            })
          }

          else if (rol.name == 'Director/a') {
            const btn = document.createElement('button');
            btn.innerHTML = 'Administrar contenido';
            btn.classList = 'director-btn';
            const div = document.querySelector('.btn-container');
            div.appendChild(btn);

            btn.addEventListener('click', function () {
              window.location.href = '/list-content.html';
            })
          }
        }
      }
    })
  .catch((error) => {
    console.log(error);
  });
});

try {

} catch (error) {
  console.log(error);
}

document.getElementById('logout-button').addEventListener('click', async function (event) {
  event.preventDefault();

  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.error('No se encontró el token de autenticación');
    return;
  }

  logOut(token);
});

fixMenuWhenScrollling();

