// main.js

// Importation des fonctions d'initialisation pour les pages Feed, Messaging et Friends
import { initFeed } from './feed.js'; 
import { initMessaging } from './messaging.js'; 
import { initFriends } from './friends.js'; 

// Définition des routes pour la navigation
const routes = {
    feed: { init: initFeed, template: '/templates/feed.html' }, 
    messaging: { init: initMessaging, template: '/templates/messaging.html' }, 
    friends: { init: initFriends, template: '/templates/friends.html' }
};

let currentPage = 'feed'; // Page courante initialisée à 'feed'

// Fonction pour charger une page
async function loadPage(page) {
    const container = document.getElementById('container'); 
    
    // Charger le template HTML de la page
    const response = await fetch(routes[page].template); 
    const html = await response.text(); 
    
    // Injecter le HTML dans le conteneur
    container.innerHTML = html; 
    
    // Initialiser la logique de la page
    routes[page].init(); 
    
    // Mettre à jour la page courante
    currentPage = page; 
}

// Fonction pour configurer la navigation entre les pages
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        // Ajout d'un écouteur d'événements pour chaque lien
        link.addEventListener('click', (e) => { 
            // Empêche le comportement par défaut du lien
            e.preventDefault();
            const page = e.target.dataset.page; 
            // Vérifie si la page cible est différente de la page courante
            if (page !== currentPage) { 
                loadPage(page); 
            }
        });
    });
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation(); // Configure la navigation
    loadPage('feed'); // Charge la page d'accueil par défaut
});
