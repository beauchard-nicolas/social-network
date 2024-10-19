// Initialise le flux d'actualités
export function initFeed() {
  loadPosts();
  // setupPostInteractions();
}

// Charge les posts depuis le fichier JSON
async function loadPosts() {
  try {
    const response = await fetch('/data/posts.json');
    const data = await response.json();
    
    // Extraction du tableau de posts
    const posts = data.posts || [];
    
    if (posts.length === 0) {
      displayError('Aucun post à afficher.');
    } else {
      displayPosts(posts);
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
  
  // Construction du HTML pour le post
  postElement.innerHTML = `
      <div class="post-header">
          <img src="${post.authorAvatar}" alt="${post.author}" class="author-avatar">
          <h2>${post.author}</h2>
          <span>${new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <p>${post.content}</p>
      ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
      <div class="post-stats">
          <span>👍 ${post.reactions.likes}</span>
          <span>❤️ ${post.reactions.loves}</span>
          <span>👎 ${post.reactions.dislikes}</span>
      </div>
      <div class="post-comments">
          ${post.comments.map(comment => `
              <div class="comment">
                  <strong>${comment.author}:</strong> ${comment.content}
                  <span>${new Date(comment.createdAt).toLocaleString()}</span>
              </div>
          `).join('')}
      </div>
  `;
  return postElement;
}

// Affiche un message d'erreur dans le conteneur
function displayError(message) {
  const container = document.getElementById('post-container');
  container.innerHTML = `<p class="error">${message}</p>`;
}
