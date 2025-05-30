import { logOut } from './modules/logOut.js';
import { directorCheck } from './modules/directorCheck.js';

const email = localStorage.getItem('current_user_email');
const device_id = localStorage.getItem('device_id_' + email);
const token = localStorage.getItem('auth_token');
const logOutButton = document.querySelector('.login-btn');
const links = document.querySelectorAll('.links');
const container = document.querySelector('.container');

if (token == null) {
  window.location.href = '/login';
}

if (device_id == null) {
  logOut(token);
}

document.addEventListener('DOMContentLoaded', directorCheck(token));

logOutButton.addEventListener('click', function () {
  logOut(token);
});

document.addEventListener('DOMContentLoaded', function () {
    links.forEach((link) => {
    if (link.getAttribute('data-content') == container.id) {
      link.classList.add('active');
    }

    link.addEventListener('click', function () {
      window.location.href = `${link.getAttribute('data-content')}.html`;
     })
  });
});
