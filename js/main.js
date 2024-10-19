// main.js

// Importation des fonctions d'initialisation pour les pages Feed, Messaging et Friends
import { initFeed } from './feed.js';
import { initMessaging } from './messaging.js';
import { initFriends } from './friends.js';

// Configuration des routes de l'application
const routes = {
  feed: { init: initFeed, template: '/templates/feed.html' },
  messaging: { init: initMessaging, template: '/templates/messaging.html' },
  friends: { init: initFriends, template: '/templates/friends.html' }
};

let currentPage = 'feed';

// Charge et initialise une page spécifique
async function loadPage(page) {
  const container = document.getElementById('container');
  
  if (!routes[page]) {
    console.error(`La page ${page} n'existe pas.`);
    return;
  }

  try {
    // Chargement du template HTML
    const response = await fetch(routes[page].template);
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement de la page ${page}: ${response.statusText}`);
    }
    const html = await response.text();
    
    // Insertion du HTML et initialisation de la page
    container.innerHTML = html;
    routes[page].init();
    currentPage = page;
  } catch (error) {
    console.error('Erreur lors du chargement de la page:', error);
    container.innerHTML = '<p>Une erreur est survenue lors du chargement de la page.</p>';
  }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
  loadPage(currentPage);

  // Gestion de la navigation
  document.body.addEventListener('click', (e) => {
    console.log(e.target.getAttribute('data-page'));
    if (e.target.matches('[data-page]')) {
      e.preventDefault();
      const page = e.target.getAttribute('data-page');
      
      loadPage(page);
    }
  });
});
