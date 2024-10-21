// app.js
const express = require('express');
const mongoose = require('mongoose');
const Utilisateur = require('./models/utilisateur');
const app = express();

// URL de connexion à MongoDB (remplacez <password> par votre mot de passe)
const mongoURI = "mongodb+srv://erwanweinmann:eweinmann@cluster0.wyyff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// Middleware pour analyser le corps de la requête en JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques
app.use(express.static('public'));

// Importer les routes
const utilisateursRoutes = require('./routes/utilisateurs');
app.use('/utilisateurs', utilisateursRoutes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Créer un nouvel utilisateur
    const nouvelUtilisateur = new Utilisateur({ username, email, password });
    await nouvelUtilisateur.save();

    res.status(201).send({ message: 'Inscription réussie' });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: 'Erreur lors de l\'inscription' });
  }
});

// Démarrer le serveur
const port = 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});