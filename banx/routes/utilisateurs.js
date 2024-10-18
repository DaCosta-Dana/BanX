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

// Exporter le routeur
module.exports = router;