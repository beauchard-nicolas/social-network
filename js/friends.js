// friends.js

// Fonction principale pour initialiser la page des amis
export function initFriends() {
  setupMessageButtons();
  setupFriendsFilter();
  setupFriendsSort();
}

// Configure les boutons de message pour chaque ami
function setupMessageButtons() {
  const messageButtons = document.querySelectorAll('.message-btn');
  messageButtons.forEach(button => {
    button.addEventListener('click', () => {
      const friendId = button.getAttribute('data-friend-id');
      // Redirection vers la messagerie avec l'ID de l'ami
      window.location.href = `/messaging?friendId=${friendId}`;
    });
  });
}

function setupFriendsFilter() {
  const filterInput = document.getElementById('friends-filter');
  filterInput.addEventListener('input', filterFriends);
}

function setupFriendsSort() {
  const sortSelect = document.getElementById('friends-sort');
  sortSelect.addEventListener('change', sortFriends);
}

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

  friendItems.forEach(item => friendsContainer.appendChild(item));
}
