// routes/utilisateurs.js
const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur');

// Route pour ajouter un nouvel utilisateur
router.post('/', async (req, res) => {
  try {
    const nouvelUtilisateur = new Utilisateur(req.body);
    await nouvelUtilisateur.save();
    res.status(201).send(nouvelUtilisateur);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Route pour récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.status(200).send(utilisateurs);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Recherchez l'utilisateur par nom d'utilisateur
    const user = await User.findOne({ username });

    if (!user) {
      // Si l'utilisateur n'existe pas, renvoyer une erreur
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Comparaison du mot de passe directement
    if (user.password !== password) {
      // Mot de passe incorrect
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Connexion réussie
    res.status(200).json({ message: 'Connexion réussie' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route pour récupérer le solde d'un utilisateur
router.get('/balance/:username', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findOne({ username: req.params.username });
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ balance: utilisateur.balance });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du solde.' });
  }
});


// Exporter le routeur
module.exports = router;