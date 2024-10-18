// app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// URL de connexion à MongoDB (remplacez <password> par votre mot de passe)
const mongoURI = "mongodb+srv://erwanweinmann:eweinmann@cluster0.wyyff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// Middleware pour analyser le corps de la requête en JSON
app.use(express.json());

// Importer les routes
const utilisateursRoutes = require('./routes/utilisateurs');
app.use('/utilisateurs', utilisateursRoutes);

// Démarrer le serveur
const port = 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});