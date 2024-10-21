// main.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Envoyer les données au serveur pour authentification
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    alert('Connexion réussie');
    // Rediriger vers une autre page ou effectuer une action supplémentaire
  } else {
    alert('Échec de la connexion');
  }
});

// main.js
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  // Envoyer les données au serveur pour l'inscription
  const response = await fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (response.ok) {
    alert('Inscription réussie');
    // Rediriger vers la page de connexion ou une autre page
    window.location.href = '/login.html';
  } else {
    const error = await response.json();
    alert('Erreur : ' + error.message);
  }
});