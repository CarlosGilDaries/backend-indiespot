import { getIp } from './modules/getIp.js';
import { generateUUID } from './modules/generateId.js';

const api = 'https://indiespot.test/api/';
const backendURL = 'https://indiespot.test';

document.addEventListener('DOMContentLoaded', async function () {
  try {
    const rolsResponse = await fetch(api + 'rols',);
    const rolsData = await rolsResponse.json();
    if (rolsData.success) {
      const select = document.getElementById('rol_id');
      rolsData.rols.forEach(rol => {
        const option = document.createElement('option');
        option.innerHTML = rol.name;
        option.value = rol.id;
        select.appendChild(option);
      });
    }

    document
      .getElementById('register-form')
      .addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const surnames = document.getElementById('surnames').value;
        const email = document.getElementById('email').value;
        const rol = document.getElementById('rol_id').value;
        let portfolio = document.getElementById('portfolio').value;
        if (portfolio == 'No') {
          portfolio = null;
        }
        const curriculum = document.getElementById('curriculum').files[0];
        const password = document.getElementById('password').value;
        const password_confirmation = document.getElementById(
          'password_confirmation'
        ).value;
        const ip = await getIp();
        const userAgent = navigator.userAgent;
        const device_id = generateUUID();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('surnames', surnames);
        formData.append('email', email);
        formData.append('rol', rol);
        if (portfolio) formData.append('portfolio', portfolio);
        if (curriculum) formData.append('curriculum', curriculum);
        formData.append('password', password);
        formData.append('password_confirmation', password_confirmation);

        const response = await fetch(api + 'register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'User-Agent': userAgent,
            'User-IP': ip,
            'User-Device-Id': device_id,
          },
          body: formData,
        });

        const data = await response.json();

        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem(
          'user_' + data.data.user.id,
          JSON.stringify(data.data.user)
        );
        localStorage.setItem('current_user_email', email);

        if (data.data.require_device_registration) {
          window.location.href = '/new-device.html';
          return;
        }
      });
  } catch (error) {
    alert(error);
    console.error('Error en la solicitud:', error);
    document.getElementById('error-message').textContent =
      'Credenciales incorrectas';
    document.getElementById('error-message').style.display = 'block';
  }
});
