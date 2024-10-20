// friends.js

// Fonction principale pour initialiser la page des amis
export function initFriends() {
  setupMessageButtons();
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
