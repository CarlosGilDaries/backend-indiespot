import { logOut } from '../modules/logOut.js';
import { adminCheck } from '../modules/adminCheck.js';
import { activeItems } from '../modules/activeItems.js';

const email = localStorage.getItem('current_user_email');
const device_id = localStorage.getItem('device_id_' + email);
const token = localStorage.getItem('auth_token');
const logOutButton = document.querySelector('.login-btn');
const backendAPI = 'https://indiespot.test/api/';

if (token == null) {
  window.location.href = '/login';
}

if (device_id == null) {
  logOut(token);
}

document.addEventListener('DOMContentLoaded', adminCheck(token));

logOutButton.addEventListener('click', function () {
  logOut(token);
});

document.addEventListener('DOMContentLoaded', function () {
  const menuItems = document.querySelectorAll('.admin-menu li');
  const contentContainers = document.querySelectorAll('.container');

  menuItems.forEach((item) => {
    item.addEventListener(
      'click',
      activeItems.bind(item, menuItems, contentContainers)
    );
  });

  // Activar el primer item del menú por defecto
  document.querySelector('.admin-menu li[data-content="list-content"]').click();
});
