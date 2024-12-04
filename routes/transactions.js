const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur');
const Transaction = require('../models/transaction');


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

// Route to add a new transaction
router.post('/addTransaction', async (req, res) => {
  console.log('Received request to add transaction');
  const { transactionName, date, beneficiary_username, amount, category } = req.body;
  console.log('Request body:', req.body);
  const sender_username = req.session.username; // Assuming the username is stored in the session
  console.log('Sender username from session:', sender_username);

  try {
      const sender = await Utilisateur.findOne({ username: sender_username });
      console.log('Sender found:', sender);
      const beneficiary = await Utilisateur.findOne({ iban: beneficiary_username });
      console.log('Sender found:', beneficiary);
     
      if (!sender || !beneficiary_username) {
          console.log('Sender or Beneficiary not found');
          return res.status(404).json({ message: 'Sender or Beneficiary not found' });
      }

      const newTransaction = new Transaction({
          transactionName,
          date,
          sender_account: sender.username,
          beneficiary_account: beneficiary.username,
          amount,
          category,
      });
      console.log('New transaction object:', newTransaction);

      await newTransaction.save();
      console.log('Transaction saved successfully');

      sender.balance -= amount;
      beneficiary.balance += parseFloat(amount);

      // Save the updated users
      await sender.save();
      await beneficiary.save();

      res.status(200).json({ message: 'Transaction added successfully' });
  } catch (error) {
      console.error('Error adding transaction:', error);
      res.status(500).json({ message: 'An error occurred while adding the transaction' });
  }
});

// Route to fetch transactions for a user
router.get('/userTransactions/:username', async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { sender_account: req.params.username },
        { beneficiary_account: req.params.username }
      ]
    });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Route to fetch spending by category for a user
router.get('/spendingByCategory/:username', async (req, res) => {
  try {
    const transactions = await Transaction.find({ sender_account: req.params.username });
    const spendingByCategory = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});
    res.status(200).json(spendingByCategory);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching spending by category' });
  }
});

// Route to fetch spending by month for a user
router.get('/spendingByMonth/:username', async (req, res) => {
  try {
    const transactions = await Transaction.find({ sender_account: req.params.username });
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const spendingByMonth = transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= sixMonthsAgo) {
        const month = transactionDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        acc[month] = (acc[month] || 0) + transaction.amount;
      }
      return acc;
    }, {});
    res.status(200).json(spendingByMonth);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching spending by month' });
  }
});

// Route to handle user logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
