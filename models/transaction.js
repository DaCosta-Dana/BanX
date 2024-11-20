const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionName: {
    type: String,
    required: true,
    unique: false
  },
  date: {
    type: Date,
    required: true,
    unique: false
  },
  sender_account: {
    type: String,
    required: true,
    unique: false
  },
  beneficiary_account: {
    type: String,
    required: true,
    unique: false
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'Uncategorized'
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;