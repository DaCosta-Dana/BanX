const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
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
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true,
    unique: true
  },
  ammount: {
    type: Number,
    required: true
  },
  status: { 
    type: Number, 
    default: 0 }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;