import 'core-js';
import 'core-js/stable';

import { displayMap } from './leaflet';
import { login } from './login';

// Dom Elements
const mapLeaflet = document.getElementById('map');
const loginForm = document.querySelector('.form');

// Values

// Delegation
if (mapLeaflet) {
  const tourLocations = JSON.parse(mapLeaflet.dataset.locations);
  displayMap(tourLocations);
}
if (loginForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
