// messaging.js


// Variable globale pour stocker les conversations actuelles
let conversations = [];
let currentConversationId = null;

// Fonction d'initialisation du module de messagerie
export async function initMessaging(params = {}) {
  await loadConversations();
  setupNewMessageForm();
  
  // Si un ID d'ami est fourni, affiche la conversation correspondante
  if (params.friendId) {
    const friendId = parseInt(params.friendId);
    displayConversationByFriendId(friendId);
  }
}

// Fonction pour charger les conversations depuis le fichier JSON
async function loadConversations() {
  try {
    const response = await fetch('./data/messages.json');
    const data = await response.json();
    conversations = data.conversations;
    displayConversationsList();
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
  }
}

// Fonction pour afficher la liste des conversations
function displayConversationsList() {
  const container = document.getElementById('conversations-list');
  container.innerHTML = '<h2>Conversations</h2>';
  
  conversations.forEach(conversation => {
    const conversationElement = createConversationElement(conversation);
    container.appendChild(conversationElement);
  });
}

// Fonction pour créer un élément HTML représentant une conversation
function createConversationElement(conversation) {
  const element = document.createElement('div');
  element.className = 'conversation-item';
  element.innerHTML = `
    <img src="${conversation.friendAvatar}" alt="${conversation.friendName}" class="friend-avatar">
    <div class="conversation-info">
      <h3>${conversation.friendName}</h3>
      <p>${conversation.lastMessage ? conversation.lastMessage.content : 'Pas de message'}</p>
      <span>${conversation.lastMessage ? formatDate(conversation.lastMessage.timestamp) : ''}</span>
    </div>
  `;
  // Ajoute un écouteur d'événements pour afficher la conversation lorsqu'on clique dessus
  element.addEventListener('click', () => displayConversation(conversation.id));
  return element;
}

// Fonction pour afficher une conversation spécifique
function displayConversation(conversationId) {
  currentConversationId = conversationId;
  const conversation = conversations.find(c => c.id === conversationId);
  const container = document.getElementById('messages-container');
  container.innerHTML = '';
  
  if (!conversation || conversation.messages.length === 0) {
    container.innerHTML = '<p>Pas de messages dans cette conversation.</p>';
  } else {
    conversation.messages.forEach(message => {
      const messageElement = createMessageElement(message, conversation.friendName, conversation.friendAvatar);
      container.appendChild(messageElement);
    });
  }
}

// Fonction pour créer un élément HTML représentant un message
function createMessageElement(message, friendName, friendAvatar) {
  const element = document.createElement('div');
  element.className = `message ${message.senderId === 0 ? 'sent' : 'received'}`;
  element.innerHTML = `
    <img src="${message.senderId === 0 ? './img/profiles/default.jpg' : friendAvatar}" alt="${message.senderId === 0 ? 'Moi' : friendName}" class="message-avatar">
    <div class="message-content">
      <p>${message.content}</p>
      <span>${formatDate(message.timestamp)}</span>
    </div>
  `;
  return element;
}

// Fonction pour configurer le formulaire d'envoi de nouveaux messages
function setupNewMessageForm() {
  const form = document.getElementById('new-message-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('new-message-input');
    const content = input.value.trim();
    if (content && currentConversationId) {
      sendMessage(content);
      input.value = '';
    }
  });
}

// Fonction pour envoyer un nouveau message
function sendMessage(content) {
  const conversation = conversations.find(c => c.id === currentConversationId);
  const newMessage = {
    id: conversation.messages.length + 1,
    senderId: 0,
    content: content,
    timestamp: new Date().toISOString()
  };
  conversation.messages.push(newMessage);
  conversation.lastMessage = {
    content: content,
    timestamp: newMessage.timestamp
  };
  
  // Mise à jour de l'affichage
  const messageElement = createMessageElement(newMessage, 'Moi', '/img/profiles/default.jpg');
  document.getElementById('messages-container').appendChild(messageElement);
  displayConversationsList();
}

// Fonction utilitaire pour formater une date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

// Fonction pour afficher une conversation en utilisant l'ID de l'ami
function displayConversationByFriendId(friendId) {
  const conversation = conversations.find(c => c.friendId === friendId);
  if (conversation) {
    displayConversation(conversation.id);
  } else {
    console.error(`Aucune conversation trouvée pour l'ami avec l'ID ${friendId}`);
    // Afficher un message d'erreur à l'utilisateur
    const container = document.getElementById('messages-container');
    container.innerHTML = '<p>Aucune conversation trouvée pour cet ami.</p>';
  }
}
