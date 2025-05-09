import { logOut } from './modules/logOut.js';
import { getVideoContent } from './modules/getVideoContent.js';
import { addScrollFunctionality } from './modules/addScrollFunctionality.js';
//import { checkDeviceID } from './modules/checkDeviceId.js';

const api = 'https://indiespot.test/api/';
const backendURL = 'https://indiespot.test';
const email = localStorage.getItem('current_user_email');
const device_id = localStorage.getItem('device_id_' + email);
const token = localStorage.getItem('auth_token');

document.addEventListener('DOMContentLoaded', function () {
  const menu = document.querySelector('.menu');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 1) {
      // Si se ha hecho scroll hacia abajo
      menu.classList.add('scrolled');
    } else {
      menu.classList.remove('scrolled');
    }
  });
});

if (device_id == null && token != null) {
  logOut(token);
}

//checkDeviceID(api, token);

fetch(api + 'content')
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      const video = document.getElementById('video-content');

      getVideoContent(data, video, backendURL);

      addScrollFunctionality(video, 293);
    } else {
      console.error('Error al consultar la API: ', data.message);
    }
  })
  .catch((error) => {
    console.error('Error en la solicitud: ', error);
  });

document.addEventListener('DOMContentLoaded', async function () {
  const userIcon = document.querySelector('.user');
  const navRight = document.querySelector('.right-nav');

  if (token == null) {
    if (userIcon) userIcon.remove();

    const loginButton = document.createElement('li');
    loginButton.innerHTML = `<a href="/login"><button class="login-btn">Iniciar sesión</button></a>`;
    navRight.appendChild(loginButton);
  }
});


