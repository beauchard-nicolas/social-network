// main.js

// Importation des fonctions d'initialisation pour les pages Feed, Messaging et Friends
import { initFeed } from './feed.js';
import { initMessaging } from './messaging.js';
import { initFriends } from './friends.js';

// Configuration des routes de l'application
const routes = {
  feed: { init: initFeed, template: './templates/feed.html' },
  messaging: { init: initMessaging, template: './templates/messaging.html' },
  friends: { init: initFriends, template: './templates/friends.html' }
};

let currentPage = 'feed';

// Charge et initialise une page spécifique
async function loadPage(page, params = {}) {
  const container = document.getElementById('container');
  
  if (!routes[page]) {
    console.error(`La page ${page} n'existe pas.`);
    return;
  }
  try {
    // Récupération du contenu HTML de la page demandée
    const response = await fetch(routes[page].template);
    // Vérification de la réussite de la requête
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement de la page ${page}: ${response.statusText}`);
    }
    // Extraction du contenu HTML de la réponse
    const html = await response.text();
    
    // Mise à jour du contenu du conteneur avec le HTML récupéré
    container.innerHTML = html;
    
    // Chargement du CSS spécifique à la page si nécessaire
    if (page === 'friends') {
      loadCSS('/css/components/friends.css');
    } else if (page === 'messaging') {
      loadCSS('/css/components/messaging.css');
    }
    
    // Initialisation de la page avec les paramètres éventuels
    await routes[page].init(params);
    // Mise à jour de la page actuelle
    currentPage = page;
  } catch (error) {
    // Gestion de l'erreur lors du chargement de la page
    console.error('Erreur lors du chargement de la page:', error);
    // Affichage d'un message d'erreur dans le conteneur
    container.innerHTML = '<p>Une erreur est survenue lors du chargement de la page.</p>';
  }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
  loadPage(currentPage);

  // Gestion de la navigation
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-page]')) {
      e.preventDefault();
      const page = e.target.getAttribute('data-page');
      loadPage(page);
    }
  });

  // Ajoutons un écouteur pour notre événement personnalisé
  document.addEventListener('navigate', (e) => {
    loadPage(e.detail.page, e.detail);
  });
});

// Ajoutez cette fonction pour charger dynamiquement le CSS
function loadCSS(filename) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = filename;
  document.head.appendChild(link);
}
