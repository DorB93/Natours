import 'core-js';
import 'core-js/stable';

import { displayMap } from './leaflet';
import { login } from './login';
import { logout } from './logout';
import { updateData } from './updatesettings';

// Dom Elements
const mapLeaflet = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateUserForm = document.querySelector('.form-user-data');
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
if (updateUserForm) {
  updateUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    console.log(email);
    updateData(name, email);
  });
}
