// Initialise le flux d'actualités
export function initFeed() {
  loadPosts();
  setupPostCreation();
  // setupPostInteractions();
}

// Variable globale pour stocker les posts actuels
let currentPosts = [];

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

// Crée un élément DOM pour un post individuel
function createPostElement(post) {
  const postElement = document.createElement('div');
  postElement.className = 'post';
  
  // Formatage de la date et de l'heure
  const date = new Date(post.createdAt);
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
  // Construction du HTML pour le post
  postElement.innerHTML = `
      <div class="post-header">
          <img src="${post.authorAvatar}" alt="${post.author}" class="author-avatar">
          <h2>${post.author}</h2>
          <div class="post-date">
              <span class="date">${formattedDate}</span>
              <span class="time">${formattedTime}</span>
          </div>
      </div>
      <p>${post.content}</p>
      ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
      <div class="post-stats">
          <span>❤️ ${post.reactions.loves}</span>
          <span>👍 ${post.reactions.likes}</span>
          <span>👎 ${post.reactions.dislikes}</span>
      </div>
      <div class="post-comments">
          ${post.comments.map(comment => `
              <div class="comment">
                  <strong>${comment.author}:</strong> ${comment.content}
                  <span class="comment-date">${new Date(comment.createdAt).toLocaleString()}</span>
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
