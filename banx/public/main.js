// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  // Retrieve the values of the username and password input fields
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  // Validation check to ensure both fields are filled
  if (!username || !password) {
    alert('Veuillez remplir les deux champs.');
    return;
  }

  // Send data to the server for authentication
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    alert('Connexion réussie');
    // Redirect to another page or perform additional actions
    window.location.href = '/dashboard.html'; // Example redirection
  } else {
    const error = await response.json();
    alert('Échec de la connexion : ' + (error.message || 'Erreur inconnue.'));
  }
});

// Signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  // Retrieve the values of the username, email, and password input fields
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();

  // Validation check to ensure all fields are filled
  if (!username || !email || !password) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  // Send data to the server for signup
  const response = await fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (response.ok) {
    alert('Inscription réussie');
    // Redirect to the login page or another page
    window.location.href = '/login.html';
  } else {
    const error = await response.json();
    alert('Erreur : ' + (error.message || 'Erreur inconnue.'));
  }
});