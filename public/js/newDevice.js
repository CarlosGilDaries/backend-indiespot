import { getIp } from './modules/getIp.js';
import { generateUUID } from './modules/generateId.js';

document
  .getElementById('new-device-form')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const api = 'https://indiespot.test/api/';
    const deviceName = document.getElementById('device_name').value;
    const ip = await getIp();
    const userAgent = navigator.userAgent;
    const email = localStorage.getItem('current_user_email');
    const deviceKey = `device_id_` + email;

    try {
      const response = await fetch(api + 'new-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
          'User-IP': ip,
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          device_name: deviceName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem(deviceKey, data.data);
        window.location.href = '/';
      } else {
        alert('Error al registrar dispositivo: ' + data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un error al conectar con el servidor');
    }
  });
