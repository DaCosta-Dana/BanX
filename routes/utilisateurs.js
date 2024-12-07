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

router.get('/firstname/:username', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findOne({ username: req.params.username });
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ firstname: utilisateur.firstname });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du nom.' });
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

// Add Beneficiary Route
router.post('/addBeneficiary', async (req, res) => {
    const { name, iban } = req.body;
    const username = req.session.username; // Assuming the username is stored in the session

    try {
        const user = await Utilisateur.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.beneficiaries = user.beneficiaries || [];
        user.beneficiaries.push({ name, iban });

        await user.save();
        res.status(200).json({ message: 'Beneficiary added successfully' });
    } catch (error) {
        console.error('Error adding beneficiary:', error);
        res.status(500).json({ message: 'An error occurred while adding the beneficiary' });
    }
});

router.get('/beneficiaries', async (req, res) => {
  const username = req.session.username; // Assuming the username is stored in the session

  try {
      const user = await Utilisateur.findOne({ username });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ beneficiaries: user.beneficiaries });
  } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      res.status(500).json({ message: 'An error occurred while fetching the beneficiaries' });
  }
});

// Route pour récupérer les catégories disponibles
router.get('/categories', (req, res) => {
  const categories = ['Food', 'Transport', 'Savings', 'Entertainment', 'Utilities', 'Uncategorized'];
  res.status(200).json({ categories });
});

router.get('/profileName/:username', async (req, res) => {
    try {
        const user = await Utilisateur.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const profileName = `${user.firstname} ${user.lastname.charAt(0)}.`;
        res.status(200).json({ profileName });
    } catch (error) {
        console.error('Error fetching profile name:', error);
        res.status(500).json({ message: 'An error occurred while fetching the profile name' });
    }
});

router.post('/resetPassword', async (req, res) => {
    const { newPassword } = req.body;
    const username = req.session.username;

    try {
        const user = await Utilisateur.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
});

router.delete('/deleteAccount', async (req, res) => {
    const username = req.session.username;

    try {
        const user = await Utilisateur.findOneAndDelete({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'An error occurred while deleting the account' });
    }
});

module.exports = router;