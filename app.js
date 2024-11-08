// Importation des modules
const express = require('express');
const mongoose = require('mongoose');
const Utilisateur = require('./models/utilisateur');

// Creation d'une instance de Express app
const app = express();


// URL de connexion à MongoDB
const mongoURI = "mongodb+srv://erwanweinmann:eweinmann@cluster0.wyyff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connexion à MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// Middleware pour analyser le corps de la requête en JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques (si fichier demandé, Express cherchera dans public)
app.use(express.static('public'));

// Importer les routes
const utilisateursRoutes = require('./routes/utilisateurs');
const transactionsRoutes = require('./routes/transactions');

/* Indique a l'app d'utiliser les routes importées pour le préfixe /utilisateurs. 
Par exemple, si une requête est faite à /utilisateurs, les routes définies dans 'utilisateursRoutes' seront utilisées. */

app.use('/utilisateurs', utilisateursRoutes);
app.use('/transactions', transactionsRoutes);

// Gère les requètes GET a la racine. Lorqu'un user se connecte, il est redirigé vers la page d'accueil.
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

/* Définit une route pour gérer les requêtes POST à /signup. 
La fonction est asynchrone, ce qui permet d'utiliser await pour les 
opérations qui prennent du temps, comme l'accès à la base de données. */

app.post('/signup', async (req, res) => {

  // Infos extraites du corps de la requete
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password || !phone) {
    return res.status(400).send({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Créer un nouvel utilisateur
    const nouvelUtilisateur = new Utilisateur({ username, email, password, phone });
    await nouvelUtilisateur.save();
    res.status(201).send({ message: 'Inscription réussie' });
    
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: 'Erreur lors de l\'inscription' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Trouver l'utilisateur par nom d'utilisateur
    const utilisateur = await Utilisateur.findOne({ username });
    if (!utilisateur) {
      return res.status(400).send({ message: 'Utilisateur non trouvé.' });
    }

    // Comparer directement les mots de passe
    if (utilisateur.password !== password) {
      return res.status(400).send({ message: 'Mot de passe incorrect.' });
    }

    res.status(200).send({ message: 'Connexion réussie.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Erreur lors de la connexion.' });
  }
});



// Démarrer le serveur
const port = 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});