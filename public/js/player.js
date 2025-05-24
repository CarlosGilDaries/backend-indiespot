import { getIp } from './modules/getIp.js';
import { logOut } from './modules/logOut.js';
//import { checkDeviceID } from './modules/checkDeviceId.js';

const pathParts = window.location.pathname.split('/');
const movieSlug = pathParts[pathParts.length - 1]; // Extraer el último segmento de la URL
const api = 'https://indiespot.test/api/';
const apiShow = 'https://indiespot.test/api/content/' + movieSlug;
const backendURL = 'https://indiespot.test';

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

fetch(apiShow, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'User-Device-ID': device_id,
    'User-Ip': ip,
    'User-Agent': userAgent,
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      const player = videojs('my-video');
      const videoJsElement = player.el();
      const backButtonContainer = document.createElement('div');
      backButtonContainer.className = 'vjs-back-button-container';
      const backButton = document.createElement('img');
      backButton.src = '/images/left.png';
      backButton.className = 'vjs-back-button';
      backButton.addEventListener('click', () => {
        window.location.href = `/content/${data.movie.slug}`;
      });

      const videoTitle = document.createElement('div');
      videoTitle.className = 'vjs-video-title';
      videoTitle.textContent = data.movie.title;

      backButtonContainer.appendChild(backButton);
      backButtonContainer.appendChild(videoTitle);
      player.el().appendChild(backButtonContainer);

      let inactivityTimer;

      function handleOverlays(show) {
        if (show) {
          videoJsElement.classList.add('show-overlays');
          resetInactivityTimer();
        } else if (!player.paused()) {
          videoJsElement.classList.remove('show-overlays');
        }
      }

      function showBackButton() {
        backButtonContainer.classList.add('visible');
        resetInactivityTimer();
      }

      function hideBackButton() {
        if (!player.paused()) {
          backButtonContainer.classList.remove('visible');
        }
      }

      function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        if (!player.paused()) {
          inactivityTimer = setTimeout(() => {
            hideBackButton();
            videoJsElement.classList.remove('show-overlays');
          }, 3000);
        }
      }

      player.el().addEventListener('mousemove', () => {
        showBackButton();
        handleOverlays(true);
      });

      player.on('play', () => {
        resetInactivityTimer();
      });

      player.on('pause', () => {
        clearTimeout(inactivityTimer);
        showBackButton();
        handleOverlays(true);
      });

      if (player.paused()) {
        showBackButton();
        handleOverlays(true);
      }

      const videoUrl = backendURL + data.movie.url;
      document.title = data.movie.title;

      player.src({
        src: videoUrl,
        type: data.movie.type,
      });

      player.play();
    } else {
      console.error('Error al obtener el video:', data.message);
    }
  })
  .catch((error) => {
    console.error('Error en la solicitud: ', error);
  });

/*document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
})

document.addEventListener('keydown', function (event) {
  if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J')) || (event.ctrlKey && event.key === 'U')) {
    event.preventDefault();
  }
});*/
