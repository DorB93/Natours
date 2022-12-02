import 'core-js';
import 'core-js/stable';

import { displayMap } from './leaflet';
import { login } from './login';
import { logout } from './logout';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// Dom Elements
const mapLeaflet = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateDataUserForm = document.querySelector('.form-user-data');
const updatePasswordUserForm = document.querySelector(
  '.form-user-settings',
);
const bookBtn = document.getElementById('book-tour');
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
    const form = new FormData();
    form.append('email', document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}
if (updatePasswordUserForm) {
  updatePasswordUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-user-settings').textContent =
      'Updating....';
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
    document.querySelector('.btn-user-settings').textContent =
      'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) {
  showAlert('success', alertMessage, 8);
}
