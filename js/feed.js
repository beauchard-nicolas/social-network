// feed.js

// Variable globale pour stocker les posts actuels
let currentPosts = [];

// Fonction d'initialisation du module de fil d'actualités
export function initFeed() {
  loadPosts();
  setupPostCreation();
  setupPostInteractions();
}

// Charge les posts depuis le fichier JSON
async function loadPosts() {
  try {
    const response = await fetch('/data/posts.json');
    const data = await response.json();
    
    // Extraction du tableau de posts
    currentPosts = data.posts || [];
    
    if (currentPosts.length === 0) {
      displayError('Aucun post à afficher.');
    } else {
      displayPosts(currentPosts);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des posts:', error);
    displayError('Impossible de charger les posts. Veuillez réessayer plus tard.');
  }
}

// Affiche les posts dans le conteneur
function displayPosts(posts) {
  const container = document.getElementById('post-container');
  container.innerHTML = ''; // Nettoie le contenu existant
  
  posts.forEach(post => {
    const postElement = createPostElement(post);
    container.appendChild(postElement);
  });
}

// Fonction pour formater la date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "Hier";
  } else if (diffDays <= 7) {
    return `Il y a ${diffDays} jours`;
  } else {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  }
}

// Crée un élément DOM pour un post individuel
function createPostElement(post) {
  const postElement = document.createElement('div');
  postElement.className = 'post';
  postElement.dataset.postId = post.id;
  
  // Utilisation de la fonction formatDate
  const formattedDate = formatDate(post.createdAt);
  
  // Construction du HTML pour le post
  postElement.innerHTML = `
      <div class="post-header">
          <img src="${post.authorAvatar}" alt="${post.author}" class="author-avatar">
          <h2>${post.author}</h2>
          <div class="post-date">
              <span>${formattedDate}</span>
          </div>
      </div>
      <p>${post.content}</p>
      ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image" onclick="openImageModal('${post.image}', '${post.id}')">` : ''}
      <div class="post-stats">
          <div class="reaction-btn-container">
            <button class="reaction-btn love" data-reaction="love"><span class="reaction-icon">❤️</span></button>
            <span class="reaction-count">${post.reactions.loves}</span>
          </div>
          <div class="reaction-btn-container">
            <button class="reaction-btn like" data-reaction="like"><span class="reaction-icon">👍</span></button>
            <span class="reaction-count">${post.reactions.likes}</span>
          </div>
          <div class="reaction-btn-container">
            <button class="reaction-btn dislike" data-reaction="dislike"><span class="reaction-icon">👎</span></button>
            <span class="reaction-count">${post.reactions.dislikes}</span>
          </div>
      </div>
      <div class="post-comments">
          ${post.comments.map(comment => `
              <div class="comment">
                  <strong>${comment.author}:</strong> ${comment.content}
                  <span class="comment-date">${formatDate(comment.createdAt)}</span>
              </div>
          `).join('')}
      </div>
      <form class="new-comment-form">
          <input type="text" placeholder="Ajouter un commentaire..." required>
          <button type="submit">Commenter</button>
      </form>
  `;

  // Ajout de l'écouteur d'événements pour le formulaire de nouveau commentaire
  const commentForm = postElement.querySelector('.new-comment-form');
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const commentInput = commentForm.querySelector('input');
    const commentContent = commentInput.value.trim();
    if (commentContent) {
      addCommentToPost(post.id, commentContent);
      commentInput.value = '';
    }
  });

  return postElement;
}

// Fonction pour ajouter un commentaire à un post
function addCommentToPost(postId, commentContent) {
  const post = currentPosts.find(p => p.id === postId);
  if (post) {
    const newComment = {
      id: Date.now(), // Utilise le timestamp comme ID unique
      author: 'Moi',
      content: commentContent,
      createdAt: new Date().toISOString()
    };
    post.comments.push(newComment);
    displayPosts(currentPosts);
  }
}

// Configure le formulaire de création de nouveau post
function setupPostCreation() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = form.querySelector('textarea').value;
    
    if (content.trim()) {
      const newPost = {
        id: Date.now(), // Utilise le timestamp comme ID unique
        author: 'Moi',
        authorAvatar: '/img/profiles/default.jpg',
        content: content,
        createdAt: new Date().toISOString(),
        reactions: {
          likes: 0,
          loves: 0,
          dislikes: 0
        },
        comments: []
      };

      addNewPost(newPost);
      form.reset();
    }
  });
}

// Ajoute un nouveau post au début du tableau et rafraîchit l'affichage
function addNewPost(newPost) {
  currentPosts.unshift(newPost); 
  displayPosts(currentPosts);
}

// Affiche un message d'erreur dans le conteneur
function displayError(message) {
  const container = document.getElementById('post-container');
  container.innerHTML = `<p class="error">${message}</p>`;
}

// Configure les interactions de post
function setupPostInteractions() {
  const container = document.getElementById('post-container');
  container.addEventListener('click', (e) => {
    if (e.target.closest('.reaction-btn')) {
      const button = e.target.closest('.reaction-btn');
      const postId = button.closest('.post').dataset.postId;
      const reaction = button.dataset.reaction;
      handleReaction(postId, reaction);
    }
  });
}

// Gère la réaction à un post (incrémentation côté client)
function handleReaction(postId, reaction) {
  const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
  if (postElement) {
    const countElement = postElement.querySelector(`.reaction-btn.${reaction} + .reaction-count`);
    if (countElement) {
      // Incrémente le compteur de réactions
      let count = parseInt(countElement.textContent) || 0;
      count++;
      countElement.textContent = count;
      // Déclenche l'animation de particules
      createParticleAnimation(reaction, postId);
    }
  }
}

// Crée une animation de particules pour la réaction
function createParticleAnimation(reaction, postId) {
  const colors = {
    love: '#ff69b4',
    like: '#1e90ff',
    dislike: '#ff4500'
  };

  const button = document.querySelector(`.post[data-post-id="${postId}"] .reaction-btn.${reaction}`);
  if (!button) return;

  // Calcule la position de départ des particules
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Crée et anime les particules
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.backgroundColor = colors[reaction];
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    // Définit des propriétés CSS personnalisées pour l'animation
    particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
    particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
    particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
    document.body.appendChild(particle);

    // Supprime la particule après l'animation
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
}

// Fonction pour ouvrir l'image en grand dans une modal avec les informations du post
function openImageModal(imageSrc, postId) {
  const post = currentPosts.find(p => p.id === parseInt(postId));
  if (!post) return;

  const formattedDate = formatDate(post.createdAt);

  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <img src="${imageSrc}" alt="Image en grand">
      <div class="modal-post-info">
        <div class="modal-post-header">
          <img src="${post.authorAvatar}" alt="${post.author}" class="author-avatar">
          <div class="modal-post-header-text">
            <h2>${post.author}</h2>
            <div class="modal-post-date">${formattedDate}</div>
          </div>
        </div>
        <p>${post.content}</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Fermer la modal en cliquant sur le bouton de fermeture ou en dehors de l'image
  modal.addEventListener('click', (e) => {
    if (e.target.className === 'image-modal' || e.target.className === 'close-modal') {
      document.body.removeChild(modal);
    }
  });
}

// Rendre la fonction openImageModal globale pour qu'elle soit accessible depuis l'attribut onclick
window.openImageModal = openImageModal;
