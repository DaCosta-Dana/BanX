// routes/transactions.js
const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur');

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

// Route pour transférer des fonds d'un utilisateur à un autre
router.post('/transfer', async (req, res) => {
  const { senderUsername, receiverUsername, amount } = req.body;

  if (!senderUsername || !receiverUsername || amount <= 0) {
    return res.status(400).json({ message: 'Données invalides pour le transfert.' });
  }

  try {
    // Début de la transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    const sender = await Utilisateur.findOne({ username: senderUsername }).session(session);
    const receiver = await Utilisateur.findOne({ username: receiverUsername }).session(session);

    if (!sender || !receiver) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'L\'utilisateur émetteur ou récepteur est introuvable.' });
    }

    if (sender.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Solde insuffisant pour le transfert.' });
    }

    // Mise à jour des soldes des utilisateurs
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    // Validation de la transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Transfert réussi.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du transfert.' });
  }
});

module.exports = router;