// Importation des modules
const express = require('express');
const mongoose = require('mongoose');
const Utilisateur = require('./models/utilisateur');
const session = require('express-session');

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

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Importer les routes
const utilisateursRoutes = require('./routes/utilisateurs');
app.use('/utilisateurs', utilisateursRoutes);

const transactionsRouter = require('./routes/transactions');
app.use('/transactions', transactionsRouter);


// Gère les requètes GET a la racine. Lorqu'un user se connecte, il est redirigé vers la page d'accueil.
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Définit une route pour gérer les requêtes POST à /signup.
app.post('/signup', async (req, res) => {
  const {firstname, lastname, username, email, password, phone } = req.body;


  if (!firstname ||!lastname ||!username || !email || !password || !phone) {
    return res.status(400).send({ message: 'Tous les champs sont requis.' });
  }

  try {
    const nouvelUtilisateur = new Utilisateur({ firstname, lastname, username, email, password, phone });
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
    const utilisateur = await Utilisateur.findOne({ username });
    if (!utilisateur) {
      return res.status(400).send({ message: 'Utilisateur non trouvé.' });
    }

    if (utilisateur.password !== password) {
      return res.status(400).send({ message: 'Mot de passe incorrect.' });
    }
    req.session.userId = utilisateur._id;
    req.session.username = utilisateur.username; 
    res.status(200).send({ message: 'Connexion réussie.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Erreur lors de la connexion.' });
  }
});

app.get('/utilisateurs/username', (req, res) => {
  if (req.session.userId) {
    res.status(200).send({ username: req.session.username });
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Démarrer le serveur
const port = 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});

