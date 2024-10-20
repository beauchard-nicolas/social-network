// friends.js

// Fonction d'initialisation du module des amis
export function initFriends() {
  setupMessageButtons();
  setupFriendsFilter();
  setupFriendsSort();
  setupDragAndDrop();
}

// Configure les boutons de message pour chaque ami
function setupMessageButtons() {
  const messageButtons = document.querySelectorAll('.message-btn');
  messageButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const friendId = parseInt(button.getAttribute('data-friend-id'));
      const event = new CustomEvent('navigate', {
        detail: { page: 'messaging', friendId: friendId }
      });
      document.dispatchEvent(event);
    });
  });
}

// Configure le champ de recherche pour filtrer les amis
function setupFriendsFilter() {
  const filterInput = document.getElementById('friends-filter');
  filterInput.addEventListener('input', filterFriends);
}

// Configure le sélecteur de tri pour les amis
function setupFriendsSort() {
  const sortSelect = document.getElementById('friends-sort');
  sortSelect.addEventListener('change', sortFriends);
}

// Filtre les amis en fonction du texte saisi dans le champ de recherche
function filterFriends() {
  const filterValue = document.getElementById('friends-filter').value.toLowerCase();
  const friendItems = document.querySelectorAll('.friend-item');

  friendItems.forEach(item => {
    const name = item.querySelector('.friend-name').textContent.toLowerCase();
    if (name.includes(filterValue)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Trie les amis en fonction de l'option sélectionnée (nom ou statut)
function sortFriends() {
  const sortValue = document.getElementById('friends-sort').value;
  const friendsContainer = document.getElementById('friends-container');
  const friendItems = Array.from(friendsContainer.querySelectorAll('.friend-item'));

  friendItems.sort((a, b) => {
    if (sortValue === 'name') {
      const nameA = a.querySelector('.friend-name').textContent.toLowerCase();
      const nameB = b.querySelector('.friend-name').textContent.toLowerCase();
      return nameA.localeCompare(nameB);
    } else if (sortValue === 'status') {
      const statusA = a.querySelector('.friend-status').textContent;
      const statusB = b.querySelector('.friend-status').textContent;
      return statusA.localeCompare(statusB);
    }
  });

  // Réinsère les éléments triés dans le conteneur
  friendItems.forEach(item => friendsContainer.appendChild(item));
}

// Configure le drag and drop pour réorganiser la liste d'amis
function setupDragAndDrop() {
  const container = document.getElementById('friends-container');
  let draggedItem = null;

  // Écouteur pour le démarrage du drag
  container.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('friend-item')) {
      draggedItem = e.target; // Enregistre l'élément en cours de déplacement
      e.dataTransfer.effectAllowed = 'move'; // Autorise le déplacement
      e.dataTransfer.setData('text/html', e.target.outerHTML); // Enregistre les données de l'élément pour le déplacement
      e.target.classList.add('dragging'); // Ajoute la classe 'dragging' à l'élément pour le style
    }
  });

  // Écouteur pour le survol pendant le drag
  container.addEventListener('dragover', (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du navigateur
    e.dataTransfer.dropEffect = 'move'; // Définit l'effet du déplacement
    const closestElement = getClosestElement(container, e.clientY); // Trouve l'élément le plus proche du pointeur
    if (closestElement && draggedItem !== closestElement) {
      container.insertBefore(draggedItem, closestElement); // Insère l'élément déplacé avant l'élément le plus proche
    }
  });

  // Écouteur pour la fin du drag
  container.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('friend-item')) {
      e.target.classList.remove('dragging'); // Retire la classe 'dragging' de l'élément
      draggedItem = null; // Réinitialise l'élément déplacé à null
    }
  });
}

// Fonction auxiliaire pour trouver l'élément le plus proche lors du drag
function getClosestElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.friend-item:not(.dragging)')];
  
  // Utilise educe pour trouver l'élément le plus proche du point "Y" spécifié.
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
