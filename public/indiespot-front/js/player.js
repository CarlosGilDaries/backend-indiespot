import { getIp } from './modules/getIp.js';
import { logOut } from './modules/logOut.js';
import { checkDeviceID } from './modules/checkDeviceId.js';

const pathParts = window.location.pathname.split('/');
const movieSlug = pathParts[pathParts.length - 1]; // Extraer el último segmento de la URL
const api = 'https://indiespot.test/api/';
const apiShow = 'https://indiespot.test/api/content/' + movieSlug;
const backendURL = 'https://indiespot.test';

const token = localStorage.getItem('auth_token');

if (token == null) {
  window.location.href = '/login';
}

const user_id = localStorage.getItem('current_user_id');
const device_id = localStorage.getItem('device_id_' + user_id);
const ip = await getIp();
const userAgent = navigator.userAgent;

if (device_id == null) {
  logOut(token);
}

checkDeviceID(api, token);

fetch(apiShow, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'User-Device-ID': device_id,
    'User-Ip': ip,
    'User-Agent': userAgent,
    Authorization: `Bearer ${token}`,
    'User-Id': user_id,
  },
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
        const player = videojs('my-video');
        const videoUrl = backendURL + data.data.movie.url;
        document.title = data.data.movie.title;

        player.src({
          src: videoUrl,
          type: data.data.movie.type,
        });

        player.play();

    } else {
      console.error('Error al obtener el video:', data.message);
    }
  })
  .catch((error) => {
    console.error('Error en la solicitud: ', error);
  });

document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
})

document.addEventListener('keydown', function (event) {
  if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J')) || (event.ctrlKey && event.key === 'U')) {
    event.preventDefault();
  }
});
