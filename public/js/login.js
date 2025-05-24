import { getIp } from "./modules/getIp.js";

document
  .getElementById('login-form')
  .addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita la recarga de la página

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const ip = await getIp();
    const userAgent = navigator.userAgent;
    const device_id = localStorage.getItem('device_id_' + email);
    const api = 'https://indiespot.test/api/';

    try {
      const response = await fetch(api + 'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
          'User-IP': ip,
          'User-Device-Id': device_id,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);

      localStorage.setItem('auth_token', data.data.auth_token);
      localStorage.setItem('current_user_email', email);

      if (data.data.require_device_registration) {
            window.location.href = '/new-device.html';
            return;
          }

      if (!data.success) {

        if (data.device_limit_reached) {
          window.location.href = '/manage-devices';
        }
          
        else if (data.message === 'Credenciales incorrectas') {
          document.getElementById('error-message').textContent = 'Credenciales incorrectas';
          document.getElementById('error-message').style.display = 'block';
        }

        return;
      }

      if (data.data.user.type == 'admin') {
        localStorage.setItem('device_id_' + email, data.data.session.device_id);
        window.location.href = '/admin/list-content.html';
        return;
      }

      window.location.href = '/';

    } catch (error) {
      console.error('Error en la solicitud:', error);
      document.getElementById('error-message').textContent =
        'Credenciales incorrectas';
      document.getElementById('error-message').style.display = 'block';
    }
  });