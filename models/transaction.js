const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.username,
    ref: 'Utilisateur',
    required: true,
    unique: true
  },
  transactionName: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true,
    unique: true
  },
  beneficiary: {
    type: mongoose.Schema.Types.iban,
    ref: 'Utilisateur',
    required: true,
    unique: true
  },
  ammount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },

});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;