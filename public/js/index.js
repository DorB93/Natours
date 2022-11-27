import 'core-js';
import 'core-js/stable';

import { displayMap } from './leaflet';
import { login } from './login';
import { logout } from './logout';
import { updateSettings } from './updatesettings';

// Dom Elements
const mapLeaflet = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateDataUserForm = document.querySelector('.form-user-data');
const updatePasswordUserForm = document.querySelector(
  '.form-user-settings',
);
// Values

// Delegation
if (mapLeaflet) {
  const tourLocations = JSON.parse(mapLeaflet.dataset.locations);
  displayMap(tourLocations);
}
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}
if (updateDataUserForm) {
  updateDataUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    console.log(email);
    updateSettings({ name, email }, 'data');
  });
}
if (updatePasswordUserForm) {
  updatePasswordUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.querySelector('.btn-user-settings');
    btn.value = 'Updating....';
    const password = document.getElementById(
      'password-current',
    ).value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm = document.getElementById(
      'password-confirm',
    ).value;
    await updateSettings(
      { password, newPassword, newPasswordConfirm },
      'password',
    );
    btn.value = 'Complete!';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
