import { getIp } from './modules/getIp.js';
import { logOut } from './modules/logOut.js';
//import { checkDeviceID } from './modules/checkDeviceId.js';

const pathParts = window.location.pathname.split('/');
const movieSlug = pathParts[pathParts.length - 1]; // Extraer el último segmento de la URL
const api = 'https://indiespot.test/api/';
const backendURL = 'https://indiespot.test';
const play = document.querySelector('.play-button');
const token = localStorage.getItem('auth_token');

if (token == null) {
  window.location.href = '/login';
}
const email = localStorage.getItem('current_user_email');
const device_id = localStorage.getItem('device_id_' + email);
const ip = await getIp();
const userAgent = navigator.userAgent;

if (device_id == null) {
  logOut(token);
}

//checkDeviceID(api, token);

async function fetchMovieData() {
  try {
    const response = await fetch(api + 'content/' + movieSlug, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Device-ID': device_id,
        'User-Ip': ip,
        'User-Agent': userAgent,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      console.log(data);
      const image = document.getElementById('content-image');
      const title = document.getElementById('content-title');
      const trailer = document.getElementById('trailer');
      trailer.src = backendURL + data.movie.trailer;
      image.src = backendURL + data.movie.cover;
      title.innerHTML = data.movie.title;
      document.title = data.movie.title + ' - IndieSpot';

      play.addEventListener('click', function () {
        window.location.href = `/player/${movieSlug}`;
      });
    } else {
      console.error('Error al consultar la API: ', data.message);
    }
  } catch (error) {
    alert('Error en la solicitud: ', error);
    console.log(error);
  }
}

fetchMovieData();
